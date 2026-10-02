<?php

namespace App\Http\Middleware;

use App\Models\Contact;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Resolved once and reused: the default `web` guard does not know about
        // the agent or admin sessions, so a vendor would otherwise read as
        // signed out everywhere in the SPA.
        $user = $request->user()
            ?? auth('agent')->user()
            ?? auth('admin')->user();

        // Only User and Agent implement the MustVerifyEmail contract, so that
        // is the discriminator. method_exists() does not work here: every model
        // extending Illuminate\Foundation\Auth\User inherits hasVerifiedEmail()
        // from the framework trait, including Admin, which has no verification
        // step and must never be warned about one.
        $requiresVerification = $user instanceof MustVerifyEmail
            && ! $user->hasVerifiedEmail();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'isVerified' => $requiresVerification ? false : true,
                'requiresVerification' => $requiresVerification,
            ],
            // Without this, redirect()->back()->with('success'|'error', ...) is
            // invisible to the SPA and actions appear to do nothing.
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'unreadMessages' => function () use ($request) {
                $user = $request->user()
                    ?? auth('agent')->user()
                    ?? auth('admin')->user();

                if (!$user) return 0;

                $query = Contact::query();

                if (!in_array($user->role, ['admin', 'superadmin'])) {
                    $query->where('user_id', $user->id);
                }

                return $query->where('is_read', false)->count();
            },
        ];
    }
}

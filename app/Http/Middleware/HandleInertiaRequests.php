<?php

namespace App\Http\Middleware;

use App\Models\Agent;
use App\Models\Contact;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

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

        $requiresVerification = false;

        $subscription = null;
        $subscriptionExpired = false;
        if ($user instanceof Agent) {
            $subscriptionExpired = $user->isSubscriptionExpired();
            $subscription = [
                'plan' => $user->plan,
                'isActive' => $user->isSubscriptionActive(),
                'isExpired' => $subscriptionExpired,
                'endsAt' => $user->subscription_ends_at ? $user->subscription_ends_at->toIso8601String() : null,
                'isPro' => $user->isPro(),
                'paymentStatus' => $user->subscription_payment_status ?? 'none',
                'pendingPayment' => $user->hasPendingSubscriptionPayment(),
            ];
        }

        return [
            ...parent::share($request),
            'ziggy' => fn () => (new Ziggy())->toArray(),
            'seo' => $request->attributes->get('seo', []),
            'auth' => [
                'user' => $user,
                'isVerified' => true,
                'requiresVerification' => false,
                'incompleteVendorProfile' => $user instanceof Agent
                    && ! $user->hasCompleteVendorProfile(),
                'missingVendorProfileFields' => $user instanceof Agent
                    ? $user->missingVendorProfileFields()
                    : [],
                'subscription' => $subscription,
                'subscriptionExpired' => $subscriptionExpired,
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

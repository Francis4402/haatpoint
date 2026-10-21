<?php

namespace App\Http\Middleware;

use App\Models\Agent;
use App\Models\Contact;
use App\Models\Orders;
use App\Models\Store;
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
            'recaptchaSiteKey' => config('services.recaptcha.site_key'),
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
            'notifications' => function () use ($request) {
                $user = $request->user()
                    ?? auth('agent')->user()
                    ?? auth('admin')->user();

                if (!$user) {
                    return [
                        'unreadMessages' => 0,
                        'pendingOrders' => 0,
                        'total' => 0,
                    ];
                }

                $role = $user->role ?? 'user';

                // Unread messages
                $messageQuery = Contact::query()->where('is_read', false);
                if (!in_array($role, ['admin', 'superadmin'], true)) {
                    $messageQuery->where('user_id', $user->id);
                }
                $unreadMessages = $messageQuery->count();

                // Pending/Active orders
                $pendingOrders = 0;
                if (in_array($role, ['admin', 'superadmin'], true)) {
                    $pendingOrders = Orders::where('order_status', 'pending')->count();
                } elseif ($role === 'agent') {
                    $storeIds = Store::where('agent_id', $user->id)->pluck('id');
                    $pendingOrders = Orders::whereIn('store_id', $storeIds)->where('order_status', 'pending')->count();
                } else {
                    $pendingOrders = Orders::where('user_id', $user->id)->whereIn('order_status', ['pending', 'processing', 'confirmed'])->count();
                }

                return [
                    'unreadMessages' => $unreadMessages,
                    'pendingOrders' => $pendingOrders,
                    'total' => $unreadMessages + $pendingOrders,
                ];
            },
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
            'unreadOrders' => function () use ($request) {
                $user = $request->user()
                    ?? auth('agent')->user()
                    ?? auth('admin')->user();

                if (!$user) return 0;

                $role = $user->role ?? 'user';
                if (in_array($role, ['admin', 'superadmin'], true)) {
                    return Orders::where('order_status', 'pending')->count();
                } elseif ($role === 'agent') {
                    $storeIds = Store::where('agent_id', $user->id)->pluck('id');
                    return Orders::whereIn('store_id', $storeIds)->where('order_status', 'pending')->count();
                } else {
                    return Orders::where('user_id', $user->id)->whereIn('order_status', ['pending', 'processing', 'confirmed'])->count();
                }
            },
        ];
    }
}

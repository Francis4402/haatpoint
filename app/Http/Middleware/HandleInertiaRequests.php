<?php

namespace App\Http\Middleware;

use App\Models\Agent;
use App\Models\Contact;
use App\Models\Orders;
use App\Models\Store;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
            // Throttle plan sync so we don't query and run SQL updates on every single request
            $syncCacheKey = "agent_plan_synced_{$user->id}";
            if (!Cache::has($syncCacheKey)) {
                $user->syncProductStatusForPlan();
                Cache::put($syncCacheKey, true, now()->addMinutes(15));
            }

            $subscriptionExpired = $user->isSubscriptionExpired();
            $subscription = [
                'plan' => $user->plan,
                'isActive' => $user->isSubscriptionActive(),
                'isExpired' => $subscriptionExpired,
                'endsAt' => $user->subscription_ends_at ? $user->subscription_ends_at->toIso8601String() : null,
                'isPro' => $user->isPro(),
                'paymentStatus' => $user->subscription_payment_status ?? 'none',
                'pendingPayment' => $user->hasPendingSubscriptionPayment(),
                'productsCount' => $user->getProductsCount(),
                'productLimit' => $user->getProductLimit(),
                'canAddProduct' => $user->canAddProduct(),
                'pausedProductsCount' => $user->getPausedProductsCount(),
                'commissionRate' => $user->getSalesCommissionRate(),
            ];
        }

        // Shared static resolver so unread notifications and badge counts query DB only once per request
        $resolveCounts = function () use ($user) {
            static $counts = null;
            if ($counts !== null) {
                return $counts;
            }

            if (!$user) {
                return $counts = ['unreadMessages' => 0, 'pendingOrders' => 0];
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

            return $counts = [
                'unreadMessages' => $unreadMessages,
                'pendingOrders' => $pendingOrders,
            ];
        };

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
            'notifications' => function () use ($resolveCounts) {
                $data = $resolveCounts();
                return [
                    'unreadMessages' => $data['unreadMessages'],
                    'pendingOrders' => $data['pendingOrders'],
                    'total' => $data['unreadMessages'] + $data['pendingOrders'],
                ];
            },
            'unreadMessages' => function () use ($resolveCounts) {
                return $resolveCounts()['unreadMessages'];
            },
            'unreadOrders' => function () use ($resolveCounts) {
                return $resolveCounts()['pendingOrders'];
            },
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {

        $user = Auth::user();
        $userRole = $user->role;

        // Agents must create a store before anything else: redirect a brand-new
        // agent (one with no store yet) to the onboarding guide. The dashboard
        // only becomes useful once at least one store exists.
        if ($userRole === 'agent' && Store::where('agent_id', $user->id)->doesntExist()) {
            return redirect()->route('dashboard.agent-guide');
        }

        if (in_array($userRole, ['admin', 'superadmin'])) {
            $ordersQuery = Orders::query();
            $totalUsers = User::count();
        } elseif ($userRole === 'agent') {
            $ordersQuery = Orders::forAgent($user->id);
            $storeIds = Store::where('agent_id', $user->id)->pluck('id');
            $totalUsers = User::whereHas('stores', function ($q) use ($storeIds) {
                $q->whereIn('id', $storeIds);
            })->count();
        } else {
            $ordersQuery = Orders::where('user_id', $user->id);
            $totalUsers = 0;
        }

        // Fetch only latest 15 orders for the recent orders list to keep payload and DOM lightweight
        $recentOrders = (clone $ordersQuery)
            ->with('orderItems')
            ->orderBy('created_at', 'desc')
            ->limit(15)
            ->get();

        $stats = $this->computeStats($ordersQuery, $userRole, (string) $user->id);

        // Onboarding progress for the agent checklist shown on the dashboard.
        // Agents without any store are redirected to the guide above, so this
        // always reflects an agent who already has a store.
        $onboarding = null;
        if ($userRole === 'agent') {
            $storeIds = Store::where('agent_id', $user->id)->pluck('id');
            $onboarding = [
                'vendorProfileComplete' => $user->hasCompleteVendorProfile(),
                'hasStore' => $storeIds->isNotEmpty(),
                'productsCount' => (int) Products::whereIn('store_id', $storeIds)->count(),
                'storeCount' => (int) $storeIds->count(),
            ];
        }

        // Superadmin and Admin: the bKash Pro payments agents have submitted, so
        // they can be verified (approved/rejected) from the dashboard.
        $subscriptionPayments = null;
        if (in_array($userRole, ['superadmin', 'admin'], true)) {
            $subscriptionPayments = Agent::where(function ($query) {
                $query->whereIn('subscription_payment_status', ['pending', 'approved', 'rejected'])
                    ->orWhere('plan', 'pro');
            })
                ->orderByRaw("CASE WHEN subscription_payment_status = 'pending' AND subscription_trx_id IS NOT NULL THEN 0 WHEN subscription_payment_status = 'pending' THEN 1 ELSE 2 END")
                ->orderByDesc('subscription_payment_submitted_at')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn (Agent $a) => [
                    'id' => $a->id,
                    'name' => $a->name,
                    'email' => $a->email,
                    'mobile' => $a->mobile,
                    'address' => $a->address,
                    'nationalId' => $a->national_id,
                    'images' => $a->images,
                    'trxId' => $a->subscription_trx_id,
                    'amount' => (float) ($a->subscription_payment_amount ?? 540),
                    'months' => ((float) ($a->subscription_payment_amount ?? 540)) <= 100 ? 1 : 6,
                    'status' => $a->subscription_payment_status,
                    'plan' => $a->plan,
                    'submittedAt' => $a->subscription_payment_submitted_at?->toIso8601String(),
                    'registeredAt' => $a->created_at?->toIso8601String(),
                    'subscriptionEndsAt' => $a->subscription_ends_at?->toIso8601String(),
                ])
                ->values();
        }

        return Inertia::render('dashboard/DashboardHome', [
            'totalUsers' => $totalUsers,
            'orders' => $recentOrders,
            'userRole' => $userRole,
            'stats' => $stats,
            'onboarding' => $onboarding,
            'subscriptionPayments' => $subscriptionPayments,
        ]);
    }

    /**
     * Build real dashboard KPIs from database queries in real-time.
     */
    private function computeStats($ordersQuery, string $userRole, string $userId)
    {
        // Clear any previous stale cache key if it existed
        Cache::forget("dashboard_stats_{$userRole}_{$userId}");

        $base = clone $ordersQuery;
        $deliveredPaidQuery = (clone $base)->where('order_status', 'delivered')->where('payment_status', 'paid');
        $deliveredQuery = (clone $base)->where('order_status', 'delivered');

        $totalOrders = (clone $base)->count();
        $deliveredOrders = (clone $deliveredQuery)->count();
        $deliveredPaidOrders = (clone $deliveredPaidQuery)->count();
        $paidOrders = (clone $base)->where('payment_status', 'paid')->count();
        $cancelledOrders = (clone $base)->where('order_status', 'cancelled')->count();
        $pendingOrders = (clone $base)->where('order_status', 'pending')->count();

        $subtotalSum = (float) ((clone $deliveredPaidQuery)->sum('subtotal') ?? 0);
        $totalSells = (float) ((clone $deliveredQuery)->sum('total') ?? 0);
        $totalRevenue = (float) ((clone $deliveredPaidQuery)->sum('total') ?? 0);
        $totalProductsSold = (int) ((clone $deliveredQuery)->sum('item_quantity') ?? 0);

        $deliveredOrderIds = (clone $deliveredQuery)->limit(300)->pluck('id');
        $topProducts = $deliveredOrderIds->isNotEmpty()
            ? OrderItems::query()
                ->selectRaw('order_items.product_name, SUM(order_items.quantity) as qty, SUM(order_items.total) as revenue, MIN(order_items.product_image) as image')
                ->whereIn('order_items.order_id', $deliveredOrderIds)
                ->groupBy('order_items.product_name')
                ->orderByDesc('revenue')
                ->limit(5)
                ->get()
                ->map(fn ($r) => [
                    'name' => $r->product_name,
                    'qty' => (int) $r->qty,
                    'revenue' => (float) $r->revenue,
                    'original' => (float) $r->revenue,
                    'profit' => round((float) $r->revenue * 0.10, 2),
                    'image' => $r->image,
                ])
                ->values()
            : collect();

        if ($topProducts->isEmpty()) {
            $activeOrderIds = (clone $base)->whereNotIn('order_status', ['cancelled', 'returned'])->limit(300)->pluck('id');
            if ($activeOrderIds->isNotEmpty()) {
                $topProducts = OrderItems::query()
                    ->selectRaw('order_items.product_name, SUM(order_items.quantity) as qty, SUM(order_items.total) as revenue, MIN(order_items.product_image) as image')
                    ->whereIn('order_items.order_id', $activeOrderIds)
                    ->groupBy('order_items.product_name')
                    ->orderByDesc('revenue')
                    ->limit(5)
                    ->get()
                    ->map(fn ($r) => [
                        'name' => $r->product_name,
                        'qty' => (int) $r->qty,
                        'revenue' => (float) $r->revenue,
                        'original' => (float) $r->revenue,
                        'profit' => round((float) $r->revenue * 0.10, 2),
                        'image' => $r->image,
                    ])
                    ->values();
            }
        }

        if ($topProducts->isEmpty()) {
            $catalogQuery = Products::query();
            if ($userRole === 'agent') {
                $storeIds = Store::where('agent_id', $userId)->pluck('id');
                $catalogQuery->whereIn('store_id', $storeIds);
            }
            $topProducts = $catalogQuery->where(function ($q) {
                    $q->whereIn('product_type', ['top-selling', 'featured', 'trending'])
                      ->orWhere('quantity', '>', 0);
                })
                ->limit(5)
                ->get()
                ->map(function ($p) {
                    $imgs = is_string($p->images) ? json_decode($p->images, true) : $p->images;
                    $img = is_array($imgs) && !empty($imgs) ? $imgs[0] : (is_string($p->images) ? $p->images : null);
                    $price = (float) ($p->sale_price ?? $p->regular_price ?? 0);
                    return [
                        'name' => $p->name,
                        'qty' => 0,
                        'revenue' => $price,
                        'original' => $price,
                        'profit' => round($price * 0.10, 2),
                        'image' => $img,
                    ];
                })
                ->values();
        }

        return [
            'totalProfit' => round($subtotalSum * 0.10, 2),
            'originalRevenue' => round($subtotalSum, 2),
            'totalSells' => round($totalSells, 2),
            'totalRevenue' => round($totalRevenue, 2),
            'totalProductsSold' => $totalProductsSold,
            'deliveredPaidOrders' => $deliveredPaidOrders,
            'deliveredOrders' => $deliveredOrders,
            'paidOrders' => $paidOrders,
            'cancelledOrders' => $cancelledOrders,
            'pendingOrders' => $pendingOrders,
            'totalOrders' => $totalOrders,
            'conversionRate' => $totalOrders > 0
                ? round(($deliveredPaidOrders / $totalOrders) * 100, 2)
                : 0,
            'topProducts' => $topProducts,
        ];
    }

    /**
     * Onboarding guide shown right after an agent registers / logs in.
     *
     * Step 1 (create a store) is mandatory and cannot be skipped. Step 2
     * (upload your first product) is optional. Also documents the full
     * store-creation and product-upload flows for new sellers.
     */
    public function agentGuide()
    {
        $user = Auth::user();

        if (! $user instanceof \App\Models\Agent) {
            return redirect()->route('dashboard');
        }

        $stores = Store::where('agent_id', $user->id)->get();
        $productsCount = Products::whereIn('store_id', $stores->pluck('id'))->count();

        return Inertia::render('dashboard/AgentGuide', [
            'userRole' => $user->role,
            'hasStore' => $stores->isNotEmpty(),
            'stores' => $stores,
            'productsCount' => (int) $productsCount,
            'vendorProfileComplete' => $user->hasCompleteVendorProfile(),
        ]);
    }
}

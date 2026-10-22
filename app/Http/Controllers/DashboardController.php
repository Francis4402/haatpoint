<?php

namespace App\Http\Controllers;

use App\Models\Dashboard;
use App\Http\Requests\StoreDashboardRequest;
use App\Http\Requests\UpdateDashboardRequest;
use App\Models\Agent;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
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
            // Admins see everything
            $orders = Orders::with('orderItems')->orderBy('created_at', 'desc')->get();
            $totalUsers = User::count();
        } elseif ($userRole === 'agent') {
            // Agents see orders for their assigned store(s) plus orders they placed themselves
            $orders = Orders::forAgent($user->id)
                ->with('orderItems')
                ->orderBy('created_at', 'desc')
                ->get();
            $storeIds = Store::where('agent_id', $user->id)->pluck('id');
            $totalUsers = User::whereHas('stores', function ($q) use ($storeIds) {
                $q->whereIn('id', $storeIds);
            })->count();
        } else {
            // Deliverymen and regular users only see their own orders
            $orders = Orders::where('user_id', $user->id)
                ->with('orderItems')
                ->orderBy('created_at', 'desc')
                ->get();
            $totalUsers = 0;
        }

        $stats = $this->computeStats($orders);

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

        // Superadmin only: the bKash Pro payments agents have submitted, so
        // they can be verified (approved/rejected) from the dashboard.
        $subscriptionPayments = null;
        if ($userRole === 'superadmin') {
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
                    'amount' => (float) ($a->subscription_payment_amount ?? 570),
                    'months' => ((float) ($a->subscription_payment_amount ?? 570)) <= 100 ? 1 : 6,
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
            'orders' => $orders,
            'userRole' => $userRole,
            'stats' => $stats,
            'onboarding' => $onboarding,
            'subscriptionPayments' => $subscriptionPayments,
        ]);
    }

    /**
     * Build real dashboard KPIs from the role-scoped order list.
     */
    private function computeStats($orders)
    {
        $deliveredPaid = $orders->where('order_status', 'delivered')->where('payment_status', 'paid');
        $delivered = $orders->where('order_status', 'delivered');

        $topProducts = OrderItems::query()
            ->selectRaw('order_items.product_name, SUM(order_items.quantity) as qty, SUM(order_items.total) as revenue, MIN(order_items.product_image) as image')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereIn('orders.id', $delivered->pluck('id'))
            ->where('orders.order_status', 'delivered')
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

        // Order subtotals store the agent's ORIGINAL product price (the price the
        // agent set). The platform's cut is 10% of that original price.
        $subtotalSum = $deliveredPaid->sum(fn ($o) => (float) $o->subtotal);

        return [
            'totalProfit' => round($subtotalSum * 0.10, 2),
            'originalRevenue' => round($subtotalSum, 2),
            'totalSells' => round($delivered->sum('total'), 2),
            'totalRevenue' => round($deliveredPaid->sum('total'), 2),
            'totalProductsSold' => $delivered->sum('item_quantity'),
            'deliveredPaidOrders' => $deliveredPaid->count(),
            'deliveredOrders' => $delivered->count(),
            'paidOrders' => $orders->where('payment_status', 'paid')->count(),
            'cancelledOrders' => $orders->where('order_status', 'cancelled')->count(),
            'pendingOrders' => $orders->where('order_status', 'pending')->count(),
            'totalOrders' => $orders->count(),
            'conversionRate' => $orders->count() > 0
                ? round(($deliveredPaid->count() / $orders->count()) * 100, 2)
                : 0,
            'topProducts' => $topProducts,
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDashboardRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Dashboard $dashboard)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dashboard $dashboard)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDashboardRequest $request, Dashboard $dashboard)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dashboard $dashboard)
    {
        //
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

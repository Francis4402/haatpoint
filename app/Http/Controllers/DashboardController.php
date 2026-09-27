<?php

namespace App\Http\Controllers;

use App\Models\Dashboard;
use App\Http\Requests\StoreDashboardRequest;
use App\Http\Requests\UpdateDashboardRequest;
use App\Models\OrderItems;
use App\Models\Orders;
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

        return Inertia::render('dashboard/DashboardHome', [
            'totalUsers' => $totalUsers,
            'orders' => $orders,
            'userRole' => $userRole,
            'stats' => $stats,
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
                'image' => $r->image,
            ])
            ->values();

        return [
            'totalProfit' => round($deliveredPaid->sum(fn ($o) => ((float) $o->subtotal * 0.10)), 2),
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
}

<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\OrderItems;
use App\Models\Store;
use App\Models\Wishlist;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PageController extends Controller
{
    public function privacypolicy()
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->paginate(12);
        return Inertia::render('privacypolicy/index', [
            'wishlist' => $wishlist
        ]);
    }

    public function termsandconditions()
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->paginate(12);
        return Inertia::render('termscondition/index', [
            'wishlist' => $wishlist
        ]);
    }

    public function aboutus()
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->paginate(12);
        return Inertia::render('Components/AboutUs', [
            'wishlist' => $wishlist
        ]);
    }

    public function cartPage()
    {
        $user = Auth::user();
        $wishlist = Wishlist::where('user_id', Auth::id())->paginate(12);
        return Inertia::render('cartpage/index', [
            'auth' => ['user' => $user],
            'wishlist' => $wishlist
        ]);
    }

    public function checkout()
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->paginate(12);
        return Inertia::render('orders/Checkout', [
            'auth' => ['user' => Auth::user()],
            'wishlist' => $wishlist
        ]);
    }

    public function payment()
    {
        $user = Auth::user();
        $userRole = $user->role;

        $paidOrders = $this->roleOrders($user, $userRole, 'payment_status', 'paid');

        return Inertia::render('dashboard/payments/index', [
            'orders' => $paidOrders,
            'userRole' => $userRole,
            'auth' => ['user' => $user],
        ]);
    }

    public function analystics()
    {
        $user = Auth::user();
        $userRole = $user->role;

        if (in_array($userRole, ['admin', 'superadmin'])) {
            $orders = Orders::with('orderItems')->orderBy('created_at', 'desc')->get();
            $deliveredPaid = Orders::where('order_status', 'delivered')->where('payment_status', 'paid')->get();
            $delivered = Orders::where('order_status', 'delivered')->get();

            // Admin revenue = 10% profit on delivered & paid orders (per order rule)
            $totalProfit = $deliveredPaid->sum(fn ($o) => ((float) $o->subtotal * 0.10));
            // Total sells = all delivered products
            $totalSells = (float) $delivered->sum('total');
            $totalProductsSold = (int) OrderItems::query()
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.order_status', 'delivered')
                ->sum('order_items.quantity');

            $sellByProduct = OrderItems::query()
                ->selectRaw('order_items.product_name, SUM(order_items.quantity) as qty, SUM(order_items.total) as revenue, MIN(order_items.product_image) as image')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.order_status', 'delivered')
                ->groupBy('order_items.product_name')
                ->orderByDesc('revenue')
                ->get()
                ->map(fn ($r) => [
                    'name' => $r->product_name,
                    'qty' => (int) $r->qty,
                    'revenue' => (float) $r->revenue,
                    'image' => $r->image,
                ])->values();

            $metrics = [
                'role' => 'admin',
                'isAdmin' => true,
                'totalProfit' => round($totalProfit, 2),
                'profitCommissionRate' => 10,
                'profitOrdersCount' => $deliveredPaid->count(),
                'totalSells' => round($totalSells, 2),
                'totalProductsSold' => $totalProductsSold,
                'totalOrders' => $orders->count(),
                'deliveredOrders' => $delivered->count(),
                'cancelledOrders' => $orders->where('order_status', 'cancelled')->count(),
                'paidOrders' => $orders->where('payment_status', 'paid')->count(),
                'sellByProduct' => $sellByProduct,
            ];

            return Inertia::render('dashboard/analytics/index', [
                'metrics' => $metrics,
                'userRole' => $userRole,
            ]);
        }

        if ($userRole === 'agent') {
            $orders = Orders::forAgent($user->id)
                ->with('orderItems')
                ->orderBy('created_at', 'desc')
                ->get();

            $deliveredPaid = Orders::forAgent($user->id)
                ->where('order_status', 'delivered')
                ->where('payment_status', 'paid')
                ->get();

            $delivered = Orders::forAgent($user->id)
                ->where('order_status', 'delivered')
                ->get();

            $totalRevenue = $deliveredPaid->sum('total');
            $totalOrdersCount = $orders->count();
            $conversionRate = $totalOrdersCount > 0
                ? round(($deliveredPaid->count() / $totalOrdersCount) * 100, 2)
                : 0;

            $sellByProduct = OrderItems::query()
                ->selectRaw('order_items.product_name, SUM(order_items.quantity) as qty, SUM(order_items.total) as revenue, MIN(order_items.product_image) as image')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->whereIn('orders.store_id', Store::where('agent_id', $user->id)->pluck('id'))
                ->where('orders.order_status', 'delivered')
                ->groupBy('order_items.product_name')
                ->orderByDesc('revenue')
                ->get()
                ->map(fn ($r) => [
                    'name' => $r->product_name,
                    'qty' => (int) $r->qty,
                    'revenue' => (float) $r->revenue,
                    'image' => $r->image,
                ])->values();

            $metrics = [
                'role' => 'agent',
                'isAdmin' => false,
                'totalRevenue' => round((float) $totalRevenue, 2),
                'conversionRate' => $conversionRate,
                'totalOrders' => $totalOrdersCount,
                'deliveredOrders' => $deliveredPaid->count(),
                'pendingOrders' => $orders->where('order_status', 'pending')->count(),
                'cancelledOrders' => $orders->where('order_status', 'cancelled')->count(),
                'sellByProduct' => $sellByProduct,
            ];

            return Inertia::render('dashboard/analytics/index', [
                'metrics' => $metrics,
                'userRole' => $userRole,
            ]);
        }

        return Inertia::render('dashboard/analytics/index', [
            'metrics' => null,
            'userRole' => $userRole,
        ]);
    }

    public function shipping()
    {
        $user = Auth::user();
        $userRole = $user->role;

        if ($userRole === 'user') {
            abort(403, 'You do not have permission to view the shipping page.');
        }

        $shippedOrders = $this->roleOrders($user, $userRole, 'order_status', 'shipped');

        return Inertia::render('dashboard/shipping/index', [
            'orders' => $shippedOrders,
            'userRole' => $userRole,
            'auth' => ['user' => $user],
        ]);
    }

    /**
     * Fetch orders visible to the current role, filtered by a status field.
     */
    private function roleOrders($user, $userRole, string $field, string $value)
    {
        if ($userRole === 'admin' || $userRole === 'superadmin') {
            return Orders::with('orderItems')
                ->where($field, $value)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        if ($userRole === 'agent') {
            return Orders::with('orderItems')
                ->forAgent($user->id)
                ->where($field, $value)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Orders::with('orderItems')
            ->where('user_id', $user->id)
            ->where($field, $value)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function trackorder()
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->paginate(12);
        return Inertia::render('trackorders/index', [
            'wishlist' => $wishlist
        ]);
    }
}

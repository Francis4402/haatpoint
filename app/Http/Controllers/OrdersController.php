<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateOrdersRequest;
use App\Models\Agent;
use App\Models\OrderItems;
use App\Models\Products;
use App\Models\Store;
use App\Models\Wishlist;
use Enan\PathaoCourier\Requests\PathaoOrderRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $userRole = $user->role;

        // `store` is needed by editRulesFor() to tell an agent's own sales
        // apart from orders they merely placed as a shopper.
        if ($userRole === 'admin' || $userRole === 'superadmin') {

            $orders = Orders::with(['orderItems', 'store'])
                ->orderBy('created_at', 'desc')
                ->get();
        } elseif ($userRole === 'agent') {

            $orders = Orders::with(['orderItems', 'store'])
                ->forAgent($user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {

            $orders = Orders::with(['orderItems', 'store'])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('dashboard/adminorders/index', [
            'orders' => $orders,
            'userRole' => $userRole,
            'auth' => ['user' => $user],
            'revenue' => $this->revenueFor($user, $userRole),
            'orderRules' => $this->orderRules($orders, $user),
        ]);
    }

    /**
     * Revenue is summed in the database, not in the browser: Orders casts money
     * columns to decimal strings, so a client-side reduce() concatenated them
     * ("0" + "1000.00") instead of adding. Agents only earn from sales of their
     * own stores, not from orders they placed as a shopper.
     */
    private function revenueFor($user, string $userRole): float
    {
        $query = Orders::query()->earningRevenue();

        if ($userRole === 'agent') {
            $query->whereIn('store_id', Store::where('agent_id', $user->id)->pluck('id'));
        } elseif ($userRole === 'user') {
            $query->where('user_id', $user->id);
        }

        return round((float) $query->sum('total'), 2);
    }

    /**
     * Per-order edit rules so the UI only offers what update() allows, and can
     * explain why a field is locked instead of failing on submit.
     *
     * @return array<string, array{canEdit: bool, reason: string|null, orderStatus: array<int, string>, paymentStatus: array<int, string>, orderStatusLocked: bool, paymentStatusLocked: bool, paymentStatusLockedReason: string|null}>
     */
    private function orderRules($orders, $user): array
    {
        $rules = [];

        foreach ($orders as $order) {
            $rules[$order->id] = $order->editRulesFor($user, $user->role);
        }

        return $rules;
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
    public function store(Request $request)
    {
        try {

            $user = Auth::user();
            if (!$user) return back()->withErrors(['error' => 'User not authenticated']);

            $validated = $request->validate([
                'recipient_name' => 'required|string|max:255',
                'recipient_email' => 'required|string',
                'recipient_phone' => 'required|string|max:20',
                'recipient_address' => 'required|string|min:10',
                'recipient_city' => 'required|integer',
                'recipient_zone' => 'required|integer',
                'recipient_area' => 'nullable|integer',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|string',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric',
                'subtotal' => 'required|numeric',
                'delivery_charge' => 'required|numeric',
                'total' => 'required|numeric',
                'amount_to_collect' => 'required|numeric',
                'item_quantity' => 'required|integer',
                'item_weight' => 'required|numeric|min:0.1',
                'item_description' => 'required|string',
                'store_name' => 'required|string',
                'order_number' => 'required|string|unique:orders',
                'merchant_order_id' => 'required|string',
                'payment_method' => 'required|in:cash_on_delivery,bikash',
                'shipping_method' => 'required|in:pathao',
                'delivery_type' => 'required|integer|in:12,48',
                'item_type' => 'required|integer|in:1,2',
                'coupon_code' => 'nullable|string',
                'discount_amount' => 'nullable|numeric',
                'notes' => 'nullable|string',
                'tracking_number' => 'nullable|string',
                'special_instruction' => 'nullable|string',
                'sender_email' => 'required|email',
            ]);

            $firstProduct = Products::find($validated['items'][0]['product_id']);
            if (!$firstProduct) return back()->withErrors(['error' => 'Product not found']);

            // Stock validation
            foreach ($validated['items'] as $item) {
                $product = Products::find($item['product_id']);
                if (!$product) return back()->withErrors(['error' => "Product not found: {$item['product_id']}"]);
                if ($product->quantity < $item['quantity']) {
                    return back()->withErrors(['error' => "Insufficient stock for: {$product->name}"]);
                }
            }

            $store = Store::find($firstProduct->store_id);
            if (!$store) return back()->withErrors(['error' => 'Store not found']);
            if (!$store->is_active) return back()->withErrors(['error' => 'This store is currently inactive and cannot accept orders.']);

            $isAgent = $user instanceof Agent;

            $order = Orders::create([
                // IDs
                'user_id' => $isAgent ? null : $user->id,
                'agent_id' => $isAgent ? $user->id : null,
                'store_id' => $store->id,

                // Order Identifiers
                'merchant_order_id' => $validated['merchant_order_id'],
                'order_number' => $validated['order_number'],

                // Sender Info (from store)
                'sender_name' => $store->name,
                'sender_phone' => $store->phone ?? $store->mobile ?? '',
                'sender_email' => $validated['sender_email'],

                // Recipient Info
                'recipient_name' => $validated['recipient_name'],
                'recipient_email' => $validated['recipient_email'],
                'recipient_phone' => $validated['recipient_phone'],
                'recipient_address' => $validated['recipient_address'],
                'recipient_city' => $validated['recipient_city'],
                'recipient_zone' => $validated['recipient_zone'],
                'recipient_area' => $validated['recipient_area'] ?? null,

                // Pathao Settings
                'delivery_type' => $validated['delivery_type'],
                'item_type' => $validated['item_type'],
                'special_instruction' => $validated['special_instruction'] ?? $validated['notes'] ?? null,

                // Order Details
                'item_quantity' => $validated['item_quantity'],
                'item_weight' => $validated['item_weight'],
                'amount_to_collect' => $validated['amount_to_collect'],
                'item_description' => $validated['item_description'],
                'store_name' => $validated['store_name'],

                // Financials
                'subtotal' => $validated['subtotal'],
                'delivery_charge' => $validated['delivery_charge'],
                'total' => $validated['total'],
                'coupon_code' => $validated['coupon_code'] ?? null,
                'discount_amount' => $validated['discount_amount'] ?? 0,

                // Tracking
                'tracking_number' => $validated['tracking_number'] ?? null,
                'shipping_method' => $validated['shipping_method'],

                // Status
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'pending',
                'order_status' => 'pending',

                // Additional
                'notes' => $validated['notes'] ?? null,
                'items' => json_encode($validated['items']),
            ]);


            foreach ($validated['items'] as $item) {
                $product = Products::find($item['product_id']);
                if ($product) {
                    OrderItems::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_image' => $this->getFirstImage($product->images),
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                        'total' => $item['price'] * $item['quantity'],
                    ]);
                    $product->decrement('quantity', $item['quantity']);
                }
            }

            // Pathao API integration
            if ($validated['shipping_method'] === 'pathao' && $store->pathao_store_id) {
                try {
                    $pathaoRequest = new PathaoOrderRequest();
                    $pathaoRequest->merge([
                        'store_id' => $store->pathao_store_id,
                        'merchant_order_id' => $order->order_number,
                        'sender_name' => $store->name,
                        'sender_email' => $validated['sender_email'],
                        'sender_phone' => $store->mobile,
                        'recipient_name' => $validated['recipient_name'],
                        'recipient_phone' => $validated['recipient_phone'],
                        'recipient_address' => $validated['recipient_address'],
                        'recipient_city' => $validated['recipient_city'],
                        'recipient_zone' => $validated['recipient_zone'],
                        'recipient_area' => $validated['recipient_area'] ?? 0,
                        'delivery_type' => $validated['delivery_type'],
                        'item_type' => $validated['item_type'],
                        'special_instruction' => $validated['special_instruction'] ?? '',
                        'item_quantity' => $validated['item_quantity'],
                        'item_weight' => $validated['item_weight'],
                        'amount_to_collect' => $validated['amount_to_collect'],
                        'item_description' => $validated['item_description'],
                    ]);

                    $response = \Enan\PathaoCourier\Facades\PathaoCourier::CREATE_ORDER($pathaoRequest);

                    if (!empty($response['data'])) {
                        $order->update([
                            'pathao_order_id' => $response['data']['order_id'] ?? null,
                            'pathao_consignment_id' => $response['data']['consignment_id'] ?? null,
                            'pathao_response' => json_encode($response),
                            'tracking_number' => $response['data']['consignment_id'] ?? $order->tracking_number,
                        ]);
                    }
                } catch (\Exception $e) {
                    $order->update(['pathao_response' => json_encode(['error' => $e->getMessage()])]);
                }
            }

            return redirect()->route('orders.confirmation', $order->id)
                ->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to place order: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($order)
    {
        $user = Auth::user();

        if (!($user->role === 'admin' ||
              $user->role === 'superadmin' ||
              $order->user_id === $user->id ||
              $order->agent_id === $user->id ||
              ($user->role === 'agent' && $this->isAgentStore($user, $order->store_id)))) {
            abort(403, 'You do not have permission to view this order.');
        }

        $order->load('orderItems');
        $store = Store::find($order->store_id);
        $wishlist = wishlist::where('user_id', $user->id)->paginate(12);

        return Inertia::render('orders/Show', [
            'order' => $order,
            'store' => $store,
            'wishlist' => $wishlist
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Orders $orders)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Orders $order)
    {
        $user = Auth::user();

        $rules = $order->editRulesFor($user, $user->role);

        if (! $rules['canEdit']) {
            abort(403, $rules['reason'] ?? 'You do not have permission to update this order.');
        }

        $validated = $request->validate([
            'payment_status' => ['sometimes', Rule::in(Orders::PAYMENT_STATUSES)],
            'order_status' => ['sometimes', Rule::in(Orders::ORDER_STATUSES)],
        ]);

        if (isset($validated['order_status'])
            && ! in_array($validated['order_status'], $rules['orderStatus'], true)) {
            return redirect()->back()->with(
                'error',
                $rules['reason'] ?? "This order cannot be moved to \"{$validated['order_status']}\"."
            );
        }

        if (isset($validated['payment_status'])
            && ! in_array($validated['payment_status'], $rules['paymentStatus'], true)) {
            return redirect()->back()->with(
                'error',
                $rules['paymentStatusLockedReason']
                    ?? 'You are not allowed to change the payment status of this order.'
            );
        }

        $order->update($validated);

        return redirect()->back()->with('success', 'Order updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Orders $order)
    {
        try {
            $user = Auth::user();

            $canDelete = in_array($user->role, ['superadmin', 'admin']);

            if (!$canDelete) {
                return redirect()->back()->with('error', 'You do not have permission to delete this order.');
            }

            if (method_exists($order, 'orderItems')) {
                $order->orderItems()->delete();
            }

            $order->delete();

            return redirect()->back()->with('success', 'Order deleted successfully.');

        } catch (\Exception $e) {

            return redirect()->back()->with('error', 'Failed to delete order.');
        }
    }

    private function getFirstImage(array|string $images): string
    {
        if (is_string($images)) {
            $decoded = json_decode($images, true);
            if (is_array($decoded) && !empty($decoded)) {
                return $decoded[0];
            }
            return $images;
        }
        return is_array($images) && !empty($images) ? $images[0] : '';
    }

    private function isAgentStore($user, $storeId): bool
    {
        return Store::where('id', $storeId)
            ->where('agent_id', $user->id)
            ->exists();
    }

    public function confirmation(Orders $order)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'superadmin']) && $order->user_id !== $user->id && $order->agent_id !== $user->id) {
            abort(403, 'You do not have permission to view this order confirmation.');
        }

        $order->load(['orderItems', 'store', 'user']);
        $wishlist = Wishlist::where('user_id', $user->id)->paginate(12);

        return Inertia::render('orders/Confirmation', [
            'order' => $order,
            'wishlist' => $wishlist,
            'userRole' => $user->role,
        ]);
    }

    public function cancel(Orders $order)
    {
        try {
            $user = Auth::user();

            // Only the order owner may cancel
            if ($order->user_id !== $user->id && $order->agent_id !== $user->id) {
                return redirect()->back()->with('error', 'You do not have permission to cancel this order.');
            }

            $nonCancellable = ['confirmed', 'shipped', 'delivered', 'cancelled'];

            if (in_array($order->order_status, $nonCancellable)) {
                return redirect()->back()->with(
                    'error',
                    "This order cannot be cancelled because it is already {$order->order_status}."
                );
            }

            $order->update(['order_status' => 'cancelled']);


            return redirect()->back()->with('success', 'Order cancelled successfully.');

        } catch (\Exception $e) {

            return redirect()->back()->with('error', 'Failed to cancel order.');
        }
    }
}

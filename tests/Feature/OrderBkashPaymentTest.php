<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\Contact;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderBkashPaymentTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $email = 'customer@example.com'): User
    {
        return User::create([
            'name' => 'Test Customer',
            'email' => $email,
            'password' => bcrypt('password'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);
    }

    private function makeSuperadmin(): Admin
    {
        return Admin::create([
            'name' => 'Superadmin',
            'email' => 'superadmin@example.com',
            'password' => bcrypt('password'),
            'role' => 'superadmin',
        ]);
    }

    private function makeAgent(): Agent
    {
        return Agent::create([
            'name' => 'Agent Shopkeeper',
            'email' => 'agent@example.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'blocked' => false,
            'plan' => 'free',
            'subscription_ends_at' => now()->addDays(30),
            'email_verified_at' => now(),
        ]);
    }

    private function makeStoreAndProduct(Agent $agent): array
    {
        $owner = $this->makeUser('owner@example.com');

        $store = Store::create([
            'user_id' => $owner->id,
            'agent_id' => $agent->id,
            'name' => 'Test Tech Store',
            'email' => 'store@example.com',
            'address' => 'Store Address, Dhaka',
            'mobile' => '01711112222',
            'storetype' => 'general',
            'national_id' => '1234567890123',
            'is_active' => true,
        ]);

        $product = Products::create([
            'user_id' => $owner->id,
            'store_id' => $store->id,
            'name' => 'Wireless Mouse',
            'slug' => 'wireless-mouse-' . uniqid(),
            'category' => 'Electronics',
            'subcategory' => 'Accessories',
            'brand' => 'Logitech',
            'regular_price' => '500.00',
            'description' => 'A great mouse',
            'item_weight' => '0.50',
            'quantity' => 20,
            'images' => 'mouse.jpg',
        ]);

        return [$store, $product];
    }

    public function test_bkash_order_requires_transaction_id(): void
    {
        $user = $this->makeUser();
        $agent = $this->makeAgent();
        [$store, $product] = $this->makeStoreAndProduct($agent);

        $payload = [
            'store_id' => $store->id,
            'user_id' => $user->id,
            'order_number' => 'ORD-BKASH-FAIL',
            'merchant_order_id' => 'ORD-BKASH-FAIL',
            'sender_name' => $store->name,
            'sender_phone' => $store->mobile,
            'sender_email' => 'store@example.com',
            'recipient_name' => 'John Doe',
            'recipient_phone' => '01712345678',
            'recipient_email' => 'johndoe@example.com',
            'recipient_address' => 'House 1, Road 2, Dhanmondi, Dhaka',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'delivery_type' => 48,
            'item_type' => 2,
            'item_quantity' => 1,
            'item_weight' => 0.5,
            'amount_to_collect' => 560,
            'item_description' => 'Products order',
            'store_name' => $store->name,
            'subtotal' => 500,
            'delivery_charge' => 60,
            'total' => 560,
            'shipping_method' => 'pathao',
            'payment_method' => 'bikash',
            // transaction_id omitted
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'price' => 500,
                ],
            ],
        ];

        $response = $this->actingAs($user)->post(route('orders.store'), $payload);
        $response->assertSessionHasErrors(['transaction_id']);
    }

    public function test_bkash_order_succeeds_with_transaction_id_and_sets_amount_to_collect_to_zero(): void
    {
        $user = $this->makeUser();
        $agent = $this->makeAgent();
        [$store, $product] = $this->makeStoreAndProduct($agent);

        $payload = [
            'store_id' => $store->id,
            'user_id' => $user->id,
            'order_number' => 'ORD-BKASH-SUCCESS-01',
            'merchant_order_id' => 'ORD-BKASH-SUCCESS-01',
            'sender_name' => $store->name,
            'sender_phone' => $store->mobile,
            'sender_email' => 'store@example.com',
            'recipient_name' => 'John Doe',
            'recipient_phone' => '01712345678',
            'recipient_email' => 'johndoe@example.com',
            'recipient_address' => 'House 1, Road 2, Dhanmondi, Dhaka',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'delivery_type' => 48,
            'item_type' => 2,
            'item_quantity' => 1,
            'item_weight' => 0.5,
            'amount_to_collect' => 560,
            'item_description' => 'Products order',
            'store_name' => $store->name,
            'subtotal' => 500,
            'delivery_charge' => 60,
            'total' => 560,
            'shipping_method' => 'pathao',
            'payment_method' => 'bikash',
            'transaction_id' => 'TRX987654321',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'price' => 500,
                ],
            ],
        ];

        $response = $this->actingAs($user)->post(route('orders.store'), $payload);
        $response->assertSessionHasNoErrors();

        $order = Orders::where('order_number', 'ORD-BKASH-SUCCESS-01')->first();
        $this->assertNotNull($order);
        $this->assertEquals('bikash', $order->payment_method);
        $this->assertEquals('TRX987654321', $order->transaction_id);
        $this->assertEquals(0, (float) $order->amount_to_collect);
        $this->assertEquals('pending', $order->order_status);
        $this->assertEquals('pending', $order->payment_status);

        $response->assertRedirect(route('orders.confirmation', $order->id));
    }

    public function test_superadmin_can_confirm_bkash_order_and_mark_it_paid(): void
    {
        $user = $this->makeUser();
        $agent = $this->makeAgent();
        [$store, $product] = $this->makeStoreAndProduct($agent);
        $superadmin = $this->makeSuperadmin();

        $order = Orders::create([
            'user_id' => $user->id,
            'store_id' => $store->id,
            'order_number' => 'ORD-BKASH-CONFIRM-TEST',
            'sender_name' => $store->name,
            'sender_phone' => $store->mobile,
            'sender_email' => 'store@example.com',
            'recipient_name' => 'Alice',
            'recipient_phone' => '01700000000',
            'recipient_email' => 'alice@example.com',
            'recipient_address' => 'Mirpur, Dhaka',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'delivery_type' => 48,
            'item_type' => 2,
            'item_quantity' => 1,
            'item_weight' => 1,
            'amount_to_collect' => 0,
            'item_description' => 'Product order',
            'store_name' => $store->name,
            'subtotal' => 500,
            'delivery_charge' => 60,
            'total' => 560,
            'shipping_method' => 'pathao',
            'payment_method' => 'bikash',
            'transaction_id' => 'TRXCONFIRM123',
            'order_status' => 'pending',
            'payment_status' => 'pending',
        ]);

        $response = $this->actingAs($superadmin, 'superadmin')
            ->patch(route('admin.orders.confirm', $order->id));

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $order->refresh();
        $this->assertEquals('confirmed', $order->order_status);
        $this->assertEquals('paid', $order->payment_status);
    }

    public function test_regular_user_cannot_confirm_order(): void
    {
        $user = $this->makeUser();
        $agent = $this->makeAgent();
        [$store, $product] = $this->makeStoreAndProduct($agent);

        $order = Orders::create([
            'user_id' => $user->id,
            'store_id' => $store->id,
            'order_number' => 'ORD-BKASH-UNAUTH-TEST',
            'sender_name' => $store->name,
            'sender_phone' => $store->mobile,
            'sender_email' => 'store@example.com',
            'recipient_name' => 'Alice',
            'recipient_phone' => '01700000000',
            'recipient_email' => 'alice@example.com',
            'recipient_address' => 'Mirpur, Dhaka',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'delivery_type' => 48,
            'item_type' => 2,
            'item_quantity' => 1,
            'item_weight' => 1,
            'amount_to_collect' => 0,
            'item_description' => 'Product order',
            'store_name' => $store->name,
            'subtotal' => 500,
            'delivery_charge' => 60,
            'total' => 560,
            'shipping_method' => 'pathao',
            'payment_method' => 'bikash',
            'transaction_id' => 'TRXUNAUTH123',
            'order_status' => 'pending',
            'payment_status' => 'pending',
        ]);

        $response = $this->actingAs($user)->patch(route('admin.orders.confirm', $order->id));
        $response->assertStatus(403);
    }

    public function test_cash_on_delivery_requires_advance_delivery_transaction_id(): void
    {
        $user = $this->makeUser();
        $agent = $this->makeAgent();
        [$store, $product] = $this->makeStoreAndProduct($agent);

        $payload = [
            'store_id' => $store->id,
            'user_id' => $user->id,
            'order_number' => 'ORD-COD-NO-TRX',
            'merchant_order_id' => 'ORD-COD-NO-TRX',
            'sender_name' => $store->name,
            'sender_phone' => $store->mobile,
            'sender_email' => 'store@example.com',
            'recipient_name' => 'John Doe',
            'recipient_phone' => '01712345678',
            'recipient_email' => 'johndoe@example.com',
            'recipient_address' => 'House 1, Road 2, Dhanmondi, Dhaka',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'delivery_type' => 48,
            'item_type' => 2,
            'item_quantity' => 1,
            'item_weight' => 0.5,
            'amount_to_collect' => 500,
            'item_description' => 'Products order',
            'store_name' => $store->name,
            'subtotal' => 500,
            'delivery_charge' => 80,
            'total' => 580,
            'shipping_method' => 'pathao',
            'payment_method' => 'cash_on_delivery',
            // transaction_id omitted
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'price' => 500,
                ],
            ],
        ];

        $response = $this->actingAs($user)->post(route('orders.store'), $payload);
        $response->assertSessionHasErrors(['transaction_id']);
    }

    public function test_cash_on_delivery_succeeds_with_transaction_id_and_sets_amount_to_collect_to_subtotal(): void
    {
        $user = $this->makeUser();
        $agent = $this->makeAgent();
        [$store, $product] = $this->makeStoreAndProduct($agent);

        $payload = [
            'store_id' => $store->id,
            'user_id' => $user->id,
            'order_number' => 'ORD-COD-SUCCESS-01',
            'merchant_order_id' => 'ORD-COD-SUCCESS-01',
            'sender_name' => $store->name,
            'sender_phone' => $store->mobile,
            'sender_email' => 'store@example.com',
            'recipient_name' => 'John Doe',
            'recipient_phone' => '01712345678',
            'recipient_email' => 'johndoe@example.com',
            'recipient_address' => 'House 1, Road 2, Dhanmondi, Dhaka',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'delivery_type' => 48,
            'item_type' => 2,
            'item_quantity' => 1,
            'item_weight' => 0.5,
            'amount_to_collect' => 580, // sent total, but controller will enforce subtotal (500)
            'item_description' => 'Products order',
            'store_name' => $store->name,
            'subtotal' => 500,
            'delivery_charge' => 80,
            'total' => 580,
            'shipping_method' => 'pathao',
            'payment_method' => 'cash_on_delivery',
            'transaction_id' => 'TRXCODADVANCE1',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'price' => 500,
                ],
            ],
        ];

        $response = $this->actingAs($user)->post(route('orders.store'), $payload);
        $response->assertSessionHasNoErrors();

        $order = Orders::where('order_number', 'ORD-COD-SUCCESS-01')->first();
        $this->assertNotNull($order);
        $this->assertEquals('cash_on_delivery', $order->payment_method);
        $this->assertEquals('TRXCODADVANCE1', $order->transaction_id);
        // Delivery charge was paid in advance, so only subtotal is collected upon delivery
        $this->assertEquals(500, (float) $order->amount_to_collect);
        $this->assertEquals('pending', $order->order_status);
        $this->assertEquals('pending', $order->payment_status);
    }

    public function test_notifications_shared_across_roles(): void
    {
        $superadmin = $this->makeSuperadmin();
        $agent = $this->makeAgent();
        [$store, $product] = $this->makeStoreAndProduct($agent);
        $user = $this->makeUser();

        // Create an unread contact message for the user
        Contact::create([
            'user_id' => $user->id,
            'name' => 'User Question',
            'email' => $user->email,
            'subject' => 'Help needed',
            'message' => 'How to pay delivery fee?',
            'is_read' => false,
        ]);

        // Create a pending order for agent's store
        Orders::create([
            'user_id' => $user->id,
            'store_id' => $store->id,
            'order_number' => 'ORD-NOTIF-TEST',
            'sender_name' => $store->name,
            'sender_phone' => $store->mobile,
            'sender_email' => 'store@example.com',
            'recipient_name' => 'Alice',
            'recipient_phone' => '01700000000',
            'recipient_email' => 'alice@example.com',
            'recipient_address' => 'Mirpur, Dhaka',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'delivery_type' => 48,
            'item_type' => 2,
            'item_quantity' => 1,
            'item_weight' => 1,
            'amount_to_collect' => 500,
            'item_description' => 'Product order',
            'store_name' => $store->name,
            'subtotal' => 500,
            'delivery_charge' => 80,
            'total' => 580,
            'shipping_method' => 'pathao',
            'payment_method' => 'cash_on_delivery',
            'transaction_id' => 'TRXNOTIF123',
            'order_status' => 'pending',
            'payment_status' => 'pending',
        ]);

        // Superadmin sees 1 unread message and 1 pending order
        $responseSuperadmin = $this->actingAs($superadmin, 'admin')->get(route('dashboard'));
        $responseSuperadmin->assertInertia(fn ($page) => $page
            ->where('notifications.pendingOrders', 1)
            ->where('notifications.unreadMessages', 1)
            ->where('notifications.total', 2)
        );

        // Reset auth guards for isolated agent request
        auth('admin')->logout();
        auth('web')->logout();

        // Agent sees 1 pending order for their store (tested on vendor profile page where agent is allowed)
        $responseAgent = $this->actingAs($agent, 'agent')->get(route('vendor.profile.edit'));
        $responseAgent->assertInertia(fn ($page) => $page
            ->where('notifications.pendingOrders', 1)
            ->where('notifications.unreadMessages', 0)
            ->where('notifications.total', 1)
        );

        // Reset auth guards for isolated user request
        auth('agent')->logout();

        // User sees 1 active order and 1 unread message
        $responseUser = $this->actingAs($user)->get(route('dashboard'));
        $responseUser->assertInertia(fn ($page) => $page
            ->where('notifications.pendingOrders', 1)
            ->where('notifications.unreadMessages', 1)
            ->where('notifications.total', 2)
        );
    }
}

<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\Orders;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AgentOrderManagementTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(string $email = 'buyer@example.com'): User
    {
        return User::create([
            'name' => 'Buyer',
            'email' => $email,
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);
    }

    private function makeAgent(string $email): Agent
    {
        return Agent::create([
            'name' => 'Agent ' . $email,
            'email' => $email,
            'password' => bcrypt('password'),
            'role' => 'agent',
            'blocked' => false,
            'email_verified_at' => now(),
        ]);
    }

    private function makeStore(User $owner, Agent $agent, string $suffix): Store
    {
        return Store::create([
            'user_id' => $owner->id,
            'agent_id' => $agent->id,
            'name' => 'Store ' . $suffix,
            'email' => "store{$suffix}@example.com",
            'address' => 'Address',
            'mobile' => '0170000' . str_pad((string) random_int(0, 999), 4, '0', STR_PAD_LEFT),
            'storetype' => 'general',
            'national_id' => '1234567890' . $suffix,
            'is_active' => true,
        ]);
    }

    private function makeOrder(
        User $buyer,
        Store $store,
        string $orderStatus,
        string $paymentStatus,
        string $total = '1000.00',
        ?Agent $placedByAgent = null,
    ): Orders {
        return Orders::create([
            'user_id' => $buyer->id,
            'agent_id' => $placedByAgent?->id,
            'store_id' => $store->id,
            'order_number' => 'ORD-' . strtoupper($this->orderToken()),
            'sender_name' => $store->name,
            'sender_phone' => '01300000000',
            'recipient_name' => 'Recipient',
            'recipient_email' => 'r@example.com',
            'recipient_phone' => '01800000000',
            'recipient_address' => 'Address',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'item_quantity' => 1,
            'item_weight' => 1,
            'amount_to_collect' => 0,
            'item_description' => 'Item',
            'store_name' => $store->name,
            'subtotal' => $total,
            'delivery_charge' => 0,
            'total' => $total,
            'order_status' => $orderStatus,
            'payment_status' => $paymentStatus,
        ]);
    }

    private function orderToken(): string
    {
        return substr(bin2hex(random_bytes(8)), 0, 12);
    }

    private function actingAsAgent(Agent $agent): static
    {
        $this->actingAs($agent, 'agent');

        return $this;
    }

    public function test_agent_can_update_order_status_on_their_own_store_order(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'pending', 'pending');

        $this->actingAsAgent($agent)
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), ['order_status' => 'shipped'])
            ->assertRedirect(route('dashboard.orders'))
            ->assertSessionHasNoErrors();

        $this->assertSame('shipped', $order->fresh()->order_status);
    }

    public function test_agent_cannot_update_an_order_from_another_store(): void
    {
        $buyer = $this->makeUser();
        $owner = $this->makeUser('owner@example.com');
        $otherAgent = $this->makeAgent('other@example.com');
        $otherStore = $this->makeStore($owner, $otherAgent, '02');
        $order = $this->makeOrder($buyer, $otherStore, 'pending', 'pending');

        $agent = $this->makeAgent('a1@example.com');

        $this->actingAsAgent($agent)
            ->patch(route('admin.orders.update', $order), ['order_status' => 'shipped'])
            ->assertForbidden();

        $this->assertSame('pending', $order->fresh()->order_status);
    }

    /**
     * The real-world case: the order shows up in the agent's list because they
     * placed it, so they drive it exactly like one of their own store's orders.
     */
    public function test_agent_can_fulfil_an_order_they_placed_at_another_store(): void
    {
        $buyer = $this->makeUser();
        $otherAgent = $this->makeAgent('other@example.com');
        $otherStore = $this->makeStore($this->makeUser('owner@example.com'), $otherAgent, '02');

        $agent = $this->makeAgent('a1@example.com');

        foreach (['confirmed', 'processing', 'shipped', 'delivered'] as $target) {
            $order = $this->makeOrder($buyer, $otherStore, 'pending', 'pending', '1000.00', $agent);

            $this->actingAsAgent($agent)
                ->from(route('dashboard.orders'))
                ->patch(route('admin.orders.update', $order), ['order_status' => $target])
                ->assertSessionHasNoErrors();

            $this->assertSame($target, $order->fresh()->order_status, $target);
        }
    }

    public function test_agent_can_record_payment_on_an_order_they_placed_elsewhere(): void
    {
        $buyer = $this->makeUser();
        $otherAgent = $this->makeAgent('other@example.com');
        $otherStore = $this->makeStore($this->makeUser('owner@example.com'), $otherAgent, '02');

        $agent = $this->makeAgent('a1@example.com');
        $order = $this->makeOrder($buyer, $otherStore, 'delivered', 'pending', '1000.00', $agent);

        $this->actingAsAgent($agent)
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), ['payment_status' => 'paid'])
            ->assertSessionHasNoErrors();

        $this->assertSame('paid', $order->fresh()->payment_status);
    }

    public function test_agent_placed_order_elsewhere_offers_every_option(): void
    {
        $buyer = $this->makeUser();
        $otherAgent = $this->makeAgent('other@example.com');
        $otherStore = $this->makeStore($this->makeUser('owner@example.com'), $otherAgent, '02');

        $agent = $this->makeAgent('a1@example.com');
        $order = $this->makeOrder($buyer, $otherStore, 'pending', 'pending', '1000.00', $agent);

        $this->actingAsAgent($agent)->get(route('dashboard.orders'))
            ->assertInertia(fn ($page) => $page
                ->where("orderRules.{$order->id}.canEdit", true)
                ->where("orderRules.{$order->id}.orderStatus", Orders::ORDER_STATUSES)
                ->where("orderRules.{$order->id}.paymentStatus", Orders::PAYMENT_STATUSES)
                ->where("orderRules.{$order->id}.orderStatusLocked", false)
            );
    }

    public function test_placed_order_elsewhere_still_locks_once_it_is_delivered(): void
    {
        $buyer = $this->makeUser();
        $otherAgent = $this->makeAgent('other@example.com');
        $otherStore = $this->makeStore($this->makeUser('owner@example.com'), $otherAgent, '02');

        $agent = $this->makeAgent('a1@example.com');
        $order = $this->makeOrder($buyer, $otherStore, 'delivered', 'pending', '1000.00', $agent);

        $this->actingAsAgent($agent)->get(route('dashboard.orders'))
            ->assertInertia(fn ($page) => $page
                ->where("orderRules.{$order->id}.canEdit", true)
                ->where("orderRules.{$order->id}.orderStatus", ['delivered'])
                ->where("orderRules.{$order->id}.orderStatusLocked", true)
                ->where("orderRules.{$order->id}.paymentStatus", Orders::PAYMENT_STATUSES)
            );

        $this->actingAsAgent($agent)
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), ['order_status' => 'shipped'])
            ->assertSessionHas('error');

        $this->assertSame('delivered', $order->fresh()->order_status);
    }

    /**
     * The order status freezes once the order is delivered or once the payment
     * is settled (paid/refunded). A cancelled order with an open payment may
     * still be corrected by the agent.
     */
    #[DataProvider('orderStatusLockProvider')]
    public function test_order_status_is_locked_by_terminal_status_or_settled_payment(
        string $from,
        string $payment,
        array $allowed,
    ): void {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');

        $probe = $this->makeOrder($buyer, $store, $from, $payment);

        // Settled money locks the payment field too, so it only offers itself.
        $paymentSettled = in_array($payment, Orders::SETTLED_PAYMENT_STATUSES, true);
        $expectedPayment = $paymentSettled ? [$payment] : Orders::PAYMENT_STATUSES;

        $this->actingAsAgent($agent)->get(route('dashboard.orders'))
            ->assertInertia(fn ($page) => $page
                ->where("orderRules.{$probe->id}.orderStatus", $allowed)
                ->where("orderRules.{$probe->id}.orderStatusLocked", $allowed !== Orders::ORDER_STATUSES)
                ->where("orderRules.{$probe->id}.paymentStatus", $expectedPayment)
                ->where("orderRules.{$probe->id}.paymentStatusLocked", $paymentSettled)
            );

        // One fresh order per target, otherwise the first successful move would
        // legitimately lock the order and invalidate the rest.
        foreach (Orders::ORDER_STATUSES as $target) {
            $order = $this->makeOrder($buyer, $store, $from, $payment);

            $this->actingAsAgent($agent)
                ->from(route('dashboard.orders'))
                ->patch(route('admin.orders.update', $order), ['order_status' => $target]);

            $this->assertSame(
                in_array($target, $allowed, true) ? $target : $from,
                $order->fresh()->order_status,
                "{$from}/{$payment} -> {$target}"
            );
        }
    }

    public static function orderStatusLockProvider(): array
    {
        $all = Orders::ORDER_STATUSES;

        return [
            // still in flight and unpaid: anything goes
            'pending / pending'   => ['pending', 'pending', $all],
            'processing / pending'=> ['processing', 'pending', $all],
            'shipped / pending'   => ['shipped', 'pending', $all],
            'confirmed / failed'  => ['confirmed', 'failed', $all],

            // delivered: frozen; cancelled with open money: still correctable
            'delivered / pending' => ['delivered', 'pending', ['delivered']],
            'delivered / paid'    => ['delivered', 'paid', ['delivered']],
            'cancelled / pending' => ['cancelled', 'pending', $all],
            'cancelled / refunded'=> ['cancelled', 'refunded', ['cancelled']],

            // money settled: frozen even mid-flow
            'pending / paid'      => ['pending', 'paid', ['pending']],
            'shipped / paid'      => ['shipped', 'paid', ['shipped']],
            'pending / refunded'  => ['pending', 'refunded', ['pending']],
        ];
    }

    public function test_agent_can_move_an_unpaid_order_to_delivered_shipped_or_cancelled(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');

        foreach (['shipped', 'delivered', 'cancelled'] as $target) {
            $order = $this->makeOrder($buyer, $store, 'pending', 'pending');

            $this->actingAsAgent($agent)
                ->from(route('dashboard.orders'))
                ->patch(route('admin.orders.update', $order), ['order_status' => $target])
                ->assertSessionHasNoErrors();

            $this->assertSame($target, $order->fresh()->order_status);
        }
    }

    public function test_agent_can_record_payment_after_the_order_is_delivered(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'delivered', 'pending');

        $this->actingAsAgent($agent)
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), ['payment_status' => 'paid'])
            ->assertSessionHasNoErrors();

        $this->assertSame('paid', $order->fresh()->payment_status);
    }

    /**
     * Settled money is final for an agent: a paid order can no longer be
     * refunded through this screen, and the reason says so.
     */
    #[DataProvider('settledPaymentProvider')]
    public function test_a_settled_payment_can_no_longer_be_changed_by_an_agent(string $payment): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'delivered', $payment);

        $this->actingAsAgent($agent)->get(route('dashboard.orders'))
            ->assertInertia(fn ($page) => $page
                ->where("orderRules.{$order->id}.paymentStatusLocked", true)
                ->where("orderRules.{$order->id}.paymentStatus", [$payment])
                ->where("orderRules.{$order->id}.orderStatus", ['delivered'])
                ->where("orderRules.{$order->id}.orderStatusLocked", true)
            );

        foreach (Orders::PAYMENT_STATUSES as $target) {
            // Re-sending the value it already has is a harmless no-op.
            if ($target === $payment) {
                continue;
            }

            $this->actingAsAgent($agent)
                ->from(route('dashboard.orders'))
                ->patch(route('admin.orders.update', $order), ['payment_status' => $target])
                ->assertSessionHas('error');

            $this->assertSame($payment, $order->fresh()->payment_status, "{$payment} -> {$target}");
        }
    }

    public static function settledPaymentProvider(): array
    {
        return [
            'paid' => ['paid'],
            'refunded' => ['refunded'],
        ];
    }

    private function makeSuperAdmin(string $email = 'root@example.com'): Admin
    {
        return Admin::create([
            'name' => 'Root',
            'email' => $email,
            'password' => bcrypt('password'),
            'role' => 'superadmin',
        ]);
    }

    /**
     * A fully locked order (delivered and paid) is still wide open to a
     * superadmin: both dropdowns must offer everything and neither may lock.
     */
    public function test_superadmin_sees_no_lock_on_a_fully_locked_order(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'delivered', 'paid');

        $this->actingAs($this->makeSuperAdmin(), 'superadmin')
            ->get(route('dashboard.orders'))
            ->assertInertia(fn ($page) => $page
                ->where("orderRules.{$order->id}.canEdit", true)
                ->where("orderRules.{$order->id}.orderStatus", Orders::ORDER_STATUSES)
                ->where("orderRules.{$order->id}.paymentStatus", Orders::PAYMENT_STATUSES)
                ->where("orderRules.{$order->id}.orderStatusLocked", false)
                ->where("orderRules.{$order->id}.paymentStatusLocked", false)
                ->where("orderRules.{$order->id}.reason", null)
            );
    }

    public function test_superadmin_can_change_the_order_status_of_a_locked_order(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $root = $this->makeSuperAdmin();

        // Reopen a delivered/paid order into any other status, one at a time.
        foreach (Orders::ORDER_STATUSES as $target) {
            $order = $this->makeOrder($buyer, $store, 'delivered', 'paid');

            $this->actingAs($root, 'superadmin')
                ->from(route('dashboard.orders'))
                ->patch(route('admin.orders.update', $order), ['order_status' => $target])
                ->assertSessionHasNoErrors();

            $this->assertSame($target, $order->fresh()->order_status, $target);
        }
    }

    public function test_superadmin_can_change_the_payment_status_of_a_locked_order(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $root = $this->makeSuperAdmin();

        foreach (Orders::PAYMENT_STATUSES as $target) {
            $order = $this->makeOrder($buyer, $store, 'delivered', 'paid');

            $this->actingAs($root, 'superadmin')
                ->from(route('dashboard.orders'))
                ->patch(route('admin.orders.update', $order), ['payment_status' => $target])
                ->assertSessionHasNoErrors();

            $this->assertSame($target, $order->fresh()->payment_status, $target);
        }
    }

    /** Both fields can be corrected in a single submit. */
    public function test_superadmin_can_move_a_locked_order_and_reopen_its_payment(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'cancelled', 'refunded');

        $this->actingAs($this->makeSuperAdmin(), 'superadmin')
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), [
                'order_status' => 'shipped',
                'payment_status' => 'paid',
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame('shipped', $order->fresh()->order_status);
        $this->assertSame('paid', $order->fresh()->payment_status);
    }

    /** A plain admin is still bound by both locks. */
    public function test_admin_remains_locked_out_of_settled_fields(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'delivered', 'paid');

        $staff = Admin::create([
            'name' => 'Staff',
            'email' => 'staff@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $this->actingAs($staff, 'superadmin')->get(route('dashboard.orders'))
            ->assertInertia(fn ($page) => $page
                ->where("orderRules.{$order->id}.orderStatus", ['delivered'])
                ->where("orderRules.{$order->id}.paymentStatus", ['paid'])
                ->where("orderRules.{$order->id}.orderStatusLocked", true)
                ->where("orderRules.{$order->id}.paymentStatusLocked", true)
            );

        $this->actingAs($staff, 'superadmin')
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), [
                'order_status' => 'shipped',
                'payment_status' => 'refunded',
            ])
            ->assertSessionHas('error');

        $this->assertSame('delivered', $order->fresh()->order_status);
        $this->assertSame('paid', $order->fresh()->payment_status);
    }

    public function test_order_status_and_payment_can_be_saved_together(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'pending', 'pending');

        $this->actingAsAgent($agent)
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), [
                'order_status' => 'delivered',
                'payment_status' => 'paid',
            ])
            ->assertSessionHasNoErrors();

        $order->refresh();
        $this->assertSame('delivered', $order->order_status);
        $this->assertSame('paid', $order->payment_status);
    }

    public function test_confirmed_is_a_selectable_order_status(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'processing', 'pending');

        $this->actingAsAgent($agent)
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), ['order_status' => 'confirmed'])
            ->assertSessionHasNoErrors();

        $this->assertSame('confirmed', $order->fresh()->order_status);
    }

    public function test_revenue_counts_only_paid_non_cancelled_orders_of_the_agents_stores(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');

        $otherAgent = $this->makeAgent('other@example.com');
        $otherStore = $this->makeStore($this->makeUser('o@example.com'), $otherAgent, '02');

        $this->makeOrder($buyer, $store, 'delivered', 'paid', '1000.50');
        $this->makeOrder($buyer, $store, 'shipped', 'pending', '500.00');   // not paid
        $this->makeOrder($buyer, $store, 'cancelled', 'paid', '700.00');   // cancelled
        $this->makeOrder($buyer, $store, 'delivered', 'refunded', '300.00'); // refunded
        $this->makeOrder($buyer, $otherStore, 'delivered', 'paid', '9999.00'); // other store

        $response = $this->actingAsAgent($agent)->get(route('dashboard.orders'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard/adminorders/index')
            ->where('revenue', 1000.5)
        );
    }

    public function test_index_tells_the_ui_which_statuses_each_order_may_move_to(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $delivered = $this->makeOrder($buyer, $store, 'delivered', 'paid');
        $pending = $this->makeOrder($buyer, $store, 'pending', 'pending');

        $this->actingAsAgent($agent)->get(route('dashboard.orders'))
            ->assertInertia(fn ($page) => $page
                ->where("orderRules.{$delivered->id}.orderStatus", ['delivered'])
                ->where("orderRules.{$delivered->id}.orderStatusLocked", true)
                ->where("orderRules.{$delivered->id}.paymentStatus", ['paid'])
                ->where("orderRules.{$delivered->id}.paymentStatusLocked", true)
                ->where("orderRules.{$pending->id}.orderStatus", Orders::ORDER_STATUSES)
                ->where("orderRules.{$pending->id}.orderStatusLocked", false)
                ->where("orderRules.{$pending->id}.paymentStatusLocked", false)
            );
    }

    public function test_flash_messages_are_shared_with_inertia(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'pending', 'pending');

        $this->actingAsAgent($agent)
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), ['order_status' => 'shipped']);

        $this->actingAsAgent($agent)->get(route('dashboard.orders'))
            ->assertInertia(fn ($page) => $page->where('flash.success', 'Order updated successfully'));
    }

    /** Only delivery is final for an agent: a cancelled order may be reopened. */
    public function test_agent_can_reopen_a_cancelled_unpaid_order(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'cancelled', 'pending');

        $this->actingAsAgent($agent)
            ->from(route('dashboard.orders'))
            ->patch(route('admin.orders.update', $order), ['order_status' => 'shipped'])
            ->assertSessionHasNoErrors();

        $this->assertSame('shipped', $order->fresh()->order_status);
    }

    /** The index paginates for every role and echoes the filters back. */
    public function test_orders_are_paginated_with_filters_echoed_back(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');

        for ($i = 0; $i < 12; $i++) {
            $this->makeOrder($buyer, $store, 'pending', 'pending');
        }

        $response = $this->actingAsAgent($agent)
            ->get(route('dashboard.orders', ['status' => 'pending', 'search' => 'ORD']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard/adminorders/index')
            ->count('orders', 10)
            ->where('pagination.total', 12)
            ->where('pagination.lastPage', 2)
            ->where('pagination.page', 1)
            ->where('filters.status', 'pending')
            ->where('filters.search', 'ORD')
            ->where('statusCounts.pending', 12)
        );

        $this->actingAsAgent($agent)
            ->get(route('dashboard.orders', ['page' => 2]))
            ->assertInertia(fn ($page) => $page
                ->count('orders', 2)
                ->where('pagination.page', 2)
                ->where('pagination.total', 12)
            );

        // Out-of-scope filter values are ignored rather than trusted.
        $this->actingAsAgent($agent)
            ->get(route('dashboard.orders', ['status' => 'nonsense']))
            ->assertInertia(fn ($page) => $page->where('filters.status', 'all'));
    }

    public function test_confirmation_page_is_openable_by_whatever_the_listing_shows(): void
    {
        $buyer = $this->makeUser();
        $agent = $this->makeAgent('a1@example.com');
        $store = $this->makeStore($buyer, $agent, '01');
        $order = $this->makeOrder($buyer, $store, 'pending', 'pending');

        // The agent sees the order in their listing (via the store), so the
        // confirmation page must open for them too.
        $this->actingAsAgent($agent)
            ->get(route('orders.confirmation', $order))
            ->assertOk();

        // The buyer always sees their own.
        $this->actingAs($buyer)
            ->get(route('orders.confirmation', $order))
            ->assertOk();

        // An agent with no connection to the order stays out.
        $this->actingAsAgent($this->makeAgent('other@example.com'))
            ->get(route('orders.confirmation', $order))
            ->assertForbidden();
    }
}

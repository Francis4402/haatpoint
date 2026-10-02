<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Staff accounts (admin + superadmin) never confirm their email address, so
 * their email_verified_at is NULL for the whole life of the account.
 *
 * The store and order gates used to read that column for every role, which sent
 * a superadmin to /verify-email on a page routes/auth.php deliberately keeps
 * staff out of. Store creation was therefore impossible for a superadmin unless
 * they had happened to register through Google, the one path that fills the
 * column in.
 */
class StaffStoreAndProductTest extends TestCase
{
    use RefreshDatabase;

    private function makeStaff(string $email = 'boss@gmail.com', string $role = 'superadmin'): Admin
    {
        return Admin::create([
            'name' => 'Boss',
            'email' => $email,
            'password' => bcrypt('secret123'),
            'role' => $role,
        ]);
    }

    private function storePayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Boss Store',
            'storetype' => 'Retail',
            'address' => 'House 1, Road 1, Dhaka',
            'national_id' => '1987654321',
            'mobile' => '01812345678',
        ], $overrides);
    }

    private function productPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Boss Product',
            'slug' => 'boss-product',
            'category' => 'General',
            'quantity' => 5,
            'regular_price' => 100,
            'description' => 'A product',
            'item_weight' => 1,
            'product_type' => 'regular',
        ], $overrides);
    }

    public function test_a_superadmin_has_no_verified_email_but_can_still_open_the_store_form(): void
    {
        $admin = $this->makeStaff();

        // Guards the premise of this whole file. If staff ever start verifying,
        // the rest of it stops testing anything.
        $this->assertNull($admin->email_verified_at);

        $this->actingAs($admin)
            ->get(route('dashboard.createstore'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('dashboard/forms/CreateStoreForm'));
    }

    public function test_a_superadmin_can_create_a_store_without_verifying_their_email(): void
    {
        $admin = $this->makeStaff();

        $this->actingAs($admin)
            ->post(route('stores.store'), $this->storePayload())
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('stores', [
            'name' => 'Boss Store',
            'user_id' => $admin->id,
        ]);
    }

    public function test_a_plain_admin_can_create_a_store_without_verifying_their_email(): void
    {
        $admin = $this->makeStaff('manager@gmail.com', 'admin');

        $this->actingAs($admin)
            ->post(route('stores.store'), $this->storePayload())
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('stores', [
            'name' => 'Boss Store',
            'user_id' => $admin->id,
        ]);
    }

    public function test_a_superadmin_can_upload_a_product_to_their_store(): void
    {
        $admin = $this->makeStaff();

        $this->actingAs($admin)->post(route('stores.store'), $this->storePayload());

        $this->actingAs($admin)
            ->post(route('products.store'), $this->productPayload())
            ->assertSessionHasNoErrors();

        $store = Store::where('name', 'Boss Store')->firstOrFail();

        $this->assertDatabaseHas('products', [
            'name' => 'Boss Product',
            'store_id' => $store->id,
        ]);
    }

    public function test_staff_are_not_sent_to_the_verification_page_when_placing_an_order(): void
    {
        $admin = $this->makeStaff();

        // The gate runs before validation, so an unverified staff account used to
        // be redirected to /verify-email here. A validation failure instead proves
        // the gate no longer claims the account.
        $response = $this->actingAs($admin)->post(route('orders.store'), []);

        $response->assertSessionHasErrors();

        $this->assertStringNotContainsString(
            route('verification.notice'),
            (string) $response->headers->get('Location')
        );
    }

    public function test_an_unverified_agent_is_still_kept_away_from_stores(): void
    {
        $agent = Agent::create([
            'name' => 'Vendor',
            'email' => 'vendor@gmail.com',
            'password' => bcrypt('secret123'),
            'role' => 'agent',
            'address' => 'House 1, Road 1, Dhaka',
            'mobile' => '01812345678',
            'national_id' => '1987654321',
        ]);

        $this->assertNull($agent->email_verified_at);

        $this->actingAs($agent)
            ->get(route('dashboard.createstore'))
            ->assertRedirect(route('verification.notice'));

        $this->actingAs($agent)
            ->post(route('stores.store'), $this->storePayload())
            ->assertRedirect(route('verification.notice'));

        $this->assertDatabaseCount('stores', 0);
    }

    public function test_a_verified_agent_can_create_a_store_and_upload_a_product(): void
    {
        $agent = Agent::create([
            'name' => 'Vendor',
            'email' => 'vendor@gmail.com',
            'password' => bcrypt('secret123'),
            'role' => 'agent',
            'address' => 'House 1, Road 1, Dhaka',
            'mobile' => '01812345678',
            'national_id' => '1987654321',
            'email_verified_at' => now(),
        ]);

        $this->actingAs($agent)
            ->post(route('stores.store'), $this->storePayload())
            ->assertSessionHasNoErrors();

        $this->actingAs($agent)
            ->post(route('products.store'), $this->productPayload())
            ->assertSessionHasNoErrors();

        $store = Store::where('agent_id', $agent->id)->firstOrFail();

        $this->assertDatabaseHas('products', [
            'name' => 'Boss Product',
            'store_id' => $store->id,
        ]);
    }

    public function test_a_customer_is_also_kept_away_from_stores_until_verified(): void
    {
        $user = User::create([
            'name' => 'Shopper',
            'email' => 'shopper@gmail.com',
            'password' => bcrypt('secret123'),
        ]);

        $this->assertNull($user->email_verified_at);

        $this->actingAs($user)
            ->post(route('stores.store'), $this->storePayload())
            ->assertRedirect(route('verification.notice'));

        $this->assertDatabaseCount('stores', 0);
    }
}
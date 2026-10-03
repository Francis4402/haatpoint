<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * edit(), update() and destroy() looked products up by slug/id with no
 * ownership check, and update() accepted any store_id that merely existed.
 * Because Products::$guarded is empty, that value was mass-assigned, so any
 * signed-in account could open, rewrite or delete another vendor's product and
 * move it into a store it did not own.
 */
class ProductOwnershipTest extends TestCase
{
    use RefreshDatabase;

    private function makeAgent(string $email): Agent
    {
        return Agent::create([
            'name' => 'Vendor',
            'email' => $email,
            'password' => bcrypt('secret123'),
            'role' => 'agent',
            'mobile' => '018' . (string) random_int(10000000, 99999999),
            'national_id' => (string) random_int(10000000000, 99999999999),
            'address' => 'House 1, Road 1, Dhaka',
            'email_verified_at' => now(),
        ]);
    }

    private function makeUser(string $email): User
    {
        return User::create([
            'name' => 'Shopper',
            'email' => $email,
            'password' => bcrypt('secret123'),
            'email_verified_at' => now(),
        ]);
    }

    private function makeStore(?Agent $agent = null, ?User $user = null): Store
    {
        $owner = $user ?? $agent;

        return Store::create([
            'name' => 'Store ' . uniqid(),
            'storetype' => 'Retail',
            'email' => $owner->email,
            'address' => 'House 1, Road 1, Dhaka',
            'national_id' => (string) random_int(10000000000, 99999999999),
            'mobile' => '017' . (string) random_int(10000000, 99999999),
            // Not nullable in the schema, and StoreController::store writes the
            // actor's id for agents too — only agent_id distinguishes them.
            'user_id' => $user?->id ?? $agent?->id,
            'agent_id' => $agent?->id,
        ]);
    }

    private function makeProduct(Store $store, ?User $user = null): Products
    {
        return Products::create([
            // ProductsController::store stamps the acting id here, so an agent's
            // product carries the agent id rather than a users row.
            'user_id' => $user?->id ?? $store->user_id,
            'store_id' => $store->id,
            'name' => 'Widget',
            'slug' => 'widget-' . uniqid(),
            'category' => 'General',
            'subcategory' => '',
            'brand' => '',
            'quantity' => 5,
            'regular_price' => 100,
            'description' => 'A widget',
            'color' => '[]',
            'inStock' => true,
            'item_weight' => 1,
            'product_type' => 'regular',
            'images' => json_encode([]),
        ]);
    }

    private function updatePayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Widget Renamed',
            'slug' => 'widget-slug',
            'category' => 'General',
            'quantity' => 5,
            'regular_price' => 120,
            'description' => 'Updated',
            'item_weight' => 1,
            'product_type' => 'regular',
        ], $overrides);
    }

    public function test_an_agent_cannot_open_the_edit_form_for_another_agents_product(): void
    {
        $owner = $this->makeAgent('owner@gmail.com');
        $intruder = $this->makeAgent('intruder@gmail.com');
        $product = $this->makeProduct($this->makeStore($owner));

        $this->actingAs($intruder, 'agent')
            ->get(route('dashboard.productedit', $product->slug))
            ->assertForbidden();
    }

    public function test_an_agent_cannot_update_another_agents_product(): void
    {
        $owner = $this->makeAgent('owner@gmail.com');
        $intruder = $this->makeAgent('intruder@gmail.com');
        $store = $this->makeStore($owner);
        $product = $this->makeProduct($store);

        $this->actingAs($intruder, 'agent')
            ->post(route('dashboard.updateproduct', $product->slug), $this->updatePayload([
                'store_id' => $store->id,
            ]))
            ->assertForbidden();

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Widget']);
    }

    public function test_an_agent_cannot_delete_another_agents_product(): void
    {
        $owner = $this->makeAgent('owner@gmail.com');
        $intruder = $this->makeAgent('intruder@gmail.com');
        $product = $this->makeProduct($this->makeStore($owner));

        $this->actingAs($intruder, 'agent')
            ->delete(route('dashboard.deleteproduct', $product->id))
            ->assertForbidden();

        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    public function test_a_product_cannot_be_moved_into_a_store_the_agent_does_not_own(): void
    {
        $owner = $this->makeAgent('owner@gmail.com');
        $other = $this->makeAgent('other@gmail.com');

        $ownStore = $this->makeStore($owner);
        $foreignStore = $this->makeStore($other);
        $product = $this->makeProduct($ownStore);

        $this->actingAs($owner, 'agent')
            ->post(route('dashboard.updateproduct', $product->slug), $this->updatePayload([
                'store_id' => $foreignStore->id,
            ]))
            ->assertForbidden();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'store_id' => $ownStore->id,
        ]);
    }

    public function test_an_agent_can_move_their_own_product_between_their_own_stores(): void
    {
        $agent = $this->makeAgent('owner@gmail.com');
        $first = $this->makeStore($agent);
        $second = $this->makeStore($agent);
        $product = $this->makeProduct($first);

        $this->actingAs($agent, 'agent')
            ->post(route('dashboard.updateproduct', $product->slug), $this->updatePayload([
                'store_id' => $second->id,
            ]))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'store_id' => $second->id,
        ]);
    }

    public function test_a_plain_customer_cannot_delete_another_customers_product(): void
    {
        $owner = $this->makeUser('owner@gmail.com');
        $intruder = $this->makeUser('intruder@gmail.com');
        $product = $this->makeProduct($this->makeStore(null, $owner), $owner);

        $this->actingAs($intruder)
            ->delete(route('dashboard.deleteproduct', $product->id))
            ->assertForbidden();

        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    /**
     * Staff run the platform, and their product list already spans every store,
     * so the broad reach has to survive the ownership checks.
     */
    public function test_a_superadmin_still_manages_any_product(): void
    {
        $owner = $this->makeAgent('owner@gmail.com');
        $store = $this->makeStore($owner);
        $product = $this->makeProduct($store);

        $superadmin = Admin::create([
            'name' => 'Boss',
            'email' => 'boss@gmail.com',
            'password' => bcrypt('secret123'),
            'role' => 'superadmin',
        ]);

        $this->actingAs($superadmin, 'admin')
            ->get(route('dashboard.productedit', $product->slug))
            ->assertOk();

        $this->actingAs($superadmin, 'admin')
            ->post(route('dashboard.updateproduct', $product->slug), $this->updatePayload([
                'store_id' => $store->id,
            ]))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Widget Renamed']);
    }

    /**
     * The create form used to be handed a null store and crashed on store.id.
     */
    public function test_a_seller_without_a_store_is_sent_to_the_store_list(): void
    {
        $agent = $this->makeAgent('owner@gmail.com');

        $this->actingAs($agent, 'agent')
            ->get(route('dashboard.createproduct'))
            ->assertRedirect(route('dashboard.store'));
    }

    public function test_the_create_form_offers_every_store_the_agent_owns(): void
    {
        $agent = $this->makeAgent('owner@gmail.com');
        $first = $this->makeStore($agent);
        $second = $this->makeStore($agent);

        $this->actingAs($agent, 'agent')
            ->get(route('dashboard.createproduct'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard/forms/CreateProductForm')
                ->has('stores', 2)
                ->where('stores.0.id', $first->id)
                ->where('stores.1.id', $second->id));
    }

    public function test_a_new_product_lands_in_the_store_the_agent_picked(): void
    {
        $agent = $this->makeAgent('owner@gmail.com');
        $first = $this->makeStore($agent);
        $second = $this->makeStore($agent);

        $this->actingAs($agent, 'agent')
            ->post(route('products.store'), [
                'name' => 'Chosen Store Product',
                'slug' => 'chosen-store-product',
                'category' => 'General',
                'quantity' => 2,
                'regular_price' => 250,
                'description' => 'Lands in the second store',
                'item_weight' => 1,
                'product_type' => 'regular',
                'store_id' => $second->id,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('products', [
            'name' => 'Chosen Store Product',
            'store_id' => $second->id,
        ]);
    }

    public function test_a_product_cannot_be_created_in_a_store_the_agent_does_not_own(): void
    {
        $agent = $this->makeAgent('owner@gmail.com');
        $other = $this->makeAgent('other@gmail.com');
        $this->makeStore($agent);
        $foreignStore = $this->makeStore($other);

        $this->actingAs($agent, 'agent')
            ->post(route('products.store'), [
                'name' => 'Trespassing Product',
                'slug' => 'trespassing-product',
                'category' => 'General',
                'quantity' => 2,
                'regular_price' => 250,
                'description' => 'Should not be created',
                'item_weight' => 1,
                'product_type' => 'regular',
                'store_id' => $foreignStore->id,
            ])
            ->assertSessionHasErrors('store_id');

        $this->assertDatabaseMissing('products', ['name' => 'Trespassing Product']);
    }
}
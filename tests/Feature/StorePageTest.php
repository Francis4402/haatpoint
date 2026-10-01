<?php

namespace Tests\Feature;

use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class StorePageTest extends TestCase
{
    use RefreshDatabase;

    private function makeStore(string $name = 'Test Store', bool $active = true, ?User $owner = null): Store
    {
        $owner ??= User::create([
            'name' => 'Owner ' . uniqid(),
            'email' => uniqid() . '@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        return Store::create([
            'user_id' => $owner->id,
            'name' => $name,
            'email' => uniqid() . '@example.com',
            'address' => 'Dhaka, Bangladesh',
            'mobile' => '017' . uniqid(),
            'storetype' => 'general',
            'national_id' => '1' . uniqid(),
            'is_active' => $active,
        ]);
    }

    private function makeProduct(Store $store, string $name = 'Product', string $type = 'regular'): Products
    {
        return Products::create([
            'user_id' => $store->user_id,
            'store_id' => $store->id,
            'name' => $name,
            'images' => '[]',
            'slug' => 'product-' . uniqid(),
            'category' => 'Test',
            'subcategory' => 'Test',
            'brand' => 'Test',
            'regular_price' => '100.00',
            'description' => 'A product',
            'item_weight' => '1.00',
            'product_type' => $type,
        ]);
    }

    public function test_a_store_page_shows_the_products_of_that_store(): void
    {
        $store = $this->makeStore('Alpha Store');
        $other = $this->makeStore('Beta Store');

        $this->makeProduct($store, 'Alpha One');
        $this->makeProduct($store, 'Alpha Two');
        $this->makeProduct($other, 'Beta One');

        $this->get(route('stores.show', $store->id))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('storeproducts/index')
                ->where('store.name', 'Alpha Store')
                ->where('store.products_count', 2)
                ->has('products.data', 2)
                ->where('products.total', 2)
                ->has('products.links')
                // The other store's product must not leak onto this page.
                ->where('products.data.0.store_id', $store->id)
            );
    }

    public function test_a_store_page_excludes_products_from_other_stores(): void
    {
        $store = $this->makeStore('Gamma Store');
        $other = $this->makeStore('Delta Store');

        $this->makeProduct($store, 'Mine');
        $this->makeProduct($other, 'Theirs');

        $names = $this->get(route('stores.show', $store->id))
            ->assertOk()
            ->viewData('page')['props']['products']['data'];

        $this->assertSame(['Mine'], array_column($names, 'name'));
    }

    public function test_a_store_page_excludes_inactive_stores(): void
    {
        $store = $this->makeStore('Hidden Store', active: false);
        $this->makeProduct($store, 'Hidden Product');

        $this->get(route('stores.show', $store->id))->assertNotFound();
    }

    public function test_a_store_page_excludes_products_whose_store_is_inactive(): void
    {
        $active = $this->makeStore('Active Store');
        $this->makeProduct($active, 'Visible Product');

        // Deactivating the store is what hides the whole page, so a product can
        // only appear while its own store is active.
        $active->update(['is_active' => false]);

        $this->get(route('stores.show', $active->id))->assertNotFound();
    }

    public function test_a_store_page_paginates_its_products(): void
    {
        $store = $this->makeStore('Paging Store');

        foreach (range(1, 15) as $i) {
            $this->makeProduct($store, 'Product ' . $i);
        }

        $props = $this->get(route('stores.show', $store->id))
            ->assertOk()
            ->viewData('page')['props'];

        $this->assertCount(12, $props['products']['data']);
        $this->assertSame(15, $props['products']['total']);
        $this->assertSame(2, $props['products']['last_page']);
    }

    public function test_a_store_page_can_be_paginated(): void
    {
        $store = $this->makeStore('Paged Store');

        foreach (range(1, 15) as $i) {
            $this->makeProduct($store, 'Product ' . $i);
        }

        $this->get(route('stores.show', [$store->id, 'page' => 2]))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('products.current_page', 2)
                ->has('products.data', 3)
            );
    }

    public function test_the_store_directory_lists_active_stores(): void
    {
        $this->makeStore('Listed Store');
        $this->makeStore('Disabled Store', active: false);

        $this->get(route('stores.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('stores/index')
                ->has('stores', 1)
                ->where('stores.0.name', 'Listed Store')
            );
    }

    public function test_the_product_detail_page_links_to_the_store_page(): void
    {
        $store = $this->makeStore('Linked Store');
        $product = $this->makeProduct($store, 'Linked Product');

        $this->get(route('products.details', $product->slug))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('store.id', $store->id)
            );
    }
}

<?php

namespace Tests\Feature;

use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class WelcomeSectionsTest extends TestCase
{
    use RefreshDatabase;

    private function makeStore(string $name = 'Store', bool $active = true): Store
    {
        $owner = User::create([
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

    private function makeProducts(Store $store, string $type, int $count): void
    {
        foreach (range(1, $count) as $i) {
            Products::create([
                'user_id' => $store->user_id,
                'store_id' => $store->id,
                'name' => ucfirst($type) . ' ' . $i,
                'images' => '[]',
                'slug' => strtolower($type) . '-' . uniqid(),
                'category' => 'Test',
                'subcategory' => 'Test',
                'brand' => 'Test',
                'regular_price' => '100.00',
                'description' => 'A product',
                'item_weight' => '1.00',
                'product_type' => $type,
            ]);
        }
    }

    public function test_the_home_page_exposes_each_showcase_rail(): void
    {
        $store = $this->makeStore();
        $this->makeProducts($store, 'featured', 6);
        $this->makeProducts($store, 'trending', 6);
        $this->makeProducts($store, 'regular', 6);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Welcome')
                ->has('offeredProducts', 6)
                ->has('trendingProducts', 6)
                ->has('dailyDiscoverProducts', 6)
                ->has('topSelling', 0)
                ->has('stores', 1)
            );
    }

    public function test_each_rail_caps_at_six_products(): void
    {
        $store = $this->makeStore();
        $this->makeProducts($store, 'featured', 20);
        $this->makeProducts($store, 'trending', 20);
        $this->makeProducts($store, 'regular', 20);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('offeredProducts', 6)
                ->has('trendingProducts', 6)
                ->has('dailyDiscoverProducts', 6)
            );
    }

    public function test_rails_only_contain_their_own_product_type_when_enough_exist(): void
    {
        $store = $this->makeStore();
        $this->makeProducts($store, 'featured', 6);
        $this->makeProducts($store, 'trending', 6);
        $this->makeProducts($store, 'regular', 6);

        $props = $this->get('/')->viewData('page')['props'];

        foreach ($props['offeredProducts'] as $product) {
            $this->assertSame('featured', $product['product_type']);
        }

        foreach ($props['trendingProducts'] as $product) {
            $this->assertSame('trending', $product['product_type']);
        }

        foreach ($props['dailyDiscoverProducts'] as $product) {
            $this->assertSame('regular', $product['product_type']);
        }
    }

    public function test_a_short_rail_is_topped_up_to_six_with_other_visible_products(): void
    {
        $store = $this->makeStore();
        $this->makeProducts($store, 'featured', 2);
        $this->makeProducts($store, 'regular', 20);

        $props = $this->get('/')->viewData('page')['props'];

        // Two featured products plus four random others fills the rail.
        $this->assertCount(6, $props['offeredProducts']);
        $this->assertCount(6, array_unique(array_column($props['offeredProducts'], 'id')));

        $types = array_count_values(array_column($props['offeredProducts'], 'product_type'));
        $this->assertSame(2, $types['featured']);
        $this->assertSame(4, $types['regular']);
    }

    public function test_a_rail_is_never_longer_than_six_after_topping_up(): void
    {
        $store = $this->makeStore();
        $this->makeProducts($store, 'trending', 1);
        $this->makeProducts($store, 'regular', 30);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('trendingProducts', 6)
                ->etc()
            );
    }

    public function test_topping_up_does_not_repeat_products_inside_a_rail(): void
    {
        $store = $this->makeStore();
        $this->makeProducts($store, 'featured', 1);
        $this->makeProducts($store, 'regular', 12);

        $props = $this->get('/')->viewData('page')['props'];

        foreach (['offeredProducts', 'trendingProducts', 'dailyDiscoverProducts'] as $rail) {
            $ids = array_column($props[$rail], 'id');
            $this->assertSame($ids, array_values(array_unique($ids)), $rail . ' repeated a product');
        }
    }

    public function test_rails_skip_products_whose_store_is_inactive(): void
    {
        $active = $this->makeStore('Active');
        $hidden = $this->makeStore('Hidden', active: false);

        $this->makeProducts($active, 'featured', 2);
        $this->makeProducts($hidden, 'featured', 2);

        $props = $this->get('/')->viewData('page')['props'];

        $this->assertCount(2, $props['offeredProducts']);
        $this->assertSame(
            [$active->id, $active->id],
            array_column($props['offeredProducts'], 'store_id')
        );
    }

    public function test_stores_rail_only_lists_active_stores_with_products(): void
    {
        $withProducts = $this->makeStore('Has Products');
        $empty = $this->makeStore('No Products');
        $inactive = $this->makeStore('Inactive', active: false);

        $this->makeProducts($withProducts, 'regular', 1);
        $this->makeProducts($inactive, 'regular', 1);

        $props = $this->get('/')->viewData('page')['props'];

        $names = array_column($props['stores'], 'name');

        $this->assertSame(['Has Products'], $names);
        $this->assertNotContains($empty->id, array_column($props['stores'], 'id'));
        $this->assertNotContains($inactive->id, array_column($props['stores'], 'id'));
        $this->assertSame(1, $props['stores'][0]['products_count']);
    }

    public function test_rails_never_return_duplicate_products(): void
    {
        $store = $this->makeStore();
        $this->makeProducts($store, 'regular', 10);

        $props = $this->get('/')->viewData('page')['props'];

        $ids = array_column($props['dailyDiscoverProducts'], 'id');

        $this->assertCount(6, $ids);
        $this->assertCount(6, array_unique($ids));
    }

    public function test_rails_carry_rating_data(): void
    {
        $store = $this->makeStore();
        $this->makeProducts($store, 'featured', 1);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('offeredProducts.0.rating', 0)
                ->where('offeredProducts.0.review', 0)
                ->etc()
            );
    }

    public function test_the_home_page_still_renders_with_no_data(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Welcome')
                ->has('offeredProducts', 0)
                ->has('trendingProducts', 0)
                ->has('dailyDiscoverProducts', 0)
                ->has('stores', 0)
            );
    }
}

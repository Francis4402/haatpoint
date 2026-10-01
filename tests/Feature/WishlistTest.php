<?php

namespace Tests\Feature;

use App\Models\Agent;
use App\Models\Products;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WishlistTest extends TestCase
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

    private function makeAgent(string $email = 'vendor@example.com'): Agent
    {
        return Agent::create([
            'name' => 'Vendor',
            'email' => $email,
            'password' => bcrypt('password'),
            'role' => 'agent',
            'blocked' => false,
        ]);
    }

    private function makeProduct(): Products
    {
        $owner = $this->makeUser('owner' . uniqid() . '@example.com');

        $store = \App\Models\Store::create([
            'user_id' => $owner->id,
            'name' => 'Store ' . uniqid(),
            'email' => uniqid() . '@example.com',
            'address' => 'Address',
            'mobile' => '017' . uniqid(),
            'storetype' => 'general',
            'national_id' => '1234567890' . uniqid(),
            'is_active' => true,
        ]);

        return Products::create([
            'user_id' => $owner->id,
            'store_id' => $store->id,
            'name' => 'Test Product',
            'images' => 'test.jpg',
            'slug' => 'test-product-' . uniqid(),
            'category' => 'Test',
            'subcategory' => 'Test',
            'brand' => 'Test',
            'regular_price' => '100.00',
            'description' => 'Test product',
            'item_weight' => '1.00',
        ]);
    }

    public function test_a_customer_can_add_and_remove_a_product(): void
    {
        $user = $this->makeUser();
        $product = $this->makeProduct();

        $this->actingAs($user, 'web')
            ->post(route('wishlist.toggle', $product->id));

        $this->assertDatabaseHas('wishlists', [
            'user_id' => $user->id,
            'agent_id' => null,
            'product_id' => $product->id,
        ]);

        // Toggling the same product again removes it.
        $this->actingAs($user, 'web')
            ->post(route('wishlist.toggle', $product->id));

        $this->assertDatabaseMissing('wishlists', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    /**
     * The regression: vendors live in `agents`, not `users`, so writing the
     * agent's id into the user_id column always failed the foreign key.
     */
    public function test_a_signed_in_agent_can_add_a_product_to_their_wishlist(): void
    {
        $agent = $this->makeAgent();
        $product = $this->makeProduct();

        $this->actingAs($agent, 'agent')
            ->post(route('wishlist.toggle', $product->id))
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('wishlists', [
            'agent_id' => $agent->id,
            'user_id' => null,
            'product_id' => $product->id,
        ]);
    }

    public function test_an_agents_wishlist_reports_its_own_items(): void
    {
        $agent = $this->makeAgent();
        $other = $this->makeAgent('other@example.com');
        $product = $this->makeProduct();
        $otherProduct = $this->makeProduct();

        Wishlist::create(['agent_id' => $agent->id, 'product_id' => $product->id]);
        Wishlist::create(['agent_id' => $other->id, 'product_id' => $otherProduct->id]);

        $this->actingAs($agent, 'agent')
            ->get(route('wishlist.check', $product->id))
            ->assertJson(['success' => true, 'isInWishlist' => true]);

        $this->actingAs($agent, 'agent')
            ->get(route('wishlist.check', $otherProduct->id))
            ->assertJson(['success' => true, 'isInWishlist' => false]);
    }

    public function test_an_agent_cannot_toggle_a_product_someone_else_saved(): void
    {
        $agent = $this->makeAgent();
        $other = $this->makeAgent('other@example.com');
        $product = $this->makeProduct();

        Wishlist::create(['agent_id' => $other->id, 'product_id' => $product->id]);

        $this->actingAs($agent, 'agent')
            ->post(route('wishlist.toggle', $product->id));

        // The other agent's row is untouched; a new one belongs to the actor.
        $this->assertDatabaseHas('wishlists', [
            'agent_id' => $other->id,
            'product_id' => $product->id,
        ]);
        $this->assertDatabaseHas('wishlists', [
            'agent_id' => $agent->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_the_wishlist_page_loads_for_an_agent(): void
    {
        $agent = $this->makeAgent();
        $product = $this->makeProduct();
        Wishlist::create(['agent_id' => $agent->id, 'product_id' => $product->id]);

        $this->actingAs($agent, 'agent')
            ->get(route('wishlist.index'))
            ->assertOk();
    }

    /**
     * Guests never reach the controller - the auth middleware answers first -
     * so no row can be written for a signed out visitor.
     */
    public function test_a_guest_is_asked_to_log_in_instead_of_hitting_the_database(): void
    {
        $product = $this->makeProduct();

        $this->postJson(route('wishlist.toggle', $product->id))
            ->assertUnauthorized();

        $this->assertDatabaseCount('wishlists', 0);
    }

    /**
     * The heart buttons render for guests, so the check endpoint has to answer
     * with JSON. Behind the auth middleware it returned the HTML login page and
     * the component threw while parsing it.
     */
    public function test_a_guest_gets_a_json_answer_from_the_wishlist_check(): void
    {
        $product = $this->makeProduct();

        $this->getJson(route('wishlist.check', $product->id))
            ->assertOk()
            ->assertJson(['success' => true, 'isInWishlist' => false]);

        $this->assertDatabaseCount('wishlists', 0);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Agent;
use App\Models\Comments;
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

    private function makeReviewer(): User
    {
        return User::create([
            'name' => 'Reviewer ' . uniqid(),
            'email' => uniqid() . '@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);
    }

    public function test_a_signed_in_customer_can_rate_a_store(): void
    {
        $store = $this->makeStore('Rated Store');
        $reviewer = $this->makeReviewer();

        $this->actingAs($reviewer)
            ->post(route('stores.review', $store->id), [
                'rating' => 4,
                'comment' => 'Quick delivery and friendly staff.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('comments', [
            'store_id' => $store->id,
            'user_id' => $reviewer->id,
            'product_id' => null,
            'rating' => 4,
        ]);
    }

    public function test_rating_a_store_updates_the_cached_average_and_review_count(): void
    {
        $store = $this->makeStore('Counted Store');

        $this->actingAs($this->makeReviewer())
            ->post(route('stores.review', $store->id), ['rating' => 5]);

        $this->actingAs($this->makeReviewer())
            ->post(route('stores.review', $store->id), ['rating' => 4]);

        $this->actingAs($this->makeReviewer())
            ->post(route('stores.review', $store->id), ['rating' => 3]);

        // 5 + 4 + 3 = 12 over 3 reviews.
        $store->refresh();

        $this->assertEquals(4.0, (float) $store->rating);
        $this->assertEquals(3, (int) $store->review_count);
    }

    public function test_the_store_page_reports_the_fresh_average_and_count(): void
    {
        $store = $this->makeStore('Reported Store');

        $this->actingAs($this->makeReviewer())
            ->post(route('stores.review', $store->id), ['rating' => 5, 'comment' => 'Excellent shop']);

        $this->actingAs($this->makeReviewer())
            ->post(route('stores.review', $store->id), ['rating' => 2, 'comment' => 'Slow sometimes']);

        $this->get(route('stores.show', $store->id))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('storeRating.average', 3.5)
                ->where('storeRating.count', 2)
                ->where('store.review_count', 2)
            );
    }

    public function test_rating_the_same_store_twice_is_rejected_and_the_first_rating_stands(): void
    {
        $store = $this->makeStore('Once Store');
        $reviewer = $this->makeReviewer();

        $this->actingAs($reviewer)
            ->post(route('stores.review', $store->id), ['rating' => 1, 'comment' => 'Genuinely bad']);

        $this->actingAs($reviewer)
            ->post(route('stores.review', $store->id), ['rating' => 5, 'comment' => 'Changed my mind'])
            ->assertSessionHasErrors('rating');

        $this->assertSame(1, Comments::where('store_id', $store->id)->count());

        $store->refresh();

        // The rejected second attempt must not overwrite the original score.
        $this->assertEquals(1.0, (float) $store->rating);
        $this->assertEquals(1, (int) $store->review_count);

        $this->assertSame(1, (int) Comments::where('store_id', $store->id)->first()->rating);
    }

    public function test_a_store_rating_cannot_be_rewritten_through_the_comment_edit_route(): void
    {
        $store = $this->makeStore('Locked Store');
        $reviewer = $this->makeReviewer();

        $this->actingAs($reviewer)
            ->post(route('stores.review', $store->id), ['rating' => 2, 'comment' => 'Not great']);

        $review = Comments::where('store_id', $store->id)->firstOrFail();

        // The generic comment editor is not a way around the lock.
        $this->actingAs($reviewer)
            ->put(route('comments.update', $review->id), ['rating' => 5, 'comment' => 'Sneaking a change'])
            ->assertSessionHas('error');

        $this->assertEquals(2.0, (float) $store->fresh()->rating);
        $this->assertEquals(2, (int) $review->fresh()->rating);
    }

    public function test_the_public_store_page_does_not_leak_national_id_or_licence(): void
    {
        $store = $this->makeStore('Private Documents Store');
        $store->update([
            'national_id' => '9876543210',
            'license' => 'LIC-99887',
        ]);

        $response = $this->get(route('stores.show', $store->id));

        $response->assertOk();

        // Hiding these only in the markup would still expose them in
        // view-source, so assert against the whole rendered response.
        $response->assertDontSee('9876543210');
        $response->assertDontSee('LIC-99887');
        $response->assertDontSee('national_id');
        $response->assertDontSee('National ID');
    }

    public function test_the_public_store_page_does_not_leak_the_owning_agents_national_id(): void
    {
        $agent = Agent::create([
            'name' => 'Vendor Agent',
            'email' => 'vendor.agent@example.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'blocked' => false,
            'email_verified_at' => now(),
            'national_id' => '1122334455',
        ]);

        $store = $this->makeStore('Agent Owned Store');
        $store->update(['agent_id' => $agent->id]);

        $response = $this->get(route('stores.show', $store->id));

        $response->assertOk();

        // getAuthorNameAttribute() touches ->agent, which loads the relation and
        // would otherwise serialise the whole vendor record, national ID
        // included, to anonymous visitors.
        $response->assertDontSee('1122334455');

        // The display name still has to work, otherwise the page loses the
        // vendor name the accessor exists to provide.
        $response->assertSee('Vendor Agent');
    }

    public function test_a_store_rating_must_be_between_one_and_five(): void
    {
        $store = $this->makeStore('Validated Store');
        $reviewer = $this->makeReviewer();

        foreach ([0, 6, 'abc'] as $badRating) {
            $this->actingAs($reviewer)
                ->from(route('stores.show', $store->id))
                ->post(route('stores.review', $store->id), ['rating' => $badRating])
                ->assertRedirect(route('stores.show', $store->id))
                ->assertSessionHasErrors('rating');
        }

        $this->assertSame(0, Comments::where('store_id', $store->id)->count());
        $this->assertSame(0, (int) $store->fresh()->review_count);
    }

    public function test_a_guest_cannot_rate_a_store(): void
    {
        $store = $this->makeStore('Guest Store');

        $this->post(route('stores.review', $store->id), ['rating' => 5])
            ->assertRedirect(route('login'));

        $this->assertSame(0, Comments::where('store_id', $store->id)->count());
    }

    public function test_an_inactive_store_cannot_be_rated(): void
    {
        $store = $this->makeStore('Closed Store', active: false);

        $this->actingAs($this->makeReviewer())
            ->post(route('stores.review', $store->id), ['rating' => 5])
            ->assertNotFound();

        $this->assertSame(0, Comments::where('store_id', $store->id)->count());
    }

    public function test_a_store_review_is_not_counted_as_a_product_review(): void
    {
        $store = $this->makeStore('Mixed Store');
        $product = $this->makeProduct($store, 'Mixed Product');

        $this->actingAs($this->makeReviewer())
            ->post(route('stores.review', $store->id), ['rating' => 5]);

        // Rating the store must not leak into the product's own score.
        $this->assertDatabaseMissing('comments', [
            'product_id' => $product->id,
            'rating' => 5,
        ]);
    }

    public function test_the_store_page_prefills_the_review_the_customer_already_left(): void
    {
        $store = $this->makeStore('Returning Store');
        $reviewer = $this->makeReviewer();

        $this->actingAs($reviewer)
            ->post(route('stores.review', $store->id), ['rating' => 5, 'comment' => 'Great store']);

        $this->actingAs($reviewer)
            ->get(route('stores.show', $store->id))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('userStoreRating.rating', 5)
                ->where('userStoreRating.comment', 'Great store')
            );
    }

    public function test_a_guest_is_not_shown_a_previous_review_on_the_store_page(): void
    {
        $store = $this->makeStore('Anonymous Store');

        $this->get(route('stores.show', $store->id))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('userStoreRating', null)
            );
    }

    public function test_deleting_a_store_review_rewrites_the_cached_average(): void
    {
        $store = $this->makeStore('Pruned Store');

        $this->actingAs($this->makeReviewer())->post(route('stores.review', $store->id), ['rating' => 5]);
        $lowReviewer = $this->makeReviewer();
        $this->actingAs($lowReviewer)->post(route('stores.review', $store->id), ['rating' => 1]);

        $this->assertEquals(3.0, (float) $store->fresh()->rating);
        $this->assertEquals(2, (int) $store->fresh()->review_count);

        $comment = Comments::where('store_id', $store->id)->where('rating', 1)->firstOrFail();

        $this->actingAs($lowReviewer)
            ->delete(route('comments.destroy', $comment->id))
            ->assertRedirect();

        // The delete path has to recalculate on its own, otherwise the header
        // keeps showing an average that includes a review that is gone.
        $this->assertEquals(5.0, (float) $store->fresh()->rating);
        $this->assertEquals(1, (int) $store->fresh()->review_count);
    }

    public function test_product_reviews_remain_editable_while_store_ratings_do_not(): void
    {
        $store = $this->makeStore('Mixed Reviews Store');
        $reviewer = $this->makeReviewer();
        $product = $this->makeProduct($store);

        $this->actingAs($reviewer)->post(route('comments.store'), [
            'product_id' => $product->id,
            'rating' => 1,
            'comment' => 'Not great',
        ]);

        $productReview = Comments::where('product_id', $product->id)->firstOrFail();

        $this->actingAs($reviewer)
            ->put(route('comments.update', $productReview->id), ['rating' => 5, 'comment' => 'Much better now'])
            ->assertRedirect();

        $this->assertEquals(5.0, (float) $productReview->fresh()->rating);
    }

    public function test_somebody_else_cannot_delete_a_store_review(): void
    {
        $store = $this->makeStore('Protected Store');
        $author = $this->makeReviewer();

        $this->actingAs($author)->post(route('stores.review', $store->id), ['rating' => 5]);

        $comment = Comments::where('store_id', $store->id)->firstOrFail();

        $this->actingAs($this->makeReviewer())
            ->delete(route('comments.destroy', $comment->id))
            ->assertForbidden();

        $this->assertSame(1, Comments::where('store_id', $store->id)->count());
        $this->assertEquals(5.0, (float) $store->fresh()->rating);
    }
}

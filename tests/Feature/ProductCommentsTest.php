<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\Comments;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductCommentsTest extends TestCase
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

    private function makeAdmin(string $email = 'staff@example.com', string $role = 'admin'): Admin
    {
        return Admin::create([
            'name' => 'Staff',
            'email' => $email,
            'password' => bcrypt('password'),
            'role' => $role,
        ]);
    }

    private function makeProduct(): Products
    {
        $owner = $this->makeUser('owner' . uniqid() . '@example.com');

        $store = Store::create([
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

    /**
     * `actingAs` only signs a guard in; it never signs the others out, so two
     * guards can hold a session at once and owner resolution picks the `web`
     * user. Clear every guard between identities.
     */
    private function signOutEveryGuard(): void
    {
        foreach (['web', 'agent', 'admin', 'superadmin'] as $guard) {
            $this->app['auth']->guard($guard)->logout();
        }
    }

    public function test_a_customer_can_comment_on_a_product(): void
    {
        $user = $this->makeUser();
        $product = $this->makeProduct();

        $this->actingAs($user, 'web')
            ->post(route('comments.store'), [
                'product_id' => $product->id,
                'comment' => 'Great product from a customer',
                'rating' => 5,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('comments', [
            'user_id' => $user->id,
            'agent_id' => null,
            'admin_id' => null,
            'product_id' => $product->id,
        ]);
    }

    /**
     * The regression: vendors live in `agents`, not `users`, so writing the
     * agent's id into the user_id column hit a NOT NULL violation and the
     * request failed with a 500.
     */
    public function test_a_signed_in_agent_can_comment_on_a_product(): void
    {
        $agent = $this->makeAgent();
        $product = $this->makeProduct();

        $this->actingAs($agent, 'agent')
            ->post(route('comments.store'), [
                'product_id' => $product->id,
                'comment' => 'Great product from an agent',
                'rating' => 4,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('comments', [
            'agent_id' => $agent->id,
            'user_id' => null,
            'admin_id' => null,
            'product_id' => $product->id,
        ]);
    }

    /**
     * Staff live in `admins`, so the admin guard had the same failure as the
     * agent guard.
     */
    public function test_a_signed_in_admin_can_comment_on_a_product(): void
    {
        $admin = $this->makeAdmin();
        $product = $this->makeProduct();

        $this->actingAs($admin, 'admin')
            ->post(route('comments.store'), [
                'product_id' => $product->id,
                'comment' => 'Great product from an admin',
                'rating' => 3,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('comments', [
            'admin_id' => $admin->id,
            'user_id' => null,
            'agent_id' => null,
            'product_id' => $product->id,
        ]);
    }

    public function test_a_signed_in_superadmin_can_comment_on_a_product(): void
    {
        $superadmin = $this->makeAdmin('root@example.com', 'superadmin');
        $product = $this->makeProduct();

        // Superadmin accounts authenticate through the same `admin` guard.
        $this->actingAs($superadmin, 'admin')
            ->post(route('comments.store'), [
                'product_id' => $product->id,
                'comment' => 'Great product from a superadmin',
                'rating' => 5,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('comments', [
            'admin_id' => $superadmin->id,
            'user_id' => null,
            'product_id' => $product->id,
        ]);
    }

    public function test_the_superadmin_guard_can_also_comment(): void
    {
        $superadmin = $this->makeAdmin('root2@example.com', 'superadmin');
        $product = $this->makeProduct();

        $this->actingAs($superadmin, 'superadmin')
            ->post(route('comments.store'), [
                'product_id' => $product->id,
                'comment' => 'Commented through the superadmin guard',
                'rating' => 4,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('comments', [
            'admin_id' => $superadmin->id,
            'user_id' => null,
            'product_id' => $product->id,
        ]);
    }

    public function test_commenting_twice_updates_the_existing_comment(): void
    {
        $agent = $this->makeAgent();
        $product = $this->makeProduct();

        $this->actingAs($agent, 'agent')->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'First review from the agent',
            'rating' => 2,
        ]);

        $this->actingAs($agent, 'agent')->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'Updated review from the agent',
            'rating' => 5,
        ]);

        // Still a single row for this agent and product.
        $this->assertSame(1, Comments::where('agent_id', $agent->id)
            ->where('product_id', $product->id)
            ->count());

        $this->assertDatabaseHas('comments', [
            'agent_id' => $agent->id,
            'product_id' => $product->id,
            'comment' => 'Updated review from the agent',
            'rating' => 5,
        ]);
    }

    public function test_different_roles_can_each_comment_on_the_same_product(): void
    {
        $user = $this->makeUser();
        $agent = $this->makeAgent();
        $admin = $this->makeAdmin();
        $product = $this->makeProduct();

        // Each request starts signed out, otherwise the previous guard's
        // session would still be active and own the next comment.
        $this->signOutEveryGuard();

        $this->actingAs($user, 'web')->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'Customer review',
        ]);

        $this->signOutEveryGuard();
        $this->actingAs($agent, 'agent')->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'Agent review',
        ]);

        $this->signOutEveryGuard();
        $this->actingAs($admin, 'admin')->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'Admin review',
        ]);

        $this->assertSame(3, Comments::where('product_id', $product->id)->count());
    }

    public function test_a_guest_cannot_comment(): void
    {
        $product = $this->makeProduct();

        $this->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'A guest review',
        ])->assertRedirect(route('login'));

        $this->assertDatabaseMissing('comments', [
            'product_id' => $product->id,
        ]);
    }

    public function test_the_author_name_is_returned_for_every_role(): void
    {
        $agent = $this->makeAgent();
        $admin = $this->makeAdmin();
        $product = $this->makeProduct();

        $this->signOutEveryGuard();
        $this->actingAs($agent, 'agent')->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'Agent review',
            'rating' => 4,
        ]);

        $this->signOutEveryGuard();
        $this->actingAs($admin, 'admin')->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'Admin review',
            'rating' => 5,
        ]);

        $response = $this->get(route('comments.product', $product->id))
            ->assertJson(['success' => true]);

        $names = collect($response->json('data'))->pluck('user.name');
        $this->assertTrue($names->contains('Vendor'), 'Agent name missing from comments payload');
        $this->assertTrue($names->contains('Staff'), 'Admin name missing from comments payload');
    }

    public function test_rating_stats_and_user_reviewed_flag_work_for_agents(): void
    {
        $agent = $this->makeAgent();
        $other = $this->makeAgent('other@example.com');
        $product = $this->makeProduct();

        Comments::create([
            'user_id' => $this->makeUser()->id,
            'product_id' => $product->id,
            'comment' => 'Customer review',
            'rating' => 4,
        ]);

        $this->actingAs($agent, 'agent')
            ->get(route('comments.product', $product->id))
            ->assertJson([
                'stats' => [
                    'count' => 1,
                    'average' => 4.0,
                    'user_reviewed' => false,
                ],
            ]);

        $this->signOutEveryGuard();
        $this->actingAs($agent, 'agent')->post(route('comments.store'), [
            'product_id' => $product->id,
            'comment' => 'Agent review',
            'rating' => 5,
        ]);

        $this->signOutEveryGuard();
        $this->actingAs($agent, 'agent')
            ->get(route('comments.product', $product->id))
            ->assertJson([
                'stats' => [
                    'count' => 2,
                    'average' => 4.5,
                    'user_reviewed' => true,
                ],
            ]);

        // A different agent has not reviewed, so the flag must stay false.
        $this->signOutEveryGuard();
        $this->actingAs($other, 'agent')
            ->get(route('comments.product', $product->id))
            ->assertJson(['stats' => ['user_reviewed' => false]]);
    }

    public function test_an_agent_can_update_their_own_comment(): void
    {
        $agent = $this->makeAgent();
        $comment = Comments::create([
            'agent_id' => $agent->id,
            'comment' => 'Original agent review',
            'rating' => 2,
        ]);

        $this->actingAs($agent, 'agent')
            ->put(route('comments.update', $comment->id), [
                'comment' => 'Edited agent review',
                'rating' => 5,
            ]);

        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'comment' => 'Edited agent review',
            'rating' => 5,
        ]);
    }

    public function test_an_agent_cannot_update_another_identitys_comment(): void
    {
        $agent = $this->makeAgent();
        $other = $this->makeAgent('other@example.com');

        $customerComment = Comments::create([
            'user_id' => $this->makeUser()->id,
            'comment' => 'Customer owned review',
            'rating' => 1,
        ]);

        $agentComment = Comments::create([
            'agent_id' => $other->id,
            'comment' => 'Other agent review',
            'rating' => 1,
        ]);

        $this->actingAs($agent, 'agent')
            ->put(route('comments.update', $customerComment->id), [
                'comment' => 'Hijacked customer review',
            ])
            ->assertSessionHas('error');

        $this->actingAs($agent, 'agent')
            ->put(route('comments.update', $agentComment->id), [
                'comment' => 'Hijacked agent review',
            ])
            ->assertSessionHas('error');

        $this->assertDatabaseHas('comments', [
            'id' => $customerComment->id,
            'comment' => 'Customer owned review',
        ]);

        $this->assertDatabaseHas('comments', [
            'id' => $agentComment->id,
            'comment' => 'Other agent review',
        ]);
    }

    public function test_an_admin_can_delete_their_own_comment(): void
    {
        $admin = $this->makeAdmin();
        $comment = Comments::create([
            'admin_id' => $admin->id,
            'comment' => 'Admin review to remove',
            'rating' => 3,
        ]);

        $this->actingAs($admin, 'admin')
            ->delete(route('comments.destroy', $comment->id));

        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_an_admin_cannot_delete_another_identitys_comment(): void
    {
        $admin = $this->makeAdmin();
        $comment = Comments::create([
            'user_id' => $this->makeUser()->id,
            'comment' => 'Customer review that must survive',
        ]);

        $this->actingAs($admin, 'admin')
            ->delete(route('comments.destroy', $comment->id))
            ->assertStatus(403);

        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'comment' => 'Customer review that must survive',
        ]);
    }
}

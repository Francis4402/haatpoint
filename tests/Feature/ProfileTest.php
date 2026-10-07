<?php

namespace Tests\Feature;

use App\Models\Agent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private function agent(array $overrides = []): Agent
    {
        return Agent::create(array_merge([
            'name' => 'Vendor',
            'email' => 'vendor@gmail.com',
            'password' => bcrypt('secret1234'),
            'role' => 'agent',
        ], $overrides));
    }

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/dashboard/profile');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test.user@gmail.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test.user@gmail.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_a_profile_email_update_is_gmail_only(): void
    {
        // The rule has to cover this form too, otherwise the account can leave
        // Gmail entirely after registering with a Gmail address.
        $user = User::factory()->create(['email' => 'before@gmail.com']);

        $this->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ])
            ->assertSessionHasErrors('email');

        $this->assertSame('before@gmail.com', $user->refresh()->email);
    }

    public function test_an_agent_can_update_their_seller_details_from_the_profile_page(): void
    {
        // One profile page for every role. The agent's KYC columns have to be
        // reachable from here without a second profile screen.
        $agent = $this->agent();

        $this->actingAs($agent, 'agent')
            ->patch('/profile', [
                'name' => 'Vendor Renamed',
                'email' => 'vendor@gmail.com',
                'mobile' => '01812345678',
                'national_id' => '1987654321',
                'address' => 'House 1, Road 1, Dhaka',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/profile');

        $agent->refresh();

        $this->assertSame('Vendor Renamed', $agent->name);
        $this->assertSame('01812345678', $agent->mobile);
        $this->assertSame('1987654321', $agent->national_id);
        $this->assertSame('House 1, Road 1, Dhaka', $agent->address);
        // And the values the store gate reads are satisfied by this save.
        $this->assertTrue($agent->hasCompleteVendorProfile());
    }

    public function test_an_agent_can_save_their_profile_before_the_seller_fields_are_filled_in(): void
    {
        // The KYC columns are nullable on purpose: an agent must be able to fix
        // their name or email before they have gathered the rest. Requiring all
        // three here would lock them out of the only page that has them.
        $agent = $this->agent(['address' => 'Old address']);

        $this->actingAs($agent, 'agent')
            ->patch('/profile', [
                'name' => 'Vendor Renamed',
                'email' => 'vendor@gmail.com',
                'mobile' => '',
                'national_id' => '',
                'address' => '',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/profile');

        $agent->refresh();

        $this->assertSame('Vendor Renamed', $agent->name);
        $this->assertNull($agent->mobile);
        $this->assertNull($agent->address);
        $this->assertFalse($agent->hasCompleteVendorProfile());
    }

    public function test_a_malformed_seller_field_is_rejected_on_the_profile_page(): void
    {
        // The regexes here and in Agent::missingVendorProfileFields() must
        // agree, or a value the form accepts is one the store gate still
        // refuses and the seller cannot tell why.
        $agent = $this->agent();

        $this->actingAs($agent, 'agent')
            ->patch('/profile', [
                'name' => 'Vendor',
                'email' => 'vendor@gmail.com',
                'mobile' => '12345',
                'national_id' => '12345',
                'address' => 'Somewhere',
            ])
            ->assertSessionHasErrors(['mobile', 'national_id']);

        $agent->refresh();

        $this->assertNull($agent->mobile);
        $this->assertNull($agent->national_id);
    }

    public function test_a_customer_cannot_write_agent_columns_through_the_profile_form(): void
    {
        // User is unguarded, so these keys reaching fill() would put a column
        // that does not exist on `users` into the UPDATE and 500 the request.
        // The rules are conditional on the signed-in model, not on the input.
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch('/profile', [
                'name' => 'Shopper',
                'email' => $user->email,
                'mobile' => '01812345678',
                'national_id' => '1987654321',
                'address' => 'Somewhere',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/profile');

        $this->assertEmpty($user->refresh()->getAttributes()['mobile'] ?? null);
        $this->assertSame('Shopper', $user->name);
    }

    public function test_an_agent_changing_their_email_is_checked_against_the_agents_table(): void
    {
        // The rule used to point at `users` for every role, so two agents could
        // hold the same address and the collision only surfaced as a 23000.
        $this->agent(['email' => 'taken@gmail.com']);

        $agent = $this->agent();

        $this->actingAs($agent, 'agent')
            ->patch('/profile', [
                'name' => 'Vendor',
                'email' => 'taken@gmail.com',
            ])
            ->assertSessionHasErrors('email');

        $this->assertSame('vendor@gmail.com', $agent->refresh()->email);
    }

    public function test_an_agent_with_a_non_gmail_address_can_still_save_the_profile(): void
    {
        // Google sign-up is not restricted to Gmail, so a seller can hold any
        // domain. The Gmail rule used to run on the address as stored as well
        // as on a change to it, which locked that account out of this form
        // completely: every save failed on an address it was not asked to touch.
        $agent = $this->agent(['email' => 'vendor@example.test']);

        $this->actingAs($agent, 'agent')
            ->patch('/profile', [
                'name' => 'Vendor Renamed',
                'email' => 'vendor@example.test',
                'address' => 'House 1, Road 1, Dhaka',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect('/dashboard/profile');

        $agent->refresh();

        $this->assertSame('Vendor Renamed', $agent->name);
        $this->assertSame('vendor@example.test', $agent->email);
        // Still refuses a move *away* from Gmail.
        $this->assertTrue(str_ends_with($agent->email, '@example.test'));
    }

    public function test_the_profile_page_is_displayed_for_an_agent(): void
    {
        // The form reads these off the shared auth.user prop rather than a page
        // prop, so the values have to actually be in the payload.
        $agent = $this->agent(['mobile' => '01812345678']);

        $this->actingAs($agent, 'agent')
            ->get('/dashboard/profile')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Profile/Edit')
                ->where('auth.user.role', 'agent')
                ->where('auth.user.mobile', '01812345678')
            );
    }
}

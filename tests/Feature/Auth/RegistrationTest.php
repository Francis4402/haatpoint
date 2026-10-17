<?php

namespace Tests\Feature\Auth;

use App\Models\Agent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test.user@gmail.com',
            'phone' => '01712345678',
            'address' => 'House 12, Road 4, Sector 10, Uttara',
            'city_id' => 1,
            'city_name' => 'Dhaka',
            'zone_id' => 298,
            'zone_name' => '60 feet',
            'area_id' => 3069,
            'area_name' => '60 feet road',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'email' => 'test.user@gmail.com',
            'phone' => '01712345678',
            'address' => 'House 12, Road 4, Sector 10, Uttara',
            'city_id' => 1,
            'city_name' => 'Dhaka',
            'zone_id' => 298,
            'zone_name' => '60 feet',
        ]);
    }

    public function test_registration_requires_delivery_address_and_phone(): void
    {
        $response = $this->post('/register', [
            'name' => 'Incomplete User',
            'email' => 'incomplete@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors(['phone', 'address', 'city_id', 'zone_id']);
        $this->assertGuest();
    }

    public function test_a_non_gmail_address_is_rejected(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '01712345678',
            'address' => 'House 12, Road 4, Sector 10',
            'city_id' => 1,
            'zone_id' => 298,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_an_agent_can_only_register_with_a_gmail_address(): void
    {
        $this->post('/agent/register', [
            'name' => 'Agent',
            'email' => 'agent@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'national_id' => '1234567890',
            'mobile' => '01712345678',
            'address' => 'Dhaka',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseMissing('agents', ['email' => 'agent@example.com']);

        $this->post('/agent/register', [
            'name' => 'Agent',
            'email' => 'agent@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'national_id' => '1234567890',
            'mobile' => '01712345678',
            'address' => 'Dhaka',
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('agents', ['email' => 'agent@gmail.com']);
    }

    public function test_an_admin_can_only_register_with_a_gmail_address(): void
    {
        $this->post('/admin/register', [
            'name' => 'Boss',
            'email' => 'boss@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseCount('admins', 0);

        $this->post('/admin/register', [
            'name' => 'Boss',
            'email' => 'boss@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertSessionHasNoErrors();

        // The first admin registrant bootstraps the superadmin.
        $this->assertDatabaseHas('admins', ['email' => 'boss@gmail.com', 'role' => 'superadmin']);
    }

    public function test_registering_as_an_agent_absorbs_a_customer_account_on_the_same_email(): void
    {
        // An agent is a single identity, so the customer row is dropped rather
        // than the registration being refused. See AgentAuthController.
        $this->post('/register', [
            'name' => 'Buyer',
            'email' => 'shared@gmail.com',
            'phone' => '01712345678',
            'address' => 'Dhaka Delivery Address',
            'city_id' => 1,
            'zone_id' => 298,
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertDatabaseHas('users', ['email' => 'shared@gmail.com']);

        $this->post('/agent/register', [
            'name' => 'Agent',
            'email' => 'shared@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'national_id' => '1234567890',
            'mobile' => '01712345678',
            'address' => 'Dhaka',
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('agents', ['email' => 'shared@gmail.com']);
        $this->assertDatabaseMissing('users', ['email' => 'shared@gmail.com']);
    }
}

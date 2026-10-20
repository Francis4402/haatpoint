<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CustomerProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    private function createSuperAdmin(string $email = 'superadmin@example.com'): Admin
    {
        return Admin::create([
            'id' => (string) Str::uuid(),
            'name' => 'Super Admin',
            'email' => $email,
            'password' => bcrypt('password'),
            'role' => 'superadmin',
        ]);
    }

    private function createAgent(array $attributes = []): Agent
    {
        return Agent::create(array_merge([
            'id' => (string) Str::uuid(),
            'name' => 'Original Agent',
            'email' => 'agent@haatpoint.com',
            'password' => bcrypt('password'),
            'role' => 'agent',
            'mobile' => '01711111111',
            'national_id' => '1234567890',
            'address' => 'Original Address',
            'plan' => 'free',
        ], $attributes));
    }

    public function test_superadmin_can_update_agent_profile(): void
    {
        $superadmin = $this->createSuperAdmin();
        $agent = $this->createAgent();

        $response = $this->actingAs($superadmin, 'admin')
            ->put("/dashboard/customers/agent/{$agent->id}", [
                'name' => 'Updated Agent Name',
                'email' => 'newagent@haatpoint.com',
                'mobile' => '01822222222',
                'national_id' => '9876543210',
                'address' => 'Updated Store Address, Dhaka',
                'plan' => 'pro',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $agent->refresh();
        $this->assertSame('Updated Agent Name', $agent->name);
        $this->assertSame('newagent@haatpoint.com', $agent->email);
        $this->assertSame('01822222222', $agent->mobile);
        $this->assertSame('9876543210', $agent->national_id);
        $this->assertSame('Updated Store Address, Dhaka', $agent->address);
        $this->assertSame('pro', $agent->plan);
        $this->assertNotNull($agent->subscription_ends_at);
    }

    public function test_superadmin_can_update_user_profile(): void
    {
        $superadmin = $this->createSuperAdmin();

        $user = User::factory()->create([
            'name' => 'Original Customer',
            'email' => 'customer@haatpoint.com',
            'phone' => '01733333333',
            'address' => 'Customer Address',
        ]);

        $response = $this->actingAs($superadmin, 'admin')
            ->put("/dashboard/customers/user/{$user->id}", [
                'name' => 'Updated Customer Name',
                'email' => 'updatedcustomer@haatpoint.com',
                'mobile' => '01944444444',
                'address' => 'New Customer Address, Sylhet',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $user->refresh();
        $this->assertSame('Updated Customer Name', $user->name);
        $this->assertSame('updatedcustomer@haatpoint.com', $user->email);
        $this->assertSame('01944444444', $user->phone);
        $this->assertSame('New Customer Address, Sylhet', $user->address);
    }

    public function test_agent_cannot_update_other_profiles_via_customers_route(): void
    {
        $agent1 = $this->createAgent(['email' => 'agent1@haatpoint.com', 'mobile' => '01711111111', 'national_id' => '1111111111']);
        $agent2 = $this->createAgent(['email' => 'agent2@haatpoint.com', 'mobile' => '01722222222', 'national_id' => '2222222222']);

        $response = $this->actingAs($agent1, 'agent')
            ->put("/dashboard/customers/agent/{$agent2->id}", [
                'name' => 'Hacked Name',
                'email' => 'hacked@haatpoint.com',
            ]);

        // Agent does not have admin/superadmin role
        $this->assertTrue(in_array($response->status(), [302, 403]));
    }

    public function test_updating_agent_with_profane_name_is_rejected(): void
    {
        $superadmin = $this->createSuperAdmin();
        $agent = $this->createAgent();

        $response = $this->actingAs($superadmin, 'admin')
            ->put("/dashboard/customers/agent/{$agent->id}", [
                'name' => 'Sex Shop Agent',
                'email' => $agent->email,
            ]);

        $response->assertSessionHasErrors('name');
        $agent->refresh();
        $this->assertSame('Original Agent', $agent->name);
    }
}

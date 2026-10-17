<?php

namespace Tests\Feature;

use App\Models\Agent;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgentStoreCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_agent_creates_store_using_their_registered_national_id(): void
    {
        $agent = Agent::create([
            'name' => 'Agent One',
            'email' => 'agent1@gmail.com',
            'password' => bcrypt('password'),
            'national_id' => '1234567890',
            'mobile' => '01711223344',
            'address' => 'Dhaka, Bangladesh',
            'plan' => 'free',
            'subscription_ends_at' => now()->addYear(),
        ]);

        $response = $this->actingAs($agent, 'agent')->post(route('stores.store'), [
            'name' => 'Agent One Store',
            'storetype' => 'Retail Store',
            'address' => 'Dhaka, Bangladesh',
            'sender_city' => 1,
            'mobile' => '01711223344',
            // national_id submitted by form or merged by controller
            'national_id' => '1234567890',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('dashboard.store'));

        $store = Store::where('name', 'Agent One Store')->first();
        $this->assertNotNull($store);
        $this->assertEquals('1234567890', $store->national_id);
        $this->assertEquals($agent->id, $store->agent_id);
    }

    public function test_agent_can_create_second_store_with_same_national_id(): void
    {
        $agent = Agent::create([
            'name' => 'Multi Store Agent',
            'email' => 'multiagent@gmail.com',
            'password' => bcrypt('password'),
            'national_id' => '9876543210',
            'mobile' => '01811223344',
            'address' => 'Chittagong, Bangladesh',
            'plan' => 'free',
            'subscription_ends_at' => now()->addYear(),
        ]);

        // Create first store
        Store::create([
            'agent_id' => $agent->id,
            'name' => 'First Store',
            'email' => $agent->email,
            'storetype' => 'Retail Store',
            'address' => 'Chittagong',
            'sender_city' => 1,
            'mobile' => '01811223344',
            'national_id' => '9876543210',
        ]);

        // Create second store with same national_id
        $response = $this->actingAs($agent, 'agent')->post(route('stores.store'), [
            'name' => 'Second Store',
            'storetype' => 'E-commerce',
            'address' => 'Chittagong',
            'sender_city' => 1,
            'mobile' => '01811223344',
            'national_id' => '9876543210',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('dashboard.store'));

        $this->assertEquals(2, Store::where('agent_id', $agent->id)->count());
        $secondStore = Store::where('name', 'Second Store')->first();
        $this->assertEquals('9876543210', $secondStore->national_id);
    }

    public function test_agent_cannot_use_another_agents_national_id(): void
    {
        $agent1 = Agent::create([
            'name' => 'Agent A',
            'email' => 'agenta@gmail.com',
            'password' => bcrypt('password'),
            'national_id' => '1111122222',
            'mobile' => '01911223344',
            'address' => 'Sylhet',
            'plan' => 'free',
            'subscription_ends_at' => now()->addYear(),
        ]);

        $agent2 = Agent::create([
            'name' => 'Agent B',
            'email' => 'agentb@gmail.com',
            'password' => bcrypt('password'),
            'national_id' => '3333344444',
            'mobile' => '01999887766',
            'address' => 'Rajshahi',
            'plan' => 'free',
            'subscription_ends_at' => now()->addYear(),
        ]);

        // Agent 2 attempts to submit Agent 1's national_id
        // The controller automatically enforces Agent 2's own national_id
        $response = $this->actingAs($agent2, 'agent')->post(route('stores.store'), [
            'name' => 'Agent B Store',
            'storetype' => 'Retail Store',
            'address' => 'Rajshahi',
            'sender_city' => 1,
            'mobile' => '01999887766',
            'national_id' => '1111122222', // Agent 1's NID
        ]);

        $response->assertSessionHasNoErrors();
        $store = Store::where('name', 'Agent B Store')->first();
        $this->assertNotNull($store);
        // It always used Agent 2's own registered national_id
        $this->assertEquals('3333344444', $store->national_id);
    }
}

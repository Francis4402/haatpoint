<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AgentProRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_agent_register_free_redirects_without_payment_checkout_page(): void
    {
        $response = $this->post('/agent/register', [
            'name' => 'Free Agent',
            'email' => 'freeagent@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'national_id' => '1234567890',
            'mobile' => '01711223344',
            'address' => 'Dhaka, Bangladesh',
            'plan' => 'free',
        ]);

        $response->assertSessionHasNoErrors();
        // Free agents redirect to dashboard, not to subscription payment page
        $response->assertRedirect(route('dashboard'));

        $agent = Agent::where('email', 'freeagent@gmail.com')->first();
        $this->assertNotNull($agent);
        $this->assertEquals('free', $agent->plan);
        $this->assertTrue($agent->isSubscriptionActive());
    }

    public function test_agent_register_pro_redirects_to_payment_checkout_page_with_message(): void
    {
        $response = $this->post('/agent/register', [
            'name' => 'Pro Agent',
            'email' => 'proagent@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'national_id' => '1234567890',
            'mobile' => '01799887766',
            'address' => 'Chittagong, Bangladesh',
            'plan' => 'pro',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('dashboard.subscription.payment'));
        $response->assertSessionHas('success');

        $agent = Agent::where('email', 'proagent@gmail.com')->first();
        $this->assertNotNull($agent);
        $this->assertEquals('pro', $agent->plan);
        $this->assertFalse($agent->isPro()); // Not activated yet!
    }

    public function test_pro_agent_submits_bkash_transaction_id_and_sees_activation_message(): void
    {
        $agent = Agent::create([
            'name' => 'Pro Agent',
            'email' => 'proagent2@gmail.com',
            'password' => 'password',
            'national_id' => '1234567890',
            'mobile' => '01711112222',
            'address' => 'Sylhet, Bangladesh',
            'plan' => 'pro',
            'subscription_payment_status' => 'pending',
        ]);

        $response = $this->actingAs($agent, 'agent')
            ->post(route('dashboard.subscription.payment.submit'), [
                'trx_id' => '9F7A2C1B4D',
            ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect(route('dashboard.subscription.payment'));
        $response->assertSessionHas('success', 'Payment submitted! If your transaction ID is correct, then your account will be activated.');

        $agent->refresh();
        $this->assertEquals('9F7A2C1B4D', $agent->subscription_trx_id);
        $this->assertEquals('pending', $agent->subscription_payment_status);
    }

    public function test_superadmin_can_view_transaction_id_and_activate_pro_with_button(): void
    {
        $superadmin = Admin::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'password' => 'password',
            'role' => 'superadmin',
        ]);

        $agent = Agent::create([
            'name' => 'Pending Agent',
            'email' => 'pendingagent@gmail.com',
            'password' => 'password',
            'national_id' => '1234567890',
            'mobile' => '01733334444',
            'address' => 'Rajshahi, Bangladesh',
            'plan' => 'pro',
            'subscription_payment_status' => 'pending',
            'subscription_trx_id' => 'BKASH12345',
            'subscription_payment_amount' => 500,
            'subscription_payment_submitted_at' => now(),
        ]);

        // Superadmin views dashboard
        $response = $this->actingAs($superadmin, 'admin')
            ->get(route('dashboard'));

        $response->assertOk();

        // Superadmin clicks Activate (approve) button
        $approveResponse = $this->actingAs($superadmin, 'admin')
            ->post(route('dashboard.subscription.approve', $agent->id));

        $approveResponse->assertSessionHas('success', "HaatPoint Pro activated for {$agent->name}.");

        $agent->refresh();
        $this->assertEquals('approved', $agent->subscription_payment_status);
        $this->assertEquals('pro', $agent->plan);
        $this->assertTrue($agent->isPro());
        $this->assertTrue($agent->subscription_ends_at->isFuture());
    }

    public function test_superadmin_can_reject_invalid_transaction_id(): void
    {
        $superadmin = Admin::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@gmail.com',
            'password' => 'password',
            'role' => 'superadmin',
        ]);

        $agent = Agent::create([
            'name' => 'Fake Trx Agent',
            'email' => 'fakeagent@gmail.com',
            'password' => 'password',
            'national_id' => '1234567890',
            'mobile' => '01755556666',
            'address' => 'Barisal, Bangladesh',
            'plan' => 'pro',
            'subscription_payment_status' => 'pending',
            'subscription_trx_id' => 'FAKETRX999',
        ]);

        $rejectResponse = $this->actingAs($superadmin, 'admin')
            ->post(route('dashboard.subscription.reject', $agent->id));

        $rejectResponse->assertSessionHas('error', "Payment from {$agent->name} was rejected.");

        $agent->refresh();
        $this->assertEquals('rejected', $agent->subscription_payment_status);
        $this->assertFalse($agent->isPro());
    }
}

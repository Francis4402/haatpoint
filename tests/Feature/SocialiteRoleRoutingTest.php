<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

class SocialiteRoleRoutingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Stub the provider response so the callback never talks to Google.
     */
    private function fakeGoogleUser(string $email, string $name, string $providerId): void
    {
        $socialUser = (new SocialiteUser())->setRaw([])->map([
            'id' => $providerId,
            'nickname' => 'test',
            'name' => $name,
            'email' => $email,
            'avatar' => 'https://example.test/avatar.jpg',
        ]);

        Socialite::shouldReceive('driver->user')->andReturn($socialUser);
    }

    private function completeCallback(string $destination): \Illuminate\Testing\TestResponse
    {
        return $this->withSession(['socialite_destination' => $destination])
            ->get('/auth/google/callback');
    }

    public function test_customer_destination_creates_a_user_and_logs_into_the_web_guard(): void
    {
        $this->fakeGoogleUser('customer@example.test', 'Customer One', 'g-cust-1');

        $this->completeCallback('user')->assertRedirect();

        $user = User::where('email', 'customer@example.test')->first();

        $this->assertNotNull($user, 'Expected a user row to be created.');
        $this->assertSame('user', $user->role);
        $this->assertSame('google', $user->provider);
        $this->assertSame('g-cust-1', $user->google_id);
        $this->assertNotNull($user->email_verified_at);
        $this->assertNotEmpty($user->password, 'A social account still needs a usable password.');

        $this->assertTrue(auth('web')->check());
        $this->assertFalse(auth('agent')->check());
        $this->assertFalse(auth('admin')->check());
    }

    public function test_agent_destination_creates_an_agent_and_logs_into_the_agent_guard(): void
    {
        $this->fakeGoogleUser('agent@example.test', 'Agent One', 'g-agent-1');

        $this->completeCallback('agent')->assertRedirect();

        $agent = Agent::where('email', 'agent@example.test')->first();

        $this->assertNotNull($agent, 'Expected an agent row to be created.');
        $this->assertSame('agent', $agent->role);
        $this->assertSame('google', $agent->provider);
        $this->assertSame('g-agent-1', $agent->google_id);
        $this->assertNotNull($agent->email_verified_at);

        $this->assertTrue(auth('agent')->check());
        $this->assertFalse(auth('web')->check());
        $this->assertFalse(auth('admin')->check());
    }

    public function test_superadmin_destination_creates_a_superadmin_and_logs_into_the_admin_guard(): void
    {
        $this->fakeGoogleUser('super@example.test', 'Super One', 'g-super-1');

        $this->completeCallback('superadmin')->assertRedirect();

        $admin = Admin::where('email', 'super@example.test')->first();

        $this->assertNotNull($admin, 'Expected an admin row to be created.');
        $this->assertSame('superadmin', $admin->role);
        $this->assertSame('google', $admin->provider);
        $this->assertSame('g-super-1', $admin->google_id);
        $this->assertNotNull($admin->email_verified_at);

        $this->assertTrue(auth('admin')->check());
        $this->assertFalse(auth('web')->check());
        $this->assertFalse(auth('agent')->check());
    }

    public function test_superadmin_registration_closes_once_a_superadmin_exists(): void
    {
        Admin::create([
            'name' => 'Existing Super',
            'email' => 'boss@example.test',
            'password' => bcrypt('secret1234'),
            'role' => 'superadmin',
        ]);

        $this->fakeGoogleUser('late@example.test', 'Late Comer', 'g-late-1');

        $this->completeCallback('superadmin')
            ->assertRedirect(route('superadmin.login'))
            ->assertSessionHas('error');

        $this->assertDatabaseMissing('admins', ['email' => 'late@example.test']);
        $this->assertFalse(auth('admin')->check());
    }

    public function test_admin_destination_does_not_self_register(): void
    {
        $this->fakeGoogleUser('staff@example.test', 'Staff One', 'g-staff-1');

        $this->completeCallback('admin')
            ->assertRedirect(route('admin.login'))
            ->assertSessionHas('error');

        $this->assertDatabaseMissing('admins', ['email' => 'staff@example.test']);
        $this->assertFalse(auth('admin')->check());
    }

    public function test_unknown_destination_is_rejected(): void
    {
        $this->fakeGoogleUser('someone@example.test', 'Someone', 'g-x-1');

        $this->withSession(['socialite_destination' => 'superuser'])
            ->get('/auth/google/callback')
            ->assertNotFound();
    }

    public function test_returning_user_is_matched_by_email_and_reuses_the_same_row(): void
    {
        User::create([
            'name' => 'Returning',
            'email' => 'returning@example.test',
            'password' => bcrypt('secret1234'),
        ]);

        $this->fakeGoogleUser('returning@example.test', 'Returning', 'g-new-id');

        $this->completeCallback('user')->assertRedirect();

        $this->assertSame(1, User::where('email', 'returning@example.test')->count());
        $this->assertSame('g-new-id', User::where('email', 'returning@example.test')->value('provider_id'));
        $this->assertNotNull(User::where('email', 'returning@example.test')->value('email_verified_at'));
    }

    public function test_agent_signup_converts_a_customer_with_the_same_email(): void
    {
        User::create([
            'name' => 'Dual Identity',
            'email' => 'dual@example.test',
            'password' => bcrypt('secret1234'),
        ]);

        $this->fakeGoogleUser('dual@example.test', 'Dual Identity', 'g-dual-1');

        $this->completeCallback('agent')->assertRedirect();

        $this->assertDatabaseMissing('users', ['email' => 'dual@example.test']);
        $this->assertDatabaseHas('agents', [
            'email' => 'dual@example.test',
            'role' => 'agent',
        ]);
        $this->assertTrue(auth('agent')->check());
    }

    public function test_provider_without_an_email_is_rejected(): void
    {
        $socialUser = (new SocialiteUser())->setRaw([])->map([
            'id' => 'g-no-email',
            'nickname' => 'noemail',
            'name' => 'No Email',
            'email' => null,
        ]);
        Socialite::shouldReceive('driver->user')->andReturn($socialUser);

        $this->completeCallback('user')
            ->assertRedirect(route('login'))
            ->assertSessionHas('error');

        $this->assertFalse(auth('web')->check());
    }
}

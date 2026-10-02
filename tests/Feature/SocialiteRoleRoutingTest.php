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

    public function test_an_existing_superadmin_can_sign_in_with_google(): void
    {
        // The live situation: a superadmin already exists, so /admin/register is
        // closed and the only Google entry point is the login page, which sends
        // destination=admin. That destination refuses to CREATE an account but
        // must still sign in a row that already exists.
        Admin::create([
            'name' => 'Boss',
            'email' => 'boss@example.test',
            'password' => bcrypt('secret1234'),
            'role' => 'superadmin',
        ]);

        $this->fakeGoogleUser('boss@example.test', 'Boss', 'g-google-id');

        $this->completeCallback('admin')->assertRedirect(route('dashboard'));

        $this->assertTrue(auth('admin')->check());
        $this->assertSame('boss@example.test', auth('admin')->user()->email);

        // The Google identity gets linked to the row so later logins match on
        // provider id too.
        $this->assertDatabaseHas('admins', [
            'email' => 'boss@example.test',
            'provider' => 'google',
            'provider_id' => 'g-google-id',
        ]);
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

    public function test_the_admin_register_page_points_google_at_the_superadmin_destination(): void
    {
        // The regression: /admin/register rendered type="admin", so the Google
        // button requested destination=admin. That destination is create=false,
        // so every brand-new admin click died with "No admin account exists for
        // ...". The password form on the very same page bootstraps a superadmin,
        // so the two submit paths disagreed about what registering means.
        $this->get(route('admin.register'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Auth/StaffRegister')
                ->where('type', 'admin')
                ->where('socialDestination', 'superadmin')
            );
    }

    public function test_the_agent_register_page_still_uses_the_agent_destination(): void
    {
        // Guard against the override leaking to the other staff roles.
        $this->get(route('agent.register'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('socialDestination', 'agent'));
    }

    public function test_google_signup_on_the_admin_register_page_creates_the_first_superadmin(): void
    {
        $this->fakeGoogleUser('boss@example.test', 'The Boss', 'g-boss-1');

        $this->completeCallback('superadmin')->assertRedirect();

        $this->assertDatabaseHas('admins', [
            'email' => 'boss@example.test',
            'role' => 'superadmin',
            'provider' => 'google',
        ]);

        $this->assertTrue(auth('admin')->check());
        $this->assertSame('superadmin', auth('admin')->user()->role);
    }

    public function test_a_blocked_admin_cannot_sign_in_through_google(): void
    {
        // Google had no blocked check of its own, so a suspended admin could be
        // signed straight back in through OAuth.
        Admin::create([
            'name' => 'Suspended',
            'email' => 'suspended@example.test',
            'password' => bcrypt('secret1234'),
            'role' => 'admin',
            'blocked' => true,
            'google_id' => 'g-susp-1',
            'provider' => 'google',
            'provider_id' => 'g-susp-1',
            'email_verified_at' => now(),
        ]);

        $this->fakeGoogleUser('suspended@example.test', 'Suspended', 'g-susp-1');

        $this->completeCallback('admin')
            ->assertRedirect(route('admin.login'))
            ->assertSessionHas('error');

        $this->assertFalse(auth('admin')->check());
    }

    public function test_the_google_redirect_uses_the_configured_callback_url(): void
    {
        // route() built the callback from the live request host, so arriving at
        // http://localhost:8000 instead of http://127.0.0.1:8000 produced a
        // redirect_uri Google rejected with Error 400 and nothing logged here.
        config()->set('services.google.redirect', 'http://127.0.0.1:8000/auth/google/callback');

        $response = $this->get('/auth/google/redirect/admin');

        $response->assertRedirect();

        $location = $response->headers->get('Location');
        $this->assertStringContainsString(
            urlencode('http://127.0.0.1:8000/auth/google/callback'),
            $location
        );
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

    public function test_an_existing_agent_using_the_shared_login_signs_in_as_an_agent(): void
    {
        Agent::create([
            'name' => 'Vendor',
            'email' => 'vendor@example.test',
            'password' => bcrypt('secret1234'),
            'role' => 'agent',
            'address' => 'House 1, Road 1, Dhaka',
            'mobile' => '01812345678',
            'national_id' => '1987654321',
        ]);

        $this->fakeGoogleUser('vendor@example.test', 'Vendor', 'g-agent-1');

        // The shared /login page asks for the `user` destination, which is what
        // used to create a second, customer identity for an agent.
        $this->completeCallback('user')->assertRedirect();

        $this->assertTrue(auth('agent')->check());
        $this->assertFalse(auth('web')->check());
        $this->assertDatabaseMissing('users', ['email' => 'vendor@example.test']);
        $this->assertDatabaseCount('users', 0);
    }

    public function test_the_agent_role_wins_when_an_email_exists_in_both_tables(): void
    {
        Agent::create([
            'name' => 'Vendor',
            'email' => 'both@example.test',
            'password' => bcrypt('secret1234'),
            'role' => 'agent',
            'address' => 'House 1, Road 1, Dhaka',
            'mobile' => '01812345678',
            'national_id' => '1987654321',
        ]);

        User::create([
            'name' => 'Shopper',
            'email' => 'both@example.test',
            'password' => bcrypt('secret1234'),
        ]);

        $this->fakeGoogleUser('both@example.test', 'Vendor', 'g-both-1');

        $this->completeCallback('user')->assertRedirect();

        $this->assertTrue(auth('agent')->check());
        $this->assertFalse(auth('web')->check());
        $this->assertDatabaseCount('users', 1);
    }

    public function test_a_customer_using_the_shared_login_still_signs_in_as_a_user(): void
    {
        User::create([
            'name' => 'Shopper',
            'email' => 'shopper@example.test',
            'password' => bcrypt('secret1234'),
        ]);

        $this->fakeGoogleUser('shopper@example.test', 'Shopper', 'g-shop-1');

        $this->completeCallback('user')->assertRedirect();

        $this->assertTrue(auth('web')->check());
        $this->assertFalse(auth('agent')->check());
        $this->assertDatabaseCount('agents', 0);
    }

    public function test_the_shared_login_page_points_google_at_the_resolving_destination(): void
    {
        // Guards the wiring, not just the callback. If the login page stops
        // asking for `user`, none of the resolution above is ever reached.
        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Auth/Login')
                ->where('canResetPassword', true)
            );

        $source = file_get_contents(resource_path('js/Pages/Auth/Login.tsx'));

        $this->assertStringContainsString(
            'destination="user"',
            $source,
            'The shared login page must send Google to the `user` destination, which resolves agent vs user server-side.'
        );
    }
}

<?php

namespace Tests\Feature;

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class SuperadminGoogleRegistrationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Swap in a provider stub.
     *
     * A fresh mock per call: registering another shouldReceive() on the same
     * facade mock leaves the earlier un-exhausted expectation matching, so every
     * later callback silently replays the FIRST Google user and each "new
     * account" case quietly resolves to the existing row instead.
     */
    private function fakeGoogle(string $email, string $providerId): void
    {
        $socialUser = (new SocialiteUser())->setRaw([])->map([
            'id' => $providerId,
            'nickname' => 'test',
            'name' => 'Google Person',
            'email' => $email,
            'avatar' => 'https://example.test/avatar.jpg',
        ]);

        $driver = Mockery::mock(\Laravel\Socialite\Contracts\Provider::class);
        $driver->shouldReceive('user')->andReturn($socialUser);

        $factory = Mockery::mock(\Laravel\Socialite\Contracts\Factory::class);
        $factory->shouldReceive('driver')->andReturn($driver);

        Socialite::swap($factory);
    }

    private function makeSuperadmin(string $email = 'boss@gmail.com', string $role = 'superadmin'): Admin
    {
        return Admin::create([
            'name' => 'Boss',
            'email' => $email,
            'password' => bcrypt('secret123'),
            'role' => $role,
        ]);
    }

    private function socialCallback(string $destination)
    {
        return $this->withSession(['socialite_destination' => $destination])
            ->get('/auth/google/callback');
    }

    public function test_a_fresh_install_registers_its_first_superadmin_through_google(): void
    {
        $this->fakeGoogle('founder@gmail.com', 'g-1');

        $this->socialCallback('superadmin')->assertRedirect();

        $this->assertSame(1, Admin::where('role', 'superadmin')->count());
        $this->assertSame('founder@gmail.com', auth('admin')->user()->email);
    }

    public function test_the_register_page_sends_google_to_the_superadmin_destination(): void
    {
        $this->get('/superadmin/register')
            ->assertOk()
            ->assertInertia(fn ($p) => $p
                ->component('Auth/StaffRegister')
                ->where('type', 'superadmin')
                ->where('socialDestination', 'superadmin')
            );
    }

    /**
     * The bug being fixed: with a superadmin already present, the register page
     * redirected away and the Socialite callback refused too, so Google sign-up
     * was impossible for the very role that is meant to manage the platform.
     */
    public function test_an_existing_superadmin_can_reach_the_register_page(): void
    {
        $boss = $this->makeSuperadmin();

        $this->actingAs($boss, 'admin')
            ->get('/superadmin/register')
            ->assertOk()
            ->assertInertia(fn ($p) => $p
                ->where('type', 'superadmin')
                ->where('socialDestination', 'superadmin')
            );
    }

    public function test_an_existing_superadmin_can_register_another_superadmin_through_google(): void
    {
        $boss = $this->makeSuperadmin();

        $this->fakeGoogle('second@gmail.com', 'g-2');

        $this->actingAs($boss, 'admin')
            ->socialCallback('superadmin')
            ->assertRedirect();

        $this->assertSame(2, Admin::where('role', 'superadmin')->count());
        $this->assertDatabaseHas('admins', [
            'email' => 'second@gmail.com',
            'role' => 'superadmin',
        ]);
    }

    public function test_an_existing_superadmin_can_register_another_through_the_password_form(): void
    {
        $boss = $this->makeSuperadmin();

        $this->actingAs($boss, 'admin')
            ->post('/superadmin/register', [
                'name' => 'Second',
                'email' => 'second@gmail.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])
            ->assertRedirect();

        $this->assertSame(2, Admin::where('role', 'superadmin')->count());
    }

    /**
     * The public register URL must not become an open invitation. It is
     * unlisted, not secret, so anonymous access has to stay closed.
     */
    public function test_an_anonymous_visitor_cannot_reach_the_register_page(): void
    {
        $this->makeSuperadmin();

        $this->get('/superadmin/register')
            ->assertRedirect(route('admin.login'));
    }

    public function test_an_anonymous_google_signup_is_still_refused(): void
    {
        $this->makeSuperadmin();
        $this->fakeGoogle('stranger@gmail.com', 'g-3');

        $this->socialCallback('superadmin')
            ->assertRedirect(route('superadmin.login'))
            ->assertSessionHas('error');

        $this->assertSame(1, Admin::count());
    }

    public function test_an_anonymous_visitor_cannot_post_the_register_form(): void
    {
        $this->makeSuperadmin();

        $this->post('/superadmin/register', [
            'name' => 'Intruder',
            'email' => 'intruder@gmail.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertSessionHasErrors('email');

        $this->assertSame(1, Admin::count());
    }

    public function test_a_plain_admin_cannot_add_a_superadmin(): void
    {
        $this->makeSuperadmin();
        $plain = $this->makeSuperadmin('plain@gmail.com', 'admin');

        $this->actingAs($plain, 'admin')
            ->get('/superadmin/register')
            ->assertRedirect(route('admin.login'));

        $this->fakeGoogle('escalated@gmail.com', 'g-4');

        $this->actingAs($plain, 'admin')
            ->socialCallback('superadmin')
            ->assertRedirect(route('superadmin.login'));

        $this->assertSame(1, Admin::where('role', 'superadmin')->count());
    }

    public function test_a_blocked_superadmin_cannot_add_another(): void
    {
        $boss = $this->makeSuperadmin();
        $boss->forceFill(['blocked' => true])->save();

        $this->actingAs($boss->refresh(), 'admin')
            ->get('/superadmin/register')
            ->assertRedirect(route('admin.login'));

        $this->assertSame(1, Admin::where('role', 'superadmin')->count());
    }

    public function test_the_existing_superadmin_can_still_sign_in_through_google(): void
    {
        $this->makeSuperadmin('boss@gmail.com');
        $this->fakeGoogle('boss@gmail.com', 'g-5');

        $this->socialCallback('admin')->assertRedirect();

        $this->assertSame('boss@gmail.com', auth('admin')->user()->email);
    }
}
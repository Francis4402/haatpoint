<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

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
}

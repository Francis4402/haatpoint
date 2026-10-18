<?php

namespace Tests\Feature;

use App\Models\User;
use App\Rules\Recaptcha;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RecaptchaVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_renders_recaptcha_site_key(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Auth/Login')
                ->has('recaptchaSiteKey')
        );
    }

    public function test_staff_login_page_renders_recaptcha_site_key(): void
    {
        $response = $this->get('/admin/login');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('Auth/StaffLogin')
                ->has('recaptchaSiteKey')
        );
    }

    public function test_recaptcha_rule_fails_when_google_rejects_token(): void
    {
        // Temporarily fake production environment behavior for testing the rule directly
        $rule = new Recaptcha();

        Http::fake([
            'https://www.google.com/recaptcha/api/siteverify' => Http::response([
                'success' => false,
                'error-codes' => ['invalid-input-response'],
            ], 200),
        ]);

        $failed = false;
        $errorMessage = '';

        // Calling validate in non-testing mode by mocking environment check or calling API logic
        // Because app()->environment('testing') returns early by default, let's test rule logic
        $this->app->detectEnvironment(fn () => 'production');

        $rule->validate('recaptcha_token', 'invalid_token_123', function ($message) use (&$failed, &$errorMessage) {
            $failed = true;
            $errorMessage = $message;
        });

        $this->assertTrue($failed);
        $this->assertStringContainsString('reCAPTCHA verification failed', $errorMessage);

        // Reset environment
        $this->app->detectEnvironment(fn () => 'testing');
    }

    public function test_recaptcha_rule_passes_when_google_accepts_token(): void
    {
        $rule = new Recaptcha();

        Http::fake([
            'https://www.google.com/recaptcha/api/siteverify' => Http::response([
                'success' => true,
                'challenge_ts' => now()->toIso8601String(),
                'hostname' => 'localhost',
            ], 200),
        ]);

        $failed = false;
        $this->app->detectEnvironment(fn () => 'production');

        $rule->validate('recaptcha_token', 'valid_token_123', function () use (&$failed) {
            $failed = true;
        });

        $this->assertFalse($failed);

        $this->app->detectEnvironment(fn () => 'testing');
    }

    public function test_socialite_redirect_requires_recaptcha_in_production(): void
    {
        $this->app->detectEnvironment(fn () => 'production');

        $response = $this->get('/auth/google/redirect/user');

        $response->assertRedirect(route('login'));
        $response->assertSessionHas('error', 'Please complete the reCAPTCHA verification before signing in with Google.');

        $this->app->detectEnvironment(fn () => 'testing');
    }

    public function test_socialite_callback_rejected_if_recaptcha_not_verified_in_production(): void
    {
        $this->app->detectEnvironment(fn () => 'production');

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('login'));
        $response->assertSessionHas('error', 'Please complete the reCAPTCHA verification before signing in with Google.');

        $this->app->detectEnvironment(fn () => 'testing');
    }
}

<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\Store;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Symfony\Component\Mailer\Exception\TransportException;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    private const PASSWORD = 'password123';

    private function makeUser(bool $verified, string $email = 'buyer@gmail.com'): User
    {
        return User::factory()->create([
            'email' => $email,
            'email_verified_at' => $verified ? now() : null,
        ]);
    }

    private function makeAgent(bool $verified, string $email = 'vendor@gmail.com'): Agent
    {
        return Agent::create([
            'name' => 'Vendor',
            'email' => $email,
            'password' => bcrypt(self::PASSWORD),
            'role' => 'agent',
            'email_verified_at' => $verified ? now() : null,
            // Complete KYC so these tests isolate the verification rule. Vendor
            // KYC is enforced ahead of it, so a bare fixture would be turned away
            // for an unrelated reason.
            'mobile' => '01712345678',
            'national_id' => '1234567890',
            'address' => 'House 1, Road 1, Dhaka',
        ]);
    }

    private function storePayload(): array
    {
        return [
            'name' => 'My Store '.uniqid(),
            'storetype' => 'Grocery',
            'address' => 'Somewhere',
            'national_id' => '1234567890',
            'mobile' => '01712345678',
        ];
    }

    public function test_the_verification_notice_can_be_rendered(): void
    {
        $this->actingAs($this->makeUser(false))
            ->get(route('verification.notice'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Auth/VerifyEmail'));
    }

    public function test_a_verified_account_is_redirected_away_from_the_notice(): void
    {
        $this->actingAs($this->makeUser(true))
            ->get(route('verification.notice'))
            ->assertRedirect(route('dashboard'));
    }

    public function test_a_user_can_verify_their_email_with_a_signed_link(): void
    {
        $user = $this->makeUser(false);

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->getKey(), 'hash' => sha1($user->email)]
        );

        $this->actingAs($user)->get($url)->assertRedirect(route('dashboard'));

        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }

    public function test_the_verified_event_fires(): void
    {
        Event::fake([Verified::class]);

        $user = $this->makeUser(false);

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->getKey(), 'hash' => sha1($user->email)]
        );

        $this->actingAs($user)->get($url);

        Event::assertDispatched(Verified::class);
    }

    public function test_a_user_cannot_verify_someone_elses_email(): void
    {
        $user = $this->makeUser(false);
        $other = $this->makeUser(false, 'other@gmail.com');

        // Signed for the *other* account in both id and hash, so the link is
        // genuine but addressed at somebody else's address.
        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $other->getKey(), 'hash' => sha1($other->email)]
        );

        $this->actingAs($user)->get($url)->assertForbidden();

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
        $this->assertFalse($other->fresh()->hasVerifiedEmail());
    }

    public function test_a_tampered_hash_is_rejected(): void
    {
        // Right id, hash of a different address: the signed URL still verifies
        // because hash is part of the signature, so this must be refused by the
        // form request rather than confirming the wrong address.
        $user = $this->makeUser(false);

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->getKey(), 'hash' => sha1('someone.else@gmail.com')]
        );

        $this->actingAs($user)->get($url)->assertForbidden();

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_an_unsigned_link_is_rejected(): void
    {
        $user = $this->makeUser(false);

        $this->actingAs($user)
            ->get(route('verification.verify', [
                'id' => $user->getKey(),
                'hash' => sha1($user->email),
            ]))
            ->assertForbidden();
    }

    public function test_a_vendor_can_verify_their_email(): void
    {
        $agent = $this->makeAgent(false);

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $agent->getKey(), 'hash' => sha1($agent->email)]
        );

        $this->actingAs($agent, 'agent')->get($url)->assertRedirect(route('dashboard'));

        $this->assertTrue($agent->fresh()->hasVerifiedEmail());
    }

    public function test_staff_cannot_reach_the_verification_routes(): void
    {
        // Admin has no verification step, so the notice must not be open to it.
        $admin = Admin::create([
            'name' => 'Boss',
            'email' => 'boss@gmail.com',
            'password' => bcrypt(self::PASSWORD),
            'role' => 'superadmin',
            'email_verified_at' => null,
        ]);

        $this->actingAs($admin, 'admin')
            ->get(route('verification.notice'))
            ->assertRedirect(route('login'));
    }

    public function test_guests_cannot_reach_the_verification_routes(): void
    {
        $this->get(route('verification.notice'))->assertRedirect(route('login'));
        $this->post(route('verification.send'))->assertRedirect(route('login'));
    }

    public function test_the_verification_link_can_be_resent(): void
    {
        Notification::fake();

        $user = $this->makeUser(false);

        $this->actingAs($user)
            ->post(route('verification.send'))
            ->assertSessionHas('status', 'verification-link-sent');

        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_a_failed_resend_reports_the_failure_instead_of_claiming_success(): void
    {
        // The controller used to return `verification-link-sent` unconditionally,
        // so a dead mail server still told the user a link was on its way.
        Mail::shouldReceive('mailer')->andThrow(
            new TransportException('525 5.7.1 Unauthorized IP address')
        );

        $user = $this->makeUser(false);

        $this->actingAs($user)
            ->post(route('verification.send'))
            ->assertSessionHas('error')
            ->assertSessionMissing('status');
    }

    public function test_a_successful_resend_does_not_show_a_failure(): void
    {
        Notification::fake();

        $user = $this->makeUser(false);

        $this->actingAs($user)
            ->post(route('verification.send'))
            ->assertSessionHas('status', 'verification-link-sent')
            ->assertSessionMissing('error');
    }

    public function test_a_verified_account_resending_is_sent_to_the_dashboard(): void
    {
        Notification::fake();

        $this->actingAs($this->makeUser(true))
            ->post(route('verification.send'))
            ->assertRedirect(route('dashboard'));
    }

    public function test_registration_survives_an_smtp_outage(): void
    {
        // Brevo rejecting an unwhitelisted IP used to escape as a 500 *after*
        // the account row was written, leaving an account nobody could log into.
        Mail::shouldReceive('mailer')->andThrow(
            new TransportException('525 5.7.1 Unauthorized IP address')
        );

        $response = $this->post(route('register'), [
            'name' => 'Shopper',
            'email' => 'outage-buyer@gmail.com',
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
        ]);

        $response->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('users', ['email' => 'outage-buyer@gmail.com']);
        $this->assertAuthenticated();
        $this->assertStringContainsString('could not', (string) session('error'));
    }

    public function test_agent_registration_survives_an_smtp_outage(): void
    {
        Mail::shouldReceive('mailer')->andThrow(
            new TransportException('525 5.7.1 Unauthorized IP address')
        );

        $this->post(route('agent.register'), [
            'name' => 'Vendor',
            'email' => 'outage-agent@gmail.com',
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
            'national_id' => '1234567890',
            'mobile' => '01712345678',
            'address' => 'Dhaka',
        ])->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('agents', ['email' => 'outage-agent@gmail.com']);
        $this->assertAuthenticatedAs(
            Agent::where('email', 'outage-agent@gmail.com')->first(),
            'agent'
        );
    }

    public function test_admin_registration_is_not_broken_by_an_smtp_outage(): void
    {
        // Admin does not carry the safe-send trait, so the controller must not
        // read verificationMailFailed off it.
        Mail::shouldReceive('mailer')->andThrow(
            new TransportException('525 5.7.1 Unauthorized IP address')
        );

        $this->post(route('admin.register'), [
            'name' => 'Boss',
            'email' => 'outage-admin@gmail.com',
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
        ])->assertRedirect(route('dashboard'));

        $this->assertDatabaseHas('admins', ['email' => 'outage-admin@gmail.com']);
    }

    public function test_the_verification_email_is_sent_on_registration(): void
    {
        Notification::fake();

        $this->post(route('register'), [
            'name' => 'Shopper',
            'email' => 'notified@gmail.com',
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
        ]);

        Notification::assertSentTo(
            User::where('email', 'notified@gmail.com')->first(),
            VerifyEmail::class
        );
    }

    public function test_an_unverified_vendor_cannot_create_a_store(): void
    {
        $agent = $this->makeAgent(false);

        $this->actingAs($agent, 'agent')
            ->post(route('stores.store'), $this->storePayload())
            ->assertRedirect(route('verification.notice'));

        $this->assertSame(0, Store::count());
    }

    public function test_a_verified_vendor_can_create_a_store(): void
    {
        $agent = $this->makeAgent(true);

        $this->actingAs($agent, 'agent')
            ->post(route('stores.store'), $this->storePayload())
            ->assertSessionHasNoErrors();

        $this->assertSame(1, Store::where('agent_id', $agent->id)->count());
    }

    private function makeProduct(): \App\Models\Products
    {
        $store = Store::create([
            'user_id' => $this->makeUser(true, 'shop.owner@gmail.com')->id,
            'agent_id' => null,
            'name' => 'Shop '.uniqid(),
            'storetype' => 'Grocery',
            'address' => 'Somewhere',
            'email' => 'shop'.uniqid().'@gmail.com',
            'national_id' => '1234567890',
            'mobile' => '0171234567'.random_int(0, 9),
        ]);

        return \App\Models\Products::create([
            'user_id' => $store->user_id,
            'store_id' => $store->id,
            'name' => 'Product '.uniqid(),
            'images' => '[]',
            'slug' => 'product-'.uniqid(),
            'category' => 'Test',
            'subcategory' => 'Test',
            'brand' => 'Test',
            'regular_price' => '100.00',
            'description' => 'A product',
            'item_weight' => '1.00',
            'product_type' => 'physical',
        ]);
    }

    private function orderPayload(\App\Models\Products $product): array
    {
        return [
            'recipient_name' => 'Buyer',
            'recipient_email' => 'buyer@gmail.com',
            'recipient_phone' => '01712345678',
            'recipient_address' => 'A sufficiently long address',
            'recipient_city' => 1,
            'recipient_zone' => 1,
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1, 'price' => 100],
            ],
            'subtotal' => 100,
            'delivery_charge' => 50,
            'total' => 150,
            'amount_to_collect' => 150,
            'delivery_type' => 'normal',
            'item_type' => 'parcel',
            'item_quantity' => 1,
            'item_weight' => '1.00',
            'item_description' => 'A product',
        ];
    }

    public function test_an_unverified_customer_cannot_place_an_order(): void
    {
        $user = $this->makeUser(false);
        $product = $this->makeProduct();

        $this->actingAs($user)
            ->post(route('orders.store'), $this->orderPayload($product))
            ->assertRedirect(route('verification.notice'));

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_a_verified_customer_passes_the_order_verification_gate(): void
    {
        // Scope is the gate, not the whole checkout: past this point the request
        // goes on to the Pathao delivery API, which cannot run in tests. What
        // matters here is that verification is no longer what stops the order.
        $user = $this->makeUser(true);
        $product = $this->makeProduct();

        $response = $this->actingAs($user)
            ->post(route('orders.store'), $this->orderPayload($product));

        $this->assertNotSame(
            route('verification.notice'),
            $response->headers->get('Location'),
            'A verified customer was still sent to the verification screen.'
        );
    }

    public function test_the_shared_auth_prop_reports_the_verification_state(): void
    {
        $this->actingAs($this->makeUser(false))
            ->get(route('dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('auth.isVerified', false)
                ->where('auth.requiresVerification', true)
            );
    }

    public function test_the_shared_auth_prop_is_false_for_a_verified_account(): void
    {
        $this->actingAs($this->makeUser(true))
            ->get(route('dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('auth.isVerified', true)
                ->where('auth.requiresVerification', false)
            );
    }

    public function test_staff_are_never_asked_to_verify(): void
    {
        // Admin and Superadmin have no verification step, so the banner and the
        // shared prop must stay off for them.
        $admin = Admin::create([
            'name' => 'Boss',
            'email' => 'noverify@gmail.com',
            'password' => bcrypt(self::PASSWORD),
            'role' => 'admin',
            'email_verified_at' => null,
        ]);

        $this->actingAs($admin, 'admin')
            ->get(route('dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('auth.requiresVerification', false)
            );
    }
}

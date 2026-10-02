<?php

namespace Tests\Feature;

use App\Models\Agent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VendorProfileTest extends TestCase
{
    use RefreshDatabase;

    private int $sequence = 0;

    private function makeAgent(array $overrides = []): Agent
    {
        // agents.national_id and agents.mobile are UNIQUE, so a test that
        // creates several vendors cannot reuse the same values. Overrides still
        // win, which is what the malformed-KYC cases rely on.
        $n = ++$this->sequence;

        return Agent::create(array_merge([
            'name' => 'Vendor',
            'email' => "vendor{$n}@gmail.com",
            'password' => 'password123',
            'role' => 'agent',
            'email_verified_at' => now(),
            'mobile' => sprintf('017%08d', $n),
            'national_id' => (string) (1000000000 + $n),
            'address' => 'House 1, Road 1, Dhaka',
        ], $overrides));
    }

    private function completeKyc(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Vendor',
            'mobile' => '01712345678',
            'national_id' => '1234567890',
            'address' => 'House 1, Road 1, Dhaka',
        ], $overrides);
    }

    /**
     * A vendor who has registered but supplied no KYC yet, which is the state a
     * brand new agent is actually in.
     */
    private function incompleteKyc(array $overrides = []): array
    {
        return array_merge([
            'mobile' => null,
            'national_id' => null,
            'address' => null,
        ], $overrides);
    }

    public function test_the_vendor_profile_page_loads_with_the_current_details(): void
    {
        $agent = $this->makeAgent();

        $this->actingAs($agent)
            ->get(route('vendor.profile.edit'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard/vendor/VendorProfile')
                ->where('vendor.email', $agent->email)
                ->where('vendor.national_id', $agent->national_id)
            );
    }

    public function test_an_incomplete_vendor_is_told_which_fields_are_missing(): void
    {
        $agent = $this->makeAgent($this->incompleteKyc());

        $this->actingAs($agent)
            ->get(route('vendor.profile.edit'))
            ->assertInertia(fn ($page) => $page
                ->where('isComplete', false)
                ->where('missingFields', ['national_id', 'mobile', 'address'])
            );
    }

    public function test_a_complete_vendor_reports_no_missing_fields(): void
    {
        $agent = $this->makeAgent($this->completeKyc());

        $this->actingAs($agent)
            ->get(route('vendor.profile.edit'))
            ->assertInertia(fn ($page) => $page
                ->where('isComplete', true)
                ->where('missingFields', [])
            );
    }

    public function test_a_vendor_can_save_their_details(): void
    {
        $agent = $this->makeAgent($this->incompleteKyc());

        $this->actingAs($agent)
            ->post(route('vendor.profile.update'), $this->completeKyc())
            ->assertRedirect(route('vendor.profile.edit'))
            ->assertSessionHas('success');

        $agent->refresh();

        $this->assertSame('01712345678', $agent->mobile);
        $this->assertSame('1234567890', $agent->national_id);
        $this->assertTrue($agent->hasCompleteVendorProfile());
    }

    /**
     * The banner, the store guard and the model must agree on what "complete"
     * means. These cases are the ones where a laxer check would let a vendor
     * through a gate they should fail.
     */
    public function test_the_model_rejects_partial_kyc(): void
    {
        $cases = [
            'no mobile' => ['mobile' => null],
            'short mobile' => ['mobile' => '0171234567'],
            'mobile not a valid allocation' => ['mobile' => '01212345678'],
            'no national id' => ['national_id' => null],
            'nine digit national id' => ['national_id' => '123456789'],
            'national id with letters' => ['national_id' => '123456789a'],
            'blank address' => ['address' => '   '],
        ];

        foreach ($cases as $label => $override) {
            // Build on the fixture's own unique values rather than
            // completeKyc()'s fixed ones, so the UNIQUE index on mobile does not
            // fail the case before the assertion runs.
            $agent = $this->makeAgent($override);

            $this->assertFalse(
                $agent->hasCompleteVendorProfile(),
                "Expected an incomplete profile for case: {$label}"
            );
        }
    }

    public function test_the_model_accepts_a_ten_and_seventeen_digit_national_id(): void
    {
        $this->assertTrue(
            $this->makeAgent(['national_id' => '1234567890'])->hasCompleteVendorProfile()
        );

        $this->assertTrue(
            $this->makeAgent(['national_id' => '12345678901234567'])->hasCompleteVendorProfile()
        );
    }

    public function test_the_update_request_rejects_a_malformed_mobile(): void
    {
        $agent = $this->makeAgent($this->incompleteKyc());

        $this->actingAs($agent)
            ->post(route('vendor.profile.update'), $this->completeKyc(['mobile' => '01212345678']))
            ->assertSessionHasErrors('mobile');

        $this->assertFalse($agent->refresh()->hasCompleteVendorProfile());
    }

    public function test_the_update_request_rejects_a_malformed_national_id(): void
    {
        $agent = $this->makeAgent($this->incompleteKyc());

        $this->actingAs($agent)
            ->post(route('vendor.profile.update'), $this->completeKyc(['national_id' => 'abcdefghij']))
            ->assertSessionHasErrors('national_id');
    }

    public function test_an_incomplete_vendor_is_kept_away_from_the_store_form(): void
    {
        $agent = $this->makeAgent($this->incompleteKyc());

        $this->actingAs($agent)
            ->get(route('dashboard.createstore'))
            ->assertRedirect(route('vendor.profile.edit'))
            ->assertSessionHas('error');
    }

    public function test_an_incomplete_vendor_cannot_create_a_store(): void
    {
        $agent = $this->makeAgent($this->incompleteKyc());

        $this->actingAs($agent)
            ->post(route('stores.store'), [
                'name' => 'My Store',
                'storetype' => 'Retail',
                'address' => 'House 1, Road 1, Dhaka',
                'national_id' => '1987654321',
                'mobile' => '01812345678',
            ])
            ->assertRedirect(route('vendor.profile.edit'));

        $this->assertDatabaseCount('stores', 0);
    }

    public function test_a_complete_vendor_reaches_the_store_form(): void
    {
        $agent = $this->makeAgent($this->completeKyc());

        $this->actingAs($agent)
            ->get(route('dashboard.createstore'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('dashboard/forms/CreateStoreForm'));
    }

    public function test_a_complete_vendor_can_create_a_store(): void
    {
        $agent = $this->makeAgent($this->completeKyc());

        $this->actingAs($agent)
            ->post(route('stores.store'), [
                'name' => 'My Store',
                'storetype' => 'Retail',
                'address' => 'House 1, Road 1, Dhaka',
                'national_id' => '1987654321',
                'mobile' => '01812345678',
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('stores', [
            'name' => 'My Store',
            'agent_id' => $agent->id,
        ]);
    }

    /**
     * The store gate has to run before validation. It used to run after, so a
     * vendor who failed validation got a field error instead of being sent to
     * complete their profile, and a vendor who passed it hit a guard that
     * returned from inside an open transaction.
     */
    public function test_the_store_guard_runs_before_validation(): void
    {
        $agent = $this->makeAgent($this->incompleteKyc());

        // No valid payload at all: the guard must still be what answers.
        $this->actingAs($agent)
            ->post(route('stores.store'), [])
            ->assertRedirect(route('vendor.profile.edit'))
            ->assertSessionHasNoErrors();
    }

    public function test_a_customer_cannot_open_the_vendor_profile(): void
    {
        $user = User::create([
            'name' => 'Customer',
            'email' => 'customer@gmail.com',
            'password' => 'password123',
            'role' => 'user',
        ]);

        $this->actingAs($user)
            ->get(route('vendor.profile.edit'))
            ->assertForbidden();

        $this->actingAs($user)
            ->post(route('vendor.profile.update'), $this->completeKyc())
            ->assertForbidden();
    }

    public function test_guests_cannot_open_the_vendor_profile(): void
    {
        $this->get(route('vendor.profile.edit'))->assertRedirect(route('login'));
        $this->post(route('vendor.profile.update'), $this->completeKyc())->assertRedirect(route('login'));
    }

    public function test_an_image_can_be_uploaded(): void
    {
        Storage::fake('public');
        $agent = $this->makeAgent($this->incompleteKyc());

        $this->actingAs($agent)
            ->post(route('vendor.profile.update'), $this->completeKyc() + [
                'images' => \Illuminate\Http\UploadedFile::fake()->image('me.jpg'),
            ])
            ->assertSessionHasNoErrors();

        $agent->refresh();

        $this->assertNotNull($agent->images);
        Storage::disk('public')->assertExists($agent->images);
    }

    public function test_the_shared_props_report_incomplete_vendors(): void
    {
        $agent = $this->makeAgent($this->incompleteKyc());

        $this->actingAs($agent)
            ->get(route('dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('auth.incompleteVendorProfile', true)
                ->where('auth.missingVendorProfileFields', ['national_id', 'mobile', 'address'])
            );
    }

    public function test_the_shared_props_report_complete_vendors(): void
    {
        $agent = $this->makeAgent($this->completeKyc());

        $this->actingAs($agent)
            ->get(route('dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('auth.incompleteVendorProfile', false)
                ->where('auth.missingVendorProfileFields', [])
            );
    }

    /**
     * Customers are not vendors, so they must never be asked to complete vendor
     * KYC. Sharing the flag for every role is how a customer ends up with a
     * vendor warning they cannot act on.
     */
    public function test_customers_are_never_asked_to_complete_vendor_kyc(): void
    {
        $user = User::create([
            'name' => 'Customer',
            'email' => 'customer@gmail.com',
            'password' => 'password123',
            'role' => 'user',
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('auth.incompleteVendorProfile', false)
                ->where('auth.missingVendorProfileFields', [])
            );
    }
}

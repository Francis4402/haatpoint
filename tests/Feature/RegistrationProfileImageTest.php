<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Registration must persist the profile picture on every role.
 *
 * The customer form has always shown an uploader, but the field was never read
 * by RegisteredUserController, so the uploaded file was discarded and
 * users.images stayed NULL. Staff registration had no uploader at all. Both
 * are silent failures: the account is created and the visitor sees a success
 * toast, so nothing indicates the picture was lost.
 *
 * Agent, admin and superadmin share StaffAuthController::register(), so one
 * test per role is what keeps that shared path honest.
 */
class RegistrationProfileImageTest extends TestCase
{
    use RefreshDatabase;

    /** A registration payload valid for all three role guards. */
    private function payload(array $overrides = []): array
    {
        return $overrides + [
            'name' => 'Test Person',
            'email' => 'person@gmail.com',
            'password' => 'Password!123',
            'password_confirmation' => 'Password!123',
            // Agent-only fields; harmless for roles that ignore them.
            'address' => '12 Test Road',
            'mobile' => '01812345678',
            'national_id' => '1234567890',
        ];
    }

    public function test_a_customer_registration_persists_the_profile_image(): void
    {
        Storage::fake('public');

        $this->post(route('register'), $this->payload([
            'image' => UploadedFile::fake()->image('me.jpg')->size(200),
        ]))->assertSessionHasNoErrors();

        $user = User::where('email', 'person@gmail.com')->firstOrFail();

        $this->assertNotNull($user->images, 'The uploaded picture was silently discarded.');
        Storage::disk('public')->assertExists($user->images);
    }

    public function test_customer_registration_still_works_without_a_picture(): void
    {
        Storage::fake('public');

        $this->post(route('register'), $this->payload())->assertSessionHasNoErrors();

        $user = User::where('email', 'person@gmail.com')->firstOrFail();

        $this->assertNull($user->images);
    }

    public function test_an_agent_registration_persists_the_profile_image(): void
    {
        Storage::fake('public');

        $this->post(route('agent.register'), $this->payload([
            'email' => 'vendor@gmail.com',
            'image' => UploadedFile::fake()->image('me.jpg')->size(200),
        ]))->assertSessionHasNoErrors();

        $agent = Agent::where('email', 'vendor@gmail.com')->firstOrFail();

        $this->assertNotNull($agent->images, 'The uploaded picture was silently discarded.');
        Storage::disk('public')->assertExists($agent->images);
    }

    public function test_a_superadmin_registration_persists_the_profile_image(): void
    {
        Storage::fake('public');

        $this->post(route('superadmin.register'), $this->payload([
            'email' => 'boss@gmail.com',
            'image' => UploadedFile::fake()->image('me.jpg')->size(200),
        ]))->assertSessionHasNoErrors();

        $admin = Admin::where('email', 'boss@gmail.com')->firstOrFail();

        $this->assertNotNull($admin->images, 'The uploaded picture was silently discarded.');
        Storage::disk('public')->assertExists($admin->images);
    }

    public function test_staff_registration_still_works_without_a_picture(): void
    {
        Storage::fake('public');

        $this->post(route('agent.register'), $this->payload([
            'email' => 'vendor@gmail.com',
        ]))->assertSessionHasNoErrors();

        $this->assertNull(Agent::where('email', 'vendor@gmail.com')->firstOrFail()->images);
    }

    /**
     * The upload must be rejected server side. The form checks type and size in
     * the browser, which anyone can bypass by posting the form directly.
     */
    public function test_a_non_image_upload_is_rejected(): void
    {
        Storage::fake('public');

        $this->post(route('register'), $this->payload([
            'image' => UploadedFile::fake()->create('payload.php', 8, 'application/x-php'),
        ]))->assertSessionHasErrors('image');

        $this->assertSame(
            0,
            count(Storage::disk('public')->files('profile_images')),
            'A rejected upload must not leave a file behind.'
        );
    }

    public function test_an_oversized_image_is_rejected(): void
    {
        Storage::fake('public');

        // The rule caps at 2048 KB; 3MB is over it.
        $this->post(route('register'), $this->payload([
            'image' => UploadedFile::fake()->image('big.jpg')->size(3072),
        ]))->assertSessionHasErrors('image');
    }

    /**
     * A picture is stored as a bare path, never as the JSON array products use.
     * DashboardLayout branches on this: it prefixes /storage/ for a bare path
     * and uses an absolute URL untouched (what the Google path saves), so a
     * JSON-encoded value here would render a broken image for every role.
     */
    public function test_the_stored_value_is_a_bare_path_not_json(): void
    {
        Storage::fake('public');

        $this->post(route('register'), $this->payload([
            'image' => UploadedFile::fake()->image('me.jpg')->size(200),
        ]))->assertSessionHasNoErrors();

        $images = User::where('email', 'person@gmail.com')->firstOrFail()->images;

        $this->assertIsString($images);
        $this->assertStringStartsWith('profile_images/', $images);
        $this->assertNull(json_decode($images, true), 'The value decoded as JSON, so it is not a bare path.');
    }

    /**
     * All three roles must land in the same folder.
     *
     * Splitting them per role would scatter the same kind of file across
     * several directories and make a person's picture impossible to find
     * without first knowing their role.
     */
    public function test_every_role_shares_the_one_profile_images_folder(): void
    {
        Storage::fake('public');

        $this->post(route('register'), $this->payload([
            'email' => 'shopper@gmail.com',
            'image' => UploadedFile::fake()->image('a.jpg')->size(200),
        ]))->assertSessionHasNoErrors();

        $this->post(route('agent.register'), $this->payload([
            'email' => 'vendor@gmail.com',
            'image' => UploadedFile::fake()->image('b.jpg')->size(200),
        ]))->assertSessionHasNoErrors();

        $this->post(route('superadmin.register'), $this->payload([
            'email' => 'boss@gmail.com',
            'image' => UploadedFile::fake()->image('c.jpg')->size(200),
        ]))->assertSessionHasNoErrors();

        $paths = [
            User::where('email', 'shopper@gmail.com')->firstOrFail()->images,
            Agent::where('email', 'vendor@gmail.com')->firstOrFail()->images,
            Admin::where('email', 'boss@gmail.com')->firstOrFail()->images,
        ];

        foreach ($paths as $path) {
            $this->assertStringStartsWith('profile_images/', $path);
        }

        // Three distinct uploads, one folder, no per-role directories.
        $this->assertCount(3, array_unique($paths));
        $this->assertCount(3, Storage::disk('public')->files('profile_images'));
    }
}
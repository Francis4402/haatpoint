<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;

/**
 * Stores the optional profile picture accepted by every registration form.
 *
 * Shared by the customer and staff registration paths on purpose. Those paths
 * already diverge over who they validate and which table they write to, and a
 * per-controller copy of this logic is how the customer form ended up silently
 * dropping its upload while the field stayed on screen: the file arrived, the
 * controller ignored it, and nothing failed.
 *
 * Follows the store-logo convention (StoreController): re-encode through
 * Intervention rather than trusting the extension, keep the JPEG bytes on the
 * public disk, and store a bare relative path. DashboardLayout decides how to
 * render it -- a bare path becomes /storage/<path>, and an absolute URL (what
 * the Google sign-in path saves via $socialUser->getAvatar()) is used as-is.
 *
 * Avatars are centre-cropped square because every consumer renders them inside
 * a rounded-full circle, where a non-square source would otherwise be squeezed.
 */
trait StoresProfileImage
{
    /**
     * Directory on the public disk that holds profile pictures.
     *
     * One directory for all three roles. users, agents and admins each have
     * their own `images` column and each renders through the same dashboard
     * avatar, so splitting them by role would mean three folders holding the
     * same kind of file and no way to find a person's picture without knowing
     * their role first.
     */
    protected static string $profileImageDirectory = 'profile_images';

    /** Validation rule for the profile picture field. */
    protected function profileImageRules(): array
    {
        return ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'];
    }

    /**
     * Persist the uploaded picture and return the relative path, or null when
     * no usable file was sent.
     *
     * A file that cannot be decoded throws from Intervention. That is left to
     * propagate: it means the upload is genuinely broken, and silently saving
     * nothing would reproduce the bug this trait exists to prevent.
     */
    protected function storeProfileImage(?UploadedFile $file): ?string
    {
        if (! $file || ! $file->isValid()) {
            return null;
        }

        // Always a .jpg suffix because the bytes are JPEG-encoded below, so the
        // extension cannot disagree with the content.
        $filename = 'avatar_' . Str::random(16) . '_' . time() . '.jpg';
        $path = static::$profileImageDirectory . '/' . $filename;

        $manager = new ImageManager(new Driver);

        $image = $manager->read($file->getRealPath());

        // Centre-cropped square, since cover() already produces exactly
        // 400x400 and a pad would be a no-op.
        $image->cover(400, 400, 'center');

        Storage::disk('public')->put($path, (string) $image->encode(new JpegEncoder(quality: 90)));

        return $path;
    }
}
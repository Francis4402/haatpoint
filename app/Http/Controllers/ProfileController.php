<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->images) {
                Storage::disk('public')->delete($user->images);
            }

            // Process and store new image
            $user->images = $this->processAndStoreImage($request->file('image'));
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        if ($user->images) {
            Storage::disk('public')->delete($user->images);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }


    private function processAndStoreImage($image): string
    {
        $manager = new ImageManager(new Driver());


        $img = $manager->read($image);


        $img->scale(width: 800);


        $filename = 'profile_' . uniqid() . '.jpg';
        $path = 'profile_images/' . $filename;


        $encoded = $img->toJpeg(quality: 85);

        Storage::disk('public')->put($path, (string) $encoded);

        return $path;
    }
}

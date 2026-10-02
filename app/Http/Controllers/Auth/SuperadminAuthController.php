<?php

namespace App\Http\Controllers\Auth;

use App\Models\Admin;
use Illuminate\Http\Request;

class SuperadminAuthController extends StaffAuthController
{
    protected function guard(): string
    {
        return 'admin';
    }

    protected function model(): string
    {
        return Admin::class;
    }

    protected function roleKey(): string
    {
        return 'superadmin';
    }

    protected function roleColumn(): bool
    {
        return true;
    }

    /**
     * Open the bootstrap registration while the system has no superadmin at all,
     * and to an existing superadmin afterwards.
     *
     * Anonymous self-registration has to stay closed once a superadmin exists:
     * the register URL is public and unlisted-guarded, so opening it permanently
     * would hand full superadmin rights to anyone who finds it. But the holder of
     * the role needs to be able to add another superadmin, and that is exactly
     * the case this exception exists for.
     *
     * The same rule is applied to the Socialite callback, since the register page
     * can offer Google sign-up and the page-level check alone would not stop a
     * direct callback.
     */
    public function canRegister(Request $request): bool
    {
        if (! Admin::where('role', 'superadmin')->exists()) {
            return true;
        }

        $actor = $request->user() ?? auth('admin')->user();

        return $actor instanceof Admin
            && $actor->role === 'superadmin'
            && ! $actor->blocked;
    }

    protected function registrationClosedMessage(): string
    {
        return 'A superadmin already exists. Registration is closed.';
    }
}
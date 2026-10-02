<?php

namespace App\Http\Controllers\Auth;

use App\Models\Admin;
use Illuminate\Http\Request;

class AdminAuthController extends StaffAuthController
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
        return 'admin';
    }

    protected function roleColumn(): bool
    {
        return true;
    }

    /**
     * Admin self-registration is open ONLY until the first superadmin exists.
     * Once a superadmin is registered, this route is locked so nobody can
     * create further admin accounts by hand — only the superadmin can promote.
     */
    public function canRegister(Request $request): bool
    {
        return ! Admin::where('role', 'superadmin')->exists();
    }

    /**
     * The first registrant through the admin register route bootstraps the
     * system and therefore becomes the superadmin.
     */
    protected function registrationRole(): ?string
    {
        return 'superadmin';
    }

    /**
     * Sign up through Google on this page has to land on the `superadmin`
     * destination, because that is the only one permitted to CREATE an admin
     * row. The password form above already turns the first registrant into a
     * superadmin, so sending `admin` here made the Google button on this same
     * page always fail with "no admin account exists".
     */
    protected function socialDestination(): string
    {
        return 'superadmin';
    }

    protected function registrationClosedMessage(): string
    {
        return 'A superadmin already exists. Registration is closed. Admin accounts are created by the superadmin.';
    }
}

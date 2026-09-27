<?php

namespace App\Http\Controllers\Auth;

use App\Models\Admin;

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
    public function canRegister(): bool
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

    protected function registrationClosedMessage(): string
    {
        return 'A superadmin already exists. Registration is closed. Admin accounts are created by the superadmin.';
    }
}

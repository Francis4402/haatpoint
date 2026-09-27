<?php

namespace App\Http\Controllers\Auth;

use App\Models\Admin;

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

    public function canRegister(): bool
    {
        return ! Admin::where('role', 'superadmin')->exists();
    }

    protected function registrationClosedMessage(): string
    {
        return 'A superadmin already exists. Registration is closed.';
    }
}
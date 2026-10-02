<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Auth\MustVerifyEmail;

abstract class Controller
{
    /**
     * Whether this account has to confirm its email address before it is
     * allowed to act as a customer.
     *
     * Only User and Agent implement MustVerifyEmail. Admin and Superadmin have
     * no verification step at all: routes/auth.php deliberately keeps them out
     * of the verify-email group, and StaffAuthController never sends them a
     * verification mail, so their email_verified_at stays NULL forever.
     *
     * Gating on that column for every role sent each staff account to
     * /verify-email on a page it is not allowed to open, which then bounced it
     * straight back with no explanation. So the column may only be consulted
     * for a role that actually verifies.
     */
    protected function requiresVerifiedEmail(mixed $user): bool
    {
        return $user instanceof MustVerifyEmail;
    }
}
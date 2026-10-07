<?php

namespace App\Traits;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;

trait ClearsOtherGuards
{
    /**
     * Sign in on $guard after dropping every other guard's session.
     *
     * ResolveAuthGuard walks ['web', 'superadmin', 'admin', 'agent'] and stops
     * at the first guard that reports a user, while Laravel's own login() only
     * writes the key for the guard being used. A visitor who already held a
     * customer session and then registered through Google therefore landed on
     * the dashboard still reading as that customer -- the superadmin existed,
     * but nothing ever showed it. The switch has to be explicit.
     *
     * SessionGuard::logout() cycles the remember token of the account being
     * signed out, which is the intended cost: a "remember me" cookie for the
     * abandoned account must not keep working once the visitor has switched.
     *
     * @param  Authenticatable  $user
     */
    protected function loginOnGuard(string $guard, $user): void
    {
        $this->clearOtherGuards($guard);

        Auth::guard($guard)->login($user);
    }

    /**
     * Drop every session except $guard's, leaving the caller to log in.
     *
     * Used on the password path, where attempt() has already written the
     * target guard's key before the switch is needed.
     */
    protected function clearOtherGuards(string $guard): void
    {
        foreach (['web', 'superadmin', 'admin', 'agent'] as $other) {
            if ($other !== $guard) {
                Auth::guard($other)->logout();
            }
        }
    }
}

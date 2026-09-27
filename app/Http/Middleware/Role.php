<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403, 'Unauthenticated.');
        }

        // Allow if the user's role is in the allowed list
        $role = $user->role ?? 'user';

        if (in_array($role, $roles, true)) {
            return $next($request);
        }

        abort(403, 'You do not have permission to access this page.');
    }
}
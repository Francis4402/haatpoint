<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ResolveAuthGuard
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        foreach (['web', 'superadmin', 'admin', 'agent'] as $guard) {
            if (Auth::guard($guard)->check()) {
                Auth::shouldUse($guard);
                break;
            }
        }

        return $next($request);
    }
}
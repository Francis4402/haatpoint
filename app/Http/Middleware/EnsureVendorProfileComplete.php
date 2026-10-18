<?php

namespace App\Http\Middleware;

use App\Models\Agent;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureVendorProfileComplete
{
    /**
     * Route names permitted when an agent's vendor profile is incomplete.
     */
    protected array $allowedRoutes = [
        'vendor.profile.edit',
        'vendor.profile.update',
        'agent.logout',
        'logout',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('api/*') || $request->is('_debugbar/*')) {
            return $next($request);
        }

        $user = $request->user()
            ?? Auth::guard('agent')->user()
            ?? Auth::guard('web')->user()
            ?? Auth::guard('admin')->user();

        if ($user instanceof Agent && ! $user->hasCompleteVendorProfile()) {
            $routeName = $request->route()?->getName();

            if (
                ($routeName && in_array($routeName, $this->allowedRoutes, true))
                || $request->is('dashboard/vendor/profile*')
                || $request->is('logout')
                || $request->is('agent/logout')
            ) {
                return $next($request);
            }

            // An agent with an incomplete profile cannot access any other page.
            return redirect()
                ->route('vendor.profile.edit')
                ->with('error', 'Please complete your vendor information form before continuing.')
                ->with('warning', 'Please complete your vendor information form before continuing.');
        }

        return $next($request);
    }
}

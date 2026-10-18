<?php

namespace App\Http\Middleware;

use App\Models\Agent;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureSubscriptionActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user()
            ?? Auth::guard('agent')->user()
            ?? Auth::guard('admin')->user();

        if ($user instanceof Agent) {
            // Allow access to the upgrade page and logout.
            $routeName = $request->route()?->getName();
            $allowedRoutes = [
                'dashboard.upgrade',
                'dashboard.subscription.payment',
                'dashboard.subscription.payment.submit',
                'vendor.profile.edit',
                'vendor.profile.update',
                'agent.logout',
                'logout',
            ];

            if (in_array($routeName, $allowedRoutes, true)) {
                return $next($request);
            }

            if ($user->isSubscriptionExpired()) {
                // A Pro signup whose bKash payment is pending or not yet approved
                // goes straight to the payment page; everyone else sees the paywall.
                if ($user->plan === 'pro' || $user->hasPendingSubscriptionPayment()) {
                    return redirect()->route('dashboard.subscription.payment');
                }

                return redirect()->route('dashboard.upgrade');
            }
        }

        return $next($request);
    }
}

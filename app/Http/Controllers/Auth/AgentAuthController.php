<?php

namespace App\Http\Controllers\Auth;

use App\Models\Agent;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AgentAuthController extends StaffAuthController
{
    protected function guard(): string
    {
        return 'agent';
    }

    protected function model(): string
    {
        return Agent::class;
    }

    protected function roleKey(): string
    {
        return 'agent';
    }

    protected function roleColumn(): bool
    {
        return true;
    }

    /**
     * Agents may always register. The role does not bootstrap the system, so
     * there is nothing to lock down once one account exists.
     */
    public function canRegister(Request $request): bool
    {
        return true;
    }

    /**
     * An agent is a single identity: if this email already had a customer
     * account, drop it so the person exists only as an agent.
     */
    protected function afterRegistration(Request $request): void
    {
        User::where('email', $request->email)->delete();
    }

    /**
     * Agents must provide KYC details at registration. They do not verify their
     * email address (see App\Models\Agent), so there is no verification step
     * here.
     */
    protected function registrationRules(): array
    {
        return [
            'address' => 'required|string|max:255',
            'mobile' => ['required', 'string', 'regex:/^01[3-9]\d{8}$/'],
            'national_id' => ['required', 'string', 'regex:/^\d{10}$|^\d{17}$/'],
            'plan' => 'nullable|in:free,pro',
        ];
    }

    protected function registrationData(Request $request): array
    {
        $plan = $request->input('plan') === 'pro' ? 'pro' : 'free';

        if ($plan === 'pro') {
            return [
                'address' => $request->address,
                'mobile' => $request->mobile,
                'national_id' => $request->national_id,
                'plan' => 'pro',
                // Pro is NOT granted at signup: the agent pays ৳500 by bKash and
                // a superadmin approves the transaction. Until then the account
                // has no active subscription and is held on the payment page.
                'subscription_ends_at' => null,
                'subscription_payment_status' => 'pending',
                'subscription_payment_amount' => 500,
            ];
        }

        return [
            'address' => $request->address,
            'mobile' => $request->mobile,
            'national_id' => $request->national_id,
            'plan' => 'free',
            // Free accounts run for one year. When the date passes the account
            // is locked behind the upgrade prompt.
            'subscription_ends_at' => now()->addYear(),
            'subscription_payment_status' => 'none',
        ];
    }

    /**
     * A Pro signup is not finished until the bKash payment is submitted, so
     * send the new agent straight to the payment page instead of the dashboard.
     */
    protected function registrationRedirect(Request $request, $user): RedirectResponse
    {
        if ($user instanceof Agent && $user->hasPendingSubscriptionPayment()) {
            return redirect()->route('dashboard.subscription.payment')
                ->with('success', 'Account created! Complete your bKash payment to activate HaatPoint Pro.');
        }

        return parent::registrationRedirect($request, $user);
    }
}

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
            'name' => ['required', 'string', 'max:255', 'unique:agents,name'],
            'address' => 'required|string|max:255',
            'mobile' => ['required', 'string', 'regex:/^01[3-9]\d{8}$/', 'unique:agents,mobile'],
            'national_id' => ['required', 'string', 'regex:/^\d{10}$|^\d{17}$/', 'unique:agents,national_id'],
            'plan' => 'nullable|in:free,pro',
        ];
    }

    protected function registrationMessages(): array
    {
        return [
            'name.required' => 'Please enter your full name / user name.',
            'name.unique' => 'This user name is already registered. Please choose another name.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered. Please use another email or sign in.',
            'address.required' => 'Please enter your address.',
            'mobile.required' => 'Please enter your mobile number.',
            'mobile.regex' => 'Mobile number must be a valid 11-digit Bangladeshi number starting with 01.',
            'mobile.unique' => 'This mobile number is already registered with another agent account.',
            'national_id.required' => 'Please enter your National ID number.',
            'national_id.regex' => 'National ID must be either 10 or 17 digits.',
            'national_id.unique' => 'This National ID is already registered with another agent account.',
            'password.required' => 'Please enter a password.',
            'password.confirmed' => 'Passwords do not match.',
        ];
    }

    protected function registrationData(Request $request): array
    {
        return [
            'address' => $request->address,
            'mobile' => $request->mobile,
            'national_id' => $request->national_id,
            'plan' => 'free',
            // Free accounts are activated on registration and free forever (up to 150 products upload).
            // Agents can upgrade to Pro anytime from their dashboard for unlimited product uploads.
            'subscription_ends_at' => null,
            'subscription_payment_status' => 'none',
        ];
    }

    /**
     * Newly registered agents are created with a free active account and redirect to dashboard.
     */
    protected function registrationRedirect(Request $request, $user): RedirectResponse
    {
        return parent::registrationRedirect($request, $user);
    }
}

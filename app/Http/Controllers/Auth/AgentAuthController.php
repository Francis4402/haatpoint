<?php

namespace App\Http\Controllers\Auth;

use App\Models\Agent;
use App\Models\User;
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
     * An agent is a single identity: if this email already had a customer
     * account, drop it so the person exists only as an agent.
     */
    protected function afterRegistration(Request $request): void
    {
        User::where('email', $request->email)->delete();
    }

    /**
     * Agents must verify their email before they can create a store
     * (the /dashboard group enforces the 'verified' middleware), and must
     * provide KYC details at registration.
     */
    protected function registrationRules(): array
    {
        return [
            'address' => 'required|string|max:255',
            'mobile' => ['required', 'string', 'regex:/^01[3-9]\d{8}$/'],
            'national_id' => ['required', 'string', 'regex:/^\d{10}$|^\d{17}$/'],
        ];
    }

    protected function registrationData(Request $request): array
    {
        return [
            'address' => $request->address,
            'mobile' => $request->mobile,
            'national_id' => $request->national_id,
        ];
    }
}

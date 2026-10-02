<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     *
     * Returns to the route they were blocked from, not to a fixed page, so a
     * vendor sent here from "create store" lands back on the store form.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $request->fulfill();

        return redirect()->intended(route('dashboard', absolute: false))->with('status', 'verified');
    }
}

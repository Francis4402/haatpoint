<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the "confirm your address" screen.
     *
     * A verified account is sent straight on. Google sign-ups arrive verified,
     * so they must never see this page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        return $request->user()->hasVerifiedEmail()
            ? redirect()->intended(route('dashboard', absolute: false))
            : Inertia::render('Auth/VerifyEmail', [
                'status' => session('status'),
            ]);
    }
}

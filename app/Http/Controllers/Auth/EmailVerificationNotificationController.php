<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Re-send the verification link. An account that signed up through Google
     * is already verified and has nothing to confirm.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $user->sendEmailVerificationNotification();

        // SendsVerificationEmailSafely swallows transport failures so a broken
        // mail server cannot 500 a logged-in user out of their own account.
        // That means this method no longer gets an exception to detect, so it
        // has to ask. Without this check the user was told "a fresh link has
        // been sent" every time Brevo refused the connection.
        if (($user->verificationMailFailed ?? false) === true) {
            return back()->with('error', $user->verificationMailFailureMessage());
        }

        return back()->with('status', 'verification-link-sent');
    }
}

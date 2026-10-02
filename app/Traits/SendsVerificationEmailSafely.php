<?php

namespace App\Traits;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Implements Illuminate\Contracts\Auth\MustVerifyEmail without pulling in the
 * framework's own trait, so sendEmailVerificationNotification() can be made
 * fault tolerant.
 *
 * The stock version calls $this->notify() with nothing around it, so a refused
 * SMTP connection -- Brevo rejecting an unwhitelisted egress IP, a wrong
 * password, a DNS failure -- escapes as a TransportException and the person
 * registering gets a 500 after their account row was already written. They are
 * then unable to log in and the account looks like it never existed.
 *
 * Here the failure is recorded and swallowed. Registration continues, the
 * account is usable, and the caller can say plainly that the email could not be
 * sent yet. The dashboard banner and the resend endpoint both read
 * $verificationMailFailed for that.
 *
 * The remaining three methods are the framework trait's behaviour unchanged;
 * only the sending is different.
 */
trait SendsVerificationEmailSafely
{
    /**
     * Whether the most recent send attempt failed. Reset on every attempt, so
     * a stale true can never be reported for a later successful send.
     */
    public bool $verificationMailFailed = false;

    /**
     * Determine if the user has verified their email address.
     */
    public function hasVerifiedEmail(): bool
    {
        return ! is_null($this->email_verified_at);
    }

    /**
     * Mark the given user's email as verified.
     */
    public function markEmailAsVerified(): bool
    {
        return $this->forceFill([
            'email_verified_at' => $this->freshTimestamp(),
        ])->save();
    }

    /**
     * Get the email address that should be used for verification.
     */
    public function getEmailForVerification(): string
    {
        return $this->email;
    }

    /**
     * Send the verification notification, trapping transport failures.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->verificationMailFailed = false;

        try {
            $this->notify(new VerifyEmail);
        } catch (Throwable $e) {
            $this->verificationMailFailed = true;

            // Account id and address only. The SMTP username and host appear in
            // the exception message, so that is kept out of the structured
            // context rather than logged as a first-class field.
            Log::error('Verification email could not be sent.', [
                'account_id' => $this->getKey(),
                'email' => $this->email,
                'reason' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Message suitable for showing to the person who just registered.
     */
    public function verificationMailFailureMessage(): string
    {
        return 'Your account was created, but we could not send the verification email yet. '
            .'Please try again from your dashboard in a few minutes.';
    }
}

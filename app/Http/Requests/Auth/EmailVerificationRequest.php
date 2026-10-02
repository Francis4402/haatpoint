<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Http\FormRequest;

class EmailVerificationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Both checks matter. hasVerifiedEmail() means the link was already used,
     * so replaying it must be a no-op rather than a second verification.
     * authorize() stops a user confirming somebody else's address by putting
     * their id in the signed URL.
     */
    public function authorize(): bool
    {
        // The id must be the signed-in account, so a valid link minted for
        // somebody else cannot be replayed by the wrong person.
        if (! hash_equals((string) $this->user()->getKey(), (string) $this->route('id'))) {
            return false;
        }

        // The hash must match this account's own address. The signed URL keeps
        // the hash tamper-proof, but checking it here means a link generated
        // with a mismatched hash is refused rather than confirming the wrong
        // address.
        if (! hash_equals(sha1($this->user()->getEmailForVerification()), (string) $this->route('hash'))) {
            return false;
        }

        return ! $this->user()->hasVerifiedEmail();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function fulfill(): void
    {
        if (! $this->user()->hasVerifiedEmail()) {
            $this->user()->markEmailAsVerified();

            event(new Verified($this->user()));
        }
    }
}

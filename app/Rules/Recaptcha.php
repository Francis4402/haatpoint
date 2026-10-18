<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Recaptcha implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Bypass in testing environment so automated tests run reliably without network calls
        if (app()->environment('testing')) {
            return;
        }

        $secretKey = config('services.recaptcha.secret_key');

        // If secret key is not configured, bypass verification
        if (empty($secretKey)) {
            return;
        }

        if (empty($value) || ! is_string($value)) {
            $fail('Please complete the reCAPTCHA verification.');
            return;
        }

        try {
            $response = Http::asForm()
                ->timeout(5)
                ->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $secretKey,
                    'response' => $value,
                    'remoteip' => request()->ip(),
                ]);

            if (! $response->successful() || ! $response->json('success')) {
                Log::warning('reCAPTCHA verification failed', [
                    'errors' => $response->json('error-codes'),
                    'ip' => request()->ip(),
                ]);

                $fail('reCAPTCHA verification failed. Please try again.');
            }
        } catch (\Throwable $e) {
            Log::error('reCAPTCHA connection error: ' . $e->getMessage());
            $fail('Unable to verify reCAPTCHA. Please try again.');
        }
    }
}

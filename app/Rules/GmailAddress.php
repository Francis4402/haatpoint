<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Restricts registration to Gmail addresses.
 *
 * Socialite sign-ups are never validated by a form, so a Google account on any
 * domain can still create a record. This rule only covers the typed forms.
 */
class GmailAddress implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! str_ends_with(strtolower($value), '@gmail.com')) {
            $fail('Please register with a Gmail address.');
        }
    }
}

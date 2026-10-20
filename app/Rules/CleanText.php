<?php

namespace App\Rules;

use App\Services\ProfanityFilterService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CleanText implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value) || ! is_string($value)) {
            return;
        }

        $filter = app(ProfanityFilterService::class);

        if ($filter->containsProfanity($value)) {
            $fail('The :attribute contains inappropriate or offensive language. Please keep content respectful.');
        }
    }
}

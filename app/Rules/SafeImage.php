<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SafeImage implements ValidationRule
{
    /**
     * Whether testing mode forces a moderation response (used in tests).
     */
    public static ?array $mockAnnotation = null;

    /**
     * Whether testing mode forces label annotations (used in tests).
     */
    public static ?array $mockLabels = null;

    /**
     * Banned visual labels (e.g. bikini, revealing swimwear, lingerie, sex toys, adult novelties).
     */
    protected array $bannedLabels = [
        'bikini',
        'swimsuit',
        'swimwear',
        'undergarment',
        'lingerie',
        'brassiere',
        'thong',
        'monokini',
        'sex toy',
        'sex toys',
        'dildo',
        'vibrator',
        'fleshlight',
        'butt plug',
        'anal plug',
        'anal beads',
        'chastity device',
        'chastity cage',
        'penis pump',
        'cock ring',
        'strap-on',
        'strapon',
        'sex doll',
        'blowup doll',
        'erotic toy',
        'adult toy',
        'bondage',
        'fetish',
    ];

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // 1. Check for mock annotation in test suite
        if (static::$mockAnnotation !== null || static::$mockLabels !== null) {
            if (static::$mockAnnotation !== null) {
                $this->evaluateSafeSearch(static::$mockAnnotation, $fail);
            }
            if (static::$mockLabels !== null) {
                $this->evaluateLabels(static::$mockLabels, $fail);
            }
            return;
        }

        // 2. Bypass network calls in testing environment
        if (app()->environment('testing')) {
            return;
        }

        // 3. Ensure we have a valid uploaded file or local path
        $filePath = null;
        if ($value instanceof UploadedFile) {
            if (! $value->isValid()) {
                return;
            }
            $filePath = $value->getRealPath();
        } elseif (is_string($value) && file_exists($value)) {
            $filePath = $value;
        }

        if (! $filePath || ! file_exists($filePath)) {
            return;
        }

        // 4. Retrieve Google Vision API Key
        $apiKey = config('services.google_vision.api_key');
        if (empty($apiKey)) {
            // Safe fallback: when not configured, log debug and allow upload
            Log::debug('Google Vision API key is not configured. SafeImage moderation bypassed.');
            return;
        }

        // 5. Send image bytes to Google Cloud Vision SafeSearch & Label detection endpoints
        try {
            $imageContent = file_get_contents($filePath);
            if ($imageContent === false) {
                return;
            }

            $response = Http::timeout(6)->post(
                "https://vision.googleapis.com/v1/images:annotate?key={$apiKey}",
                [
                    'requests' => [
                        [
                            'image' => [
                                'content' => base64_encode($imageContent),
                            ],
                            'features' => [
                                ['type' => 'SAFE_SEARCH_DETECTION'],
                                ['type' => 'LABEL_DETECTION', 'maxResults' => 10],
                            ],
                        ],
                    ],
                ]
            );

            if (! $response->successful()) {
                Log::warning('Google Vision API SafeSearch returned non-200 status: ' . $response->status(), [
                    'body' => $response->body(),
                ]);
                return; // Graceful fail-open on Google API issues
            }

            $safeSearch = $response->json('responses.0.safeSearchAnnotation');
            if (is_array($safeSearch)) {
                $this->evaluateSafeSearch($safeSearch, $fail);
            }

            $labels = $response->json('responses.0.labelAnnotations');
            if (is_array($labels)) {
                $this->evaluateLabels($labels, $fail);
            }
        } catch (\Throwable $e) {
            Log::error('Google Vision SafeSearch exception: ' . $e->getMessage());
            // Graceful fail-open so transient network issues don't crash the upload flow
        }
    }

    /**
     * Evaluate the SafeSearch annotation from Google Vision API.
     */
    protected function evaluateSafeSearch(array $safeSearch, Closure $fail): void
    {
        $adult = $safeSearch['adult'] ?? 'UNKNOWN';
        $violence = $safeSearch['violence'] ?? 'UNKNOWN';
        $racy = $safeSearch['racy'] ?? 'UNKNOWN';

        if (in_array($adult, ['POSSIBLE', 'LIKELY', 'VERY_LIKELY'], true)) {
            $fail('The uploaded image was flagged for explicit or adult content. Nude or sexually explicit photos are strictly forbidden.');
            return;
        }

        if (in_array($violence, ['LIKELY', 'VERY_LIKELY'], true)) {
            $fail('The uploaded image was flagged for violent or graphic content. Please upload family-friendly images.');
            return;
        }

        // Bikini, lingerie, sex toys, and revealing swimwear are categorized under "racy"
        if (in_array($racy, ['LIKELY', 'VERY_LIKELY'], true)) {
            $fail('The uploaded image was flagged for bikini, revealing, or adult suggestive content. Please upload family-friendly images.');
            return;
        }
    }

    /**
     * Evaluate the Label annotations to catch bikini, swimwear, and sex toys specifically.
     */
    protected function evaluateLabels(array $labels, Closure $fail): void
    {
        foreach ($labels as $label) {
            $description = strtolower($label['description'] ?? '');
            $score = (float) ($label['score'] ?? 0);

            // If confidence score is 50% or higher and matches a banned visual term
            if ($score >= 0.50) {
                foreach ($this->bannedLabels as $banned) {
                    if (str_contains($description, $banned)) {
                        $fail('The uploaded image contains prohibited adult novelties, sex toys, bikini, or revealing content. Please upload family-friendly photos.');
                        return;
                    }
                }
            }
        }
    }
}

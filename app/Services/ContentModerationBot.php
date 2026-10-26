<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class ContentModerationBot
{
    /**
     * Prohibited adult, sexual, hentai, and explicit keywords (English & Romanized/Bangla).
     */
    protected static array $prohibitedKeywords = [
        // Adult / Sex Toys / Explicit
        'porn', 'porno', 'xxx', 'hentai', 'ecchi', 'erotic', 'erotica', 'nude', 'nudity', 'naked',
        'dildo', 'vibrator', 'sex toy', 'sex toys', 'sextoy', 'sextoys', 'butt plug', 'buttplug',
        'fleshlight', 'masturbat', 'masturbation', 'penis', 'vagina', 'boobs', 'pussy', 'dick',
        'blowjob', 'bdsm', 'bondage', 'fetish', 'escort', 'brothel', 'orgasm', 'ejaculat', 'condom',
        'adult only', '18+', 'r18', 'r-18', 'nsfw', 'hardcore', 'softcore', 'uncensored sex',

        // Hentai / Anime explicit
        'ahegao', 'doujin', 'doujinshi', 'eroge', 'rule34', 'rule 34', 'hentai manga', 'hentai video',

        // Bengali / Romanized Bengali adult words & profanity
        'chuda', 'choda', 'chodachodi', 'magi', 'maagi', 'khanki', 'khankir', 'khankir chele',
        'gandoo', 'gandu', 'bessha', 'besha', 'chudir', 'chudir bhai', 'chudur',
        'lingo', 'linga', 'juni', 'joni', 'dudu', 'chuchi', 'gud', 'bara', 'chod', 'chud',
        'চুদা', 'চোদা', 'মাগী', 'খানকি', 'খানকির ছেলে', 'বেশ্যা', 'লুচ্চা', 'গাঞ্জা', 'যোনি', 'লিঙ্গ', 'দুধু'
    ];

    /**
     * Moderates product content: checks text fields and image files.
     *
     * @param array $textData Key-value pairs of product text (name, description, category, brand, etc.)
     * @param array $images Array of UploadedFile instances or local storage file paths
     * @return array ['is_flagged' => bool, 'reason' => string|null]
     */
    public static function checkProduct(array $textData, array $images = []): array
    {
        // 1. Check text content
        $textViolation = self::checkText($textData);
        if ($textViolation !== null) {
            return [
                'is_flagged' => true,
                'reason' => "Flagged by Auto-Mod Bot: {$textViolation}",
            ];
        }

        // 2. Check images
        foreach ($images as $index => $image) {
            $imageViolation = self::checkImage($image);
            if ($imageViolation !== null) {
                return [
                    'is_flagged' => true,
                    'reason' => "Flagged by Auto-Mod Bot (Image #" . ($index + 1) . "): {$imageViolation}",
                ];
            }
        }

        return [
            'is_flagged' => false,
            'reason' => null,
        ];
    }

    /**
     * Checks text fields for prohibited adult or bad language terms.
     */
    public static function checkText(array $textData): ?string
    {
        $fieldsToCheck = [
            'name' => 'title',
            'description' => 'description',
            'category' => 'category',
            'subcategory' => 'subcategory',
            'brand' => 'brand',
        ];

        foreach ($fieldsToCheck as $key => $label) {
            if (empty($textData[$key])) {
                continue;
            }

            $rawText = (string) $textData[$key];
            // Normalize leet-speak and special punctuation: e.g. p.o.r.n, s*x, h_e_n_t_a_i
            $normalized = self::normalizeText($rawText);

            foreach (self::$prohibitedKeywords as $keyword) {
                // Word boundary check or substring match for distinct keywords
                $pattern = '/\b' . preg_quote($keyword, '/') . '\b/iu';

                if (preg_match($pattern, $rawText) || preg_match($pattern, $normalized)) {
                    return "Prohibited adult/explicit keyword '{$keyword}' detected in product {$label}.";
                }

                // For multi-word terms like "sex toy", "butt plug", "rule 34", check direct contains
                if (str_contains($keyword, ' ')) {
                    if (stripos($rawText, $keyword) !== false || stripos($normalized, $keyword) !== false) {
                        return "Prohibited adult/explicit term '{$keyword}' detected in product {$label}.";
                    }
                }
            }
        }

        return null;
    }

    /**
     * Checks an image for suspicious file names and high skin-tone / explicit nudity ratio.
     *
     * @param UploadedFile|string $image UploadedFile instance or file path string
     */
    public static function checkImage($image): ?string
    {
        $filename = '';
        $realPath = '';

        if ($image instanceof UploadedFile) {
            $filename = $image->getClientOriginalName();
            $realPath = $image->getRealPath();
        } elseif (is_string($image)) {
            $filename = basename($image);
            $realPath = file_exists($image) ? $image : public_path('storage/' . $image);
        }

        if (empty($realPath) || !file_exists($realPath)) {
            return null;
        }

        // 1. Filename check
        $normalizedFilename = strtolower($filename);
        foreach (['porn', 'hentai', 'nude', 'xxx', 'sexdoll', 'dildo', 'erotic', 'vibrator', 'ahegao'] as $badWord) {
            if (str_contains($normalizedFilename, $badWord)) {
                return "Suspicious adult filename pattern '{$badWord}' found in image '{$filename}'.";
            }
        }

        // 2. Skin-tone pixel density analysis (Nudity heuristic via GD)
        if (!function_exists('imagecreatefromstring')) {
            return null;
        }

        try {
            $imageData = @file_get_contents($realPath);
            if ($imageData === false) {
                return null;
            }

            $img = @imagecreatefromstring($imageData);
            if (!$img) {
                return null;
            }

            // Downsample to 80x80 for fast calculation (< 5ms)
            $sampleWidth = 80;
            $sampleHeight = 80;
            $thumb = imagecreatetruecolor($sampleWidth, $sampleHeight);
            imagecopyresampled($thumb, $img, 0, 0, 0, 0, $sampleWidth, $sampleHeight, imagesx($img), imagesy($img));
            imagedestroy($img);

            $totalPixels = $sampleWidth * $sampleHeight;
            $skinPixels = 0;

            for ($x = 0; $x < $sampleWidth; $x++) {
                for ($y = 0; $y < $sampleHeight; $y++) {
                    $rgb = imagecolorat($thumb, $x, $y);
                    $r = ($rgb >> 16) & 0xFF;
                    $g = ($rgb >> 8) & 0xFF;
                    $b = $rgb & 0xFF;

                    if (self::isSkinPixel($r, $g, $b)) {
                        $skinPixels++;
                    }
                }
            }

            imagedestroy($thumb);

            $skinRatio = ($skinPixels / $totalPixels) * 100;

            // If contiguous skin area is over 42%, flag as potential explicit nudity or adult image
            if ($skinRatio > 42.0) {
                $percentage = round($skinRatio, 1);
                return "Potential explicit nudity or excessive exposed flesh detected (skin-tone pixel ratio: {$percentage}%).";
            }
        } catch (\Throwable $e) {
            // Log or ignore image parsing failure
        }

        return null;
    }

    /**
     * Determines if an RGB color falls within typical human skin-tone color space
     * using standard RGB and YCbCr thresholds.
     */
    protected static function isSkinPixel(int $r, int $g, int $b): bool
    {
        // 1. RGB heuristic threshold
        $rgbCheck = ($r > 95) && ($g > 40) && ($b > 20) &&
            ((max($r, $g, $b) - min($r, $g, $b)) > 15) &&
            (abs($r - $g) > 15) &&
            ($r > $g) && ($r > $b);

        if (!$rgbCheck) {
            return false;
        }

        // 2. YCbCr transformation check
        // Cb = 128 - 0.168736*R - 0.331264*G + 0.5*B
        // Cr = 128 + 0.5*R - 0.418688*G - 0.081312*B
        $cb = 128 - (0.168736 * $r) - (0.331264 * $g) + (0.5 * $b);
        $cr = 128 + (0.5 * $r) - (0.418688 * $g) - (0.081312 * $b);

        return ($cb >= 77 && $cb <= 127 && $cr >= 133 && $cr <= 173);
    }

    /**
     * Normalizes text by removing leet-speak substitutions and stripping extra symbols.
     */
    protected static function normalizeText(string $text): string
    {
        // Strip HTML tags if present (e.g. from rich text editor)
        $clean = strip_tags($text);

        // Replace common leet characters
        $replacements = [
            '@' => 'a',
            '0' => 'o',
            '1' => 'i',
            '!' => 'i',
            '3' => 'e',
            '$' => 's',
            '5' => 's',
            '+' => 't',
        ];
        $clean = strtr($clean, $replacements);

        // Remove interspersed punctuation like h-e-n-t-a-i or p.o.r.n
        $words = preg_split('/\s+/', $clean);
        $normalizedWords = [];
        foreach ($words as $word) {
            $collapsed = preg_replace('/[._\-*#]/', '', $word);
            $normalizedWords[] = $collapsed;
        }

        return implode(' ', $normalizedWords);
    }
}

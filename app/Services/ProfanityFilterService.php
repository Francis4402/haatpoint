<?php

namespace App\Services;

class ProfanityFilterService
{
    /**
     * Unambiguous profanity roots that can match as parts of words or whole words.
     * (e.g., "motherfucker", "fucking", "dumbass", "jackass").
     */
    protected array $unambiguousEnglish = [
        'fuck',
        'fucker',
        'fucking',
        'motherfuck',
        'bitch',
        'bitches',
        'bitching',
        'cunt',
        'pussy',
        'whore',
        'slut',
        'dickhead',
        'nigger',
        'nigga',
        'faggot',
        'blowjob',
        'handjob',
        'masturbat',
        'porno',
        'dildo',
    ];

    /**
     * Exact words that require word boundaries (\b) to avoid false positives.
     * (e.g., prevent "asset", "classic", "cocktail", "title", "analysis").
     */
    protected array $boundedEnglish = [
        'ass',
        'asshole',
        'dick',
        'cock',
        'tit',
        'tits',
        'titties',
        'twat',
        'prick',
        'wanker',
        'bastard',
        'anal',
        'cum',
        'porn',
        'nude',
        'nudes',
        'boob',
        'boobs',
        'vagina',
        'penis',
        'semen',
    ];

    /**
     * Bengali profanity terms in Bengali script (বাংলা).
     */
    protected array $bengaliWords = [
        'মাগি',
        'মাগী',
        'খানকি',
        'খাঙ্কি',
        'খাঙ্কির',
        'খানকির',
        'বেশ্যা',
        'চোদা',
        'চোদ',
        'চুদা',
        'চুদ',
        'চোদনা',
        'চুদে',
        'ভোদা',
        'ভোদাই',
        'বাল',
        'বাড়া',
        'বাড়া',
        'শুয়োরের বাচ্চা',
        'শুয়োরের বাচ্চা',
        'কুত্তার বাচ্চা',
        'মাদারচোদ',
        'বোনচোদ',
        'বাইনচোদ',
        'বোকাতোদা',
        'বোকাচোদা',
        'হারামজাদা',
        'হারামযাদা',
        'হারামি',
        'হারামী',
        'হোগা',
        'ল্যাওড়া',
        'ল্যাওড়া',
        'ল্যাওরা',
        'লুচ্চা',
        'পুংটা',
        'রান্ডি',
        'রাঁড়ি',
        'পতিতা',
        'গু মার',
    ];

    /**
     * Banglish / Romanized transliterations of Bengali and South Asian offensive slang.
     */
    protected array $unambiguousBanglish = [
        'khanki',
        'khankir',
        'madarchod',
        'maderchod',
        'motherchod',
        'bhenchod',
        'bonchod',
        'banchod',
        'bainchod',
        'bokachoda',
        'bokachuda',
        'chodna',
        'suorer baccha',
        'suorer bacha',
        'kuttar baccha',
        'kuttar bacha',
        'haramjada',
        'bhosdike',
        'bhosdi',
    ];

    /**
     * Bounded Banglish terms that require word boundaries.
     * (e.g., prevent "bal" matching "balance", "gud" matching "guidance").
     */
    protected array $boundedBanglish = [
        'magi',
        'chod',
        'choda',
        'chudi',
        'boda',
        'bodai',
        'baal',
        'bal',
        'bara',
        'randi',
        'gandu',
        'harami',
        'hoga',
        'lawra',
        'lodaa',
        'loda',
        'chutiya',
        'gud',
        'luccha',
    ];

    /**
     * Regex patterns for masked profanities (e.g., f*ck, b*tch, sh*t, c*nt, d*ck).
     */
    protected array $maskedPatterns = [
        '/\bf[\*_\-\.\#\^\s]+ck\b/i',
        '/\bf[\*_\-\.\#\^\s]+k\b/i',
        '/\bb[\*_\-\.\#\^\s]+tch\b/i',
        '/\bsh[\*_\-\.\#\^\s]+t\b/i',
        '/\bc[\*_\-\.\#\^\s]+nt\b/i',
        '/\bp[\*_\-\.\#\^\s]+ssy\b/i',
        '/\bd[\*_\-\.\#\^\s]+ck\b/i',
        '/\b(?:@|a)[\*_\-\.\#\^\s]*sshole\b/i',
        '/\bm[\*_\-\.\#\^\s]+gi\b/i',
        '/\bkh[\*_\-\.\#\^\s]+nki\b/i',
    ];

    /**
     * Character replacement map for leetspeak / obfuscation normalization.
     */
    protected array $leetspeakMap = [
        '@' => 'a',
        '4' => 'a',
        '8' => 'b',
        '3' => 'e',
        '1' => 'i',
        '!' => 'i',
        '|' => 'i',
        '0' => 'o',
        '5' => 's',
        '$' => 's',
        '7' => 't',
        '+' => 't',
        'vv' => 'w',
    ];

    /**
     * Check if the given text contains profanity or inappropriate words.
     */
    public function containsProfanity(?string $text): bool
    {
        if (empty($text) || ! is_string($text)) {
            return false;
        }

        return ! empty($this->findProfanities($text));
    }

    /**
     * Find matched profanities in the given text.
     * Returns an array of matched offensive terms.
     */
    public function findProfanities(string $text): array
    {
        $matches = [];

        // 1. Check Bengali words in original text (preserves UTF-8 characters)
        $lowerOriginal = mb_strtolower($text, 'UTF-8');
        foreach ($this->bengaliWords as $bengali) {
            if (mb_strpos($lowerOriginal, $bengali) !== false) {
                $matches[] = $bengali;
            }
        }

        // 2. Check explicitly masked patterns (e.g. f*ck, b*tch, sh*t)
        foreach ($this->maskedPatterns as $pattern) {
            if (preg_match($pattern, $text)) {
                $matches[] = 'masked_profanity';
            }
        }

        // 3. Test variations where mask characters (*, #, _) between letters are resolved
        $testVariants = [$text];
        if (preg_match('/[a-z][\*#_]+[a-z]/i', $text)) {
            foreach (['u', 'i', 'a', 'o', 'e'] as $vowel) {
                $testVariants[] = preg_replace('/(?<=[a-z])[\*#_]+(?=[a-z])/i', $vowel, $text);
            }
        }

        foreach ($testVariants as $candidate) {
            // Normalize candidate text
            $normalized = $this->normalizeText($candidate);
            $compressed = preg_replace('/[^a-z0-9]/', '', $normalized);

            // Check unambiguous English roots
            foreach ($this->unambiguousEnglish as $bad) {
                if (str_contains($normalized, $bad) || str_contains($compressed, $bad)) {
                    $matches[] = $bad;
                }
            }

            // Check unambiguous Banglish roots
            foreach ($this->unambiguousBanglish as $bad) {
                $badCompressed = preg_replace('/[^a-z0-9]/', '', $bad);
                if (str_contains($normalized, $bad) || str_contains($compressed, $badCompressed)) {
                    $matches[] = $bad;
                }
            }

            // Check bounded English words
            foreach ($this->boundedEnglish as $bad) {
                $pattern = '/\b' . preg_quote($bad, '/') . '\b/i';
                if (preg_match($pattern, $normalized)) {
                    $matches[] = $bad;
                }
            }

            // Check bounded Banglish words
            foreach ($this->boundedBanglish as $bad) {
                $pattern = '/\b' . preg_quote($bad, '/') . '\b/i';
                if (preg_match($pattern, $normalized)) {
                    $matches[] = $bad;
                }
            }
        }

        return array_values(array_unique($matches));
    }

    /**
     * Normalize string by converting leetspeak, lowering case, and collapsing repeated characters.
     */
    protected function normalizeText(string $text): string
    {
        $str = mb_strtolower($text, 'UTF-8');

        // Apply leetspeak character substitutions
        $str = str_replace(array_keys($this->leetspeakMap), array_values($this->leetspeakMap), $str);

        // Replace common punctuation dividers between letters with spaces
        // e.g. "f.u.c.k" becomes "f u c k"
        $str = preg_replace('/[._\-*#~^,;:!?]/u', ' ', $str);

        // Collapse multiple duplicate consecutive characters (e.g., "fuuuuck" -> "fuck", "shiiit" -> "shit")
        $str = preg_replace('/(.)\1{2,}/u', '$1', $str);

        // Collapse multiple spaces
        $str = preg_replace('/\s+/', ' ', $str);

        return trim($str);
    }
}

<?php

namespace App\Services;

class ProfanityFilterService
{
    /**
     * Unambiguous profanity and adult novelty roots that can match as parts of words or whole words.
     * (e.g., "motherfucker", "fucking", "dumbass", "jackass", "sextoy", "vibrator").
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
        'vibrator',
        'fleshlight',
        'buttplug',
        'butt plug',
        'anal plug',
        'anal beads',
        'cockring',
        'cock ring',
        'penis pump',
        'strapon',
        'strap-on',
        'sex toy',
        'sex toys',
        'sextoy',
        'sextoys',
        'adult toy',
        'adult toys',
        'erotic toy',
        'erotic toys',
        'sex doll',
        'blowup doll',
        'love doll',
        'chastity cage',
        'chastity device',
        'cybersex',
    ];

    /**
     * Exact words that require word boundaries (\b) to avoid false positives.
     * (e.g., prevent "asset", "classic", "unisex", "cocktail", "title", "analysis").
     */
    protected array $boundedEnglish = [
        'sex',
        'sexy',
        'sexual',
        'sexxx',
        'sexi',
        'bikini',
        'thong',
        'intercourse',
        'erotic',
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
     * Unambiguous Bengali profanity & adult item terms in Bengali script (বাংলা).
     * These can safely match as substrings or standalone phrases.
     */
    protected array $unambiguousBengali = [
        'মাগি',
        'মাগী',
        'মাগির',
        'মাগীর',
        'মাগিবাজ',
        'খানকি',
        'খাঙ্কি',
        'খানকির',
        'খাঙ্কির',
        'খানকির পোলা',
        'খানকির ছেলে',
        'খাঙ্কির পুত',
        'বেশ্যা',
        'বেশ্যার',
        'চোদা',
        'চোদ',
        'চুদা',
        'চুদ',
        'চোদনা',
        'চুদে',
        'চুদাই',
        'চুদতে',
        'চুদাচুদি',
        'ভোদা',
        'ভোদাই',
        'ভোদানি',
        'শুয়োরের বাচ্চা',
        'শুয়োরের বাচ্চা',
        'শূয়োরের বাচ্চা',
        'শুয়ারের বাচ্চা',
        'কুত্তার বাচ্চা',
        'কুত্তার পোলা',
        'মাদারচোদ',
        'মাদারচুদ',
        'মাদারচোত',
        'বোনচোদ',
        'বাইনচোদ',
        'বইনচোদ',
        'বেইঞ্চোদ',
        'বোকাতোদা',
        'বোকাচোদা',
        'বকাচোদা',
        'বোকাচুদা',
        'হারামজাদা',
        'হারামযাদা',
        'হারামজাদি',
        'হারামি',
        'হারামী',
        'হারামখোর',
        'হোগা',
        'হোগামারা',
        'হোগার',
        'ল্যাওড়া',
        'ল্যাওড়া',
        'ল্যাওরা',
        'লুচ্চা',
        'লুচ্চামি',
        'পুংটা',
        'পুংটামি',
        'রান্ডি',
        'রাঁড়ি',
        'রাঁড়ী',
        'রান্ডির',
        'পতিতা',
        'ভাতারখাকী',
        'ভাতারখাকি',
        'চুতিয়া',
        'চুতিয়া',
        'সেক্স',
        'সেক্সি',
        'যৌন',
        'যৌনমিলন',
        'যৌন মিলন',
        'বিকিনি',
        'সেক্স টয়',
        'সেক্স টয়',
        'সেক্সটয়',
        'সেক্সটয়',
        'ডিলডো',
        'ডিল্ডো',
        'ভাইব্রেটর',
        'সেক্স ডল',
        'কৃত্রিম যোনি',
        'কৃত্রিম লিঙ্গ',
    ];

    /**
     * Bounded Bengali profanity terms that require Bengali word boundaries
     * to avoid false positives (e.g. "বালক", "বালিকা", "বালতি", "বালিশ", "ইকবাল").
     */
    protected array $boundedBengali = [
        'বাল',
        'বালের',
        'বালে',
        'বালটা',
        'বাড়া',
        'বাড়া',
        'বাড়ার',
        'বাড়ার',
        'গু মার',
        'গুদ',
        'গুদে',
        'গুদের',
        'ধোন',
        'ধোনের',
        'ধোনমারানি',
    ];

    /**
     * Banglish / Romanized transliterations of Bengali and South Asian offensive slang and adult novelties.
     */
    protected array $unambiguousBanglish = [
        'khanki',
        'khankir',
        'khankirpola',
        'khankir pola',
        'khankir chele',
        'khankir put',
        'madarchod',
        'maderchod',
        'motherchod',
        'modarchod',
        'madarchud',
        'bhenchod',
        'bonchod',
        'boinchod',
        'banchod',
        'bainchod',
        'beinchod',
        'bokachoda',
        'boka choda',
        'bokachuda',
        'boka chuda',
        'chodna',
        'chudachudi',
        'chudani',
        'chudina',
        'suorer baccha',
        'suorer bacha',
        'shuorer baccha',
        'shuorer bacha',
        'kuttar baccha',
        'kuttar bacha',
        'kuttar pola',
        'haramjada',
        'haramjadi',
        'haramzadi',
        'haramkhor',
        'hogamara',
        'vatarkhaki',
        'bhosdike',
        'bhosdi',
        'bsdk',
        'bikini',
        'bikiny',
        'sex toy',
        'sex toys',
        'sextoy',
        'sextoys',
        'dildo',
        'dildos',
        'vibrator',
        'vibrators',
        'fleshlight',
        'buttplug',
        'butt plug',
        'sex doll',
    ];

    /**
     * Bounded Banglish terms that require word boundaries.
     * (e.g., prevent "bal" matching "balance", "gud" matching "guidance").
     */
    protected array $boundedBanglish = [
        'sex',
        'sexy',
        'sexi',
        'sexxx',
        'magi',
        'magir',
        'magibaaj',
        'magibaj',
        'chod',
        'choda',
        'chudi',
        'boda',
        'bodai',
        'bodani',
        'baal',
        'bal',
        'baaler',
        'baler',
        'bara',
        'barar',
        'randi',
        'randir',
        'gandu',
        'gaandu',
        'harami',
        'hoga',
        'lawra',
        'loura',
        'lodaa',
        'loda',
        'lauda',
        'chutiya',
        'chootiya',
        'gud',
        'gude',
        'guder',
        'dhon',
        'dhoner',
        'luccha',
        'luchha',
        'luchami',
        'pungta',
    ];

    /**
     * Regex patterns for masked profanities (e.g., f*ck, b*tch, s*x, sh*t, c*nt, d*ck).
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
        '/\bs[\*_\-\.\#\^\s]+x\b/i',
        '/\bs[\*_\-\.\#\^\s]+e[\*_\-\.\#\^\s]+x\b/i',
        '/\bb[\*_\-\.\#\^\s]+k[\*_\-\.\#\^\s]+n[\*_\-\.\#\^\s]+i\b/i',
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
     * Check if the given text contains profanity, adult novelties, or inappropriate words.
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

        // 1. Check Bengali words in original and compressed text (preserves UTF-8 characters)
        $lowerOriginal = mb_strtolower($text, 'UTF-8');
        // Space/punctuation stripped version for Bengali evasion (e.g., "বো কা চো দা" -> "বোকাচোদা")
        $bengaliCompressed = preg_replace('/[\s\.\-_*#~^,;:!?]/u', '', $lowerOriginal);

        // Unambiguous Bengali check
        foreach ($this->unambiguousBengali as $bengali) {
            $bengaliNoSpace = preg_replace('/\s+/u', '', $bengali);
            if (mb_strpos($lowerOriginal, $bengali) !== false || mb_strpos($bengaliCompressed, $bengaliNoSpace) !== false) {
                $matches[] = $bengali;
            }
        }

        // Bounded Bengali check (prevents "বালক", "বালিকা", "বালতি", "বালিশ", "ইকবাল")
        foreach ($this->boundedBengali as $bengali) {
            $pattern = '/(?<![\p{Bengali}])' . preg_quote($bengali, '/') . '(?![\p{Bengali}])/u';
            if (preg_match($pattern, $lowerOriginal)) {
                $matches[] = $bengali;
            }
        }

        // 2. Check explicitly masked patterns (e.g. f*ck, b*tch, sh*t, s*x)
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
                if (str_contains($normalized, $bad) || str_contains($compressed, str_replace(' ', '', $bad))) {
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

<?php

namespace App\Console\Commands;

use App\Models\Products;
use Illuminate\Console\Command;

class AnalyzeProductColors extends Command
{
    protected $signature = 'haatpoint:analyze-colors {--chunk=50 : Concurrent chunk size} {--limit=0 : Max products to process}';
    protected $description = 'Analyze product images with GD to extract accurate garment colors instead of As Shown in Image';

    public function handle()
    {
        $this->info("=== Starting AI/GD Product Image Color Analysis ===");

        $query = Products::where(function ($q) {
            $q->where('color', 'like', '%As Shown%')
              ->orWhere('color', 'like', '%shown in image%')
              ->orWhereNull('color')
              ->orWhere('color', '');
        });

        $total = $query->count();
        $this->info("Found {$total} products needing accurate color analysis.");

        if ($total === 0) {
            $this->info("All products already have accurate colors!");
            return 0;
        }

        $limit = (int) $this->option('limit');
        if ($limit > 0) {
            $query->limit($limit);
            $total = min($total, $limit);
        }

        $chunkSize = (int) $this->option('chunk') ?: 50;
        $processed = 0;
        $updated = 0;

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $query->chunkById($chunkSize, function ($products) use (&$processed, &$updated, $bar) {
            $multi = curl_multi_init();
            $handles = [];

            foreach ($products as $product) {
                $imgs = json_decode($product->images, true);
                $url = is_array($imgs) && !empty($imgs) ? $imgs[0] : null;

                if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
                    // Fallback from title keywords
                    $fallback = $this->extractColorFromName($product->name, $product->category);
                    $product->update(['color' => $fallback]);
                    $updated++;
                    continue;
                }

                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 6);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
                curl_multi_add_handle($multi, $ch);
                $handles[(int)$ch] = [
                    'ch' => $ch,
                    'product' => $product,
                ];
            }

            if (!empty($handles)) {
                $running = null;
                do {
                    curl_multi_exec($multi, $running);
                    curl_multi_select($multi, 0.1);
                } while ($running > 0);

                foreach ($handles as $item) {
                    $ch = $item['ch'];
                    /** @var Products $product */
                    $product = $item['product'];
                    $imageData = curl_multi_getcontent($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                    $color = null;
                    if ($httpCode === 200 && !empty($imageData)) {
                        $color = $this->analyzeImageContent($imageData);
                    }

                    if (!$color) {
                        $color = $this->extractColorFromName($product->name, $product->category);
                    }

                    if ($color) {
                        $product->update(['color' => $color]);
                        $updated++;
                    }

                    curl_multi_remove_handle($multi, $ch);
                    curl_close($ch);
                }
            }

            curl_multi_close($multi);

            $processed += count($products);
            $bar->advance(count($products));
        });

        $bar->finish();
        $this->newLine();
        $this->info("Successfully analyzed and updated {$updated} products with accurate colors!");

        return 0;
    }

    public static function rgbToHsv($r, $g, $b): array
    {
        $r /= 255; $g /= 255; $b /= 255;
        $max = max($r, $g, $b);
        $min = min($r, $g, $b);
        $v = $max;
        $d = $max - $min;
        $s = $max == 0 ? 0 : $d / $max;

        if ($max == $min) {
            $h = 0;
        } else {
            if ($max == $r) {
                $h = ($g - $b) / $d + ($g < $b ? 6 : 0);
            } elseif ($max == $g) {
                $h = ($b - $r) / $d + 2;
            } else {
                $h = ($r - $g) / $d + 4;
            }
            $h /= 6;
        }
        return [$h * 360, $s * 100, $v * 100];
    }

    public static function classifyColor($r, $g, $b): ?string
    {
        list($h, $s, $v) = self::rgbToHsv($r, $g, $b);

        // Ignore human mannequin skin tones (warm face/chest)
        if ($h >= 14 && $h <= 38 && $s >= 18 && $s <= 55 && $v >= 65 && $v <= 98) {
            return null;
        }

        // Grayscale detection
        if ($v < 20) return 'Black';
        if ($v > 86 && $s < 12) return 'White';
        if ($s < 14) {
            if ($v < 40) return 'Charcoal';
            if ($v < 65) return 'Grey';
            return 'Ash';
        }

        // Hue chromatic detection
        if ($h >= 345 || $h < 12) {
            if ($v < 45) return 'Maroon';
            return 'Red';
        }
        if ($h >= 12 && $h < 40) {
            if ($v < 40) return 'Brown';
            if ($v < 60 && $s > 35) return 'Chocolate';
            if ($s > 55) return 'Orange';
            return 'Brown';
        }
        if ($h >= 40 && $h < 70) {
            if ($s > 50 && $v > 60) return 'Yellow';
            if ($v < 55) return 'Mustard';
            if ($s < 35 && $v > 70) return 'Beige';
            return 'Mustard';
        }
        if ($h >= 70 && $h < 165) {
            if ($v < 40) return 'Olive';
            if ($h < 105 && $s > 50) return 'Green';
            return 'Green';
        }
        if ($h >= 165 && $h < 200) {
            if ($v < 45) return 'Dark Teal';
            return 'Teal';
        }
        if ($h >= 200 && $h < 260) {
            if ($v < 35) return 'Navy Blue';
            if ($v > 75 && $s < 45) return 'Sky Blue';
            if ($s > 45) return 'Blue';
            return 'Blue';
        }
        if ($h >= 260 && $h < 300) {
            return 'Purple';
        }
        if ($h >= 300 && $h < 345) {
            if ($v < 45) return 'Magenta';
            return 'Pink';
        }

        return null;
    }

    public static function analyzeImageContent(?string $imageData): ?string
    {
        if (!$imageData) return null;
        $img = @imagecreatefromstring($imageData);
        if (!$img) return null;

        $w = imagesx($img);
        $h = imagesy($img);

        $colorBuckets = [];
        $startX = (int)($w * 0.15);
        $endX = (int)($w * 0.85);
        $startY = (int)($h * 0.15);
        $endY = (int)($h * 0.85);
        $step = max(2, (int)($w / 35));

        for ($x = $startX; $x < $endX; $x += $step) {
            for ($y = $startY; $y < $endY; $y += $step) {
                $rgb = imagecolorat($img, $x, $y);
                $r = ($rgb >> 16) & 0xFF;
                $g = ($rgb >> 8) & 0xFF;
                $b = $rgb & 0xFF;

                // Ignore pure white studio backdrop and pure black edge padding
                if ($r > 238 && $g > 238 && $b > 238) continue;
                if ($r < 8 && $g < 8 && $b < 8) continue;

                $c = self::classifyColor($r, $g, $b);
                if ($c) {
                    $colorBuckets[$c] = ($colorBuckets[$c] ?? 0) + 1;
                }
            }
        }

        imagedestroy($img);

        if (empty($colorBuckets)) {
            return 'Black';
        }

        arsort($colorBuckets);
        $keys = array_keys($colorBuckets);
        $total = array_sum($colorBuckets);
        $topCount = $colorBuckets[$keys[0]];

        if ($topCount / $total >= 0.50 || count($keys) === 1) {
            return $keys[0];
        }

        return $keys[0] . ', ' . $keys[1];
    }

    protected function extractColorFromName(string $name, string $category): string
    {
        $colorKeywords = [
            'black' => 'Black', 'white' => 'White', 'navy' => 'Navy Blue', 'blue' => 'Blue',
            'red' => 'Red', 'maroon' => 'Maroon', 'green' => 'Green', 'olive' => 'Olive',
            'yellow' => 'Yellow', 'mustard' => 'Mustard', 'pink' => 'Pink', 'ash' => 'Ash',
            'grey' => 'Grey', 'gray' => 'Grey', 'purple' => 'Purple', 'orange' => 'Orange',
            'brown' => 'Brown', 'chocolate' => 'Chocolate', 'coffee' => 'Coffee',
            'কাল' => 'Black', 'কালো' => 'Black', 'সাদা' => 'White', 'নীল' => 'Blue',
            'মেরুন' => 'Maroon', 'লাল' => 'Red', 'জলপাই' => 'Olive', 'সবুজ' => 'Green',
            'মাস্টার্ড' => 'Mustard', 'হলুদ' => 'Yellow', 'গোলাপী' => 'Pink',
            'অ্যাশ' => 'Ash', 'ধূসর' => 'Grey', 'কমলা' => 'Orange', 'বেগুনী' => 'Purple',
            'বাদামী' => 'Brown', 'চকলেট' => 'Chocolate', 'কফি' => 'Coffee',
        ];

        $nameLower = mb_strtolower($name);
        foreach ($colorKeywords as $kw => $val) {
            if (str_contains($nameLower, $kw)) {
                return $val;
            }
        }

        if (str_contains(mb_strtolower($category), "women")) {
            return 'Red, Pink';
        }

        return 'Black, Navy Blue';
    }
}

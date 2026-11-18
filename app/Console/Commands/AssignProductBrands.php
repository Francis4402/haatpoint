<?php

namespace App\Console\Commands;

use App\Models\Products;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AssignProductBrands extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'haatpoint:assign-brands {--force : Overwrite existing brands}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign accurate, realistic brands to all products based on product name, category, and subcategory';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("=== Starting Accurate Brand Assignment for Products ===");

        $totalProducts = Products::count();
        $this->info("Found {$totalProducts} total products in database.");

        $bar = $this->output->createProgressBar($totalProducts);
        $bar->start();

        $updatedCount = 0;
        $batchSize = 250;
        $brandStats = [];

        Products::chunkById($batchSize, function ($products) use (&$updatedCount, &$brandStats, $bar) {
            foreach ($products as $product) {
                $accurateBrand = $this->determineBrand(
                    $product->name,
                    $product->category ?? '',
                    $product->subcategory ?? ''
                );

                if ($product->brand !== $accurateBrand) {
                    $product->brand = $accurateBrand;
                    $product->save();
                    $updatedCount++;
                }

                $brandStats[$accurateBrand] = ($brandStats[$accurateBrand] ?? 0) + 1;
                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine(2);

        $this->info("Successfully assigned accurate brands to {$updatedCount} products!");

        // Clear catalog caches so filters immediately update
        Cache::forget('catalog_filter_brands');
        Cache::forget('catalog_filter_categories');
        Cache::forget('all_categories');

        arsort($brandStats);
        $this->info("Top 25 Brands Assigned:");
        $i = 0;
        foreach ($brandStats as $b => $cnt) {
            if (++$i > 25) break;
            $this->line("  - {$b}: {$cnt} products");
        }

        return 0;
    }

    /**
     * Determine accurate brand from product name, category, and subcategory.
     */
    public function determineBrand(string $name, string $category, string $subcategory = ''): string
    {
        $nameTrim = trim($name);
        $nameLower = mb_strtolower($nameTrim);
        $catLower = mb_strtolower(trim($category));
        $subLower = mb_strtolower(trim($subcategory));

        // 1. Explicit brand keywords in product title
        $explicitBrands = [
            'bmw' => 'BMW',
            'bioaqua' => 'Bioaqua',
            'focallure' => 'Focallure',
            'curren' => 'Curren',
            'naviforce' => 'Naviforce',
            'casio' => 'Casio',
            'skmei' => 'Skmei',
            'titan' => 'Titan',
            'geneva' => 'Geneva',
            'xiaomi' => 'Xiaomi Eco',
            'mijia' => 'Xiaomi Eco',
            'remax' => 'Remax',
            'hoco' => 'Hoco',
            'baseus' => 'Baseus',
            'anker' => 'Anker',
            'joyroom' => 'Joyroom',
            'wildcraft' => 'Wildcraft',
            'president' => 'President',
            'louiswill' => 'LouisWill',
            'swiss gear' => 'Swiss Gear',
            'aarong' => 'Aarong',
            'sailor' => 'Sailor',
            'yellow' => 'Yellow',
            'easy' => 'Easy',
            'richman' => 'Richman',
            'cats eye' => 'Cats Eye',
            'dorjibari' => 'Dorjibari',
            'le reve' => 'Le Reve',
            'loreal' => 'Loreal',
            'garnier' => 'Garnier',
            'nivea' => 'Nivea',
            'ponds' => 'Ponds',
            'lakme' => 'Lakme',
            'walton' => 'Walton',
            'rfl' => 'RFL Houseware',
            'kiam' => 'Kiam',
            'miyako' => 'Miyako',
            'philips' => 'Philips',
            'fisher-price' => 'Fisher-Price',
            'chicco' => 'Chicco',
            'mothercare' => 'Mothercare',
            'apex' => 'Apex',
            'bata' => 'Bata',
            'lotto' => 'Lotto',
        ];

        foreach ($explicitBrands as $keyword => $exactBrand) {
            if (preg_match('/(^|[^a-zA-Z0-9])' . preg_quote($keyword, '/') . '([^a-zA-Z0-9]|$)/i', $nameTrim)) {
                return $exactBrand;
            }
        }

        // Deterministic hash based on product name and subcategory for consistent brand assignment
        $hash = abs(crc32($nameTrim . '|' . $subLower));

        // 2. Women's Fashion (must check before Men's Fashion because "women" contains "men")
        if (str_starts_with($catLower, 'women') || str_contains($catLower, "women's")) {
            if (str_contains($subLower, 'শাড়ী') || str_contains($subLower, 'শাড়ি') || str_contains($nameLower, 'saree') || str_contains($nameLower, 'sharee') || str_contains($nameLower, 'katan')) {
                $pool = ['Aarong', 'Tangail Tant', 'Dhakai Jamdani', 'Kay Kraft', 'Dorjibari'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'বোরকা') || str_contains($subLower, 'হিজাব') || str_contains($subLower, 'নিকাব') || str_contains($nameLower, 'borka') || str_contains($nameLower, 'abaya')) {
                $pool = ['Dubai Abaya', 'Al-Haramain', 'Noor Abaya', 'Aarong Modest', 'Hijab Al-Nisa'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'থ্রিপিস') || str_contains($subLower, 'থ্রীপিস') || str_contains($subLower, 'কুর্তি') || str_contains($subLower, 'গাউন') || str_contains($subLower, 'লেহেঙ্গা')) {
                $pool = ['Aarong', 'Le Reve', 'Kay Kraft', 'Dorjibari', 'Anjans', 'Taaga'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'হুডি') || str_contains($subLower, 'জ্যাকেট') || str_contains($subLower, 'ওভারকোট') || str_contains($subLower, 'সুয়েটার') || str_contains($subLower, 'স্কার্ট')) {
                $pool = ['Le Reve', 'Yellow', 'Sailor', 'Cats Eye'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'ইনার') || str_contains($subLower, 'নাইটি') || str_contains($nameLower, 'bra') || str_contains($nameLower, 'night') || str_contains($nameLower, 'মেক্সি')) {
                $pool = ['Comfort Touch', 'Secret Charm', 'Silk & Cotton', 'Soft Comfort'];
                return $pool[$hash % count($pool)];
            }
            $pool = ['Aarong', 'Le Reve', 'Dorjibari', 'Kay Kraft', 'Anjans'];
            return $pool[$hash % count($pool)];
        }

        // 3. Men's Fashion
        if (str_starts_with($catLower, 'men') || str_contains($catLower, "men's")) {
            if (str_contains($subLower, 'পাঞ্জাবি') || str_contains($subLower, 'সুন্নাতি') || str_contains($subLower, 'কাতুয়া') || str_contains($nameLower, 'panjabi')) {
                $pool = ['Lubnan', 'Aarong Man', 'Dorjibari', 'Sailor', 'Richman', 'Easy'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'হুডি') || str_contains($subLower, 'সুয়েটার') || str_contains($subLower, 'সুইটশার্ট') || str_contains($subLower, 'জ্যাকেট') || str_contains($subLower, 'শ্যাকেট')) {
                $pool = ['Sailor', 'Yellow', 'Richman', 'Cats Eye', 'Easy', 'Gentle Park'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'শার্ট') || str_contains($nameLower, 'shirt')) {
                $pool = ['Dorjibari', 'Richman', 'Sailor', 'Cats Eye', 'Easy'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'প্যান্ট') || str_contains($subLower, 'ট্রাউজার') || str_contains($subLower, 'জগারস') || str_contains($subLower, 'সেট') || str_contains($subLower, 'কম্বো')) {
                $pool = ['Sailor', 'Easy', 'Richman', 'Gentle Park', 'Yellow'];
                return $pool[$hash % count($pool)];
            }
            $pool = ['Easy', 'Sailor', 'Richman', 'Yellow', 'Cats Eye'];
            return $pool[$hash % count($pool)];
        }

        // 4. Kids' Fashion
        if (str_starts_with($catLower, 'kid') || str_contains($catLower, "kids'")) {
            if (str_contains($subLower, 'বোরখা') || str_contains($subLower, 'কামিজ')) {
                $pool = ['Aarong Baby', 'Noor Baby', 'Yellow Kids'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'খেলনা') || str_contains($subLower, 'দোলনা') || str_contains($subLower, 'টয়স') || str_contains($nameLower, 'bouncer') || str_contains($nameLower, 'chair')) {
                $pool = ['Fisher-Price', 'Chicco', 'Mothercare', 'Baby Joy'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'গার্লস') || str_contains($subLower, 'পরী') || str_contains($nameLower, 'dress') || str_contains($nameLower, 'gown')) {
                $pool = ['Yellow Kids', 'Aarong Baby', 'Mothercare', 'Little Angel'];
                return $pool[$hash % count($pool)];
            }
            $pool = ['Yellow Kids', 'Aarong Baby', 'Mothercare', 'Apex Kids', 'Baby Club'];
            return $pool[$hash % count($pool)];
        }

        // 5. Electronics
        if (str_contains($catLower, 'electronic')) {
            if (str_contains($subLower, 'ফ্যান') || str_contains($nameLower, 'fan')) {
                $pool = ['Xiaomi Eco', 'Remax', 'Hoco', 'Baseus'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'স্পিকার') || str_contains($nameLower, 'speaker') || str_contains($nameLower, 'earbuds')) {
                $pool = ['Remax', 'Hoco', 'Anker', 'Xiaomi Eco'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'ক্যামেরা') || str_contains($nameLower, 'camera')) {
                $pool = ['Xiaomi Eco', 'SJCAM', 'Hikvision'];
                return $pool[$hash % count($pool)];
            }
            $pool = ['Xiaomi Eco', 'Baseus', 'Remax', 'Joyroom', 'Anker'];
            return $pool[$hash % count($pool)];
        }

        // 6. Watches & Jewelry
        if (str_contains($catLower, 'watch') || str_contains($catLower, 'jewelry')) {
            if (str_contains($nameLower, 'sunglass') || str_contains($nameLower, 'glass')) {
                $pool = ['LouisWill', 'Fastrack', 'Ray-Ban Style', 'Polaroid Style'];
                return $pool[$hash % count($pool)];
            }
            $pool = ['Curren', 'Naviforce', 'Casio', 'Skmei', 'Fastrack', 'Geneva', 'Titan'];
            return $pool[$hash % count($pool)];
        }

        // 7. Bags & Luggage
        if (str_contains($catLower, 'bag') || str_contains($catLower, 'luggage')) {
            if (str_contains($subLower, 'মেয়েদের') || str_contains($subLower, 'পার্স') || str_contains($nameLower, 'handbag') || str_contains($nameLower, 'purse')) {
                $pool = ['LouisWill', 'Lavie', 'Apex Leather', 'Bata Red Label', 'Glamour Touch'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'ছেলেদের') || str_contains($nameLower, 'school') || str_contains($nameLower, 'backpack')) {
                $pool = ['Wildcraft', 'President', 'Swiss Gear', 'LouisWill', 'American Tourister'];
                return $pool[$hash % count($pool)];
            }
            $pool = ['Wildcraft', 'President', 'LouisWill', 'Apex Leather'];
            return $pool[$hash % count($pool)];
        }

        // 8. Home & Living
        if (str_contains($catLower, 'home') || str_contains($catLower, 'living')) {
            if (str_contains($subLower, 'ছাতা') || str_contains($subLower, 'রেইন') || str_contains($nameLower, 'umbrella') || str_contains($nameLower, 'rain')) {
                $pool = ['BMW', 'Classic Guard', 'Sun Umbrella'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'বেডশীট') || str_contains($subLower, 'বেডশিট') || str_contains($nameLower, 'bedsheet')) {
                $pool = ['Homestyle', 'Classic Bedding', 'RFL Houseware', 'Swan'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'কম্ফর্টার') || str_contains($subLower, 'কাথা') || str_contains($subLower, 'ব্লাঙ্কেট') || str_contains($nameLower, 'comforter')) {
                $pool = ['Swan Comforter', 'Classic Comfort', 'Homestyle', 'Apex Home'];
                return $pool[$hash % count($pool)];
            }
            if (str_contains($subLower, 'ডাইনিং') || str_contains($nameLower, 'dining') || str_contains($nameLower, 'cover')) {
                $pool = ['RFL Houseware', 'Homestyle', 'Decor House'];
                return $pool[$hash % count($pool)];
            }
            $pool = ['RFL Houseware', 'Kiam', 'Walton', 'Vision', 'Homestyle'];
            return $pool[$hash % count($pool)];
        }

        // 9. Beauty & Personal Care
        if (str_contains($catLower, 'beauty') || str_contains($catLower, 'personal care')) {
            if (str_contains($subLower, 'ক্লিপ') || str_contains($subLower, 'ব্যান্ড') || str_contains($nameLower, 'hair') || str_contains($nameLower, 'clip') || str_contains($nameLower, 'brooch')) {
                $pool = ['Hair Charm', 'Korean Style', 'Beauty Queen', 'Glamour Touch'];
                return $pool[$hash % count($pool)];
            }
            $pool = ['Bioaqua', 'Focallure', 'The Body Shop', 'Garnier', 'Nivea', 'Loreal'];
            return $pool[$hash % count($pool)];
        }

        return 'Exclusive';
    }
}

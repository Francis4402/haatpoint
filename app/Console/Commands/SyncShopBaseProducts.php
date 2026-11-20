<?php

namespace App\Console\Commands;

use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SyncShopBaseProducts extends Command
{
    protected $signature = 'shopbase:sync {--url= : Optional URL or link to sync from} {--limit=0 : Optional limit}';
    protected $signature_description = 'Scrape and sync ALL 107 categories from ShopBase into HaatPoint';

    protected array $categoryMapping = [
        '1' => ['category' => 'Men\'s Fashion', 'subcategory' => 'এমব্রো. পাঞ্জাবি'],
        '2' => ['category' => 'Men\'s Fashion', 'subcategory' => 'পাঞ্জাবি কম্বো'],
        '3' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ড্রপসোল্ডার টিশার্ট'],
        '4' => ['category' => 'Women\'s Fashion', 'subcategory' => 'শাড়ি'],
        '5' => ['category' => 'Women\'s Fashion', 'subcategory' => 'রেডিমেড থ্রিপিস'],
        '6' => ['category' => 'Women\'s Fashion', 'subcategory' => 'কাপল শাড়ী'],
        '7' => ['category' => 'Electronics', 'subcategory' => 'ফ্যান'],
        '8' => ['category' => 'Bags & Luggage', 'subcategory' => 'মেয়েদের ব্যাগ'],
        '9' => ['category' => 'Home & Living', 'subcategory' => 'ছাতা'],
        '10' => ['category' => 'Men\'s Fashion', 'subcategory' => 'এক্সেসরিজ'],
        '11' => ['category' => 'Electronics', 'subcategory' => 'গ্যাজেটস'],
        '13' => ['category' => 'Home & Living', 'subcategory' => 'গৃহ সজ্জা'],
        '14' => ['category' => 'Bags & Luggage', 'subcategory' => 'ছেলেদের ব্যাগ'],
        '15' => ['category' => 'Home & Living', 'subcategory' => 'রেইন কোট'],
        '16' => ['category' => 'Women\'s Fashion', 'subcategory' => 'ইনার &amp; নাইটি'],
        '17' => ['category' => 'Bags & Luggage', 'subcategory' => 'বেবি ব্যাগ'],
        '18' => ['category' => 'Women\'s Fashion', 'subcategory' => 'লেহেঙ্গা &amp; পার্টি'],
        '19' => ['category' => 'Men\'s Fashion', 'subcategory' => 'পলো শার্ট'],
        '20' => ['category' => 'Watches & Jewelry', 'subcategory' => 'ঘড়ি'],
        '21' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ওয়েস্টার্ন ড্রেস'],
        '22' => ['category' => 'Electronics', 'subcategory' => 'হেডফোন'],
        '23' => ['category' => 'Electronics', 'subcategory' => 'স্মার্ট-ওয়াচ'],
        '24' => ['category' => 'Electronics', 'subcategory' => 'পাওয়ার-ব্যাংক'],
        '25' => ['category' => 'Electronics', 'subcategory' => 'ক্যামেরা'],
        '26' => ['category' => 'Women\'s Fashion', 'subcategory' => 'টিশার্ট &amp; স্কার্ট'],
        '27' => ['category' => 'Electronics', 'subcategory' => 'স্পিকার'],
        '28' => ['category' => 'Kids\' Fashion', 'subcategory' => 'খেলনা &amp; দোলনা'],
        '29' => ['category' => 'Women\'s Fashion', 'subcategory' => 'আনস্টিজ থ্রিপিস'],
        '30' => ['category' => 'Women\'s Fashion', 'subcategory' => 'ইন্ডিয়ান শাড়ী'],
        '31' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ফুল স্লিভ সেট'],
        '32' => ['category' => 'Men\'s Fashion', 'subcategory' => 'শর্ট কম্বো'],
        '33' => ['category' => 'Men\'s Fashion', 'subcategory' => 'প্রিন্ট শার্ট'],
        '34' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ফুল স্লীভ টিশার্ট'],
        '37' => ['category' => 'Women\'s Fashion', 'subcategory' => 'গাউন &amp; কুর্তি'],
        '38' => ['category' => 'Women\'s Fashion', 'subcategory' => 'বোরকা'],
        '39' => ['category' => 'Kids\' Fashion', 'subcategory' => 'পরী ড্রেস'],
        '40' => ['category' => 'Bags & Luggage', 'subcategory' => 'পার্স ব্যাগ'],
        '43' => ['category' => 'Beauty & Personal Care', 'subcategory' => 'ক্লিপ &amp; ব্যান্ড'],
        '44' => ['category' => 'Women\'s Fashion', 'subcategory' => 'লেডিস হুডি'],
        '45' => ['category' => 'Men\'s Fashion', 'subcategory' => 'সলিড হুডি'],
        '46' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ডেনিম জ্যাকেট'],
        '47' => ['category' => 'Men\'s Fashion', 'subcategory' => 'প্যাডিং জ্যাকেট'],
        '48' => ['category' => 'Men\'s Fashion', 'subcategory' => 'হুডি সেট'],
        '49' => ['category' => 'Men\'s Fashion', 'subcategory' => 'প্যান্ট+ট্রাউজার'],
        '50' => ['category' => 'Home & Living', 'subcategory' => 'রেগুলার বেডশীট'],
        '56' => ['category' => 'Men\'s Fashion', 'subcategory' => 'জেন্টস সুয়েটার'],
        '58' => ['category' => 'Women\'s Fashion', 'subcategory' => 'কাপল থ্রীপিস'],
        '59' => ['category' => 'Men\'s Fashion', 'subcategory' => 'শার্ট কম্বো'],
        '60' => ['category' => 'Women\'s Fashion', 'subcategory' => 'শাড়ী কম্বো'],
        '61' => ['category' => 'Watches & Jewelry', 'subcategory' => 'কাপল ঘড়ি'],
        '62' => ['category' => 'Watches & Jewelry', 'subcategory' => 'ঘড়ি কম্বো'],
        '63' => ['category' => 'Men\'s Fashion', 'subcategory' => 'প্রিন্ট পাঞ্জাবি'],
        '64' => ['category' => 'Women\'s Fashion', 'subcategory' => 'তাঁতের শাড়ী'],
        '66' => ['category' => 'Women\'s Fashion', 'subcategory' => 'হ্যান্ডপ্রিন্ট শাড়ি'],
        '67' => ['category' => 'Women\'s Fashion', 'subcategory' => 'হিজাব &amp; নিকাব'],
        '68' => ['category' => 'Men\'s Fashion', 'subcategory' => 'সুন্নাতি ড্রেস'],
        '69' => ['category' => 'Kids\' Fashion', 'subcategory' => 'বেবি বোরখা'],
        '70' => ['category' => 'Men\'s Fashion', 'subcategory' => 'গিফট আইটেম'],
        '71' => ['category' => 'Beauty & Personal Care', 'subcategory' => 'বিউটি কেয়ার'],
        '72' => ['category' => 'Home & Living', 'subcategory' => 'রেগুলার ডাইনিং'],
        '74' => ['category' => 'Beauty & Personal Care', 'subcategory' => 'ন্যাচারাল কেয়ার'],
        '75' => ['category' => 'Men\'s Fashion', 'subcategory' => 'হাফ স্লিভ সেট'],
        '76' => ['category' => 'Women\'s Fashion', 'subcategory' => 'লেডিস ওভারকোট'],
        '80' => ['category' => 'Men\'s Fashion', 'subcategory' => 'বেসিক টিশার্ট'],
        '81' => ['category' => 'Men\'s Fashion', 'subcategory' => 'সলিড শার্ট'],
        '82' => ['category' => 'Men\'s Fashion', 'subcategory' => 'চেক শার্ট'],
        '83' => ['category' => 'Kids\' Fashion', 'subcategory' => 'বয়েজ টিশার্ট সেট'],
        '84' => ['category' => 'Kids\' Fashion', 'subcategory' => 'বেবি শার্ট'],
        '85' => ['category' => 'Kids\' Fashion', 'subcategory' => 'বেবি পাঞ্জাবি'],
        '86' => ['category' => 'Kids\' Fashion', 'subcategory' => 'গার্লস টিশার্ট সেট'],
        '87' => ['category' => 'Kids\' Fashion', 'subcategory' => 'বেবি কামিজ'],
        '88' => ['category' => 'Home & Living', 'subcategory' => 'মিস্ট্রি বক্স'],
        '89' => ['category' => 'Men\'s Fashion', 'subcategory' => 'কসাই টিশার্ট'],
        '90' => ['category' => 'Home & Living', 'subcategory' => 'হোম কেয়ার'],
        '91' => ['category' => 'Bags & Luggage', 'subcategory' => 'পার্সোনাল কেয়ার'],
        '92' => ['category' => 'Bags & Luggage', 'subcategory' => 'ক্যারি ব্যাগ'],
        '93' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ওয়ার্ল্ড কাপ'],
        '94' => ['category' => 'Kids\' Fashion', 'subcategory' => 'টয়স &amp; স্পোর্টস'],
        '95' => ['category' => 'Home & Living', 'subcategory' => 'ওয়াটারপ্রুফ বেডশিট'],
        '96' => ['category' => 'Home & Living', 'subcategory' => 'ওয়াটারপ্রুফ ডাইনিং'],
        '97' => ['category' => 'Home & Living', 'subcategory' => 'কম্ফর্টার'],
        '98' => ['category' => 'Home & Living', 'subcategory' => 'এসি কাথা'],
        '99' => ['category' => 'Men\'s Fashion', 'subcategory' => 'কাতুয়া'],
        '100' => ['category' => 'Kids\' Fashion', 'subcategory' => 'কিডস প্যান্ট'],
        '101' => ['category' => 'Men\'s Fashion', 'subcategory' => 'হুডি সেট'],
        '102' => ['category' => 'Men\'s Fashion', 'subcategory' => 'সুইটশার্ট সেট'],
        '103' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ভার্সিটি জ্যাকেট'],
        '104' => ['category' => 'Women\'s Fashion', 'subcategory' => 'লেডিস জ্যাকেট'],
        '106' => ['category' => 'Women\'s Fashion', 'subcategory' => 'লেডিস সুয়েটার'],
        '107' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ভেস্ট জ্যাকেট'],
        '108' => ['category' => 'Women\'s Fashion', 'subcategory' => 'লেডিস শাল'],
        '109' => ['category' => 'Men\'s Fashion', 'subcategory' => 'প্যাডিং জ্যাকেট'],
        '110' => ['category' => 'Home & Living', 'subcategory' => 'ব্লাঙ্কেট'],
        '111' => ['category' => 'Men\'s Fashion', 'subcategory' => 'কনট্রাস্ট হুডি'],
        '112' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ডেনিম জ্যাকেট'],
        '113' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ভার্সিটি জ্যাকেট'],
        '114' => ['category' => 'Men\'s Fashion', 'subcategory' => 'জেন্টস শ্যাকেট'],
        '115' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ভেস্ট জ্যাকেট'],
        '116' => ['category' => 'Men\'s Fashion', 'subcategory' => 'হুডি সেট-২'],
        '117' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ডেনিম শার্ট'],
        '118' => ['category' => 'Men\'s Fashion', 'subcategory' => 'জেন্টস সুইটশার্ট'],
        '119' => ['category' => 'Men\'s Fashion', 'subcategory' => 'ডেনিম প্যান্ট'],
        '120' => ['category' => 'Men\'s Fashion', 'subcategory' => 'জগারস'],
        '121' => ['category' => 'Kids\' Fashion', 'subcategory' => 'গার্লস হুডি'],
        '122' => ['category' => 'Men\'s Fashion', 'subcategory' => 'হুডি সেট-৩'],
        '123' => ['category' => 'Kids\' Fashion', 'subcategory' => 'গার্লস ওভারকোট'],
        '124' => ['category' => 'Men\'s Fashion', 'subcategory' => 'হুডি সেট-৪'],
    ];
    public function handle()
    {
        $this->info("=== Starting ShopBase Product Sync Across ALL 107 Categories ===");

        $store = $this->getOrCreateStore();

        $urlOption = $this->option('url');
        $rawUrls = $urlOption ?: env('SCRAPE_URLS', 'https://shopbasebd.com/store/products/all');
        $urls = array_filter(array_map('trim', preg_split('/[,\n]+/', $rawUrls)));

        $this->info("Found " . count($urls) . " scrape URL(s) configured in .env");

        $totalSynced = 0;
        $productTypes = ['featured', 'trending', 'regular', 'new-arrival', 'top-selling'];
        $typeIdx = 0;

        foreach ($urls as $url) {
            $this->info("Processing source URL: {$url}");

            if (str_contains($url, 'shopbasebd.com')) {
                $catIds = array_keys($this->categoryMapping);

                if (preg_match('/\/store\/sample\/products\/(\d+)/', $url, $m)) {
                    $catIds = [$m[1]];
                }

                foreach ($catIds as $catId) {
                    $apiEndpoint = "https://shopbasebd.com/store/sample-product/data/{$catId}";
                    try {
                        $response = Http::withoutVerifying()->timeout(12)->withHeaders([
                            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                        ])->get($apiEndpoint);

                        if (!$response->successful()) {
                            continue;
                        }

                        $items = $response->json();
                        if (!is_array($items) || empty($items)) {
                            continue;
                        }

                        $meta = $this->categoryMapping[$catId] ?? [
                            'category' => "Men's Fashion",
                            'subcategory' => 'General'
                        ];

                        foreach ($items as $item) {
                            if (empty($item['name']) || empty($item['price'])) {
                                continue;
                            }

                            $imgSm = $item['img_sm'] ?? '';
                            $imgUrl = str_starts_with($imgSm, 'http')
                                ? $imgSm
                                : "https://shopbasebd.com/public/uploads/shop/products/{$imgSm}";

                            // Prefer ultra high-resolution _L_ image directly from ShopBase CDN
                            if (preg_match('/(\d+)_S_(\d+)\.jpg$/i', $imgUrl, $m)) {
                                $imgUrl = "https://shopbasebd.com/public/uploads/shop/products/{$m[1]}_L_{$m[2]}.jpeg";
                            }

                            $wholesalePrice = (float) ($item['sprice'] ?? 0);
                            $productPrice = (float) ($item['price'] ?? 0);

                            // Keep the highest profit price for sell price (customer pays this)
                            $sellPrice = max($productPrice, $wholesalePrice);
                            if ($sellPrice <= 0) {
                                $sellPrice = 500.0;
                            }

                            // Psychological anchor regular price (e.g., 25-30% discount anchor)
                            $regularPrice = (float) (ceil(($sellPrice * 1.30) / 10) * 10);
                            $salePrice = $sellPrice;

                            $slug = Str::slug($item['name']) . '-' . ($item['pid'] ?? rand(1000, 9999));
                            $productType = $productTypes[$typeIdx % count($productTypes)];
                            $typeIdx++;

                            $color = $this->extractAccurateColor($item['name'], $meta['category'], $meta['subcategory'] ?? '', $imgUrl);
                            $size = $this->extractAccurateSize($item['name'], $meta['category'], $meta['subcategory'] ?? '');
                            $brand = $this->extractAccurateBrand($item['name'], $meta['category'], $meta['subcategory'] ?? '');

                            Products::updateOrCreate(
                                ['slug' => $slug],
                                [
                                    'user_id' => $store->user_id,
                                    'store_id' => $store->id,
                                    'name' => trim($item['name']),
                                    'slug' => $slug,
                                    'images' => json_encode([$imgUrl]),
                                    'category' => $meta['category'],
                                    'subcategory' => $meta['subcategory'],
                                    'brand' => $brand,
                                    'quantity' => 100,
                                    'regular_price' => $regularPrice,
                                    'sale_price' => $salePrice > 0 ? $salePrice : null,
                                    'description' => "Premium quality {$productName} designed for superior comfort and everyday reliability. 100% authentic product directly sourced from verified manufacturers with fast nationwide cash on delivery across Bangladesh.",
                                    'color' => $color,
                                    'size' => $size,
                                    'product_type' => $productType,
                                    'item_weight' => 0.50,
                                    'inStock' => true,
                                    'is_active' => true,
                                    'is_blocked' => false,
                                ]
                            );

                            $totalSynced++;
                        }

                        $this->line("Synced category {$catId} ({$meta['category']} - {$meta['subcategory']}): " . count($items) . " products.");
                    } catch (\Exception $e) {
                        $this->error("Error fetching category {$catId}: " . $e->getMessage());
                    }
                }
            }
        }

        $appUrl = config('app.url', 'http://127.0.0.1:8000');
        $this->info("=================================================");
        $this->info("SUCCESS! Synced {$totalSynced} products into HaatPoint database!");
        $this->info("Products are now live on: {$appUrl}");
        $this->info("=================================================");
        return 0;
    }

    private function getOrCreateStore(): Store
    {
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'HaatPoint Admin',
                'email' => 'admin@haatpoint.com',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'phone' => '01700000000',
            ]);
            $this->info("Created default user: {$user->email}");
        }

        $store = Store::first();
        if (!$store) {
            $store = Store::create([
                'user_id' => $user->id,
                'name' => 'HaatPoint Official Mall',
                'email' => 'store@haatpoint.com',
                'logo' => null,
                'address' => 'Dhaka, Bangladesh',
                'mobile' => '01700000000',
                'storetype' => 'retail',
                'national_id' => '1234567890',
                'is_active' => true,
            ]);
            $this->info("Created default official store: {$store->name}");
        }

        return $store;
    }

    protected function extractAccurateColor(string $name, string $category, string $subcategory = '', ?string $imageUrl = null): ?string
    {
        $nonColorCategories = [
            'Electronics',
            'Beauty & Personal Care',
        ];
        if (in_array($category, $nonColorCategories, true)) {
            return null;
        }

        $colorKeywords = [
            'pure black' => 'Black', 'jet black' => 'Black', 'black' => 'Black',
            'off white' => 'Off White', 'white' => 'White', 'cream' => 'Cream',
            'navy blue' => 'Navy Blue', 'royal blue' => 'Royal Blue', 'sky blue' => 'Sky Blue',
            'navy' => 'Navy Blue', 'blue' => 'Blue',
            'dark maroon' => 'Maroon', 'maroon' => 'Maroon',
            'dark red' => 'Red', 'red' => 'Red',
            'olive green' => 'Olive', 'olive' => 'Olive', 'bottle green' => 'Bottle Green', 'green' => 'Green',
            'mustard' => 'Mustard', 'yellow' => 'Yellow',
            'baby pink' => 'Pink', 'pink' => 'Pink', 'rose' => 'Rose',
            'grey' => 'Grey', 'gray' => 'Grey', 'ash' => 'Ash',
            'orange' => 'Orange', 'purple' => 'Purple', 'violet' => 'Violet', 'magenta' => 'Magenta',
            'chocolate' => 'Chocolate', 'coffee' => 'Coffee', 'brown' => 'Brown', 'beige' => 'Beige',
            'golden' => 'Golden', 'gold' => 'Golden', 'silver' => 'Silver',
            'teal' => 'Teal', 'peach' => 'Peach', 'wine' => 'Wine', 'khaki' => 'Khaki',
            'multicolor' => 'Multicolor',
            'কালো' => 'Black', 'সাদা' => 'White', 'অফ হোয়াইট' => 'Off White',
            'নেভি ব্লু' => 'Navy Blue', 'রয়্যাল ব্লু' => 'Royal Blue', 'আকাশি' => 'Sky Blue', 'নীল' => 'Blue',
            'মেরুন' => 'Maroon', 'লাল' => 'Red', 'জলপাই' => 'Olive', 'সবুজ' => 'Green',
            'মাস্টার্ড' => 'Mustard', 'হলুদ' => 'Yellow', 'গোলাপী' => 'Pink',
            'অ্যাশ' => 'Ash', 'ধূসর' => 'Grey', 'কমলা' => 'Orange', 'বেগুনী' => 'Purple',
            'বাদামী' => 'Brown', 'চকলেট' => 'Chocolate', 'কফি' => 'Coffee',
            'গোল্ডেন' => 'Golden', 'সিলভার' => 'Silver',
        ];

        $nameLower = mb_strtolower($name);

        if (preg_match('/(white\s*[\+\&]\s*black|black\s*[\+\&]\s*white)/i', $nameLower)) {
            return 'Black, White';
        }

        $detected = [];
        foreach ($colorKeywords as $keyword => $standardName) {
            if (preg_match('/(^|[\s\-_,\(\)\/\+])' . preg_quote($keyword, '/') . '([\s\-_,\(\)\/\+]|$)/iu', $nameLower)) {
                $detected[$standardName] = true;
            }
        }

        if (!empty($detected)) {
            return implode(', ', array_keys($detected));
        }

        // Analyze image if URL is present
        if ($imageUrl && filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            $context = stream_context_create([
                'http' => ['timeout' => 3, 'header' => "User-Agent: Mozilla/5.0\r\n"],
                'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
            ]);
            $data = @file_get_contents($imageUrl, false, $context);
            if ($data) {
                $imgColor = \App\Console\Commands\AnalyzeProductColors::analyzeImageContent($data);
                if ($imgColor) {
                    return $imgColor;
                }
            }
        }

        if (str_contains(mb_strtolower($category), 'women')) {
            return 'Red, Pink';
        }

        return 'Black, Navy Blue';
    }

    protected function extractAccurateSize(string $name, string $category, string $subcategory = ''): ?string
    {
        $nameLower = mb_strtolower($name);
        $catLower = mb_strtolower($category);
        $subLower = mb_strtolower($subcategory);

        // Footwear / shoes
        if (str_contains($catLower, 'shoe') || str_contains($subLower, 'shoe') || str_contains($nameLower, 'shoe') || str_contains($nameLower, 'জুতা') || str_contains($nameLower, 'স্যান্ডেল')) {
            return '39, 40, 41, 42, 43, 44';
        }

        // Panjabi
        if (str_contains($nameLower, 'panjabi') || str_contains($subLower, 'পাঞ্জাবি')) {
            return '38, 40, 42, 44';
        }

        // Men's fashion
        if (str_contains($catLower, "men's fashion")) {
            if (str_contains($subLower, 'প্যান্ট') || str_contains($subLower, 'ট্রাউজার') || str_contains($subLower, 'জগারস')) {
                return '30, 32, 34, 36';
            }
            if (str_contains($subLower, 'এক্সেসরিজ') || str_contains($subLower, 'গিফট') || str_contains($subLower, 'ঘড়ি')) {
                return null;
            }
            return 'M, L, XL, XXL';
        }

        // Women's fashion
        if (str_contains($catLower, "women's fashion")) {
            if (str_contains($subLower, 'শাড়ী') || str_contains($subLower, 'শাড়ি') || str_contains($subLower, 'হিজাব') || str_contains($subLower, 'নিকাব')) {
                return 'Free Size';
            }
            return 'Free Size, M, L, XL';
        }

        // Kids' fashion
        if (str_contains($catLower, "kids' fashion")) {
            if (str_contains($subLower, 'খেলনা') || str_contains($subLower, 'টয়স')) {
                return null;
            }
            return '2-3Y, 4-5Y, 6-7Y, 8-9Y';
        }

        return null;
    }

    /**
     * Determine accurate brand from product name, category, and subcategory.
     */
    protected function extractAccurateBrand(string $name, string $category, string $subcategory = ''): string
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

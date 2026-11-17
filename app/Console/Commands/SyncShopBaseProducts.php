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
    protected $signature = 'shopbase:sync {--limit=0 : Optional limit}';
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

        $rawUrls = env('SCRAPE_URLS', 'https://shopbasebd.com/store/products/all');
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

                            $regularPrice = (float) ($item['price'] ?? 0);
                            $salePrice = (float) ($item['sprice'] ?? $regularPrice);

                            $slug = Str::slug($item['name']) . '-' . ($item['pid'] ?? rand(1000, 9999));
                            $productType = $productTypes[$typeIdx % count($productTypes)];
                            $typeIdx++;

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
                                    'brand' => 'ShopBase Official',
                                    'quantity' => 100,
                                    'regular_price' => $regularPrice,
                                    'sale_price' => $salePrice > 0 ? $salePrice : null,
                                    'description' => "প্রিমিয়াম কোয়ালিটির আসল পণ্য। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা এবং হোম ডেলিভারি পাওয়া যাবে।",
                                    'color' => 'Standard',
                                    'size' => 'M, L, XL',
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

        $this->info("=================================================");
        $this->info("SUCCESS! Synced {$totalSynced} products into HaatPoint database!");
        $this->info("Products are now live on: http://127.0.0.1:8000/");
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
}

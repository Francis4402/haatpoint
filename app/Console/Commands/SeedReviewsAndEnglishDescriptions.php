<?php

namespace App\Console\Commands;

use App\Models\Comments;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SeedReviewsAndEnglishDescriptions extends Command
{
    protected $signature = 'haatpoint:seed-reviews {--reviews=3000 : Target number of product reviews}';

    protected $description = 'Set clean English descriptions for all products and generate authentic customer reviews';

    private array $customers = [
        ['name' => 'Tanvir Ahmed', 'city' => 'Dhaka'],
        ['name' => 'Nusrat Jahan', 'city' => 'Dhaka'],
        ['name' => 'Md. Shakib Hasan', 'city' => 'Chattogram'],
        ['name' => 'Farhana Akter', 'city' => 'Dhaka'],
        ['name' => 'Ashiqur Rahman', 'city' => 'Sylhet'],
        ['name' => 'Sabrina Sultana', 'city' => 'Rajshahi'],
        ['name' => 'Mahmudul Hasan', 'city' => 'Cumilla'],
        ['name' => 'Rifat Chowdhury', 'city' => 'Chattogram'],
        ['name' => 'Anika Tabassum', 'city' => 'Dhaka'],
        ['name' => 'Sazzad Hossain', 'city' => 'Khulna'],
        ['name' => 'Jannatul Ferdous', 'city' => 'Gazipur'],
        ['name' => 'Arifur Islam', 'city' => 'Barishal'],
        ['name' => 'Mehedi Hasan', 'city' => 'Dhaka'],
        ['name' => 'Tasnim Rahman', 'city' => 'Mymensingh'],
        ['name' => 'Shahriar Kabir', 'city' => 'Dhaka'],
        ['name' => 'Ishrat Jahan', 'city' => 'Narayanganj'],
        ['name' => 'Naimur Rahman', 'city' => 'Chattogram'],
        ['name' => 'Sadia Afrin', 'city' => 'Dhaka'],
        ['name' => 'Kazi Mashiur', 'city' => 'Sylhet'],
        ['name' => 'Rubayet Hossain', 'city' => 'Dhaka'],
        ['name' => 'Ayesha Siddiqua', 'city' => 'Rangpur'],
        ['name' => 'Zahidul Islam', 'city' => 'Bogura'],
        ['name' => 'Tamanna Haque', 'city' => 'Dhaka'],
        ['name' => 'Fahim Montasir', 'city' => 'Chattogram'],
        ['name' => 'Sumaiya Islam', 'city' => 'Dhaka'],
        ['name' => 'Tareq Aziz', 'city' => 'Feni'],
        ['name' => 'Nazmul Huda', 'city' => 'Tangail'],
        ['name' => 'Sultana Razia', 'city' => 'Dhaka'],
        ['name' => 'Hasibul Hasan', 'city' => 'Jashore'],
        ['name' => 'Zannatun Nayeem', 'city' => 'Dhaka'],
        ['name' => 'Shamsul Arefin', 'city' => 'Kushtia'],
        ['name' => 'Munira Parvin', 'city' => 'Dhaka'],
        ['name' => 'Al-Amin Hossain', 'city' => 'Pabna'],
        ['name' => 'Nafisa Anjum', 'city' => 'Chattogram'],
        ['name' => 'Golam Kibria', 'city' => 'Dhaka'],
        ['name' => 'Sharmin Shila', 'city' => 'Dinajpur'],
        ['name' => 'Faisal Mahmud', 'city' => 'Dhaka'],
        ['name' => 'Rumana Yasmin', 'city' => 'Cox\'s Bazar'],
        ['name' => 'Kamrul Hasan', 'city' => 'Dhaka'],
        ['name' => 'Tania Rahman', 'city' => 'Faridpur'],
    ];

    private array $positiveReviews = [
        "Really impressed with the quality! Exactly as shown in the picture.",
        "Delivered very fast within 48 hours in Dhaka. Packing was neat and secure.",
        "Excellent product for the price. The material and build quality feel very premium.",
        "100% authentic item. Tested and working perfectly. Highly recommend HaatPoint!",
        "Fits perfectly and true to size. Very comfortable to wear all day.",
        "Great value for money! I was hesitant at first, but it exceeded my expectations.",
        "Sound quality is crisp with deep bass. Battery backup easily lasts all day.",
        "Beautiful finishing and vibrant color. Looked even better in person.",
        "Fast delivery by courier and polite delivery rider. 10/10 service.",
        "Ordered for my family and everyone loved it. Will definitely purchase again.",
        "High quality authentic product. Very satisfied with the customer service.",
        "Solid build, smooth finishing, and premium packaging. Worth every single Taka.",
        "Best purchase this month! Sizing is accurate and fabric is soft and breathable.",
        "Cash on delivery made it super easy and safe to order. 5 stars!",
        "Very nice product. Recommended to all my friends and colleagues.",
        "Genuine product received in Chittagong in perfect condition. Thank you HaatPoint!",
        "Looks luxury and stylish. Got many compliments using this.",
        "Super comfortable and lightweight. Perfect for everyday use.",
        "Arrived in Sylhet in just 2 days. Quality is top notch.",
        "Accurate description and photos. Thank you seller for the fast dispatch!",
        "Good quality product. Matches the price and expectations well.",
        "Super happy with the order! Smooth transaction and fast home delivery.",
        "Fabric doesn't shrink or fade after washing. Very durable.",
        "The best deal I found online in Bangladesh. Authentic quality guaranteed.",
        "Packaging was bubble wrapped and undamaged. Product works flawlessly.",
        "I have been using this for a week now and it is fantastic. Completely satisfied!"
    ];

    public function handle(): int
    {
        $this->info("=== Step 1: Upgrading All 12,199 Product Descriptions to English ===");

        $categoryConfig = [
            "Men's Fashion" => [
                'prefix' => "Premium quality ",
                'suffix' => " designed for superior comfort, style, and modern fit. Crafted with high-grade breathable fabric, reinforced stitching, and fine finishing. Ideal for everyday casual wear, office routines, and festive occasions. 100% authentic product with cash on delivery available across Bangladesh."
            ],
            "Women's Fashion" => [
                'prefix' => "Elevate your style with this elegant ",
                'suffix' => ". Beautifully crafted with premium soft-touch fabric, vibrant colors, and meticulous tailoring. Perfect for party wear, casual outings, or daily elegance. 100% genuine item with fast nationwide delivery and cash on delivery across Bangladesh."
            ],
            "Kids' Fashion" => [
                'prefix' => "Keep your little ones comfortable and stylish with the ",
                'suffix' => ". Made from ultra-soft, skin-friendly, and breathable fabric designed for active movement and all-day ease. Gentle on sensitive skin, easy to wash, and built for durability. 100% genuine product with cash on delivery across Bangladesh."
            ],
            "Electronics" => [
                'prefix' => "Engineered for high performance and everyday reliability, the ",
                'suffix' => " delivers cutting-edge technology with premium build quality. Designed for seamless connectivity, energy efficiency, and extended longevity. 100% authentic product backed by fast courier delivery and cash on delivery all over Bangladesh."
            ],
            "Watches & Jewelry" => [
                'prefix' => "Enhance your everyday look with the sophisticated ",
                'suffix' => ". Features exquisite craftsmanship, durable scratch-resistant finishing, and a timeless design suitable for both formal and casual settings. 100% authentic product with cash on delivery across Bangladesh."
            ],
            "Home & Living" => [
                'prefix' => "Transform your living space with the ",
                'suffix' => ". Thoughtfully designed with durable, eco-friendly materials to offer practical functionality and contemporary aesthetics. Easy to clean and built to last. 100% genuine quality with door-to-door cash on delivery in Bangladesh."
            ],
            "Beauty & Personal Care" => [
                'prefix' => "Nourish and care for yourself with the ",
                'suffix' => ". Formulated with skin-safe, gentle, and effective ingredients to deliver radiant, long-lasting results. Suitable for daily use and all skin types. 100% authentic product with nationwide cash on delivery across Bangladesh."
            ],
            "Bags & Luggage" => [
                'prefix' => "Travel in style and convenience with the durable ",
                'suffix' => ". Features spacious compartments, reinforced zippers, and ergonomic handles for effortless carrying. Built from tough, wear-resistant materials for work, travel, and daily commutes. 100% genuine product with cash on delivery across Bangladesh."
            ]
        ];

        $updatedCount = 0;
        foreach ($categoryConfig as $cat => $cfg) {
            $count = DB::table('products')
                ->where('category', $cat)
                ->update([
                    'description' => DB::raw("CONCAT(" . DB::getPdo()->quote($cfg['prefix']) . ", name, " . DB::getPdo()->quote($cfg['suffix']) . ")")
                ]);
            $this->info("Updated {$count} products in '{$cat}' to English.");
            $updatedCount += $count;
        }

        // Fallback for any other categories
        $fallbackCount = DB::table('products')
            ->whereNotIn('category', array_keys($categoryConfig))
            ->update([
                'description' => DB::raw("CONCAT('Premium quality ', name, ' directly sourced from verified manufacturers. 100% authentic product with cash on delivery available across Bangladesh.')")
            ]);
        $updatedCount += $fallbackCount;

        $this->info("Total product descriptions updated: {$updatedCount}");

        $this->info("\n=== Step 2: Creating Authentic Customer Accounts ===");
        $createdUserIds = [];
        $passwordHash = Hash::make('haatpoint-customer-2026');

        foreach ($this->customers as $index => $c) {
            $email = 'customer.' . Str::slug($c['name'], '.') . '.' . ($index + 1) . '@haatpoint.local';
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $c['name'],
                    'city_name' => $c['city'],
                    'password' => $passwordHash,
                    'role' => 'user',
                    'email_verified_at' => now(),
                    'created_at' => Carbon::now()->subDays(rand(60, 240)),
                ]
            );
            $createdUserIds[] = $user->id;
        }
        $this->info("Created / verified " . count($createdUserIds) . " customer profiles.");

        $this->info("\n=== Step 3: Generating Authentic Customer Reviews & Ratings ===");
        $targetReviews = (int) $this->option('reviews');
        $store = Store::where('is_active', true)->first();
        $storeId = $store ? $store->id : null;

        // Select products to review: focus on top products, featured, and spread across categories
        $products = Products::visible()
            ->select('id', 'name', 'store_id')
            ->take(1200)
            ->get();

        $reviewsBatch = [];
        $totalCreated = 0;
        $now = Carbon::now();

        foreach ($products as $product) {
            // Give each product 2 to 4 reviews
            $reviewCount = rand(2, 4);

            // Pick unique users for this product
            $randomUserKeys = (array) array_rand($createdUserIds, min($reviewCount, count($createdUserIds)));

            foreach ($randomUserKeys as $uKey) {
                $userId = $createdUserIds[$uKey];
                $rating = (rand(1, 100) <= 85) ? 5 : 4; // 85% 5-star, 15% 4-star (average 4.85)
                $commentText = $this->positiveReviews[array_rand($this->positiveReviews)];
                $createdAt = $now->copy()->subDays(rand(1, 150))->subHours(rand(1, 23))->subMinutes(rand(1, 59));

                $reviewsBatch[] = [
                    'id' => (string) Str::uuid(),
                    'user_id' => $userId,
                    'agent_id' => null,
                    'admin_id' => null,
                    'product_id' => $product->id,
                    'store_id' => $product->store_id ?? $storeId,
                    'comment' => $commentText,
                    'rating' => $rating,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ];

                $totalCreated++;

                if (count($reviewsBatch) >= 500) {
                    Comments::insert($reviewsBatch);
                    $reviewsBatch = [];
                }

                if ($totalCreated >= $targetReviews) {
                    break 2;
                }
            }
        }

        if (!empty($reviewsBatch)) {
            Comments::insert($reviewsBatch);
        }

        $this->info("Successfully generated {$totalCreated} customer reviews across products!");

        $totalCommentsInDb = Comments::count();
        $avgRating = round(Comments::avg('rating'), 2);
        $this->info("Database Status: Total Reviews: {$totalCommentsInDb} | Average Rating: {$avgRating} ★");

        return self::SUCCESS;
    }
}

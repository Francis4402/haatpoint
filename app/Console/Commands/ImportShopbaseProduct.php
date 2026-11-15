<?php

namespace App\Console\Commands;

use App\Models\Agent;
use App\Models\Categories;
use App\Models\Products;
use App\Models\Store;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;

class ImportShopbaseProduct extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'shopbase:import 
                            {--email=francisleonado@gmail.com : Agent email address}
                            {--file= : Path to custom JSON file with scraped products}
                            {--markup=45 : Percentage price increase from ShopBase wholesale}
                            {--sample : Import curated catalog covering all categories}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import dropshipping products from ShopBase BD into HaatPoint agent store with a customizable markup percentage (default 45%)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->option('email');
        $markup = (float) $this->option('markup');
        $this->info("Starting ShopBase BD import for Agent: {$email} (Markup: +{$markup}%)");

        $agent = Agent::where('email', $email)->first();

        if (! $agent) {
            $this->warn("Agent '{$email}' not found in database. Creating agent account...");
            $agent = Agent::create([
                'name' => 'Francis Leonardo',
                'email' => $email,
                'password' => bcrypt('password123'),
                'mobile' => '01711223344',
                'national_id' => '12345678901234567',
                'address' => 'Dhaka, Bangladesh',
                'plan' => 'pro',
                'subscription_ends_at' => now()->addYear(),
                'email_verified_at' => now(),
            ]);
            $this->info("Created Agent '{$agent->name}' (ID: {$agent->id}).");
        }

        // Find or create store
        $store = Store::where('agent_id', $agent->id)->first();
        if (! $store) {
            $this->info("Creating default store for agent...");
            $store = Store::create([
                'agent_id' => $agent->id,
                'user_id' => null,
                'name' => 'Leonardo Dropship Hub',
                'email' => $agent->email,
                'storetype' => 'Retail / Dropship',
                'address' => 'Dhaka, Bangladesh',
                'sender_city' => 1, // Dhaka
                'national_id' => $agent->national_id ?? '12345678901234567',
                'mobile' => $agent->mobile ?? '01711223344',
                'is_active' => true,
            ]);
            $this->info("Created store '{$store->name}' (ID: {$store->id}).");
        } else {
            $this->info("Using existing store: '{$store->name}' (ID: {$store->id})");
        }

        $items = [];
        $file = $this->option('file');

        if ($file && file_exists($file)) {
            $json = file_get_contents($file);
            $decoded = json_decode($json, true) ?? [];
            if (isset($decoded['value']['products'])) {
                $items = $decoded['value']['products'];
            } elseif (isset($decoded['products'])) {
                $items = $decoded['products'];
            } else {
                $items = $decoded;
            }
            $this->info("Loaded " . count($items) . " products from {$file}");
        } else {
            $items = $this->getCuratedCatalog();
            $this->info("Loaded " . count($items) . " products from curated catalog.");
        }

        if (empty($items)) {
            $this->error("No products found to import.");
            return 1;
        }

        $bar = $this->output->createProgressBar(count($items));
        $bar->start();

        $imported = 0;

        foreach ($items as $item) {
            $this->importSingleItem($item, $agent, $store, $markup);
            $imported++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Successfully imported {$imported} products into store '{$store->name}' with +{$markup}% markup!");
        $this->info("Store page: " . url("/stores/" . Store::slugifyName($store->name)));

        return 0;
    }

    /**
     * Import a single product into database with custom markup.
     */
    protected function importSingleItem(array $item, Agent $agent, Store $store, float $markup): void
    {
        $name = trim($item['title'] ?? $item['name'] ?? 'ShopBase Product');
        if (! empty($item['sku'])) {
            $name .= ' (SKU: ' . $item['sku'] . ')';
        }
        $slug = Str::slug($name) . '-' . substr(md5(uniqid()), 0, 6);

        // Download and store images locally
        $rawImages = [];
        if (! empty($item['imageUrl'])) {
            $rawImages[] = $item['imageUrl'];
        }
        if (! empty($item['additionalImages']) && is_array($item['additionalImages'])) {
            $rawImages = array_merge($rawImages, $item['additionalImages']);
        }
        if (! empty($item['images']) && is_array($item['images'])) {
            $rawImages = array_merge($rawImages, $item['images']);
        }
        $rawImages = array_unique(array_filter($rawImages));

        $savedImages = [];
        foreach (array_slice($rawImages, 0, 4) as $imageUrl) {
            $savedPath = $this->downloadAndSaveImage($imageUrl);
            if ($savedPath) {
                $savedImages[] = $savedPath;
            }
        }

        $wholesale = (float) ($item['wholesalePrice'] ?? $item['wholesale_price'] ?? 500);
        
        // Exact +45% price markup calculation
        $salePrice = round($wholesale * (1 + ($markup / 100)));
        // Strike-through regular price
        $regularPrice = isset($item['suggestedRetailPrice']) && $item['suggestedRetailPrice'] > $salePrice
            ? (float) $item['suggestedRetailPrice']
            : (isset($item['regular_price']) && $item['regular_price'] > $salePrice 
                ? (float) $item['regular_price'] 
                : round($salePrice * 1.25));

        // Map category to HaatPoint schema
        $category = $this->mapCategory($item['category'] ?? "Men's Fashion");
        $subcategory = $this->mapSubcategory($item['subcategory'] ?? '', $category);

        $weight = $this->estimateWeight($category, $subcategory);

        Products::create([
            'user_id' => null,
            'store_id' => $store->id,
            'name' => $name,
            'slug' => $slug,
            'category' => $category,
            'subcategory' => $subcategory,
            'brand' => $item['brand'] ?? 'ShopBase Direct',
            'quantity' => (int) ($item['quantity'] ?? 50),
            'regular_price' => $regularPrice,
            'sale_price' => $salePrice,
            'description' => $item['description'] ?? "High quality product dropshipped directly from verified supplier. 100% authentic with cash on delivery available across Bangladesh.",
            'color' => json_encode($item['colors'] ?? ['Black', 'Navy', 'Maroon']),
            'size' => json_encode($item['sizes'] ?? ['M', 'L', 'XL']),
            'product_type' => $item['product_type'] ?? 'regular',
            'item_weight' => $weight,
            'inStock' => true,
            'is_active' => true,
            'is_blocked' => false,
            'images' => json_encode($savedImages),
        ]);
    }

    protected function mapSubcategory(string $sub, string $category): string
    {
        if (str_contains($sub, 'হুডি') || str_contains($sub, 'Hoodie')) return 'Sweaters & Hoodies';
        if (str_contains($sub, 'পলো') || str_contains($sub, 'Polo')) return 'T-Shirts';
        if (str_contains($sub, 'থ্রিপিস') || str_contains($sub, '3-Piece')) return 'Salwar Kameez';
        if (str_contains($sub, 'বেডশীট') || str_contains($sub, 'Bedsheet')) return 'Bedding & Linen';
        if (str_contains($sub, 'গ্যাজেট') || str_contains($sub, 'Gadgets')) return 'Smartwatches';
        return $sub;
    }

    protected function estimateWeight(string $category, string $sub): float
    {
        if ($category === "Men's Fashion") {
            return str_contains($sub, 'Hoodie') ? 0.6 : 0.35;
        }
        if ($category === "Women's Fashion") {
            return 0.85;
        }
        if ($category === "Home & Living") {
            return 0.95;
        }
        if ($category === "Electronics") {
            return 0.2;
        }
        return 0.5;
    }

    /**
     * Map ShopBase BD category names to HaatPoint categories.
     */
    protected function mapCategory(string $cat): string
    {
        if (str_contains($cat, 'জেন্টস') || str_contains($cat, 'ছেলেদের') || str_contains($cat, "Men")) {
            return "Men's Fashion";
        }
        if (str_contains($cat, 'লেডিস') || str_contains($cat, 'মেয়েদের') || str_contains($cat, "Women") || str_contains($cat, 'কাপল')) {
            return "Women's Fashion";
        }
        if (str_contains($cat, 'কিডস') || str_contains($cat, 'বেবি') || str_contains($cat, "Kids") || str_contains($cat, 'Baby')) {
            return "Kids' Fashion";
        }
        if (str_contains($cat, 'হোম') || str_contains($cat, "Home") || str_contains($cat, 'ডেকোর')) {
            return "Home & Living";
        }
        if (str_contains($cat, 'ইলেকট্রনিক্স') || str_contains($cat, "Electronics") || str_contains($cat, 'গ্যাজেট')) {
            return "Electronics";
        }
        if (str_contains($cat, 'জুয়েলারি') || str_contains($cat, "Jewell") || str_contains($cat, 'এক্সেসরিজ')) {
            return "Watches & Jewelry";
        }
        if (str_contains($cat, 'ব্যাগ') || str_contains($cat, "Bag")) {
            return "Bags & Luggage";
        }
        return "Men's Fashion";
    }

    /**
     * Download image from URL and save to storage/app/public/products.
     */
    protected function downloadAndSaveImage(string $url): ?string
    {
        try {
            $response = Http::withOptions(['verify' => false])->timeout(15)->get($url);
            if (! $response->successful()) {
                return null;
            }

            $contents = $response->body();
            $manager = new ImageManager(new Driver);
            $img = $manager->read($contents);
            $img->scale(width: 800);
            $encoded = (string) $img->encode(new JpegEncoder(quality: 85));

            $filename = 'products/' . time() . '_' . Str::random(10) . '.jpg';
            Storage::disk('public')->put($filename, $encoded);

            return $filename;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Curated catalog mapping ShopBase BD's live inventory to HaatPoint categories.
     */
    protected function getCuratedCatalog(): array
    {
        return [
            // 1. Men's Fashion - Winter Hoodie (Wholesale: 450 -> 45% markup: 653 BDT)
            [
                'name' => 'Premium Heavyweight Fleece Winter Hoodie for Men',
                'category' => "Men's Fashion",
                'subcategory' => 'Sweaters & Hoodies',
                'brand' => 'Easy',
                'wholesale_price' => 450,
                'item_weight' => 0.6,
                'product_type' => 'trending',
                'sizes' => ['M', 'L', 'XL', 'XXL'],
                'colors' => ['Black', 'Maroon', 'Bottle Green', 'Navy'],
                'images' => [
                    'https://shopbasebd.com/public/uploads/shop/products/1794490612_L_1.jpeg',
                ],
                'description' => "Stay warm and stylish with this Premium Heavyweight Fleece Winter Hoodie. Features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Soft brushed interior for maximum warmth during cold winter days.",
            ],
            // 2. Men's Fashion - Long Sleeve Polo (Wholesale: 280 -> 45% markup: 406 BDT)
            [
                'name' => 'Men Cotton Long Sleeve Winter Polo Shirt',
                'category' => "Men's Fashion",
                'subcategory' => 'T-Shirts',
                'brand' => 'Sailor',
                'wholesale_price' => 280,
                'item_weight' => 0.35,
                'product_type' => 'regular',
                'sizes' => ['M', 'L', 'XL'],
                'colors' => ['Navy Blue', 'Charcoal', 'Olive'],
                'images' => [
                    'https://shopbasebd.com/public/uploads/shop/products/1792472266_L_1.jpeg',
                ],
                'description' => "High quality 100% combed cotton long sleeve polo shirt. Perfect for light winter and smart casual office wear. Breathable and durable fabric.",
            ],
            // 3. Women's Fashion - Party Wear Sharara (Wholesale: 1920 -> 45% markup: 2784 BDT)
            [
                'name' => 'Exclusive Georgette Heavy Embroidery Sharara Three Piece',
                'category' => "Women's Fashion",
                'subcategory' => 'Salwar Kameez',
                'brand' => "Dorjibari",
                'wholesale_price' => 1920,
                'item_weight' => 0.9,
                'product_type' => 'featured',
                'sizes' => ['Free Size', '38', '40', '42'],
                'colors' => ['Wine Red', 'Peacock Blue', 'Emerald Green'],
                'images' => [
                    'https://shopbasebd.com/public/uploads/shop/products/1794314138_L_1.jpeg',
                ],
                'description' => "Gorgeous semi-stitched wedding and party wear sharara suit with heavy zari, sequin and dori work. Includes embroidered kameez, flared sharara, and dual-tone chiffon dupatta.",
            ],
            // 4. Home & Living - King Size Bedsheet (Wholesale: 780 -> 45% markup: 1131 BDT)
            [
                'name' => '3D Print King Size Pure Cotton Bedsheet Four Piece Set',
                'category' => 'Home & Living',
                'subcategory' => 'Bedding & Linen',
                'brand' => 'Walton',
                'wholesale_price' => 780,
                'item_weight' => 0.95,
                'product_type' => 'top-selling',
                'sizes' => ['King (7x8 ft)'],
                'colors' => ['Floral Blue', 'Geometric Grey', 'Pastel Pink'],
                'images' => [
                    'https://shopbasebd.com/public/uploads/shop/products/1785935068_L_5.jpeg',
                ],
                'description' => "Premium quality cherry cotton fabric king size bedsheet with two pillow covers and one bolster cover. Fast color guarantee, wrinkle resistant, and easy to wash.",
            ],
            // 5. Electronics - Wooden Digital Tasbeeh Counter (Wholesale: 280 -> 45% markup: 406 BDT)
            [
                'name' => 'Ergonomic Wooden Finish Digital Tasbeeh Electronic Counter',
                'category' => 'Electronics',
                'subcategory' => 'Smartwatches',
                'brand' => 'Xiaomi',
                'wholesale_price' => 280,
                'item_weight' => 0.15,
                'product_type' => 'new-arrival',
                'sizes' => ['Compact Pocket Size'],
                'colors' => ['Mahogany Wood', 'Teak Wood'],
                'images' => [
                    'https://shopbasebd.com/public/uploads/shop/products/1740420449_L_2.jpg',
                ],
                'description' => "Ultra-smooth ergonomic finger ring digital tally and tasbeeh counter. Features a 5-digit LCD screen, instant reset button, and durable long-lasting internal battery.",
            ],
        ];
    }
}

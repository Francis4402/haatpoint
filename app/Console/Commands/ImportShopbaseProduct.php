<?php

namespace App\Console\Commands;

use App\Models\Admin;
use App\Models\Categories;
use App\Models\Products;
use App\Models\Store;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ImportShopbaseProduct extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'shopbase:import 
                            {--file= : Path to custom JSON file with scraped products}
                            {--markup= : Optional percentage price increase from ShopBase wholesale}
                            {--fresh : Delete existing products before importing}
                            {--sample : Import curated catalog covering all categories}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import dropshipping products from ShopBase BD directly into HaatPoint Superadmin inventory with market-optimized pricing for highest profit margin';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Starting ShopBase BD import for Superadmin with Bangladesh Market-Optimized High Profit Pricing");

        $markup = $this->option('markup') ? (float) $this->option('markup') : 0.0;

        if ($this->option('fresh')) {
            $deleted = Products::query()->delete();
            $this->warn("Cleared {$deleted} previous products for fresh catalog import.");
        }

        // Find or create Superadmin
        $admin = Admin::where('role', 'superadmin')->orWhere('role', 'admin')->first();
        if (! $admin) {
            $admin = Admin::create([
                'name' => 'HaatPoint Superadmin',
                'email' => 'superadmin@haatpoint.com',
                'password' => bcrypt('password123'),
                'role' => 'superadmin',
            ]);
            $this->info("Created Superadmin account: {$admin->email}");
        } else {
            $this->info("Using Superadmin account: {$admin->name} ({$admin->email})");
        }

        // Find or create Platform Official Store
        $store = Store::firstOrCreate(
            ['name' => 'HaatPoint Official'],
            [
                'email' => $admin->email ?? 'admin@haatpoint.com',
                'storetype' => 'Platform Store',
                'address' => 'Dhaka, Bangladesh',
                'sender_city' => 1,
                'national_id' => '1000000000',
                'mobile' => '01319052507',
                'is_active' => true,
            ]
        );

        $items = [];
        $file = $this->option('file');

        if (! $file && file_exists(database_path('data/shopbase_products.json'))) {
            $file = database_path('data/shopbase_products.json');
        }

        if ($file && file_exists($file)) {
            $json = file_get_contents($file);
            $decoded = json_decode($json, true) ?? [];
            if (isset($decoded['value']['products'])) {
                $fileProducts = $decoded['value']['products'];
            } elseif (isset($decoded['products'])) {
                $fileProducts = $decoded['products'];
            } else {
                $fileProducts = $decoded;
            }
            $items = array_merge($items, $fileProducts);
            $this->info("Loaded " . count($fileProducts) . " products from {$file}");
        }

        // Merge curated catalog items to ensure broad category coverage
        $curated = $this->getCuratedCatalog();
        $items = array_merge($items, $curated);
        $this->info("Total catalog prepared: " . count($items) . " products.");

        if (empty($items)) {
            $this->error("No products found to import.");
            return 1;
        }

        $bar = $this->output->createProgressBar(count($items));
        $bar->start();

        $imported = 0;

        foreach ($items as $item) {
            $this->importSingleItem($item, $admin, $store, $markup);
            $imported++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Successfully imported {$imported} products into Superadmin platform inventory with +{$markup}% markup!");

        return 0;
    }

    /**
     * Import a single product into database with custom markup under Superadmin.
     */
    protected function importSingleItem(array $item, Admin $admin, Store $store, float $markup): void
    {
        $name = trim($item['title'] ?? $item['name'] ?? 'ShopBase Product');
        if (! empty($item['sku']) && ! str_contains($name, $item['sku'])) {
            $name .= ' (SKU: ' . $item['sku'] . ')';
        }
        $slug = Str::slug($name) . '-' . substr(md5(uniqid()), 0, 6);

        // Do NOT store images locally - use remote ShopBase CDN URLs directly
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
        $savedImages = array_values(array_slice($rawImages, 0, 4));

        $wholesale = (float) ($item['wholesalePrice'] ?? $item['wholesale_price'] ?? 500);
        $suggestedRetail = isset($item['suggestedRetailPrice']) || isset($item['regular_price'])
            ? (float) ($item['suggestedRetailPrice'] ?? $item['regular_price'])
            : null;

        // Calculate Bangladesh Market-Optimized price for maximum Superadmin profit
        $pricing = $this->calculateMarketPrices($wholesale, $suggestedRetail, $markup > 0 ? $markup : null);
        $salePrice = $pricing['sale_price'];
        $regularPrice = $pricing['regular_price'];

        // Map category to HaatPoint schema
        $category = $this->mapCategory($item['category'] ?? "Men's Fashion");
        $subcategory = $this->mapSubcategory($item['subcategory'] ?? '', $category);

        $weight = $this->estimateWeight($category, $subcategory);

        Products::create([
            'user_id' => $admin->id,
            'store_id' => $store->id,
            'name' => $name,
            'slug' => $slug,
            'category' => $category,
            'subcategory' => $subcategory,
            'brand' => $item['brand'] ?? 'ShopBase Direct',
            'quantity' => (int) ($item['quantity'] ?? 100),
            'regular_price' => $regularPrice,
            'sale_price' => $salePrice,
            'description' => $item['description'] ?? "High quality product directly sourced from verified manufacturers. 100% authentic with cash on delivery available across Bangladesh.",
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

    /**
     * Calculate optimal customer selling price and anchor regular price
     * for maximum profit based on Bangladesh e-commerce market benchmarks (Daraz / Facebook / Social Commerce).
     */
    protected function calculateMarketPrices(float $wholesale, ?float $suggestedRetail = null, ?float $customMarkup = null): array
    {
        if ($customMarkup !== null && $customMarkup > 0) {
            $optimalSale = round($wholesale * (1 + ($customMarkup / 100)));
        } elseif ($suggestedRetail && $suggestedRetail > $wholesale) {
            // Respect ShopBase's tested market retail price as the floor, and optimize for highest margin
            if ($wholesale <= 350) {
                // High margin category (tasbeeh, gadgets, light apparel): 75% - 100% margin
                $optimalSale = max($suggestedRetail, round($wholesale * 1.75));
            } elseif ($wholesale <= 600) {
                // Winter hoodies / fashion items: 80% - 90% margin
                $optimalSale = max($suggestedRetail, round($wholesale * 1.80));
            } elseif ($wholesale <= 1200) {
                // Home & living (bedsheets): 65% - 75% margin
                $optimalSale = max($suggestedRetail, round($wholesale * 1.65));
            } else {
                // Premium ethnic wear / sharara: 45% - 55% margin
                $optimalSale = max($suggestedRetail, round($wholesale * 1.48));
            }
        } else {
            if ($wholesale <= 350) {
                $optimalSale = round($wholesale * 1.75);
            } elseif ($wholesale <= 600) {
                $optimalSale = round($wholesale * 1.80);
            } elseif ($wholesale <= 1200) {
                $optimalSale = round($wholesale * 1.65);
            } else {
                $optimalSale = round($wholesale * 1.48);
            }
        }

        // Clean psychological price ending in 0 (e.g. 490, 550, 850, 1350, 2850)
        $optimalSale = (float) (ceil($optimalSale / 10) * 10);

        // Psychological strike-through regular price (25% - 35% discount anchor)
        $anchorRegular = (float) (ceil(($optimalSale * 1.35) / 50) * 50);
        if ($anchorRegular <= $optimalSale) {
            $anchorRegular = $optimalSale + 100;
        }

        return [
            'sale_price' => $optimalSale,
            'regular_price' => $anchorRegular,
        ];
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
     * Curated catalog mapping ShopBase BD's live inventory to HaatPoint categories.
     */
    protected function getCuratedCatalog(): array
    {
        return [
            // 1. Men's Fashion - Winter Hoodie (Wholesale: ৳450 -> Suggested: ৳800 -> HaatPoint: ৳850 | Net Profit: ৳400)
            [
                'name' => 'Premium Heavyweight Fleece Winter Hoodie for Men',
                'category' => "Men's Fashion",
                'subcategory' => 'Sweaters & Hoodies',
                'brand' => 'Easy',
                'wholesale_price' => 450,
                'suggestedRetailPrice' => 800,
                'item_weight' => 0.6,
                'product_type' => 'trending',
                'sizes' => ['M', 'L', 'XL', 'XXL'],
                'colors' => ['Black', 'Maroon', 'Bottle Green', 'Navy'],
                'images' => [
                    'https://shopbasebd.com/public/uploads/shop/products/1794490612_L_1.jpeg',
                ],
                'description' => "Stay warm and stylish with this Premium Heavyweight Fleece Winter Hoodie. Features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Soft brushed interior for maximum warmth during cold winter days.",
            ],
            // 2. Men's Fashion - Long Sleeve Polo (Wholesale: ৳280 -> Suggested: ৳550 -> HaatPoint: ৳550 | Net Profit: ৳270)
            [
                'name' => 'Men Cotton Long Sleeve Winter Polo Shirt',
                'category' => "Men's Fashion",
                'subcategory' => 'T-Shirts',
                'brand' => 'Sailor',
                'wholesale_price' => 280,
                'suggestedRetailPrice' => 550,
                'item_weight' => 0.35,
                'product_type' => 'regular',
                'sizes' => ['M', 'L', 'XL'],
                'colors' => ['Navy Blue', 'Charcoal', 'Olive'],
                'images' => [
                    'https://shopbasebd.com/public/uploads/shop/products/1792472266_L_1.jpeg',
                ],
                'description' => "High quality 100% combed cotton long sleeve polo shirt. Perfect for light winter and smart casual office wear. Breathable and durable fabric.",
            ],
            // 3. Women's Fashion - Party Wear Sharara (Wholesale: ৳1920 -> Suggested: ৳2700 -> HaatPoint: ৳2850 | Net Profit: ৳930)
            [
                'name' => 'Exclusive Georgette Heavy Embroidery Sharara Three Piece',
                'category' => "Women's Fashion",
                'subcategory' => 'Salwar Kameez',
                'brand' => "Dorjibari",
                'wholesale_price' => 1920,
                'suggestedRetailPrice' => 2700,
                'item_weight' => 0.9,
                'product_type' => 'featured',
                'sizes' => ['Free Size', '38', '40', '42'],
                'colors' => ['Wine Red', 'Peacock Blue', 'Emerald Green'],
                'images' => [
                    'https://shopbasebd.com/public/uploads/shop/products/1794314138_L_1.jpeg',
                ],
                'description' => "Gorgeous semi-stitched wedding and party wear sharara suit with heavy zari, sequin and dori work. Includes embroidered kameez, flared sharara, and dual-tone chiffon dupatta.",
            ],
            // 4. Home & Living - King Size Bedsheet (Wholesale: ৳780 -> Suggested: ৳1300 -> HaatPoint: ৳1300 | Net Profit: ৳520)
            [
                'name' => '3D Print King Size Pure Cotton Bedsheet Four Piece Set',
                'category' => 'Home & Living',
                'subcategory' => 'Bedding & Linen',
                'brand' => 'Walton',
                'wholesale_price' => 780,
                'suggestedRetailPrice' => 1300,
                'item_weight' => 0.95,
                'product_type' => 'top-selling',
                'sizes' => ['King (7x8 ft)'],
                'colors' => ['Floral Blue', 'Geometric Grey', 'Pastel Pink'],
                'images' => [
                    'https://shopbasebd.com/public/uploads/shop/products/1785935068_L_5.jpeg',
                ],
                'description' => "Premium quality cherry cotton fabric king size bedsheet with two pillow covers and one bolster cover. Fast color guarantee, wrinkle resistant, and easy to wash.",
            ],
            // 5. Electronics - Wooden Digital Tasbeeh Counter (Wholesale: ৳280 -> Suggested: ৳450 -> HaatPoint: ৳490 | Net Profit: ৳210)
            [
                'name' => 'Ergonomic Wooden Finish Digital Tasbeeh Electronic Counter',
                'category' => 'Electronics',
                'subcategory' => 'Smartwatches',
                'brand' => 'Xiaomi',
                'wholesale_price' => 280,
                'suggestedRetailPrice' => 450,
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

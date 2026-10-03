<?php

namespace Database\Seeders;

use App\Models\Categories;
use App\Models\Products;
use App\Models\Store;
use Database\Seeders\Concerns\GeneratesSeedImages;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class ProductsSeeder extends Seeder
{
    use GeneratesSeedImages;

    /**
     * Products created per category. 25 categories x 6 = 150 products.
     */
    private const PER_CATEGORY = 6;

    /**
     * How the product_type column is spread across each category. Every
     * product_type used by the app (ProductsController validation) is
     * represented, so /new-arrivals, /hotdeals and the /products filters all
     * have data to show.
     *
     * @var list<string>
     */
    private const TYPE_MIX = [
        'new-arrival',
        'new-arrival',
        'featured',
        'trending',
        'top-selling',
        'regular',
    ];

    /**
     * @var list<string>
     */
    private const VARIANTS = ['Pro', 'Max', 'Plus', 'Ultra', 'Classic', 'Prime', 'Elite', 'Smart'];

    /**
     * @var list<string>
     */
    private const MODEL_PREFIXES = ['AX', 'BX', 'CX', 'DX', 'EX', 'FX', 'GX', 'HX', 'JX', 'KX', 'LX', 'MX'];

    /**
     * @var list<array{0: string, 1: string}>
     */
    private const COLORS = [
        ['#1B1B1B', '#F2F2EE'],
        ['#6E7F5C', '#E7F4EF'],
        ['#4F6B63', '#C9B37E'],
        ['#FFFFFF', '#E3E1DB'],
        ['#D6430E', '#FBFBF9'],
    ];

    /**
     * Price bands per category so cheap and expensive goods are not all the
     * same price. [min, max] in BDT.
     *
     * @var array<string, array{0: int, 1: int}>
     */
    private const PRICE_BANDS = [
        'Electronics' => [1500, 95000],
        'TV & Audio' => [2500, 180000],
        'Home Appliances' => [1800, 120000],
        "Men's Fashion" => [450, 6500],
        "Women's Fashion" => [500, 8500],
        "Kids' Fashion" => [350, 4200],
        'Shoes & Footwear' => [700, 12000],
        'Bags & Luggage' => [600, 15000],
        'Watches & Jewelry' => [900, 250000],
        'Beauty & Personal Care' => [250, 6500],
        'Health & Wellness' => [180, 4800],
        'Baby & Maternity' => [400, 22000],
        'Toys & Games' => [300, 9000],
        'Sports & Fitness' => [600, 60000],
        'Automotive & Motorcycle' => [500, 35000],
        'Books & Stationery' => [150, 4500],
        'Home & Living' => [800, 90000],
        'Kitchen & Dining' => [400, 28000],
        'Pet Supplies' => [350, 18000],
        'Tools & Hardware' => [500, 22000],
        'Garden & Outdoor' => [600, 25000],
        'Office & Business' => [400, 75000],
        'Travel & Luggage' => [550, 30000],
        'Musical Instruments' => [900, 200000],
    ];

    /**
     * Categories used when the categories table has not been seeded yet, so
     * this seeder can also run on its own.
     *
     * @var list<string>
     */
    private const FALLBACK_CATEGORIES = [
        'Electronics', 'TV & Audio', 'Home Appliances', "Men's Fashion", "Women's Fashion",
        "Kids' Fashion", 'Shoes & Footwear', 'Bags & Luggage', 'Watches & Jewelry',
        'Beauty & Personal Care', 'Health & Wellness', 'Baby & Maternity',
        'Toys & Games', 'Sports & Fitness', 'Automotive & Motorcycle', 'Books & Stationery',
        'Home & Living', 'Kitchen & Dining', 'Pet Supplies', 'Tools & Hardware',
        'Garden & Outdoor', 'Office & Business', 'Travel & Luggage', 'Musical Instruments',
    ];

    /**
     * Seed products for every category, spread over every store.
     *
     * Idempotent: keyed on the unique products.slug column.
     */
    public function run(): void
    {
        $stores = Store::orderBy('name')->get();

        if ($stores->isEmpty()) {
            $this->command?->warn('No stores found - run StoreSeeder before ProductsSeeder.');

            return;
        }

        $categories = $this->categoryBlueprints();
        $created = 0;
        $storeIndex = 0;
        $categoryCount = count($categories);

        foreach ($categories as $categoryIndex => $blueprint) {
            foreach (range(0, self::PER_CATEGORY - 1) as $slot) {
                // Round-robin over the stores so no vendor ends up with the
                // entire catalogue and every store has something to show.
                $store = $stores[$storeIndex % $stores->count()];
                $storeIndex++;

                $product = $this->makeProduct($blueprint, $slot, $store, $categoryIndex, $categoryCount);

                if ($product !== null) {
                    $created++;
                }
            }
        }

        $this->command?->info(sprintf(
            'Products: %d rows for %d categories (2 new-arrival, 1 featured, 1 trending, 1 top-selling, 1 regular per category).',
            $created,
            $categoryCount
        ));
    }

    /**
     * @return list<array{name: string, brands: list<string>, subcategories: list<string>}>
     */
    private function categoryBlueprints(): array
    {
        $rows = Categories::orderBy('categories')->get();

        if ($rows->isEmpty()) {
            return array_map(
                fn (string $name) => [
                    'name' => $name,
                    'brands' => ['Haatpoint', 'Signature', 'Everyday'],
                    'subcategories' => ['Standard', 'Premium', 'Essential'],
                ],
                self::FALLBACK_CATEGORIES
            );
        }

        return $rows->map(fn (Categories $row) => [
            'name' => $row->categories,
            'brands' => $this->decodeList($row->brand),
            'subcategories' => $this->decodeList($row->subcategory),
        ])->values()->all();
    }

    /**
     * @return list<string>
     */
    private function decodeList(?string $value): array
    {
        if (! $value) {
            return [];
        }

        $decoded = json_decode($value, true);

        if (! is_array($decoded)) {
            return [];
        }

        return array_values(array_filter(array_map('trim', array_map('strval', $decoded))));
    }

    /**
     * @param  array{name: string, brands: list<string>, subcategories: list<string>}  $blueprint
     */
    private function makeProduct(
        array $blueprint,
        int $slot,
        Store $store,
        int $categoryIndex,
        int $categoryCount
    ): ?Products {
        $category = $blueprint['name'];
        $brands = $blueprint['brands'] ?: ['Signature'];
        $subcategories = $blueprint['subcategories'] ?: ['Standard'];

        $brand = $brands[$slot % count($brands)];
        $subcategory = $subcategories[($slot + $categoryIndex) % count($subcategories)];

        $variant = self::VARIANTS[$slot % count(self::VARIANTS)];
        $model = self::MODEL_PREFIXES[($slot + $categoryIndex) % count(self::MODEL_PREFIXES)]
            . (10 + (($slot * 7 + $categoryIndex) % 90));

        $name = trim("$brand $subcategory $variant $model");

        $slug = Str::slug($name);
        $productType = self::TYPE_MIX[$slot % count(self::TYPE_MIX)];

        $band = self::PRICE_BANDS[$category] ?? [500, 15000];
        $regularPrice = $this->priceFor($slot, $categoryIndex, $band);
        $salePrice = $this->salePriceFor($regularPrice, $slot, $productType);

        $colors = self::COLORS[($slot + $categoryIndex) % count(self::COLORS)];

        $image = $this->renderLabelImage(
            'product_images',
            'seed_product_' . $slug,
            $name,
            800,
            'jpg'
        );

        // Newest products get the most recent timestamps so /new-arrivals has
        // a believable ordering.
        $createdAt = Carbon::now()
            ->subDays(self::PER_CATEGORY - $slot + ($categoryIndex % 5) * 6)
            ->subHours(($slot * 3) % 24);

        // products.user_id stores the id of whoever owns the store, which is the
        // agent id for agent stores and the user id otherwise.
        return Products::updateOrCreate(
            ['slug' => $slug],
            [
                'user_id' => $store->user_id,
                'store_id' => $store->id,
                'name' => $name,
                'images' => json_encode($image ? [$image] : []),
                'category' => $category,
                'subcategory' => $subcategory,
                'brand' => $brand,
                'quantity' => $this->quantityFor($slot, $productType, $categoryIndex, $categoryCount),
                'regular_price' => $regularPrice,
                'sale_price' => $salePrice,
                'description' => $this->descriptionFor($name, $category, $subcategory, $brand, $regularPrice),
                'color' => json_encode($colors),
                'product_type' => $productType,
                'item_weight' => $this->weightFor($category),
                'inStock' => $slot !== 5 || $categoryIndex % 4 === 0,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]
        );
    }

    /**
     * Deterministic price inside the category band, rounded to a sane amount.
     *
     * @param  array{0: int, 1: int}  $band
     */
    private function priceFor(int $slot, int $categoryIndex, array $band): float
    {
        [$min, $max] = $band;
        $span = max(1, $max - $min);
        $raw = $min + (int) (crc32($slot . '|' . $categoryIndex . '|price') % $span);

        // Round to the nearest 10 so the catalogue looks hand priced.
        return round($raw / 10) * 10;
    }

    /**
     * Most items are discounted, which feeds /hotdeals.
     */
    private function salePriceFor(float $regularPrice, int $slot, string $productType): ?float
    {
        if ($slot % 3 === 0) {
            return null;
        }

        $percent = [10, 15, 20, 25, 30, 40][$slot % 6];

        // Featured / new arrivals get a smaller, believable markdown.
        if ($productType === 'new-arrival') {
            $percent = min($percent, 15);
        }

        return round($regularPrice * (1 - $percent / 100), 2);
    }

    private function quantityFor(int $slot, string $productType, int $categoryIndex, int $categoryCount): int
    {
        [$base, $step] = match ($productType) {
            'new-arrival' => [12, 3],
            'top-selling' => [60, 7],
            'trending' => [30, 4],
            'featured' => [24, 3],
            default => [8, 5],
        };

        // The category index is mixed in so the stock level differs between
        // products that share a product_type, otherwise every product of a type
        // would be left with the same stock. 7 is coprime with the category
        // count, which keeps the values unique.
        $span = max($categoryCount, 1);
        $jitter = ((($slot * 13) + ($categoryIndex * 7)) % $span) * $step;

        return $base + ($slot * $step) + $jitter;
    }

    /**
     * Rough parcel weight in kg, scaled by the price band of the category.
     */
    private function weightFor(string $category): float
    {
        $heavy = ['Electronics', 'TV & Audio', 'Home Appliances', 'Home & Living', 'Sports & Fitness'];

        if (in_array($category, $heavy, true)) {
            return round(0.5 + (crc32($category) % 900) / 100, 2);
        }

        return round(0.1 + (crc32($category) % 250) / 100, 2);
    }

    private function descriptionFor(
        string $name,
        string $category,
        string $subcategory,
        string $brand,
        float $regularPrice
    ): string {
        $features = [
            'Genuine quality guaranteed by the vendor.',
            'Cash on delivery available nationwide.',
            'Easy 7 day return policy.',
            'Spare parts and after sales support available.',
            'Packed and shipped by ' . $brand . ' authorised distributor.',
        ];

        $highlights = array_slice($features, 0, 3);

        $html = '<p>' . e($name) . ' is part of the ' . e($brand) . ' ' . e($subcategory)
            . ' line, stocked by verified sellers on HaatPoint.</p>'
            . '<p>Listed at <strong>' . number_format($regularPrice, 0) . ' BDT</strong> with nationwide delivery across Bangladesh.</p>'
            . '<ul>' . implode('', array_map(fn (string $line) => '<li>' . e($line) . '</li>', $highlights)) . '</ul>';

        return $html;
    }
}

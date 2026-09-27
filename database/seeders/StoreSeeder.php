<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Store;
use App\Models\User;
use Database\Seeders\Concerns\GeneratesSeedImages;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    use GeneratesSeedImages;

    /**
     * An agent may own at most 3 stores (StoreController::store), so each
     * seeded agent gets two.
     */
    private const STORES_PER_AGENT = 2;

    /**
     * Customer-owned storefronts, so the marketplace is not agent-only.
     */
    private const CUSTOMER_STORE_COUNT = 10;

    /**
     * Store types offered by CreateStoreForm.
     */
    private const STORE_TYPES = [
        'Retail Store',
        'E-commerce',
        'Wholesale',
        'Fashion & Apparel',
        'Electronics',
        'Home & Garden',
        'Health & Beauty',
        'Books & Media',
        'Sports & Fitness',
        'Food & Beverage',
    ];

    /**
     * Creates stores for every agent plus a handful of customer vendors.
     *
     * Idempotent: keyed on the unique stores.name column.
     */
    public function run(): void
    {
        $stores = [];
        $nationalSeq = 0;

        // ---- Agent owned stores --------------------------------------------
        $agents = Agent::orderBy('email')->get();
        $typeIndex = 0;

        foreach ($agents as $agent) {
            for ($i = 1; $i <= self::STORES_PER_AGENT; $i++) {
                $suffix = $i === 1 ? '' : ' (Branch ' . $i . ')';
                $name = $this->cleanStoreName($agent->name) . $suffix;

                $stores[] = $this->makeStore(
                    owner: $agent,
                    name: $name,
                    storetype: self::STORE_TYPES[$typeIndex % count(self::STORE_TYPES)],
                    address: $agent->address . ($i === 1 ? '' : ', Branch ' . $i),
                    nationalSeq: $nationalSeq++,
                    rating: round(3.6 + (($typeIndex % 14) / 10), 1),
                    reviewCount: 4 + ($typeIndex * 3),
                    isActive: $typeIndex % 9 !== 8,
                );

                $typeIndex++;
            }
        }

        // ---- Customer owned stores -----------------------------------------
        $vendors = User::where('role', 'user')
            ->orderBy('email')
            ->limit(self::CUSTOMER_STORE_COUNT)
            ->get();

        foreach ($vendors as $index => $vendor) {
            $label = collect(str($vendor->name)->explode(' '))->filter()->take(2)->implode(' ');

            $stores[] = $this->makeStore(
                owner: $vendor,
                name: $this->cleanStoreName($label . ' Outlet'),
                storetype: self::STORE_TYPES[$index % count(self::STORE_TYPES)],
                address: 'Shop ' . (10 + $index) . ', ' . $this->cityFor($index) . ', Bangladesh',
                nationalSeq: $nationalSeq++,
                rating: round(3.4 + (($index % 15) / 10), 1),
                reviewCount: 2 + ($index * 2),
                isActive: true,
            );
        }

        $this->command?->info(sprintf('Stores: %d created.', count($stores)));
    }

    /**
     * Create or refresh a single store row.
     */
    private function makeStore(
        object $owner,
        string $name,
        string $storetype,
        string $address,
        int $nationalSeq,
        float $rating,
        int $reviewCount,
        bool $isActive
    ): Store {
        $slug = str($this->cleanStoreName($name))->slug()->toString() ?: 'store';

        $logo = $this->renderLabelImage('store_logos', 'seed_store_' . $slug, $name, 400, 'jpg');

        $isAgent = $owner instanceof Agent;

        return Store::updateOrCreate(
            ['name' => $name],
            [
                'user_id' => $owner->id,
                'agent_id' => $isAgent ? $owner->id : null,
                'email' => $owner->email,
                'logo' => $logo,
                'address' => $address,
                'mobile' => $this->mobileFor($owner->email),
                'storetype' => $storetype,
                'national_id' => $this->nationalId($nationalSeq),
                'license' => 'LIC-' . strtoupper(substr(md5($name), 0, 10)),
                'rating' => $rating,
                'review_count' => $reviewCount,
                'is_active' => $isActive,
            ]
        );
    }

    /**
     * Stores.name is unique, so normalise anything that could collide.
     */
    private function cleanStoreName(string $name): string
    {
        $name = preg_replace('/\s*-\s*/', ' ', $name) ?? $name;
        $name = preg_replace('/\s+/', ' ', trim($name)) ?? $name;

        return mb_substr($name, 0, 120);
    }

    /**
     * Deterministic unique 11 digit Bangladeshi mobile number.
     */
    private function mobileFor(string $email): string
    {
        $taken = Store::pluck('mobile')->all();

        for ($seed = 0; $seed < 500; $seed++) {
            $candidate = '018' . str_pad(
                (string) (crc32($email . '|' . $seed) % 100000000),
                8,
                '0',
                STR_PAD_LEFT
            );

            if (! in_array($candidate, $taken, true)) {
                return $candidate;
            }
        }

        return '018' . str_pad((string) crc32($email), 8, '0', STR_PAD_LEFT);
    }

    /**
     * National ids must be exactly 10 or 17 digits (StoreController validation).
     * Every third store gets the longer 17 digit format.
     */
    private function nationalId(int $seq): string
    {
        if ($seq % 3 === 0) {
            return '1990' . str_pad((string) (1000000000000 + $seq * 7919), 13, '0', STR_PAD_LEFT);
        }

        return '9' . str_pad((string) (100000000 + $seq * 7919), 9, '0', STR_PAD_LEFT);
    }

    /**
     * @return list<string>
     */
    private function cityFor(int $index): string
    {
        $cities = [
            'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna',
            'Barishal', 'Rangpur', 'Mymensingh', 'Cumilla', 'Narayanganj',
        ];

        return $cities[$index % count($cities)];
    }
}

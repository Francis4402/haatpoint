<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Only reference data is seeded. Accounts, vendors, stores, products,
     * comments and wishlists are deliberately left empty: those demo seeders
     * create accounts that all share one published password, which must never
     * be reachable from a real environment. They are still available as opt-in
     * fixtures for a throwaway local database, for example:
     *
     *   php artisan db:seed --class=ProductsSeeder
     */
    public function run(): void
    {
        $this->call([
            CategoriesSeeder::class,
        ]);

        $this->command?->newLine();
        $this->command?->info('Seeding complete. Only categories were created.');
        $this->command?->comment('  Accounts, stores, products, comments and wishlists are intentionally not seeded.');
    }
}

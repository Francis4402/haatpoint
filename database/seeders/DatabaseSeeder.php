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
     * Order matters: categories feed the product catalogue, and stores must
     * exist before products because products.store_id is a foreign key.
     *
     * Everything is idempotent, so `php artisan db:seed` is safe to re-run.
     */
    public function run(): void
    {
        $this->call([
            CategoriesSeeder::class,
            UsersSeeder::class,
            AgentsSeeder::class,
            StoreSeeder::class,
            ProductsSeeder::class,
            CommentsSeeder::class,
            WishlistSeeder::class,
        ]);

        $this->command?->newLine();
        $this->command?->info('Seeding complete. Accounts (password: ' . UsersSeeder::PASSWORD . ')');
        $this->command?->comment('  superadmin@haatpoint.test / admin@haatpoint.test  (admins)');
        $this->command?->comment('  agent1@haatpoint.test … agent5@haatpoint.test        (vendor agents)');
        $this->command?->comment('  test@example.com …                          (customers)');
    }
}

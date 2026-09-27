<?php

namespace Database\Seeders;

use App\Models\Products;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;

class WishlistSeeder extends Seeder
{
    /**
     * Maximum products added per customer.
     */
    private const MAX_PER_CUSTOMER = 6;

    /**
     * Fills customer wishlists so the wishlist badge and the
     * /wishlist page have content.
     *
     * Idempotent: a customer/product pair is only inserted once.
     */
    public function run(): void
    {
        $customers = User::where('role', 'user')->orderBy('email')->get();
        $products = Products::orderBy('id')->get();

        if ($customers->isEmpty() || $products->isEmpty()) {
            $this->command?->warn('No customers or products found - run UsersSeeder and ProductsSeeder first.');

            return;
        }

        $created = 0;

        foreach ($customers as $customerIndex => $customer) {
            $limit = 2 + (($customerIndex * 3) % (self::MAX_PER_CUSTOMER - 1));
            $offset = $customerIndex * 5;

            for ($i = 0; $i < $limit; $i++) {
                $product = $products[($offset + $i * 3) % $products->count()];

                $exists = Wishlist::where('user_id', $customer->id)
                    ->where('product_id', $product->id)
                    ->exists();

                if ($exists) {
                    continue;
                }

                Wishlist::create([
                    'user_id' => $customer->id,
                    'product_id' => $product->id,
                ]);

                $created++;
            }
        }

        $this->command?->info(sprintf('Wishlist: %d entries created.', $created));
    }
}

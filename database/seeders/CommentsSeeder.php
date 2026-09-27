<?php

namespace Database\Seeders;

use App\Models\Comments;
use App\Models\Products;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentsSeeder extends Seeder
{
    /**
     * Reviews per product (0-3). ProductCard reads these through
     * GET /products/{id}/comments, so without them every card shows
     * "No reviews yet".
     */
    private const REVIEWS_PER_PRODUCT = 3;

    /**
     * @var list<string>
     */
    private const BODIES = [
        'Exactly as described. Delivery was quick and the packaging was solid.',
        'Good quality for the price. Would order from this vendor again.',
        'Slightly different shade than the photos but overall satisfied.',
        'Works perfectly so far, no complaints at all.',
        'Decent product, though the delivery took a few extra days.',
        'Best purchase I have made here this month. Highly recommended.',
        'Item arrived in good condition with all accessories included.',
        'Value for money. The build quality feels much more premium.',
    ];

    /**
     * Give most products a couple of ratings from seeded customers.
     *
     * Idempotent: a customer may only review a product once (see the unique
     * key used by CommentsController), so existing rows are left alone.
     */
    public function run(): void
    {
        $customers = User::where('role', 'user')->orderBy('email')->get();

        if ($customers->isEmpty()) {
            $this->command?->warn('No customers found - run UsersSeeder before CommentsSeeder.');

            return;
        }

        $created = 0;
        $cursor = 0;

        foreach (Products::orderBy('id')->get() as $product) {
            $reviewCount = ($cursor % 4);

            for ($i = 0; $i < $reviewCount; $i++) {
                $customer = $customers[($cursor + $i) % $customers->count()];

                $exists = Comments::where('user_id', $customer->id)
                    ->where('product_id', $product->id)
                    ->exists();

                if ($exists) {
                    continue;
                }

                Comments::create([
                    'user_id' => $customer->id,
                    'product_id' => $product->id,
                    'store_id' => $product->store_id,
                    'comment' => self::BODIES[($cursor + $i) % count(self::BODIES)],
                    'rating' => 3 + (($cursor + $i) % 3),
                ]);

                $created++;
            }

            $cursor++;
        }

        $this->command?->info(sprintf('Comments: %d reviews created.', $created));
    }
}

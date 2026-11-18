<?php

namespace App\Console\Commands;

use App\Models\Products;
use Illuminate\Console\Command;

class UpgradeHighResImages extends Command
{
    protected $signature = 'haatpoint:upgrade-highres-images {--chunk=50 : Concurrent chunk size} {--limit=0 : Max products to process}';
    protected $description = 'Upgrade product image URLs to high-resolution (_L_) ShopBase images without downloading files';

    public function handle()
    {
        $this->info("=== Upgrading Products to Ultra High-Res Images (Zero Downloads) ===");

        $query = Products::where('images', 'like', '%_S_%');
        $total = $query->count();
        $this->info("Found {$total} products with low-res thumbnail (_S_) images.");

        if ($total === 0) {
            $this->info("All products are already using high-res images!");
            return 0;
        }

        $limit = (int) $this->option('limit');
        if ($limit > 0) {
            $query->limit($limit);
            $total = min($total, $limit);
        }

        $chunkSize = (int) $this->option('chunk') ?: 50;
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $upgraded = 0;

        $query->chunkById($chunkSize, function ($products) use (&$upgraded, $bar) {
            $multi = curl_multi_init();
            $handles = [];

            foreach ($products as $product) {
                $imgs = json_decode($product->images, true);
                $sm = is_array($imgs) && !empty($imgs) ? $imgs[0] : null;

                if (!$sm || !preg_match('/(\d+)_S_(\d+)\.jpg$/i', $sm, $m)) {
                    continue;
                }

                $ts = (int)$m[1];
                $idx = $m[2];

                $candidates = [
                    "https://shopbasebd.com/public/uploads/shop/products/{$ts}_L_{$idx}.jpeg",
                    "https://shopbasebd.com/public/uploads/shop/products/{$ts}_L_{$idx}.jpg",
                    "https://shopbasebd.com/public/uploads/shop/products/" . ($ts + 1) . "_L_{$idx}.jpeg",
                    "https://shopbasebd.com/public/uploads/shop/products/" . ($ts - 1) . "_L_{$idx}.jpeg",
                    "https://shopbasebd.com/public/uploads/shop/products/" . ($ts + 1) . "_L_{$idx}.jpg",
                    "https://shopbasebd.com/public/uploads/shop/products/" . ($ts - 1) . "_L_{$idx}.jpg",
                    "https://shopbasebd.com/public/uploads/shop/products/" . ($ts + 2) . "_L_{$idx}.jpeg",
                ];

                foreach ($candidates as $cand) {
                    $ch = curl_init($cand);
                    curl_setopt($ch, CURLOPT_NOBODY, true);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
                    curl_multi_add_handle($multi, $ch);

                    $handles[(int)$ch] = [
                        'ch' => $ch,
                        'product' => $product,
                        'cand' => $cand,
                    ];
                }
            }

            if (!empty($handles)) {
                $running = null;
                do {
                    curl_multi_exec($multi, $running);
                    curl_multi_select($multi, 0.05);
                } while ($running > 0);

                $productFound = [];

                foreach ($handles as $item) {
                    $ch = $item['ch'];
                    $product = $item['product'];
                    $cand = $item['cand'];
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

                    if ($httpCode === 200 && !isset($productFound[$product->id])) {
                        $productFound[$product->id] = true;
                        $product->update([
                            'images' => json_encode([$cand]),
                        ]);
                        $upgraded++;
                    }

                    curl_multi_remove_handle($multi, $ch);
                    curl_close($ch);
                }
            }

            curl_multi_close($multi);
            $bar->advance(count($products));
        });

        $bar->finish();
        $this->newLine();
        $this->info("Successfully upgraded {$upgraded} products to crystal clear, high-resolution images!");

        return 0;
    }
}

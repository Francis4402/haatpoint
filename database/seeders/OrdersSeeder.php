<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Agent;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Products;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OrdersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Superadmin exists
        Admin::firstOrCreate(
            ['email' => 'admin@haatpoint.com'],
            [
                'name' => 'HaatPoint Admin',
                'password' => Hash::make('password'),
                'role' => 'superadmin',
            ]
        );

        // 2. Ensure Customer User exists
        $customer = User::firstOrCreate(
            ['email' => 'customer@haatpoint.com'],
            [
                'name' => 'Rafiqul Islam',
                'password' => Hash::make('password'),
                'mobile' => '01711223344',
                'role' => 'user',
            ]
        );

        $stores = Store::with(['products' => function ($q) {
            $q->where('quantity', '>', 0);
        }, 'agent'])->get();

        if ($stores->isEmpty()) {
            $this->command?->warn('No stores found to seed orders.');
            return;
        }

        $banglaNames = [
            'Md. Ashraful Islam', 'Tanveer Hossain', 'Nusrat Jahan', 'Farhana Akter',
            'Sabbir Ahmed', 'Mahmudul Hasan', 'Shahidul Alam', 'Rashedul Karim',
            'Sadia Afrin', 'Mehedi Hasan', 'Jannatul Ferdous', 'Kamrul Ahsan',
            'Nazmul Huda', 'Sharmin Sultana', 'Arifur Rahman', 'Tasnim Ahmed',
            'Abdur Rahim', 'Fatema Tuz Zohra', 'Imran Nazir', 'Sumaiya Khatun'
        ];

        $addresses = [
            'House 42, Road 11, Banani, Dhaka',
            'Flat 4B, Plot 18, Block D, Bashundhara R/A, Dhaka',
            '23/A Dhanmondi 27, Dhaka',
            'Sector 4, Uttara Model Town, Dhaka',
            'GEC Circle, Nasirabad, Chattogram',
            'Agrabad Commercial Area, Chattogram',
            'Zindabazar, Sylhet Sadar, Sylhet',
            'KDA Avenue, Sonadanga, Khulna',
            'Shaheb Bazar, Rajshahi',
            'Police Line Road, Rangpur'
        ];

        $orderCount = 80;
        $createdOrders = 0;

        for ($i = 0; $i < $orderCount; $i++) {
            $store = $stores->random();
            $products = $store->products;

            if ($products->isEmpty()) {
                continue;
            }

            // Pick 1 to 3 items
            $itemCount = min($products->count(), rand(1, 3));
            $selectedProducts = $products->random($itemCount);

            $orderNumber = 'ORD-' . strtoupper(Str::random(4)) . '-' . rand(1000, 9999);
            $recipientName = $banglaNames[array_rand($banglaNames)];
            $recipientPhone = '01' . rand(3, 9) . rand(10000000, 99999999);
            $recipientAddress = $addresses[array_rand($addresses)];

            // Status weighting: 65% delivered & paid, 15% processing/shipped, 10% pending, 10% cancelled
            $randStatus = rand(1, 100);
            if ($randStatus <= 65) {
                $orderStatus = 'delivered';
                $paymentStatus = 'paid';
            } elseif ($randStatus <= 80) {
                $orderStatus = rand(0, 1) ? 'processing' : 'shipped';
                $paymentStatus = rand(0, 1) ? 'paid' : 'pending';
            } elseif ($randStatus <= 90) {
                $orderStatus = 'pending';
                $paymentStatus = 'pending';
            } else {
                $orderStatus = 'cancelled';
                $paymentStatus = 'failed';
            }

            $orderDate = now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));

            $deliveryCharge = rand(0, 1) ? 60.00 : 120.00;
            $subtotal = 0.00;
            $totalQuantity = 0;
            $itemsData = [];

            foreach ($selectedProducts as $prod) {
                $qty = rand(1, 3);
                $price = (float) ($prod->sale_price ?? $prod->regular_price ?? 500);
                $itemTotal = $price * $qty;
                $subtotal += $itemTotal;
                $totalQuantity += $qty;

                // Extract image
                $image = null;
                if (!empty($prod->images)) {
                    $imgs = is_string($prod->images) ? json_decode($prod->images, true) : $prod->images;
                    if (is_array($imgs) && !empty($imgs)) {
                        $image = $imgs[0];
                    } elseif (is_string($prod->images)) {
                        $image = $prod->images;
                    }
                }

                $itemsData[] = [
                    'product_id' => $prod->id,
                    'product_name' => $prod->name,
                    'product_image' => $image ?? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
                    'quantity' => $qty,
                    'price' => $price,
                    'total' => $itemTotal,
                    'size' => !empty($prod->sizes) ? (is_array($prod->sizes) ? $prod->sizes[0] : 'M') : null,
                    'color' => !empty($prod->colors) ? (is_array($prod->colors) ? $prod->colors[0] : 'Black') : null,
                ];
            }

            $total = $subtotal + $deliveryCharge;

            $order = Orders::create([
                'user_id' => $customer->id,
                'agent_id' => $store->agent_id,
                'store_id' => $store->id,
                'sender_name' => $store->name,
                'sender_email' => $store->email ?? 'store@haatpoint.com',
                'sender_phone' => $store->mobile ?? '01700000000',
                'recipient_name' => $recipientName,
                'recipient_email' => strtolower(Str::slug($recipientName)) . rand(1, 99) . '@gmail.com',
                'recipient_phone' => $recipientPhone,
                'recipient_address' => $recipientAddress,
                'recipient_city' => 1,
                'recipient_zone' => 1,
                'recipient_area' => 1,
                'delivery_type' => 48,
                'item_type' => 2,
                'special_instruction' => 'Handle with care',
                'item_quantity' => $totalQuantity,
                'item_weight' => 1,
                'amount_to_collect' => $paymentStatus === 'paid' ? 0 : (int) $total,
                'item_description' => 'E-commerce goods',
                'store_name' => $store->name,
                'order_number' => $orderNumber,
                'subtotal' => $subtotal,
                'delivery_charge' => $deliveryCharge,
                'total' => $total,
                'shipping_method' => 'pathao',
                'payment_method' => $paymentStatus === 'paid' ? 'bikash' : 'cash_on_delivery',
                'payment_status' => $paymentStatus,
                'order_status' => $orderStatus,
                'transaction_id' => $paymentStatus === 'paid' ? 'TRX' . rand(100000000, 999999999) : null,
                'created_at' => $orderDate,
                'updated_at' => $orderDate,
            ]);

            foreach ($itemsData as $item) {
                OrderItems::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'product_image' => $item['product_image'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['total'],
                    'size' => $item['size'],
                    'color' => $item['color'],
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);
            }

            $createdOrders++;
        }

        $this->command?->info("Orders seeding complete: {$createdOrders} orders created with realistic items and statuses.");
    }
}

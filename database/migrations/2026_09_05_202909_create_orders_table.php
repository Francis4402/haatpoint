<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('store_id')->constrained('stores')->cascadeOnDelete();
            $table->string('merchant_order_id')->nullable();
            $table->string('sender_name');
            $table->string('sender_email')->nullable();
            $table->string('sender_phone');
            $table->string('recipient_name');
            $table->string('recipient_email');
            $table->string('recipient_phone');
            $table->string('recipient_address');
            $table->integer('recipient_city');
            $table->integer('recipient_zone');
            $table->integer('recipient_area')->nullable();
            $table->integer('delivery_type')->default(48);
            $table->unsignedBigInteger('item_type')->default(2);
            $table->string('special_instruction')->nullable();
            $table->integer('item_quantity')->default(1);
            $table->integer('item_weight');
            $table->unsignedBigInteger('amount_to_collect');
            $table->string('item_description');
            $table->string('store_name');
            $table->string('order_number')->unique();

            $table->decimal('subtotal', 10, 2);
            $table->decimal('delivery_charge', 10, 2)->default(0);
            $table->decimal('total', 10, 2);

            // Discount/Coupon
            $table->string('coupon_code')->nullable();
            $table->decimal('discount_amount')->default(0);

            // Tracking
            $table->string('tracking_number')->nullable()->unique();
            $table->string('shipping_method')->default('pathao');

            // Order Status
            $table->enum('payment_method', ['cash_on_delivery', 'bikash'])->default('cash_on_delivery');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->enum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])->default('pending');

            // Additional Fields
            $table->text('notes')->nullable();
            $table->longText('items')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

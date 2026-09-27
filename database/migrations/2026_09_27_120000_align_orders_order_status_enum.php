<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The UI and UpdateOrdersRequest treat "confirmed" as a real order status, but
 * the original enum omitted it while including "returned", so any attempt to
 * set an order to "confirmed" died on a MySQL enum violation (surfacing as a
 * silent "failed to update"). Align the column with Orders::ORDER_STATUSES.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('order_status', [
                'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned',
            ])->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('order_status', [
                'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned',
            ])->default('pending')->change();
        });
    }
};

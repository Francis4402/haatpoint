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
        Schema::table('stores', function (Blueprint $table) {
            $table->index('is_active');
            $table->index(['agent_id', 'is_active']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->index('order_status');
            $table->index('payment_status');
            $table->index('created_at');
            $table->index(['store_id', 'order_status']);
            $table->index(['user_id', 'order_status']);
            $table->index(['order_status', 'created_at']);
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->index('is_read');
            $table->index(['user_id', 'is_read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['agent_id', 'is_active']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['order_status']);
            $table->dropIndex(['payment_status']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['store_id', 'order_status']);
            $table->dropIndex(['user_id', 'order_status']);
            $table->dropIndex(['order_status', 'created_at']);
        });

        Schema::table('contacts', function (Blueprint $table) {
            $table->dropIndex(['is_read']);
            $table->dropIndex(['user_id', 'is_read']);
        });
    }
};

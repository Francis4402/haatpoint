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
        Schema::table('products', function (Blueprint $table) {
            $table->index('slug');
            $table->index('is_active');
            $table->index('is_blocked');
            $table->index('product_type');
            $table->index('category');
            $table->index('brand');
            $table->index('created_at');
            $table->index(['is_active', 'is_blocked', 'created_at'], 'products_visible_created_at_idx');
            $table->index(['is_active', 'is_blocked', 'product_type'], 'products_visible_type_idx');
            $table->index(['is_active', 'is_blocked', 'category'], 'products_visible_category_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['is_blocked']);
            $table->dropIndex(['product_type']);
            $table->dropIndex(['category']);
            $table->dropIndex(['brand']);
            $table->dropIndex(['created_at']);
            $table->dropIndex('products_visible_created_at_idx');
            $table->dropIndex('products_visible_type_idx');
            $table->dropIndex('products_visible_category_idx');
        });
    }
};

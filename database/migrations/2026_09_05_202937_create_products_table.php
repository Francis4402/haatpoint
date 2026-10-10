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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('store_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('images');
            $table->string('slug');
            $table->string('category');
            $table->string('subcategory');
            $table->string('brand');
            $table->integer('quantity')->default(1);
            $table->decimal('regular_price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->mediumText('description');
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->enum('product_type', ['top-selling', 'trending', 'featured', 'regular', 'new-arrival'])
                  ->default('regular');
            $table->decimal('item_weight', 8, 2);
            $table->boolean('inStock')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

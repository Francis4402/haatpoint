<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('transaction_id')->nullable()->after('payment_method');
        });

        // Allow both 'cash_on_delivery', 'bikash', and 'bkash' in payment_method
        try {
            DB::statement("ALTER TABLE `orders` MODIFY `payment_method` ENUM('cash_on_delivery', 'bikash', 'bkash') DEFAULT 'cash_on_delivery'");
        } catch (\Throwable $e) {
            // Ignore if driver doesn't support raw enum alter (e.g. SQLite in tests)
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('transaction_id');
        });
    }
};

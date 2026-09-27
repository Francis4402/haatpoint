<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agents manage stores via stores.agent_id, and their own placed orders
     * are tracked on orders.agent_id (orders.user_id only accepts users).
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->foreignUuid('agent_id')->nullable()->after('user_id')
                ->constrained('agents')->nullOnDelete();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        if (DB::getDriverName() !== 'sqlite') {
                DB::statement('ALTER TABLE `orders` MODIFY `user_id` CHAR(36) NULL');
            }

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreignUuid('agent_id')->nullable()->after('user_id')
                ->constrained('agents')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['agent_id']);
            $table->dropColumn('agent_id');
        });

        if (DB::getDriverName() !== 'sqlite') {
                DB::statement('ALTER TABLE `orders` MODIFY `user_id` CHAR(36) NOT NULL');
            }

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('stores', function (Blueprint $table) {
            $table->dropForeign(['agent_id']);
            $table->dropColumn('agent_id');
        });
    }
};

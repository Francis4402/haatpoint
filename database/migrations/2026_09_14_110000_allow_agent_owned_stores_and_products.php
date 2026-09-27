<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agents own stores via stores.agent_id; their stores/products cannot
     * reference users.user_id (FK is users-only). Make user_id nullable so
     * agent-created stores and products can omit it.
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        if (DB::getDriverName() !== 'sqlite') {
            if (DB::getDriverName() !== 'sqlite') {
                DB::statement('ALTER TABLE `stores` MODIFY `user_id` CHAR(36) NULL');
            }
        }

        Schema::table('stores', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        if (DB::getDriverName() !== 'sqlite') {
                DB::statement('ALTER TABLE `products` MODIFY `user_id` CHAR(36) NULL');
            }

        Schema::table('products', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        DB::statement("UPDATE `stores` SET `user_id` = NULL WHERE `user_id` IS NULL");

        Schema::table('stores', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        DB::statement("UPDATE `products` SET `user_id` = NULL WHERE `user_id` IS NULL");

        Schema::table('products', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A wishlist belongs to whoever is actually signed in, and this app has two
     * separate identity tables: customers in `users` and vendors in `agents`.
     * `user_id` used to be NOT NULL with a foreign key to `users`, so a vendor
     * signed in through the `agent` guard always produced a foreign key
     * violation on insert - the row could never be created.
     */
    public function up(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->uuid('agent_id')->nullable()->after('user_id')->constrained('agents')->cascadeOnDelete();
            $table->uuid('user_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropConstrainedForeignId('agent_id');
            $table->uuid('user_id')->nullable(false)->change();
        });
    }
};

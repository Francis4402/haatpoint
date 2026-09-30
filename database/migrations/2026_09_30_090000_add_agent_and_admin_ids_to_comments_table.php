<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A comment belongs to whoever is actually signed in, and this app has three
     * separate identity tables: customers in `users`, vendors in `agents` and
     * staff in `admins`. `user_id` used to be NOT NULL with a foreign key to
     * `users`, so anyone signed in through the `agent` or `admin` guard produced
     * a NOT NULL violation on insert - the row could never be created.
     *
     * The column changes and the foreign keys must run in separate
     * Schema::table() calls. MySQL applies ->change() by rebuilding the column
     * definition, and when it shares a closure with ->constrained() the
     * constraints added in that same closure are silently dropped. That is why
     * the wishlists migration also ended up with an agent_id column but no
     * foreign key on it.
     */
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->uuid('agent_id')->nullable()->after('user_id');
            $table->uuid('admin_id')->nullable()->after('agent_id');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->change();
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->foreign('agent_id')->references('id')->on('agents')->cascadeOnDelete();
            $table->foreign('admin_id')->references('id')->on('admins')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['agent_id']);
            $table->dropForeign(['admin_id']);
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn(['agent_id', 'admin_id']);
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->uuid('user_id')->nullable(false)->change();
        });
    }
};

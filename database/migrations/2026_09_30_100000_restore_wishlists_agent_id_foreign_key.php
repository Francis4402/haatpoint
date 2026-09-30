<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Corrects the wishlists agent_id foreign key.
     *
     * The original migration added `agent_id` and changed `user_id` to nullable
     * in the same Schema::table() closure. On MySQL, ->change() rebuilds the
     * column definition, which silently discards the foreign key created by
     * ->constrained() in that same closure. The column exists but was never
     * constrained, so an agent id was never verified against `agents` and a
     * dangling row could be written.
     *
     * The columns and the nullable change are already applied; only the missing
     * constraint is added here, in its own closure.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('wishlists', 'agent_id') || $this->hasAgentForeignKey()) {
            return;
        }

        Schema::table('wishlists', function (Blueprint $table) {
            $table->foreign('agent_id')->references('id')->on('agents')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        if (!Schema::hasColumn('wishlists', 'agent_id') || !$this->hasAgentForeignKey()) {
            return;
        }

        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropForeign(['agent_id']);
        });
    }

    private function hasAgentForeignKey(): bool
    {
        // information_schema is MySQL/MariaDB only; SQLite has no such view,
        // and the test suite runs on an in-memory SQLite database.
        if (DB::getDriverName() !== 'mysql' && DB::getDriverName() !== 'mariadb') {
            return true;
        }

        $row = DB::selectOne(
            "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = 'wishlists'
               AND COLUMN_NAME = 'agent_id'
               AND REFERENCED_TABLE_NAME IS NOT NULL
             LIMIT 1"
        );

        return $row !== null;
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add generic OAuth provider columns to every auth table and backfill
     * the legacy google_id values so existing Google logins keep working.
     */
    public function up(): void
    {
        foreach (['users', 'admins', 'agents'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->string('provider')->nullable()->after('google_id');
                $table->string('provider_id')->nullable()->after('provider');
                $table->index(['provider', 'provider_id']);
            });

            DB::table($table)
                ->whereNotNull('google_id')
                ->update(['provider' => 'google', 'provider_id' => DB::raw('google_id')]);
        }
    }

    public function down(): void
    {
        foreach (['users', 'admins', 'agents'] as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropIndex(['provider', 'provider_id']);
                $table->dropColumn(['provider', 'provider_id']);
            });
        }
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Superadmins can block any account; a blocked account is denied login.
     */
    public function up(): void
    {
        foreach (['users', 'agents', 'admins'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->boolean('blocked')->default(false)->after('email_verified_at');
            });
        }
    }

    public function down(): void
    {
        foreach (['users', 'agents', 'admins'] as $table) {
            Schema::table($table, function (Blueprint $t) {
                $t->dropColumn('blocked');
            });
        }
    }
};
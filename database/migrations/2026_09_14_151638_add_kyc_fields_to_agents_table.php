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
        Schema::table('agents', function (Blueprint $table) {
            $table->text('address')->nullable()->after('images');
            $table->string('mobile')->nullable()->unique()->after('address');
            $table->string('national_id')->nullable()->unique()->after('mobile');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            $table->dropUnique(['national_id']);
            $table->dropUnique(['mobile']);
            $table->dropColumn(['address', 'mobile', 'national_id']);
        });
    }
};

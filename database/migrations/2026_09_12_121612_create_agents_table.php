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
        Schema::create('agents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('agent');
            $table->string('images')->nullable();
            $table->string('google_id')->nullable()->unique();
            $table->string('plan')->default('free');
            $table->timestamp('subscription_ends_at')->nullable();
            // bKash payment for HaatPoint Pro. A pending row is what the
            // superadmin reviews; Pro only activates once it is approved.
            $table->string('subscription_payment_status')->default('none');
            $table->string('subscription_trx_id')->nullable();
            $table->decimal('subscription_payment_amount', 8, 2)->nullable();
            $table->timestamp('subscription_payment_submitted_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agents');
    }
};

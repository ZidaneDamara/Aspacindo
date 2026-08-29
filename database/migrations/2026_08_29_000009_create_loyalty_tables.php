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
        Schema::create('loyalty_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('member_code')->unique()->index();
            $table->enum('tier', ['Silver', 'Gold', 'Platinum'])->default('Silver')->index();
            $table->unsignedInteger('points_balance')->default(0)->index();
            $table->unsignedInteger('total_points_earned')->default(0)->index();
            $table->string('phone_number')->unique()->index();
            $table->timestamp('joined_at')->useCurrent()->index();
            $table->timestamps();
        });

        Schema::create('loyalty_point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loyalty_member_id')->constrained('loyalty_members')->cascadeOnDelete();
            $table->enum('type', ['earn', 'redeem', 'expire', 'adjustment'])->index();
            $table->enum('source', ['motor_purchase', 'service', 'sparepart_purchase', 'referral', 'event', 'admin_adjustment'])->index();
            $table->integer('points');
            $table->string('description');
            $table->string('related_reference')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('loyalty_rewards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('image')->nullable();
            $table->unsignedInteger('points_cost')->index();
            $table->enum('reward_type', ['service_discount', 'sparepart_voucher', 'merchandise', 'free_oil_change']);
            $table->integer('stock_quantity')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('loyalty_redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loyalty_member_id')->constrained('loyalty_members')->cascadeOnDelete();
            $table->foreignId('loyalty_reward_id')->constrained('loyalty_rewards')->cascadeOnDelete();
            $table->unsignedInteger('points_spent');
            $table->enum('status', ['pending', 'approved', 'fulfilled', 'rejected'])->default('pending')->index();
            $table->timestamp('redeemed_at')->useCurrent()->index();
            $table->timestamp('fulfilled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalty_redemptions');
        Schema::dropIfExists('loyalty_rewards');
        Schema::dropIfExists('loyalty_point_transactions');
        Schema::dropIfExists('loyalty_members');
    }
};

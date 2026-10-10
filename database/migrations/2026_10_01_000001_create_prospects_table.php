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
        Schema::create('prospects', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('current_motorcycle')->nullable();
            
            $table->foreignId('motorcycle_id')->nullable()->constrained('motorcycles')->nullOnDelete();
            $table->string('motorcycle_name');
            $table->decimal('price_otr', 15, 2);
            $table->decimal('dp_amount', 15, 2);
            $table->integer('dp_percent');
            $table->integer('tenor_months');
            $table->string('leasing_partner');
            $table->decimal('monthly_installment', 15, 2);
            $table->text('notes')->nullable();

            $table->enum('status', ['new', 'contacted', 'prospect', 'deal', 'rejected'])->default('new');
            $table->text('follow_up_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prospects');
    }
};

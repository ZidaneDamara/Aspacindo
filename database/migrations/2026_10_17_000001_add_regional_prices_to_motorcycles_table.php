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
        Schema::table('motorcycles', function (Blueprint $table) {
            $table->json('regional_prices')->nullable()->after('price_otr');
        });

        // Modify branches table to support all 7 regions including Indragiri Hilir
        Schema::table('branches', function (Blueprint $table) {
            $table->string('region', 50)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('motorcycles', function (Blueprint $table) {
            $table->dropColumn('regional_prices');
        });
    }
};

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
        Schema::create('site_visits', function (Blueprint $table) {
            $table->id();
            $table->date('visit_date')->unique();
            $table->unsignedBigInteger('page_views')->default(0);
            $table->unsignedBigInteger('unique_visitors')->default(0);
            $table->unsignedBigInteger('mobile_views')->default(0);
            $table->unsignedBigInteger('desktop_views')->default(0);
            $table->timestamps();
        });

        Schema::create('search_logs', function (Blueprint $table) {
            $table->id();
            $table->string('keyword')->index();
            $table->unsignedBigInteger('search_count')->default(1);
            $table->timestamp('last_searched_at')->nullable();
            $table->timestamps();
        });

        if (Schema::hasTable('motorcycles') && !Schema::hasColumn('motorcycles', 'views_count')) {
            Schema::table('motorcycles', function (Blueprint $table) {
                $table->unsignedBigInteger('views_count')->default(0)->after('price_otr');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('motorcycles') && Schema::hasColumn('motorcycles', 'views_count')) {
            Schema::table('motorcycles', function (Blueprint $table) {
                $table->dropColumn('views_count');
            });
        }
        Schema::dropIfExists('search_logs');
        Schema::dropIfExists('site_visits');
    }
};


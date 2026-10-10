<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('focus_keyword')->nullable()->after('author');
            $table->text('meta_description')->nullable()->after('focus_keyword');
            $table->unsignedInteger('views_count')->default(0)->after('meta_description');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['focus_keyword', 'meta_description', 'views_count']);
        });
    }
};

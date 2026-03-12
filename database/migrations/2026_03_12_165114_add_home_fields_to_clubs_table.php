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
    Schema::table('clubs', function (Blueprint $table) {
        $table->boolean('is_featured_home')->default(false)->after('logo');
        $table->integer('home_order')->nullable()->after('is_featured_home');
    });
}

public function down(): void
{
    Schema::table('clubs', function (Blueprint $table) {
        $table->dropColumn(['is_featured_home', 'home_order']);
    });
}
};

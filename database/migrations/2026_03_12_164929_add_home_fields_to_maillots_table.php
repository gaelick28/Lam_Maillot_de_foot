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
    Schema::table('maillots', function (Blueprint $table) {
        $table->boolean('is_featured')->default(false)->after('image_dos');
        $table->boolean('is_new')->default(false)->after('is_featured');
        $table->string('badge')->nullable()->after('is_new');
        $table->integer('home_order')->nullable()->after('badge');
    });
}

public function down(): void
{
    Schema::table('maillots', function (Blueprint $table) {
        $table->dropColumn(['is_featured', 'is_new', 'badge', 'home_order']);
    });
}
};

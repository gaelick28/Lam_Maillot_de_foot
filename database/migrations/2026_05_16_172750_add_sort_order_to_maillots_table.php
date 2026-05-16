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
        $table->integer('sort_order')->nullable()->after('home_order');
    });
}

public function down(): void
{
    Schema::table('maillots', function (Blueprint $table) {
        $table->dropColumn('sort_order');
    });
}
};

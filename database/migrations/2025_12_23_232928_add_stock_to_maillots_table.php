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
            $table->integer('stock_s')->default(0)->after('price');
            $table->integer('stock_m')->default(0)->after('stock_s');
            $table->integer('stock_l')->default(0)->after('stock_m');
            $table->integer('stock_xl')->default(0)->after('stock_l');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('maillots', function (Blueprint $table) {
            $table->dropColumn(['stock_s', 'stock_m', 'stock_l', 'stock_xl']);
        });
    }
};
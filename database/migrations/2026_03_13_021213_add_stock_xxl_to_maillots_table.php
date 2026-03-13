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
        $table->integer('stock_xxl')->default(0)->after('stock_xl');
    });
}

public function down(): void
{
    Schema::table('maillots', function (Blueprint $table) {
        $table->dropColumn('stock_xxl');
    });
}
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPriceToMaillotsTable extends Migration
{
    public function up(): void
    {
        Schema::table('maillots', function (Blueprint $table) {
            $table->decimal('price', 8, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('maillots', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('cart_items', function (Blueprint $table) {
        $table->dropForeign(['product_id']);
        $table->dropColumn('product_id');
        $table->foreignId('maillot_id')->after('cart_id')->constrained('maillots');
    });
}

public function down()
{
    Schema::table('cart_items', function (Blueprint $table) {
        $table->dropForeign(['maillot_id']);
        $table->dropColumn('maillot_id');
        $table->foreignId('product_id')->constrained('products');
    });
}

};

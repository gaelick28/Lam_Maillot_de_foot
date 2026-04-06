<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
{
    Schema::table('cart_items', function (Blueprint $table) {
        // Supprime la contrainte seulement si elle existe (MySQL ok, PostgreSQL propre)
        try {
            $table->dropForeign(['product_id']);
        } catch (\Exception $e) {
            // Contrainte absente sur cette DB, on ignore
        }

        // Supprime la colonne seulement si elle existe
        if (Schema::hasColumn('cart_items', 'product_id')) {
            $table->dropColumn('product_id');
        }

        // Ajoute maillot_id seulement si elle n'existe pas déjà
        if (!Schema::hasColumn('cart_items', 'maillot_id')) {
            $table->foreignId('maillot_id')->after('cart_id')->constrained('maillots');
        }
    });
}

public function down()
{
    Schema::table('cart_items', function (Blueprint $table) {
        try {
            $table->dropForeign(['maillot_id']);
        } catch (\Exception $e) {}

        if (Schema::hasColumn('cart_items', 'maillot_id')) {
            $table->dropColumn('maillot_id');
        }

        if (!Schema::hasColumn('cart_items', 'product_id')) {
            $table->foreignId('product_id')->constrained('products');
        }
    });
}

};

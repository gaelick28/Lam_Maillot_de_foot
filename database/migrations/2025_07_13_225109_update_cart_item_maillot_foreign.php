<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Supprime la contrainte uniquement si elle existe (compatible PostgreSQL)
        DB::statement("
            DO \$\$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = 'cart_items_product_id_foreign'
                    AND table_name = 'cart_items'
                ) THEN
                    ALTER TABLE cart_items DROP CONSTRAINT cart_items_product_id_foreign;
                END IF;
            END \$\$;
        ");

        Schema::table('cart_items', function (Blueprint $table) {
            if (Schema::hasColumn('cart_items', 'product_id')) {
                $table->dropColumn('product_id');
            }
            if (!Schema::hasColumn('cart_items', 'maillot_id')) {
                $table->foreignId('maillot_id')->after('cart_id')->constrained('maillots');
            }
        });
    }

    public function down()
    {
        DB::statement("
            DO \$\$ BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.table_constraints
                    WHERE constraint_name = 'cart_items_maillot_id_foreign'
                    AND table_name = 'cart_items'
                ) THEN
                    ALTER TABLE cart_items DROP CONSTRAINT cart_items_maillot_id_foreign;
                END IF;
            END \$\$;
        ");

        Schema::table('cart_items', function (Blueprint $table) {
            if (Schema::hasColumn('cart_items', 'maillot_id')) {
                $table->dropColumn('maillot_id');
            }
            if (!Schema::hasColumn('cart_items', 'product_id')) {
                $table->foreignId('product_id')->constrained('products');
            }
        });
    }
};

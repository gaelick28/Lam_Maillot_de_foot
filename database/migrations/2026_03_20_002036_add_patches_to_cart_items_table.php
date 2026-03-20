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
    Schema::table('cart_items', function (Blueprint $table) {
        $table->json('patches')->nullable()->after('numero');
    });
}

public function down(): void
{
    Schema::table('cart_items', function (Blueprint $table) {
        $table->dropColumn('patches');
    });
    }
};

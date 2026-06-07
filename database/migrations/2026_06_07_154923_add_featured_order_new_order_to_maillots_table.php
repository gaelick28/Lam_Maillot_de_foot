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
            $table->integer('featured_order')->nullable()->after('home_order');
            $table->integer('new_order')->nullable()->after('featured_order');
        });
    }

    public function down(): void
    {
        Schema::table('maillots', function (Blueprint $table) {
            $table->dropColumn(['featured_order', 'new_order']);
        });
    }
};

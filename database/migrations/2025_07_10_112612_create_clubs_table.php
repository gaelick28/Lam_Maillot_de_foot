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
    {Schema::create('clubs', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->timestamps();
});

        // Ajout de la colonne 'logo' pour stocker l'URL du logo du club
    //     Schema::table('clubs', function (Blueprint $table) {
    //         $table->string('logo')->nullable()->after('slug');
    //     });

    // // Ajout de la colonne 'description' pour stocker une description du club
    // Schema::table('clubs', function (Blueprint $table) {
    //     $table->text('description')->nullable()->after('logo');
    // });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clubs');
    }
};

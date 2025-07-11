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
        Schema::create('maillots', function (Blueprint $table) {
    $table->id();
    $table->foreignId('club_id')->constrained()->onDelete('cascade');
    $table->string('nom');
    $table->string('image'); // chemin ou URL de l'image
    $table->timestamps();
});
        // Schema::table('maillots', function (Blueprint $table) {
        //     $table->string('description')->nullable(); // Ajout d'une colonne description
        //     $table->decimal('prix', 8, 2)->default(0.00); // Ajout d'une colonne prix
        //     $table->boolean('disponible')->default(true); // Ajout d'une colonne disponible
        // });
        // Schema::table('maillots', function (Blueprint $table) {
        //     $table->string('taille')->nullable(); // Ajout d'une colonne taille
        //     $table->string('couleur')->nullable(); // Ajout d'une colonne couleur
        //     $table->integer('quantite')->default(0); // Ajout d'une colonne quantite
        //     $table->string('code_barre')->nullable(); // Ajout d'une colonne code_barre
        // });
       
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maillots');
    }
};

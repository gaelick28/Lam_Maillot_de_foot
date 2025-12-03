<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('maillot_id')->nullable()->constrained('maillots')->onDelete('set null');
            
            // Snapshot des infos produit (au moment de la commande)
            $table->string('maillot_name'); // Nom du maillot
            $table->string('club_name')->nullable(); // Nom du club
            $table->decimal('unit_price', 10, 2); // Prix unitaire
            
            // Détails commande
            $table->string('size'); // Taille (S, M, L, XL, XXL)
            $table->integer('quantity')->default(1); // Quantité
            
            // Personnalisation (optionnelle)
            $table->string('numero')->nullable(); // Numéro flocage (1-99)
            $table->string('nom')->nullable(); // Nom flocage
            $table->decimal('personalization_cost', 10, 2)->default(0); // Coût personnalisation
            
            // Calcul
            $table->decimal('subtotal', 10, 2); // Prix total ligne (unit_price + perso) * quantity
            
            $table->timestamps();
            
            // Index
            $table->index('order_id');
            $table->index('maillot_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
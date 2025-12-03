<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('order_number')->unique(); // Ex: "CMD-2025-0001"
            
            // Montants
            $table->decimal('subtotal', 10, 2); // Total articles
            $table->decimal('shipping_cost', 10, 2)->default(0); // Frais de port
            $table->decimal('total_amount', 10, 2); // Total final
            
            // Adresses (foreign keys vers user_addresses)
            $table->foreignId('shipping_address_id')->constrained('user_addresses')->onDelete('restrict');
            $table->foreignId('billing_address_id')->constrained('user_addresses')->onDelete('restrict');
            
            // Paiement
            $table->enum('payment_method', ['card', 'paypal', 'transfer'])->default('card');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('paid');
            
            // Statut commande
            $table->enum('order_status', [
                'pending',      // En attente
                'processing',   // En préparation
                'shipped',      // Expédiée
                'delivered',    // Livrée
                'cancelled'     // Annulée
            ])->default('pending');
            
            // Dates
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            
            $table->timestamps();
            
            // Index pour recherches rapides
            $table->index('user_id');
            $table->index('order_number');
            $table->index('order_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
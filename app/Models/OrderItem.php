<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'maillot_id',
        'maillot_name',
        'club_name',
        'unit_price',
        'size',
        'quantity',
        'numero',
        'nom',
        'personalization_cost',
        'subtotal',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'personalization_cost' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'quantity' => 'integer',
    ];

    /**
     * Relation : Un article appartient à une commande
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Relation : Un article peut être lié à un maillot (nullable si maillot supprimé)
     */
    public function maillot(): BelongsTo
    {
        return $this->belongsTo(Maillot::class);
    }

    /**
     * Accessor : Affichage personnalisation
     */
    public function getPersonalizationTextAttribute(): ?string
    {
        $parts = [];
        
        if ($this->numero) {
            $parts[] = "N°{$this->numero}";
        }
        
        if ($this->nom) {
            $parts[] = strtoupper($this->nom);
        }
        
        return empty($parts) ? null : implode(' - ', $parts);
    }

    /**
     * Accessor : A une personnalisation ?
     */
    public function getHasPersonalizationAttribute(): bool
    {
        return !empty($this->numero) || !empty($this->nom);
    }
}
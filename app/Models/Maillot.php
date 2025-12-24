<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maillot extends Model
{
    protected $fillable = [
        'club_id',
        'nom',
        'image',
        'price',
        'stock_s',
        'stock_m',
        'stock_l',
        'stock_xl',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_s' => 'integer',
        'stock_m' => 'integer',
        'stock_l' => 'integer',
        'stock_xl' => 'integer',
    ];

    /**
     * Relation : Un maillot appartient à un club
     */
    public function club()
    {
        return $this->belongsTo(Club::class);
    }

    /**
     * Calculer le stock total pour ce maillot
     */
    public function getTotalStockAttribute()
    {
        return $this->stock_s + $this->stock_m + $this->stock_l + $this->stock_xl;
    }

    /**
     * Vérifier si une taille est en stock
     */
    public function hasSizeInStock($size)
    {
        $stockColumn = 'stock_' . strtolower($size);
        return $this->$stockColumn > 0;
    }

    /**
     * Obtenir le stock pour une taille donnée
     */
    public function getStockForSize($size)
    {
        $stockColumn = 'stock_' . strtolower($size);
        return $this->$stockColumn ?? 0;
    }

    /**
     * Décrémenter le stock d'une taille
     */
    public function decrementStock($size, $quantity = 1)
    {
        $stockColumn = 'stock_' . strtolower($size);
        
        if ($this->$stockColumn >= $quantity) {
            $this->decrement($stockColumn, $quantity);
            return true;
        }
        
        return false;
    }

    /**
     * Incrémenter le stock d'une taille
     */
    public function incrementStock($size, $quantity = 1)
    {
        $stockColumn = 'stock_' . strtolower($size);
        $this->increment($stockColumn, $quantity);
    }
}
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
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    
    /** Relation : Un maillot appartient à un club */
     public function club()
    {
        return $this->belongsTo(Club::class);
    }
    
}

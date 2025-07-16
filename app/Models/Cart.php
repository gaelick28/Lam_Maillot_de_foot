<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;
    protected $fillable = ['user_id'];

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }
}



use App\Models\Maillot;

class CartItem extends Model
{
    use HasFactory;
    protected $fillable = ['cart_id', 'maillot_id', 'size', 'quantity', 'numero', 'nom'];

    public function maillot()
    {
        return $this->belongsTo(Maillot::class); // ou Maillot::class
    }
   
   
    public function items()
{
    return $this->hasMany(CartItem::class);
}

}

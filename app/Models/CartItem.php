<?php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'maillot_id',  
        'size',
        'quantity',
        'numero',
        'nom',
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function maillot()
    {
        return $this->belongsTo(Maillot::class);
    }
}

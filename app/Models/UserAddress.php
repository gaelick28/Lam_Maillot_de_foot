<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'first_name',
        'last_name',
        'street',
        'city',
        'postal_code',
        'country',
        'phone',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Relation avec l'utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 🔥 Relation : Commandes utilisant cette adresse comme adresse de livraison
     */
    public function ordersAsShipping()
    {
        return $this->hasMany(Order::class, 'shipping_address_id');
    }

    /**
     * 🔥 Relation : Commandes utilisant cette adresse comme adresse de facturation
     */
    public function ordersAsBilling()
    {
        return $this->hasMany(Order::class, 'billing_address_id');
    }

    /**
     * 🔥 Vérifier si cette adresse est verrouillée (utilisée dans des commandes)
     */
    public function isLocked()
    {
        return $this->ordersAsShipping()->exists() || $this->ordersAsBilling()->exists();
    }

    /**
     * 🔥 Obtenir le nombre total de commandes utilisant cette adresse
     */
    public function getTotalOrdersCountAttribute()
    {
        return $this->ordersAsShipping()->count() + $this->ordersAsBilling()->count();
    }

    /**
     * Formater l'adresse complète
     */
    public function getFullAddressAttribute()
    {
        return trim(sprintf(
            "%s %s\n%s\n%s %s\n%s",
            $this->first_name,
            $this->last_name,
            $this->street,
            $this->postal_code,
            $this->city,
            $this->country
        ));
    }
}
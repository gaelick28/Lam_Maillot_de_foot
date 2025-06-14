<?php

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'type', // 'billing' ou 'shipping'
        'first_name',
        'last_name',
        'street',
        'city',
        'postal_code',
        'country',
        'phone',
        'is_default',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

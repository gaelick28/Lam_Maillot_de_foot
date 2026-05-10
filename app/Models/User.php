<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Builder;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'phone',
        'birth_date',
        'gender',
        'is_active',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'birth_date' => 'date',
        'is_active' => 'boolean',
        'role' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function sessions(): HasMany
    {
        return $this->hasMany(UserSession::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(UserAddress::class);
    }


    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    // Méthodes utilitaires
    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    public function isAdmin()
    {
        return $this->username === 'admin';
    }
    public function user()
{
    return $this->belongsTo(User::class);
}

//Wishlist relation
public function wishlists()
{
    return $this->hasMany(Wishlist::class);
}

public function orders()
{
    return $this->hasMany(Order::class);
}
}

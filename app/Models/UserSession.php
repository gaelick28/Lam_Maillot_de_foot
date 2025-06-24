<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSession extends Model
{
    protected $fillable = [
        'id',
        'user_id',
        'expires_at',
        'ip_address',
        'user_agent',
        'last_activity',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'last_activity' => 'datetime',
        'created_at' => 'datetime',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now());
    }

    // Méthodes utilitaires
    public function isExpired()
    {
        return $this->expires_at < now();
    }

    public function updateActivity()
    {
        $this->update(['last_activity' => now()]);
    }
}

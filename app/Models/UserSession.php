<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

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
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('expires_at', '>', now());
    }

    // Méthodes utilitaires
    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }

    public function updateActivity(): void
    {
        $this->update(['last_activity' => now()]);
    }
}

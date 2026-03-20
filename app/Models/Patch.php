<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patch extends Model
{
    protected $fillable = ['nom', 'prix'];

    public function clubs()
    {
        return $this->belongsToMany(Club::class);
    }
}

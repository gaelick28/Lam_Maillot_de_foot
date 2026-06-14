<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
protected $fillable = [
        'name',
        'slug',
        'category',
        'logo',
        'image',
        'is_featured_home',
         'home_order',
         'sort_name',
    ];


    public function maillots()
    {
        return $this->hasMany(Maillot::class);
    }

    public function patches()
{
    return $this->belongsToMany(Patch::class)
        ->orderBy('patches.display_order');
}
}

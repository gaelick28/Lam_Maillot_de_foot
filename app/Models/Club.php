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
    ];


    public function maillots()
    {
        return $this->hasMany(Maillot::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    public function maillots()
    {
        return $this->hasMany(Maillot::class);
    }
}

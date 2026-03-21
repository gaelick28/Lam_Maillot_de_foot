<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PatchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
{
    $patches = [
        ['nom' => 'Ligue 1', 'prix' => 3.00],
        ['nom' => 'Champions League', 'prix' => 3.00],
        ['nom' => 'Fondation UEFA pour l\'enfance', 'prix' => 3.00],
        ['nom' => 'Serie A', 'prix' => 3.00],
        ['nom' => 'Liga', 'prix' => 3.00],
        ['nom' => 'Bundesliga', 'prix' => 3.00],
        ['nom' => 'Premier League', 'prix' => 3.00],
        ['nom' => 'UEFA Nations League', 'prix' => 3.00],
        ['nom' => 'FIFA World Cup', 'prix' => 3.00],
        ['nom' => 'CAN', 'prix' => 3.00],
        ['nom' => 'CONMEBOL Copa América', 'prix' => 3.00],
    ];

    foreach ($patches as $patch) {
        \App\Models\Patch::create($patch);
    }
}
}

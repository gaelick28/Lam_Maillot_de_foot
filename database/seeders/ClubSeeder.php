<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Club;

class ClubSeeder extends Seeder
{
    public function run(): void
    {
        // Clubs ajoutés sans duplication
        $clubs = [
            ['name' => 'AS Cannes', 'slug' => 'cannes'],
            ['name' => 'Inde', 'slug' => 'inde'],
            ['name' => 'Grêmio', 'slug' => 'gremio'],
            ['name' => 'Flamengo', 'slug' => 'flamengo'],
        ];

        foreach ($clubs as $club) {
            Club::updateOrCreate(
                ['slug' => $club['slug']],
                ['name' => $club['name']]
            );
        }

        $this->command?->info(' Clubs ajoutés ou déjà présents : Cannes, Inde, Grêmio');
    }
}

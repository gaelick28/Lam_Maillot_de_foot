<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Http\Controllers\CategoryController;
use App\Models\Club;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // ✨ Nouvelles props partagées : catégories pour le Header
            'categories' => $this->getCategoriesData(),
        ];
    }

    /**
     * Génère les données des catégories pour le Header
     * 
     * @return array
     */
    private function getCategoriesData()
    {
        // Créer une instance du controller pour accéder à la config
        $controller = new CategoryController();
        $config = $controller->getCategoryConfig();
        
        // Créer un collator français pour le tri
        $collator = new \Collator('fr_FR');
        
        $categories = [];
        
        foreach ($config as $slug => $data) {
            // Récupérer les clubs de cette catégorie depuis la DB
            $clubs = Club::whereIn('slug', $data['slugs'])
                ->get(['name', 'slug'])
                ->sortBy(function($club) use ($collator) {
                    return $club->name;
                }, SORT_REGULAR, false)
                ->map(function($club) {
                    return [
                        'name' => $club->name,
                        'href' => "/clubs/{$club->slug}/maillots"
                    ];
                })
                ->values()
                ->toArray();
            
            $categories[] = [
                'name' => $data['title'],
                'slug' => $slug,
                'clubs' => $clubs
            ];
        }
        
        return $categories;
    }
}
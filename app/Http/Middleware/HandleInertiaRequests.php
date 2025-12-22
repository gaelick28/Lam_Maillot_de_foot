<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
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
    // Si l'utilisateur vient de se connecter, fusionner le panier
    if (Auth::check() && Session::has('cart')) {
        app(CartController::class)->mergeSessionCart();
    }

    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
        ],
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
    
    $categories = [];
    
    foreach ($config as $slug => $data) {
        // ✅ CHANGEMENT : Charger les clubs basé sur la catégorie en BDD
        $clubs = Club::where('category', $slug)
            ->orderBy('name', 'asc')
            ->get(['name', 'slug'])
            ->map(function($club) {
                return [
                    'name' => $club->name,
                    'href' => "/clubs/{$club->slug}/maillots"
                ];
            })
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
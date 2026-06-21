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
         'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                ],
                'config' => [
            'exclusivePatchPairs' => config('patches.exclusive_pairs'),
        ],
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
    ->get(['name', 'slug', 'logo', 'sort_name'])
    ->sortBy(function($club) {
    $key = $club->sort_name 
        ? mb_strtolower($club->sort_name) 
        : mb_strtolower($club->name);
    
    return strtr($key, [
        'é' => 'e', 'è' => 'e', 'ê' => 'e',
        'à' => 'a', 'â' => 'a',
        'ù' => 'u', 'û' => 'u',
        'ô' => 'o', 'ö' => 'o',
        'î' => 'i', 'ï' => 'i',
        'ç' => 'c',
    ]);
})
    ->values()
    ->map(function($club) {
        return [
            'name' => $club->name,
            'href' => "/clubs/{$club->slug}/maillots",
            'logo' => $club->logo,
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
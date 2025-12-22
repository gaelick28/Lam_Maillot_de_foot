<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminClubController extends Controller
{
    // Liste des catégories disponibles
    private function getCategories()
    {
        return [
            ['slug' => 'selections-nationales', 'name' => 'Sélections nationales'],
            ['slug' => 'ligue-1', 'name' => 'Ligue 1'],
            ['slug' => 'premier-league', 'name' => 'Premier League'],
            ['slug' => 'bundesliga', 'name' => 'Bundesliga'],
            ['slug' => 'liga', 'name' => 'La Liga'],
            ['slug' => 'serie-a', 'name' => 'Serie A'],
            ['slug' => 'autres-clubs', 'name' => 'Autres clubs'],
        ];
    }

    /**
     * Afficher la liste des clubs
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $clubs = Club::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%");
            })
            ->withCount('maillots')
            ->orderBy('name', 'asc')
            ->paginate(20)
            ->withQueryString();

        // Ajouter le nom complet de la catégorie
        $categories = collect($this->getCategories());
        $clubs->getCollection()->transform(function ($club) use ($categories) {
            $category = $categories->firstWhere('slug', $club->category);
            $club->category_name = $category ? $category['name'] : $club->category;
            return $club;
        });

        return Inertia::render('AdminClubsIndex', [
            'clubs' => $clubs,
            'filters' => [
                'search' => $search,
            ],
            'categories' => $this->getCategories(),
            'auth' => [
                'user' => auth('web')->user()
            ]
        ]);
    }

    /**
     * Enregistrer un nouveau club
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:clubs,name',
            'category' => 'required|string|max:100',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        // Générer le slug automatiquement
        $validated['slug'] = Str::slug($validated['name']);

        // Gérer l'upload du logo
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('clubs', 'public');
            $validated['logo'] = 'storage/' . $logoPath;
        }

        Club::create($validated);

        return redirect()->route('admin.clubs.index')
            ->with('success', 'Club créé avec succès.');
    }

    /**
     * Mettre à jour un club
     */
    public function update(Request $request, Club $club)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:clubs,name,' . $club->id,
            'category' => 'required|string|max:100',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        // Mettre à jour le slug si le nom change
        if ($validated['name'] !== $club->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Gérer l'upload du nouveau logo
        if ($request->hasFile('logo')) {
            // Supprimer l'ancien logo si existe
            if ($club->logo && file_exists(public_path($club->logo))) {
                unlink(public_path($club->logo));
            }

            $logoPath = $request->file('logo')->store('clubs', 'public');
            $validated['logo'] = 'storage/' . $logoPath;
        }

        $club->update($validated);

        return redirect()->route('admin.clubs.index')
            ->with('success', 'Club modifié avec succès.');
    }

    /**
     * Supprimer un club
     */
    public function destroy(Club $club)
    {
        // Vérifier si le club a des maillots associés
        if ($club->maillots()->count() > 0) {
            return redirect()->route('admin.clubs.index')
                ->with('error', 'Impossible de supprimer ce club car il contient des maillots.');
        }

        // Supprimer le logo si existe
        if ($club->logo && file_exists(public_path($club->logo))) {
            unlink(public_path($club->logo));
        }

        $club->delete();

        return redirect()->route('admin.clubs.index')
            ->with('success', 'Club supprimé avec succès.');
    }
}
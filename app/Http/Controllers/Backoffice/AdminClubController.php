<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Models\Club;
use App\Models\Patch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class AdminClubController extends Controller
{
    /**
     * Liste des catégories disponibles.
     */
    private function getCategories(): array
    {
        return [
            ['slug' => 'selections-nationales', 'name' => 'Sélections nationales'],
            ['slug' => 'ligue-1',               'name' => 'Ligue 1'],
            ['slug' => 'premier-league',        'name' => 'Premier League'],
            ['slug' => 'bundesliga',            'name' => 'Bundesliga'],
            ['slug' => 'liga',                  'name' => 'La Liga'],
            ['slug' => 'serie-a',               'name' => 'Serie A'],
            ['slug' => 'autres-clubs',          'name' => 'Autres clubs'],
        ];
    }

    /**
     * Règles de validation communes à store() et update().
     * Pour update(), on passe l'id du club pour ignorer l'unicité sur lui-même.
     */
    private function validationRules(?int $clubId = null): array
    {
        return [
            'name'             => 'required|string|max:255|unique:clubs,name' . ($clubId ? ",{$clubId}" : ''),
            'category'         => 'required|string|max:100',
            'logo'             => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'image'            => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'is_featured_home' => 'boolean',
            'home_order'       => 'nullable|integer',
            'patch_ids'        => 'nullable|array',
            'patch_ids.*'      => 'exists:patches,id',
        ];
    }

    /**
     * Gère l'upload d'une image et supprime l'ancienne si elle existe.
     * Retourne le chemin relatif ou null si pas de fichier.
     */
    private function handleImageUpload(Request $request, string $field, ?string $oldPath = null): ?string
    {
        if (!$request->hasFile($field)) {
            return null;
        }

        if ($oldPath && file_exists(public_path($oldPath))) {
            try {
                unlink(public_path($oldPath));
            } catch (\Exception $e) {
                // Fichier verrouillé sur Windows, on continue
            }
        }

        $path = $request->file($field)->store('clubs', 'public');
        return 'storage/' . $path;
    }

    /**
     * Afficher la liste des clubs
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $clubs = Club::query()
            ->when($search, fn($query, $search) =>
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%")
            )
            ->withCount('maillots')
            ->with('patches')
            ->orderBy('name', 'asc')
            ->paginate(20)
            ->withQueryString();

        $categories = collect($this->getCategories());
        $clubs->getCollection()->transform(function ($club) use ($categories) {
            $category            = $categories->firstWhere('slug', $club->category);
            $club->category_name = $category ? $category['name'] : $club->category;
            return $club;
        });

        return Inertia::render('AdminClubsIndex', [
            'clubs'      => $clubs,
            'filters'    => ['search' => $search],
            'categories' => $this->getCategories(),
            'patches'    => Patch::all(),
            'auth'       => ['user' => auth('web')->user()],
        ]);
    }

    /**
     * Enregistrer un nouveau club
     */
    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        $validated['slug'] = Str::slug($validated['name']);

        if ($path = $this->handleImageUpload($request, 'logo')) {
            $validated['logo'] = $path;
        }

        if ($path = $this->handleImageUpload($request, 'image')) {
            $validated['image'] = $path;
        }

        $club = Club::create($validated);
        $club->patches()->sync($request->input('patch_ids', []));

        return redirect()->route('admin.clubs.index')
            ->with('success', 'Club créé avec succès.');
    }

    /**
     * Mettre à jour un club
     */
    public function update(Request $request, Club $club)
    {
        $validated = $request->validate($this->validationRules($club->id));

        if ($validated['name'] !== $club->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        if ($path = $this->handleImageUpload($request, 'logo', $club->logo)) {
            $validated['logo'] = $path;
        } else {
            unset($validated['logo']);
        }

        if ($path = $this->handleImageUpload($request, 'image', $club->image)) {
            $validated['image'] = $path;
        } else {
            unset($validated['image']);
        }

        $club->update($validated);
        $club->patches()->sync($request->input('patch_ids', []));

        return redirect()->route('admin.clubs.index')
            ->with('success', 'Club modifié avec succès.');
    }

    /**
     * Supprimer un club
     */
    public function destroy(Club $club)
    {
        if ($club->maillots()->count() > 0) {
            return redirect()->route('admin.clubs.index')
                ->with('error', 'Impossible de supprimer ce club car il contient des maillots.');
        }

        if ($club->logo && file_exists(public_path($club->logo))) {
            unlink(public_path($club->logo));
        }

        if ($club->image && file_exists(public_path($club->image))) {
            unlink(public_path($club->image));
        }

        $club->delete();

        return redirect()->route('admin.clubs.index')
            ->with('success', 'Club supprimé avec succès.');
    }
}
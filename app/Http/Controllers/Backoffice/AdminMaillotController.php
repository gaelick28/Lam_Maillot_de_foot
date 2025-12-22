<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Models\Maillot;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminMaillotController extends Controller
{
    /**
     * Afficher la liste des maillots
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $clubFilter = $request->get('club');

        $maillots = Maillot::query()
            ->with('club')
            ->when($search, function ($query, $search) {
                $query->where('nom', 'like', "%{$search}%");
            })
            ->when($clubFilter, function ($query, $clubFilter) {
                $query->where('club_id', $clubFilter);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        $clubs = Club::orderBy('name', 'asc')->get(['id', 'name']);

        return Inertia::render('AdminMaillotsIndex', [
            'maillots' => $maillots,
            'clubs' => $clubs,
            'filters' => [
                'search' => $search,
                'club' => $clubFilter,
            ],
            'auth' => [
                'user' => auth('web')->user()
            ]
        ]);
    }

    /**
     * Enregistrer un nouveau maillot
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'club_id' => 'required|exists:clubs,id',
            'nom' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        // Upload de l'image
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('maillots', 'public');
            $validated['image'] = 'storage/' . $imagePath;
        }

        Maillot::create($validated);

        return redirect()->route('admin.maillots.index')
            ->with('success', 'Maillot créé avec succès.');
    }

    /**
 * Mettre à jour un maillot
 */
public function update(Request $request, Maillot $maillot)
{
    $validated = $request->validate([
        'club_id' => 'required|exists:clubs,id',
        'nom' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
    ]);

    // Upload de la nouvelle image SEULEMENT si fournie
    if ($request->hasFile('image')) {
        // Supprimer l'ancienne image
        if ($maillot->image && file_exists(public_path($maillot->image))) {
            unlink(public_path($maillot->image));
        }

        $imagePath = $request->file('image')->store('maillots', 'public');
        $validated['image'] = 'storage/' . $imagePath;
    } else {
        // ✅ IMPORTANT : Ne pas toucher à l'image si aucun fichier uploadé
        unset($validated['image']);
    }

    $maillot->update($validated);

    return redirect()->route('admin.maillots.index')
        ->with('success', 'Maillot modifié avec succès.');
}

    /**
     * Supprimer un maillot
     */
    public function destroy(Maillot $maillot)
    {
        // Supprimer l'image
        if ($maillot->image && file_exists(public_path($maillot->image))) {
            unlink(public_path($maillot->image));
        }

        $maillot->delete();

        return redirect()->route('admin.maillots.index')
            ->with('success', 'Maillot supprimé avec succès.');
    }
}
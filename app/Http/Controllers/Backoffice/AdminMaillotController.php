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
        $stockFilter = $request->get('stock'); // 'low', 'out', 'partial', 'all'

        $maillots = Maillot::query()
            ->with('club')
            ->when($search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhereHas('club', function($clubQuery) use ($search) {
                          $clubQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($clubFilter, function ($query, $clubFilter) {
                $query->where('club_id', $clubFilter);
            })
            ->when($stockFilter, function ($query, $stockFilter) {
                if ($stockFilter === 'out') {
                    // ✅ Rupture totale (toutes les tailles à 0)
                    $query->where('stock_s', 0)
                          ->where('stock_m', 0)
                          ->where('stock_l', 0)
                          ->where('stock_xl', 0);
                } elseif ($stockFilter === 'partial') {
                    // ✅ Rupture partielle (au moins une taille à 0, mais pas toutes)
                    $query->where(function($q) {
                        $q->where('stock_s', 0)
                          ->orWhere('stock_m', 0)
                          ->orWhere('stock_l', 0)
                          ->orWhere('stock_xl', 0);
                    })
                    ->whereRaw('(stock_s + stock_m + stock_l + stock_xl) > 0');
                } elseif ($stockFilter === 'low') {
                    // ✅ Stock faible total (total < 10 et > 0)
                    $query->whereRaw('(stock_s + stock_m + stock_l + stock_xl) < 10')
                          ->whereRaw('(stock_s + stock_m + stock_l + stock_xl) > 0');
                } elseif ($stockFilter === 'low_partial') {
                    // ✅ NOUVEAU : Stock faible partiel (au moins une taille < 5)
                    $query->where(function($q) {
                        $q->where(function($subQ) {
                            $subQ->where('stock_s', '<', 5)->where('stock_s', '>', 0);
                        })
                        ->orWhere(function($subQ) {
                            $subQ->where('stock_m', '<', 5)->where('stock_m', '>', 0);
                        })
                        ->orWhere(function($subQ) {
                            $subQ->where('stock_l', '<', 5)->where('stock_l', '>', 0);
                        })
                        ->orWhere(function($subQ) {
                            $subQ->where('stock_xl', '<', 5)->where('stock_xl', '>', 0);
                        });
                    });
                }
            })
            ->join('clubs', 'maillots.club_id', '=', 'clubs.id')
            ->orderBy('clubs.name', 'asc')
            ->orderBy('maillots.nom', 'asc')
            ->select('maillots.*')
            ->paginate(20)
            ->withQueryString();

        // Ajouter le stock total pour chaque maillot
        $maillots->getCollection()->transform(function ($maillot) {
            $maillot->total_stock = $maillot->stock_s + $maillot->stock_m + $maillot->stock_l + $maillot->stock_xl;
            return $maillot;
        });

        $clubs = Club::orderBy('name', 'asc')->get(['id', 'name']);

        return Inertia::render('AdminMaillotsIndex', [
            'maillots' => $maillots,
            'clubs' => $clubs,
            'filters' => [
                'search' => $search,
                'club' => $clubFilter,
                'stock' => $stockFilter,
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
            'stock_s' => 'required|integer|min:0',
            'stock_m' => 'required|integer|min:0',
            'stock_l' => 'required|integer|min:0',
            'stock_xl' => 'required|integer|min:0',
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
            'stock_s' => 'required|integer|min:0',
            'stock_m' => 'required|integer|min:0',
            'stock_l' => 'required|integer|min:0',
            'stock_xl' => 'required|integer|min:0',
        ]);

        // Upload de la nouvelle image si fournie
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($maillot->image && file_exists(public_path($maillot->image))) {
                unlink(public_path($maillot->image));
            }

            $imagePath = $request->file('image')->store('maillots', 'public');
            $validated['image'] = 'storage/' . $imagePath;
        } else {
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
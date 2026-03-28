<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Models\Maillot;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMaillotController extends Controller
{
    /**
     * Règles de validation communes à store() et update().
     * Pour store(), image est required. Pour update(), nullable.
     */
    private function validationRules(bool $isStore = true): array
    {
        return [
            'club_id'     => 'required|exists:clubs,id',
            'nom'         => 'required|string|max:255',
            'price'       => 'required|numeric|min:0',
            'image'       => ($isStore ? 'required' : 'nullable') . '|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'image_dos'   => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'stock_s'     => 'required|integer|min:0',
            'stock_m'     => 'required|integer|min:0',
            'stock_l'     => 'required|integer|min:0',
            'stock_xl'    => 'required|integer|min:0',
            'stock_xxl'   => 'required|integer|min:0',
            'is_featured' => 'boolean',
            'is_new'      => 'boolean',
            'badge'       => 'nullable|string|max:50',
            'home_order'  => 'nullable|integer',
            'description' => 'nullable|string',
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

        // Supprimer l'ancienne image si elle existe
        if ($oldPath && file_exists(public_path($oldPath))) {
            unlink(public_path($oldPath));
        }

        $path = $request->file($field)->store('maillots', 'public');
        return 'storage/' . $path;
    }

    /**
     * Afficher la liste des maillots
     */
    public function index(Request $request)
    {
        $search      = $request->get('search');
        $clubFilter  = $request->get('club');
        $stockFilter = $request->get('stock');

        $maillots = Maillot::query()
            ->with('club')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhereHas('club', fn($cq) => $cq->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($clubFilter, fn($query, $clubFilter) => $query->where('club_id', $clubFilter))
            ->when($stockFilter, function ($query, $stockFilter) {
                match ($stockFilter) {
                    'out' => $query->where('stock_s', 0)->where('stock_m', 0)->where('stock_l', 0)
                                   ->where('stock_xl', 0)->where('stock_xxl', 0),
                    'partial' => $query->where(fn($q) =>
                                        $q->where('stock_s', 0)->orWhere('stock_m', 0)->orWhere('stock_l', 0)
                                          ->orWhere('stock_xl', 0)->orWhere('stock_xxl', 0))
                                       ->whereRaw('(stock_s + stock_m + stock_l + stock_xl + stock_xxl) > 0'),
                    'low' => $query->whereRaw('(stock_s + stock_m + stock_l + stock_xl + stock_xxl) < 10')
                                   ->whereRaw('(stock_s + stock_m + stock_l + stock_xl + stock_xxl) > 0'),
                    'low_partial' => $query->where(fn($q) =>
                                        $q->where(fn($s) => $s->where('stock_s', '<', 5)->where('stock_s', '>', 0))
                                          ->orWhere(fn($s) => $s->where('stock_m', '<', 5)->where('stock_m', '>', 0))
                                          ->orWhere(fn($s) => $s->where('stock_l', '<', 5)->where('stock_l', '>', 0))
                                          ->orWhere(fn($s) => $s->where('stock_xl', '<', 5)->where('stock_xl', '>', 0))
                                          ->orWhere(fn($s) => $s->where('stock_xxl', '<', 5)->where('stock_xxl', '>', 0))),
                    default => null,
                };
            })
            ->join('clubs', 'maillots.club_id', '=', 'clubs.id')
            ->orderBy('clubs.name', 'asc')
            ->orderBy('maillots.nom', 'asc')
            ->select('maillots.*')
            ->paginate(20)
            ->withQueryString();

        $maillots->getCollection()->transform(function ($maillot) {
            $maillot->total_stock = $maillot->stock_s + $maillot->stock_m + $maillot->stock_l + $maillot->stock_xl + $maillot->stock_xxl;
            return $maillot;
        });

        return Inertia::render('AdminMaillotsIndex', [
            'maillots' => $maillots,
            'clubs'    => Club::orderBy('name', 'asc')->get(['id', 'name']),
            'filters'  => ['search' => $search, 'club' => $clubFilter, 'stock' => $stockFilter],
            'auth'     => ['user' => auth('web')->user()],
        ]);
    }

    /**
     * Enregistrer un nouveau maillot
     */
    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules(isStore: true));

        if ($path = $this->handleImageUpload($request, 'image')) {
            $validated['image'] = $path;
        }

        if ($path = $this->handleImageUpload($request, 'image_dos')) {
            $validated['image_dos'] = $path;
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
        $validated = $request->validate($this->validationRules(isStore: false));

        if ($path = $this->handleImageUpload($request, 'image', $maillot->image)) {
            $validated['image'] = $path;
        } else {
            unset($validated['image']);
        }

        if ($path = $this->handleImageUpload($request, 'image_dos', $maillot->image_dos)) {
            $validated['image_dos'] = $path;
        } else {
            unset($validated['image_dos']);
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
        if ($maillot->image && file_exists(public_path($maillot->image))) {
            unlink(public_path($maillot->image));
        }

        if ($maillot->image_dos && file_exists(public_path($maillot->image_dos))) {
            unlink(public_path($maillot->image_dos));
        }

        $maillot->delete();

        return redirect()->route('admin.maillots.index')
            ->with('success', 'Maillot supprimé avec succès.');
    }
}
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
            'stock_s'   => 'nullable|integer|min:0',
            'stock_m'   => 'nullable|integer|min:0',
            'stock_l'   => 'nullable|integer|min:0',
            'stock_xl'  => 'nullable|integer|min:0',
            'stock_xxl' => 'nullable|integer|min:0',
            'is_featured' => 'boolean',
            'is_new'      => 'boolean',
            'badge'       => 'nullable|string|max:50',
            'home_order'  => 'nullable|integer',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
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

    if (env('RENDER')) {
        $cloudinary = new \Cloudinary\Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
        ]);

        $result = $cloudinary->uploadApi()->upload(
            $request->file($field)->getRealPath(),
            ['folder' => 'fou2foot/maillots']
        );

        return $result['secure_url'];
    }

    if ($oldPath && str_starts_with($oldPath, 'images/') && file_exists(public_path($oldPath))) {
        try { unlink(public_path($oldPath)); } catch (\Exception $e) {}
    }

    $file = $request->file($field);
    $filename = $file->hashName();
    $file->move(public_path('images/maillot/images_maillot'), $filename);
    return 'images/maillot/images_maillot/' . $filename;
}

// Supprime une image de Cloudinary à partir de son URL
private function deleteCloudinaryImage(string $url): void
{
    if (!str_starts_with($url, 'https://res.cloudinary.com')) return;

    $cloudinary = new \Cloudinary\Cloudinary([
        'cloud' => [
            'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
            'api_key'    => env('CLOUDINARY_API_KEY'),
            'api_secret' => env('CLOUDINARY_API_SECRET'),
        ],
    ]);

    $publicId = 'fou2foot/maillots/' . pathinfo(parse_url($url, PHP_URL_PATH), PATHINFO_FILENAME);
    $cloudinary->uploadApi()->destroy($publicId);
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
                $operator = config('database.default') === 'pgsql' ? 'ILIKE' : 'LIKE';
                $q->where('nom', $operator, "%{$search}%")
                ->orWhereHas('club', fn($cq) => $cq->where('name', $operator, "%{$search}%")
                    ->orWhere('slug', $operator, "%{$search}%"));
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
            ->orderByRaw(
            config('database.default') === 'pgsql'
                ? "lower(COALESCE(clubs.sort_name, clubs.name)) ASC"
                : "COALESCE(clubs.sort_name, clubs.name) ASC"
            )
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

        $validated['stock_s']   = $validated['stock_s']   ?? 25;
        $validated['stock_m']   = $validated['stock_m']   ?? 25;
        $validated['stock_l']   = $validated['stock_l']   ?? 25;
        $validated['stock_xl']  = $validated['stock_xl']  ?? 25;
        $validated['stock_xxl'] = $validated['stock_xxl'] ?? 25;

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

    // Gestion image principale
    if ($request->boolean('remove_image') && $maillot->image) {
        if (env('RENDER')) $this->deleteCloudinaryImage($maillot->image);
        $validated['image'] = null;
    } elseif ($path = $this->handleImageUpload($request, 'image', $maillot->image)) {
        $validated['image'] = $path;
    } else {
        unset($validated['image']);
    }

    // Gestion image dos
    if ($request->boolean('remove_image_dos') && $maillot->image_dos) {
        if (env('RENDER')) $this->deleteCloudinaryImage($maillot->image_dos);
        $validated['image_dos'] = null;
    } elseif ($path = $this->handleImageUpload($request, 'image_dos', $maillot->image_dos)) {
        $validated['image_dos'] = $path;
    } else {
        unset($validated['image_dos']);
    }

// Décalage automatique des sort_order du même club
if (!empty($validated['sort_order'])) {
    $newOrder = (int) $validated['sort_order'];
    $oldOrder = $maillot->sort_order;

    if ($oldOrder && $oldOrder !== $newOrder) {
        if ($oldOrder < $newOrder) {
            // Déplace vers le bas : comble le trou laissé
            Maillot::where('club_id', $maillot->club_id)
                ->where('id', '!=', $maillot->id)
                ->where('sort_order', '>', $oldOrder)
                ->where('sort_order', '<=', $newOrder)
                ->whereNotNull('sort_order')
                ->decrement('sort_order');
        } else {
            // Déplace vers le haut : écarte les maillots
            Maillot::where('club_id', $maillot->club_id)
                ->where('id', '!=', $maillot->id)
                ->where('sort_order', '>=', $newOrder)
                ->where('sort_order', '<', $oldOrder)
                ->whereNotNull('sort_order')
                ->increment('sort_order');
        }
    } elseif (!$oldOrder) {
        // sort_order était NULL : simple insertion
        Maillot::where('club_id', $maillot->club_id)
            ->where('id', '!=', $maillot->id)
            ->where('sort_order', '>=', $newOrder)
            ->whereNotNull('sort_order')
            ->increment('sort_order');
    }
}

// Décalage automatique des home_order (page d'accueil - tous clubs confondus)
if (!empty($validated['home_order'])) {
    $newOrder = (int) $validated['home_order'];
    $oldOrder = $maillot->home_order;

    if ($oldOrder && $oldOrder !== $newOrder) {
        if ($oldOrder < $newOrder) {
            Maillot::where('id', '!=', $maillot->id)
                ->where('home_order', '>', $oldOrder)
                ->where('home_order', '<=', $newOrder)
                ->whereNotNull('home_order')
                ->decrement('home_order');
        } else {
            Maillot::where('id', '!=', $maillot->id)
                ->where('home_order', '>=', $newOrder)
                ->where('home_order', '<', $oldOrder)
                ->whereNotNull('home_order')
                ->increment('home_order');
        }
    } elseif (!$oldOrder) {
        Maillot::where('id', '!=', $maillot->id)
            ->where('home_order', '>=', $newOrder)
            ->whereNotNull('home_order')
            ->increment('home_order');
    }
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
    if (env('RENDER')) {
        $cloudinary = new \Cloudinary\Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
        ]);

        if ($maillot->image && str_starts_with($maillot->image, 'https://res.cloudinary.com')) {
            $publicId = 'fou2foot/maillots/' . pathinfo(parse_url($maillot->image, PHP_URL_PATH), PATHINFO_FILENAME);
            $cloudinary->uploadApi()->destroy($publicId);
        }

        if ($maillot->image_dos && str_starts_with($maillot->image_dos, 'https://res.cloudinary.com')) {
            $publicId = 'fou2foot/maillots/' . pathinfo(parse_url($maillot->image_dos, PHP_URL_PATH), PATHINFO_FILENAME);
            $cloudinary->uploadApi()->destroy($publicId);
        }
    } else {
        if ($maillot->image && file_exists(public_path($maillot->image))) {
            unlink(public_path($maillot->image));
        }
        if ($maillot->image_dos && file_exists(public_path($maillot->image_dos))) {
            unlink(public_path($maillot->image_dos));
        }
    }

    $maillot->delete();

    return redirect()->route('admin.maillots.index')
        ->with('success', 'Maillot supprimé avec succès.');
}
}
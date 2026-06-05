<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Models\Maillot;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminImportMaillotController extends Controller
{

    private array $typeConfig = [
        'dom'   => ['label' => 'Domicile',  'sort_order' => 1],
        'ext'   => ['label' => 'Extérieur', 'sort_order' => 2],
        'third' => ['label' => 'Third',     'sort_order' => 3],
    ];

    public function index(): \Inertia\Response
    {
        return Inertia::render('AdminImportMaillots', [
            'auth' => ['user' => auth('web')->user()],
            'clubs' => Club::select('name', 'slug', 'sort_name')->get(),
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'files'   => 'required|array|min:1',
            'files.*' => 'required|file|mimes:jpeg,jpg,png,gif,webp|max:5120',
        ]);

        $overwrite = $request->boolean('overwrite_duplicates', false);
        $groups    = $this->groupFiles($request->file('files'));

        // Trier : dom=1, ext=2, third=3 pour que le décalage sort_order soit correct
        uasort($groups, function (array $a, array $b): int {
            $order = ['dom' => 1, 'ext' => 2, 'third' => 3];
            $aOrder = $order[$a['parsed']['type'] ?? ''] ?? 9;
            $bOrder = $order[$b['parsed']['type'] ?? ''] ?? 9;
            return $aOrder <=> $bOrder;
        });

        $created = 0;
        $skipped = 0;
        $errors  = [];

        foreach ($groups as $baseName => $group) {
            if (!$group['face']) {
                continue; // image dos sans face — on ignore
            }

            $parsed = $group['parsed'];

            if (!$parsed) {
                $errors[] = "{$baseName} : format de nom invalide";
                continue;
            }

            // Résolution du club
            $club = Club::whereRaw('LOWER(sort_name) = ?', [strtolower($parsed['club'])])
            ->orWhere('slug', $parsed['club'])
            ->first();

            if (!$club) {
                $errors[] = "{$baseName} : club \"{$parsed['club']}\" non trouvé";
                continue;
            }

            // Génération du nom
            $nom = $this->typeConfig[$parsed['type']]['label']
                 . ' '
                 . $this->seasonToLabel($parsed['season']);

            // Vérification doublon
            $existing = Maillot::where('club_id', $club->id)
                ->where('nom', $nom)
                ->first();

            if ($existing && !$overwrite) {
                $skipped++;
                continue;
            }

            // Upload images
            try {
                $imagePath    = $this->uploadFile($group['face']);
                $imageDospath = $group['back'] ? $this->uploadFile($group['back']) : null;
            } catch (\Exception $e) {
                $errors[] = "{$baseName} : erreur upload — " . $e->getMessage();
                continue;
            }

           if ($existing && $overwrite) {
            $updateData = [
                'image'     => $imagePath,
                'image_dos' => $imageDospath,
            ];

            if ($existing->sort_order === null) {
                $sortOrder = $this->typeConfig[$parsed['type']]['sort_order'];
                Maillot::where('club_id', $club->id)
                    ->where('id', '!=', $existing->id)
                    ->where('sort_order', '>=', $sortOrder)
                    ->whereNotNull('sort_order')
                    ->increment('sort_order');
                $updateData['sort_order'] = $sortOrder;
            }

            $existing->update($updateData);
            }
            else {
                // Nouveau maillot : décaler le sort_order du club
                $sortOrder = $this->typeConfig[$parsed['type']]['sort_order'];

                Maillot::where('club_id', $club->id)
                    ->where('sort_order', '>=', $sortOrder)
                    ->whereNotNull('sort_order')
                    ->increment('sort_order');

                Maillot::create([
                    'club_id'    => $club->id,
                    'nom'        => $nom,
                    'price'      => 20.00,
                    'image'      => $imagePath,
                    'image_dos'  => $imageDospath,
                    'sort_order' => $sortOrder,
                    'stock_s'    => 25,
                    'stock_m'    => 25,
                    'stock_l'    => 25,
                    'stock_xl'   => 25,
                    'stock_xxl'  => 25,
                    'is_featured' => false,
                    'is_new' => false,
                ]);
            }

            $created++;
        }

        // Message flash résumé
        $parts = [];
        if ($created > 0) $parts[] = "{$created} maillot(s) importé(s)";
        if ($skipped > 0) $parts[] = "{$skipped} doublon(s) ignoré(s)";
        if (count($errors) > 0) {
            $parts[] = count($errors) . " erreur(s) : " . implode(' | ', $errors);
        }

        $isSuccess = $created > 0 || $skipped > 0;

        return redirect()->route('admin.import-maillots.index')
            ->with($isSuccess ? 'success' : 'error', implode(' — ', $parts) ?: 'Aucun fichier traité.');
    }

    // ─── Méthodes privées ────────────────────────────────────────────────────

    private function groupFiles(array $files): array
    {
        $groups = [];

        foreach ($files as $file) {
            $nameWithoutExt = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $isBack         = str_ends_with($nameWithoutExt, '-back');
            $baseName       = $isBack ? substr($nameWithoutExt, 0, -5) : $nameWithoutExt;

            if (!isset($groups[$baseName])) {
                $groups[$baseName] = [
                    'face'   => null,
                    'back'   => null,
                    'parsed' => $this->parseBaseName($baseName),
                ];
            }

            if ($isBack) {
                $groups[$baseName]['back'] = $file;
            } else {
                $groups[$baseName]['face'] = $file;
            }
        }

        return $groups;
    }

    private function parseBaseName(string $baseName): ?array
    {
        // Format attendu : {club}-(dom|ext|third)-{26-27|26}
        if (!preg_match('/^(.+)-(dom|ext|third)-(\d{2}-\d{2}|\d{2})$/', $baseName, $matches)) {
            return null;
        }

        return [
            'club'   => $matches[1],
            'type'   => $matches[2],
            'season' => $matches[3],
        ];
    }

    private function seasonToLabel(string $season): string
    {
        if (str_contains($season, '-')) {
            [$y1, $y2] = explode('-', $season);
            return '20' . $y1 . '-20' . $y2;
        }
        return '20' . $season;
    }

    private function uploadFile(\Illuminate\Http\UploadedFile $file): string
    {
        if (env('RENDER')) {
            $cloudinary = new \Cloudinary\Cloudinary([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
            ]);

            $result = $cloudinary->uploadApi()->upload(
                $file->getRealPath(),
                ['folder' => 'fou2foot/maillots']
            );

            return $result['secure_url'];
        }

        $filename = $file->hashName();
        $file->move(public_path('images/maillot/images_maillot'), $filename);
        return 'images/maillot/images_maillot/' . $filename;
    }
}
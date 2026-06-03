<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Models\Maillot;
use App\Models\Club;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminImportMaillotController extends Controller
{
    private array $slugMapping = [
        // Ligue 1
        'lyon'              => 'olympique-lyonnais',
        'bordeaux'          => 'girondins-de-bordeaux',
        'angers'            => 'angers-sco',
        'annecy'            => 'annecy-fc',
        'cannes'            => 'cannes',
        'lille'             => 'lille',
        'monaco'            => 'monaco',
        'nice'              => 'nice',
        'rennes'            => 'rennes',
        'strasbourg'        => 'strasbourg',
        'toulouse'          => 'toulouse',
        'nantes'            => 'nantes',
        'montpellier'       => 'montpellier',
        'lens'              => 'lens',
        'reims'             => 'reims',
        'auxerre'           => 'auxerre',
        // Premier League
        'liverpool'         => 'liverpool',
        'manchester'        => 'manchester-city',
        'arsenal'           => 'arsenal',
        'chelsea'           => 'chelsea',
        'tottenham'         => 'tottenham-hotspur',
        'leicester'         => 'leicester-city',
        'villa'             => 'aston-villa',
        'newcastle'         => 'newcastle-united',
        'everton'           => 'everton',
        'wolverhampton'     => 'wolverhampton-wanderers',
        'brighton'          => 'brighton',
        'palace'            => 'crystal-palace',
        'brentford'         => 'brentford',
        'fulham'            => 'fulham',
        // Bundesliga
        'bayern'            => 'bayern-munich',
        'dortmund'          => 'borussia-dortmund',
        'monchengladbach'   => 'borussia-monchengladbach',
        'leipzig'           => 'rb-leipzig',
        'leverkusen'        => 'bayer-leverkusen',
        'wolfsburg'         => 'wolfsburg',
        'francfort'         => 'eintracht-francfort',
        'hoffenheim'        => 'hoffenheim',
        'berlin'            => 'hertha-berlin',
        'stuttgart'         => 'stuttgart',
        'cologne'           => 'cologne',
        'schalke'           => 'schalke',
        // La Liga
        'atletico'          => 'atletico-madrid',
        'bilbao'            => 'athletic-bilbao',
        'real'              => 'real-madrid',
        'barcelone'         => 'fc-barcelone',
        'sociedad'          => 'real-sociedad',
        'valence'           => 'valence-cf',
        'villarreal'        => 'villarreal',
        'sevilla'           => 'sevilla-fc',
        'betis'             => 'real-betis',
        'espanyol'          => 'espanyol',
        // Serie A
        'inter'             => 'inter-milan',
        'ac-milan'          => 'ac-milan',
        'naples'            => 'naples',
        'juventus'          => 'juventus',
        'roma'              => 'as-roma',
        'lazio'             => 'lazio-rome',
        'atalanta'          => 'atalanta',
        'fiorentina'        => 'fiorentina',
        'torino'            => 'torino',
        'bologne'           => 'bologne',
        'come'              => 'come',
        // Autres clubs
        'porto'             => 'porto',
        'benfica'           => 'benfica',
        'sporting'          => 'sporting-cp',
        'galatasaray'       => 'galatasaray',
        'fenerbahce'        => 'fenerbahçe',
        'celtic'            => 'celtic-fc',
        'rangers'           => 'rangers-fc',
        'ajax'              => 'ajax-amsterdam',
        'psv'               => 'psv-eindhoven',
        'gremio'            => 'gremio',
        'flamengo'          => 'flamengo',
        'anderlecht'        => 'anderlecht',
        // Sélections nationales
        'france'            => 'france',
        'bresil'            => 'bresil',
        'espagne'           => 'espagne',
        'pays-bas'          => 'pays-bas',
        'belgique'          => 'belgique',
        'senegal'           => 'senegal',
        'cote-divoire'      => 'cote-divoire',
        'maroc'             => 'maroc',
        'suisse'            => 'suisse',
        'pologne'           => 'pologne',
        'croatie'           => 'croatie',
        'suede'             => 'suede',
        'danemark'          => 'danemark',
        'ukraine'           => 'ukraine',
        'japon'             => 'japon',
        'coree-du-sud'      => 'coree-du-sud',
        'mexique'           => 'mexique',
        'inde'              => 'inde',
        'colombie'          => 'colombie',
        'uruguay'           => 'uruguay',
        'tunisie'           => 'tunisie',
        'perou'             => 'perou',
        'irlande'           => 'irlande',
    ];

    private array $typeConfig = [
        'dom'   => ['label' => 'Domicile',  'sort_order' => 1],
        'ext'   => ['label' => 'Extérieur', 'sort_order' => 2],
        'third' => ['label' => 'Third',     'sort_order' => 3],
    ];

    public function index(): \Inertia\Response
    {
        return Inertia::render('AdminImportMaillots', [
            'auth' => ['user' => auth('web')->user()],
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
            $slug = $this->slugMapping[$parsed['club']] ?? $parsed['club'];
            $club = Club::where('slug', $slug)->first();

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
                // Mise à jour images uniquement (sort_order inchangé)
                $existing->update([
                    'image'     => $imagePath,
                    'image_dos' => $imageDospath,
                    'is_new'    => true,
                ]);
            } else {
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
<?php

namespace App\Services;

use App\Models\Maillot;
use App\Models\Patch;

class PricingService
{
    const NOM_PRIX    = 3.0;
    const NUMERO_PRIX = 2.0;
    const PATCH_PRIX  = 3.0;

    /**
     * Calcule le supplément de personnalisation pour un article.
     *
     * @param  string|null  $nom
     * @param  string|null  $numero
     * @param  array        $patches  tableau d'IDs de patches
     * @return float
     */
    public function calculateSupplement(?string $nom, ?string $numero, array $patches = []): float
    {
        $supplement = 0.0;

        if (!empty($nom))    $supplement += self::NOM_PRIX;
        if (!empty($numero)) $supplement += self::NUMERO_PRIX;

        $supplement += count($patches) * self::PATCH_PRIX;

        return $supplement;
    }

    /**
     * Calcule le supplément total d'une ligne (supplément unitaire × quantité).
     *
     * @param  string|null  $nom
     * @param  string|null  $numero
     * @param  array        $patches
     * @param  int          $quantity
     * @return float
     */
    public function calculateLineSupplement(?string $nom, ?string $numero, array $patches, int $quantity): float
    {
        return $this->calculateSupplement($nom, $numero, $patches) * $quantity;
    }

    /**
     * Calcule le total d'une ligne (prix unitaire + supplément) × quantité.
     *
     * @param  float        $price
     * @param  string|null  $nom
     * @param  string|null  $numero
     * @param  array        $patches
     * @param  int          $quantity
     * @return float
     */
    public function calculateLineTotal(float $price, ?string $nom, ?string $numero, array $patches, int $quantity): float
    {
        $suppUnit = $this->calculateSupplement($nom, $numero, $patches);
        return ($price + $suppUnit) * $quantity;
    }

    /**
     * Vérifie la disponibilité du stock pour tous les articles d'un panier.
     * Retourne un tableau d'erreurs (vide si tout est ok).
     *
     * @param  \Illuminate\Support\Collection|\Illuminate\Database\Eloquent\Collection  $items
     * @return array
     */
    public function checkStockAvailability($items): array
    {
        $issues = [];

        foreach ($items as $item) {
            $maillot = $item->maillot ?? Maillot::find($item->maillot_id);

            if (!$maillot) {
                $issues[] = [
                    'message'  => "Le maillot n'existe plus.",
                    'item_id'  => $item->id,
                ];
                continue;
            }

            $requestedQty   = (int) $item->quantity;
            $availableStock = $maillot->getStockForSize($item->size);

            if ($availableStock < $requestedQty) {
                $issues[] = [
                    'message'      => sprintf(
                        "%s (taille %s) : Stock insuffisant",
                        $maillot->nom,
                        $item->size
                    ),
                    'details'      => sprintf(
                        "Disponible : %d, Demandé : %d",
                        $availableStock,
                        $requestedQty
                    ),
                    'item_id'      => $item->id,
                    'maillot_name' => $maillot->nom,
                    'size'         => $item->size,
                    'available'    => $availableStock,
                    'requested'    => $requestedQty,
                ];
            }
        }

        return $issues;
    }

    /**
     * Résout les noms de patches depuis un tableau d'IDs.
     *
     * @param  array  $patchIds
     * @return array  tableau de noms
     */
    public function resolvePatchNames(array $patchIds): array
    {
        if (empty($patchIds)) return [];

        return Patch::whereIn('id', $patchIds)
            ->pluck('nom')
            ->filter()
            ->values()
            ->toArray();
    }
}
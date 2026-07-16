<?php

namespace App\Http\Controllers\Backoffice;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Maillot;
use Illuminate\Http\Request;
use App\Helpers\CountryHelper;
use App\Models\OrderActivity;
use App\Mail\OrderStatusChanged;
use App\Services\PricingService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class AdminOrderController extends Controller
{
    public function __construct(private PricingService $pricing) {}

    /**
     * Afficher la liste des commandes
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $status = $request->get('status');

        $orders = Order::query()
            ->with(['user'])
            ->when($search, function ($query, $search) {
                $query->where('order_number', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q) use ($search) {
                          $q->where('username', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
                      });
            })
            ->when($status, fn($query, $status) => $query->where('order_status', $status))
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'all'       => Order::count(),
            'pending'   => Order::where('order_status', 'pending')->count(),
            'shipped'   => Order::where('order_status', 'shipped')->count(),
            'delivered' => Order::where('order_status', 'delivered')->count(),
            'cancelled' => Order::where('order_status', 'cancelled')->count(),
        ];

        return Inertia::render('AdminOrdersIndex', [
            'orders'  => $orders,
            'stats'   => $stats,
            'filters' => ['search' => $search, 'status' => $status],
            'auth'    => ['user' => auth('web')->user()],
        ]);
    }

    /**
     * Afficher les détails d'une commande
     */
    public function show(Order $order)
    {
        $order->load(['user', 'items.maillot', 'shippingAddress', 'billingAddress']);

        foreach ($order->items as $item) {
            $item->patch_names = $this->pricing->resolvePatchNames($item->patches ?? []);
        }

        if ($order->shippingAddress) {
            $order->shippingAddress->country_name = CountryHelper::name($order->shippingAddress->country);
        }

        if ($order->billingAddress) {
            $order->billingAddress->country_name = CountryHelper::name($order->billingAddress->country);
        }

        $maillots = Maillot::select('id', 'nom', 'price', 'club_id')
    ->with('club:id,name,sort_name')
    ->get()
    ->sortBy(fn($m) => \Illuminate\Support\Str::ascii(mb_strtolower(($m->club?->sort_name ?? $m->club?->name ?? '') . ' ' . $m->nom)))
    ->values();
    
        return Inertia::render('AdminOrdersShow', [
            'order' => $order,
            'maillots' => $maillots,
            'auth'  => ['user' => auth('web')->user()],
        ]);
    }

    /**
     * Changer le statut d'une commande
     */
    public function updateStatus(Order $order, Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,shipped,delivered,cancelled',
        ]);

        $oldStatus = $order->order_status;
        $newStatus = $validated['status'];

        OrderActivity::recordStatusChange($order, $oldStatus, $newStatus);

        $order->order_status = $newStatus;
        $order->save();

        $order->load(['user', 'shippingAddress']);

        try {
            Mail::to($order->user->email)->send(new OrderStatusChanged($order, $oldStatus, $newStatus));
            Log::info("Email envoyé pour commande {$order->order_number}");
        } catch (\Exception $e) {
            Log::error("Erreur envoi email : " . $e->getMessage());
        }

        $statusLabels = [
            'pending'   => 'En attente',
            'shipped'   => 'Expédiée',
            'delivered' => 'Livrée',
            'cancelled' => 'Annulée',
        ];

        return back()->with('success', "Commande #{$order->order_number} : statut changé de '{$statusLabels[$oldStatus]}' à '{$statusLabels[$newStatus]}'");
    }

    public function updateItem(Order $order, Request $request)
{
    // Bloquer si commande expédiée ou livrée
    if (in_array($order->order_status, ['shipped', 'delivered', 'cancelled'])) {
        return back()->with('error', 'Impossible de modifier une commande expédiée, livrée ou annulée.');
    }

    $validated = $request->validate([
        'item_id' => 'required|exists:order_items,id',
        'size'    => 'nullable|in:S,M,L,XL,XXL',
        'nom'     => 'nullable|string|max:25',
        'numero'  => 'nullable|integer|min:1|max:99',
        'maillot_id' => 'nullable|exists:maillots,id',
    ]);

    $item = $order->items()->findOrFail($validated['item_id']);

    // Changement de maillot
        if (!empty($validated['maillot_id']) && $validated['maillot_id'] != $item->maillot_id) {
            $newMaillot = Maillot::findOrFail($validated['maillot_id']);
            $oldMaillot = $item->maillot;

            if ((float) $newMaillot->price !== (float) $oldMaillot->price) {
                return back()->with('error', "Changement impossible : prix différent ({$oldMaillot->price} € → {$newMaillot->price} €). Procéder par annulation et nouvelle commande.");
            }

            $sizeCol = strtolower('stock_' . $item->size);
            if ($newMaillot->$sizeCol < $item->quantity) {
                return back()->with('error', "Stock insuffisant pour ce maillot en taille {$item->size}.");
            }

            $oldMaillot->increment($sizeCol, $item->quantity);
            $newMaillot->decrement($sizeCol, $item->quantity);
            
            $item->maillot_id   = $newMaillot->id;
            $item->maillot_name = $newMaillot->nom;
            $item->club_name    = $newMaillot->club->name;
        }

    // Changement de taille → réajustement stocks
    if (isset($validated['size']) && $validated['size'] !== $item->size) {
        $maillot = $item->fresh()->maillot;
        $oldSize = strtolower('stock_' . $item->size);
        $newSize = strtolower('stock_' . $validated['size']);

        if ($maillot->$newSize < $item->quantity) {
            return back()->with('error', "Stock insuffisant pour la taille {$validated['size']}.");
        }

        $maillot->increment($oldSize, $item->quantity);
        $maillot->decrement($newSize, $item->quantity);
        $item->size = $validated['size'];
    }

    if (array_key_exists('nom', $validated)) $item->nom = $validated['nom'] ?: null;
    if (array_key_exists('numero', $validated)) $item->numero = $validated['numero'] ?: null;

    $item->save();

    return back()->with('success', 'Article mis à jour avec succès.');
}

}
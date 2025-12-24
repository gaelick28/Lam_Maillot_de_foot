<?php

namespace App\Http\Controllers\Backoffice;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Maillot;
use App\Models\Club;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // Statistiques générales
        $stats = [
            // Utilisateurs
            'totalUsers' => User::count(),
            'activeUsers' => User::where('is_active', true)->count(),
            
            // Commandes
            'totalOrders' => Order::count(),
            'pendingOrders' => Order::where('order_status', 'pending')->count(),
            
            // Revenus
            'totalRevenue' => Order::sum('total_amount'),
            'monthRevenue' => Order::whereMonth('created_at', now()->month)
                                   ->whereYear('created_at', now()->year)
                                   ->sum('total_amount'),
            
            // Produits
            'totalProducts' => Maillot::count(),
            'totalClubs' => Club::count(),
            
            // ✅ NOUVELLES STATISTIQUES : STOCKS
            'stockStats' => $this->getStockStatistics(),
            
            // Dernières commandes (5 plus récentes)
            'recentOrders' => Order::with('user')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'user_email' => $order->user->email ?? 'N/A',
                        'total_amount' => $order->total_amount,
                        'order_status' => $order->order_status,
                        'status_label' => $order->status_label,
                        'created_at' => $order->created_at->format('d/m/Y H:i'),
                    ];
                }),
        ];

        return Inertia::render('AdminDashboard', [
            'stats' => $stats,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * ✅ NOUVELLE MÉTHODE : Calculer les statistiques de stock
     */
    private function getStockStatistics()
    {
        // Récupérer tous les maillots avec leurs stocks
        $maillots = Maillot::all();

        $stats = [
            'outOfStock' => 0,      // Rupture totale (toutes tailles à 0)
            'lowStock' => 0,        // Stock faible (total < 10)
            'inStock' => 0,         // Stock normal (total >= 10)
            'totalStockValue' => 0, // Valeur totale du stock (prix × quantité)
            'totalUnits' => 0,      // Nombre total d'unités en stock
        ];

        foreach ($maillots as $maillot) {
            $totalStock = $maillot->stock_s + $maillot->stock_m + $maillot->stock_l + $maillot->stock_xl;
            $stats['totalUnits'] += $totalStock;
            
            // Valeur du stock
            $stats['totalStockValue'] += $totalStock * $maillot->price;

            // Catégorisation
            if ($totalStock === 0) {
                $stats['outOfStock']++;
            } elseif ($totalStock < 10) {
                $stats['lowStock']++;
            } else {
                $stats['inStock']++;
            }
        }

        return $stats;
    }
}
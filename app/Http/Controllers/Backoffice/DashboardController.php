<?php

namespace App\Http\Controllers\Backoffice;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Maillot;
use App\Models\Club;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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
            
            // Statistiques de stock
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
     * Calculer les statistiques de stock
     */
    private function getStockStatistics()
    {
        $maillots = Maillot::all();

        $stats = [
            'outOfStock' => 0,
            'lowStock' => 0,
            'inStock' => 0,
            'totalStockValue' => 0,
            'totalUnits' => 0,
        ];

        foreach ($maillots as $maillot) {
            $totalStock = $maillot->stock_s + $maillot->stock_m + $maillot->stock_l + $maillot->stock_xl;
            $stats['totalUnits'] += $totalStock;
            $stats['totalStockValue'] += $totalStock * $maillot->price;

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

    /**
     * ✅ NOUVEAU : Page de statistiques avancées
     */
    public function statistics()
    {
        $stats = [
            // Évolution des revenus (12 derniers mois)
            'revenueEvolution' => $this->getRevenueEvolution(),
            
            // Top 10 maillots vendus
            'topMaillots' => $this->getTopMaillots(),
            
            // Top 10 clubs
            'topClubs' => $this->getTopClubs(),
            
            // Statistiques par période
            'periodStats' => [
                'today' => $this->getPeriodStats('today'),
                'week' => $this->getPeriodStats('week'),
                'month' => $this->getPeriodStats('month'),
                'year' => $this->getPeriodStats('year'),
            ],
        ];

        return Inertia::render('AdminStatistics', [
            'stats' => $stats,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * ✅ NOUVEAU : Évolution des revenus sur 12 mois
     */
    private function getRevenueEvolution()
    {
        $months = [];
        $revenues = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->locale('fr')->isoFormat('MMM YYYY');
            
            $revenue = Order::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total_amount');
            
            $months[] = $monthName;
            $revenues[] = (float) $revenue;
        }

        return [
            'labels' => $months,
            'data' => $revenues,
        ];
    }

    /**
     * ✅ NOUVEAU : Top maillots vendus
     */
    private function getTopMaillots($limit = 20)
    {
        return OrderItem::select('maillot_id', 'maillot_name', 'club_name')
            ->selectRaw('SUM(quantity) as total_quantity')
            ->selectRaw('SUM(subtotal) as total_revenue')
            ->groupBy('maillot_id', 'maillot_name', 'club_name')
            ->orderByDesc('total_quantity')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->maillot_name,
                    'club' => $item->club_name,
                    'quantity' => $item->total_quantity,
                    'revenue' => (float) $item->total_revenue,
                ];
            });
    }

    /**
     * ✅ NOUVEAU : Top clubs
     */
    private function getTopClubs($limit = 20)
    {
        return OrderItem::select('club_name')
            ->selectRaw('SUM(quantity) as total_quantity')
            ->selectRaw('SUM(subtotal) as total_revenue')
            ->groupBy('club_name')
            ->orderByDesc('total_quantity')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->club_name,
                    'quantity' => $item->total_quantity,
                    'revenue' => (float) $item->total_revenue,
                ];
            });
    }

    /**
     * ✅ NOUVEAU : Statistiques par période
     */
    private function getPeriodStats($period)
    {
        $start = match($period) {
            'today' => Carbon::today(),
            'week' => Carbon::now()->subDays(7),
            'month' => Carbon::now()->subDays(30),
            'year' => Carbon::now()->subYear(),
            default => Carbon::today(),
        };

        $orders = Order::where('created_at', '>=', $start)->get();

        return [
            'orders_count' => $orders->count(),
            'revenue' => (float) $orders->sum('total_amount'),
            'average_order' => $orders->count() > 0 ? (float) $orders->avg('total_amount') : 0,
        ];
    }
}
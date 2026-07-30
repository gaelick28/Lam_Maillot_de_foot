import { Head, Link } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"

export default function AdminDashboard({ stats }) {
  return (
    <AdminLayout>
      <Head title="Dashboard Admin" />

      <div className="space-y-4 sm:space-y-6">
        {/* Titre */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Vue d'ensemble de votre boutique</p>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Utilisateurs */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-gray-600 truncate">Utilisateurs</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              {stats.activeUsers} actifs
            </p>
          </div>

          {/* Total Commandes */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-gray-600 truncate">Commandes</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-2">
              {stats.pendingOrders} en attente
            </p>
          </div>

          {/* Revenus Totaux */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-gray-600 truncate">Revenus Totaux</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  {Number(stats.totalRevenue).toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full shrink-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="12" y="17" fontSize="14" fontWeight="bold" textAnchor="middle" fill="currentColor">€</text>
              </svg>
            </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              {Number(stats.monthRevenue).toLocaleString('fr-FR')}€ ce mois
            </p>
          </div>

          {/* Total des Produits */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-gray-600 truncate">Produits</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full shrink-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {stats.totalClubs} clubs
            </p>
          </div>
        </div>

        {/* ✅ NOUVELLE SECTION : Statistiques de stock */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">État des stocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stock normal */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 truncate">En stock</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.stockStats.inStock}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Stock &ge; 10 unités</p>
            </div>

            {/* Stock faible */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 truncate">Stock faible</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.stockStats.lowStock}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Stock &lt; 10 unités</p>
            </div>

            {/* Rupture de stock */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 truncate">Rupture</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.stockStats.outOfStock}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">Stock épuisé</p>
            </div>

            {/* Valeur du stock */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-600 truncate">Valeur stock</p>
                  <p className="text-xl sm:text-2xl font-bold text-indigo-600 truncate">
                    {Number(stats.stockStats.totalStockValue).toLocaleString('fr-FR')}€
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {stats.stockStats.totalUnits.toLocaleString('fr-FR')} unités
              </p>
            </div>
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Dernières commandes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">N° Commande</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Client</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Montant</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Statut</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {order.order_number}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 truncate max-w-[150px]">
                        {order.user_email}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {Number(order.total_amount).toFixed(2)}€
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status_label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 whitespace-nowrap">
                        {order.created_at}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 sm:px-6 py-8 text-center text-gray-500 text-sm">
                      Aucune commande récente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/admin/users"
            className="bg-orange-200 rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Gérer les utilisateurs</h3>
            <p className="text-xs sm:text-sm text-gray-600">Actions et informations comptes utilisateurs</p>
          </Link>
          
          <Link
            href="/admin/orders"
            className="bg-green-200 rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Gérer les commandes</h3>
            <p className="text-xs sm:text-sm text-gray-600">Voir et traiter les commandes en attente</p>
          </Link>
          <Link
            href="/admin/clubs"
           className="bg-blue-200 rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Gérer les clubs</h3>
            <p className="text-xs sm:text-sm text-gray-600">Ajouter ou modifier des clubs</p>
          </Link>
          <Link
            href="/admin/maillots" 
            className="bg-purple-200 rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow"     
          >
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Gérer les maillots</h3>
            <p className="text-xs sm:text-sm text-gray-600">Modifier les produits et les stocks</p>
          </Link>
          
          <Link
            href="/admin/import-maillots" 
            className="bg-pink-200 rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow"     
          >
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Import maillots</h3>
            <p className="text-xs sm:text-sm text-gray-600">Importer plusieurs maillots à partir des images</p>
          </Link>

          <Link
          href="/admin/statistics"
          className="bg-red-200 rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">📊 Statistiques avancées</h3>
          <p className="text-xs sm:text-sm text-gray-600">Graphiques et analyses détaillées</p>
        </Link>

        <Link
            href="/admin/profile"
            className="bg-yellow-100 rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Gestion du profil Administrateur</h3>
            <p className="text-xs sm:text-sm text-gray-600">Modifier les informations du compte</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
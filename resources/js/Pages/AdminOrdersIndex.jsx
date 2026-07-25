import { Head, Link, router } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { useState } from "react"
import BackToDashboardButton from "@/Components/Admin/BackToDashboardButton"

export default function AdminOrdersIndex({ orders, stats, filters, auth }) {
  const [search, setSearch] = useState(filters.search || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || '')

  const handleSearch = (e) => {
    e.preventDefault()
    router.get('/admin/orders', { search, status: statusFilter }, { preserveState: true })
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    router.get('/admin/orders', { search, status }, { preserveState: true })
  }

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('')
    router.get('/admin/orders')
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const statusLabels = {
    pending: 'En attente',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  }

  return (
    <AdminLayout>
      <Head title="Gestion des commandes" />

      <div className="space-y-4 sm:space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Commandes</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Gérer et suivre toutes les commandes</p>
        </div>

        {/* Statistiques par statut */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <button
            onClick={() => handleStatusFilter('')}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
              statusFilter === '' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.all}</p>
            <p className="text-xs sm:text-sm text-gray-600">Toutes</p>
          </button>

          <button
            onClick={() => handleStatusFilter('pending')}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
              statusFilter === 'pending' 
                ? 'border-yellow-600 bg-yellow-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-xl sm:text-2xl font-bold text-yellow-700">{stats.pending}</p>
            <p className="text-xs sm:text-sm text-gray-600">En attente</p>
          </button>

          <button
            onClick={() => handleStatusFilter('shipped')}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
              statusFilter === 'shipped' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats.shipped}</p>
            <p className="text-xs sm:text-sm text-gray-600">Expédiées</p>
          </button>

          <button
            onClick={() => handleStatusFilter('delivered')}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
              statusFilter === 'delivered' 
                ? 'border-green-600 bg-green-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-xl sm:text-2xl font-bold text-green-700">{stats.delivered}</p>
            <p className="text-xs sm:text-sm text-gray-600">Livrées</p>
          </button>

          <button
            onClick={() => handleStatusFilter('cancelled')}
            className={`p-3 sm:p-4 rounded-lg border-2 transition-all col-span-2 sm:col-span-1 ${
              statusFilter === 'cancelled' 
                ? 'border-red-600 bg-red-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-xl sm:text-2xl font-bold text-red-700">{stats.cancelled}</p>
            <p className="text-xs sm:text-sm text-gray-600">Annulées</p>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par n° commande, client..."
              className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Rechercher
              </button>
              {(search || statusFilter) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tableau des commandes - Desktop */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.data.length > 0 ? (
                orders.data.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.user?.username || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {Number(order.total_amount).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[order.order_status]}`}>
                        {statusLabels[order.order_status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.payment_status === 'paid' ? 'Payée' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                      >
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Aucune commande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cartes des commandes - Mobile */}
        <div className="md:hidden space-y-3">
          {orders.data.length > 0 ? (
            orders.data.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.order_number}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[order.order_status]}`}>
                    {statusLabels[order.order_status]}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.user?.username || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {Number(order.total_amount).toFixed(2)} €
                    </p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      order.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.payment_status === 'paid' ? 'Payée' : 'En attente'}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Aucune commande trouvée
            </div>
          )}
        </div>

        {/* Pagination */}
        {orders.last_page > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 bg-white rounded-lg shadow px-4 sm:px-6 py-3 sm:py-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Affichage de {orders.from} à {orders.to} sur {orders.total} commandes
            </p>
            
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
              {orders.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-2.5 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                    link.active
                      ? 'bg-blue-600 text-white'
                      : link.url
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <BackToDashboardButton />
    </AdminLayout>
  )
}
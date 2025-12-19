import { Head, Link, router } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { useState } from "react"

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

      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-600 mt-1">Gérer et suivre toutes les commandes</p>
        </div>

        {/* Statistiques par statut */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => handleStatusFilter('')}
            className={`p-4 rounded-lg border-2 transition-all ${
              statusFilter === '' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
            <p className="text-sm text-gray-600">Toutes</p>
          </button>

          <button
            onClick={() => handleStatusFilter('pending')}
            className={`p-4 rounded-lg border-2 transition-all ${
              statusFilter === 'pending' 
                ? 'border-yellow-600 bg-yellow-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            <p className="text-sm text-gray-600">En attente</p>
          </button>

          <button
            onClick={() => handleStatusFilter('shipped')}
            className={`p-4 rounded-lg border-2 transition-all ${
              statusFilter === 'shipped' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-blue-700">{stats.shipped}</p>
            <p className="text-sm text-gray-600">Expédiées</p>
          </button>

          <button
            onClick={() => handleStatusFilter('delivered')}
            className={`p-4 rounded-lg border-2 transition-all ${
              statusFilter === 'delivered' 
                ? 'border-green-600 bg-green-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
            <p className="text-sm text-gray-600">Livrées</p>
          </button>

          <button
            onClick={() => handleStatusFilter('cancelled')}
            className={`p-4 rounded-lg border-2 transition-all ${
              statusFilter === 'cancelled' 
                ? 'border-red-600 bg-red-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
            <p className="text-sm text-gray-600">Annulées</p>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow p-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par n° commande, client..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Rechercher
            </button>
            {(search || statusFilter) && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </form>
        </div>

        {/* Tableau des commandes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.order_status]}`}>
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

        {/* Pagination */}
        {orders.last_page > 1 && (
          <div className="flex justify-between items-center bg-white rounded-lg shadow px-6 py-4">
            <p className="text-sm text-gray-600">
              Affichage de {orders.from} à {orders.to} sur {orders.total} commandes
            </p>
            
            <div className="flex gap-2">
              {orders.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-1 rounded text-sm ${
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
    </AdminLayout>
  )
}
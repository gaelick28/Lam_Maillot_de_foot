import { Head, Link, router } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { useState } from "react"

export default function AdminUsersShow({ user, ordersCount, totalSpent, auth }) {
   const [activeTab, setActiveTab] = useState('shipping')
  const toggleActive = () => {
    if (confirm('Êtes-vous sûr de vouloir changer le statut de ce compte ?')) {
      router.post(`/admin/users/${user.id}/toggle`, {}, {
        preserveScroll: true,
      })
    }
  }

  return (
    <AdminLayout>
      <Head title={`Utilisateur : ${user.username}`} />

      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/admin/users" className="hover:text-blue-600">Utilisateurs</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{user.username}</span>
        </div>

        {/* En-tête avec actions */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
          
          <div className="flex gap-3">
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Retour
            </Link>
            
            {user.role !== 'admin' && user.id !== auth.user.id && (
              <button
                onClick={toggleActive}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  user.is_active
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {user.is_active ? '🔒 Bloquer ce compte' : '✅ Activer ce compte'}
              </button>
            )}
          </div>
        </div>

        {/* Cartes d'informations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Statistiques */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Commandes :</span>
                <span className="font-bold text-gray-900">{ordersCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total dépensé :</span>
                <span className="font-bold text-green-600">
                  {Number(totalSpent).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </span>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Nom complet :</span>
                <p className="font-medium text-gray-900">
                  {user.first_name || user.last_name 
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : 'Non renseigné'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Téléphone :</span>
                <p className="font-medium text-gray-900">{user.phone || 'Non renseigné'}</p>
              </div>
              <div>
                <span className="text-gray-600">Date de naissance :</span>
                <p className="font-medium text-gray-900">
                  {user.birth_date 
                    ? new Date(user.birth_date).toLocaleDateString('fr-FR')
                    : 'Non renseigné'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Genre :</span>
                <p className="font-medium text-gray-900">
                  {user.gender === 'male' ? 'Homme' : 
                   user.gender === 'female' ? 'Femme' : 
                   user.gender === 'other' ? 'Autre' : 'Non renseigné'}
                </p>
              </div>
            </div>
          </div>

          {/* Statut du compte */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compte</h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 text-sm">Rôle :</span>
                <p className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Statut :</span>
                <p className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? '✓ Actif' : '✗ Bloqué'}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Inscription :</span>
                <p className="font-medium text-gray-900 mt-1">
                  {new Date(user.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

{/* Adresses avec onglets */}
<div className="bg-white rounded-lg shadow">
  <div className="p-6 border-b">
    <h2 className="text-xl font-semibold text-gray-900">Adresses</h2>
  </div>

  {/* Onglets */}
  <div className="border-b border-gray-200">
    <div className="flex">
      <button
        onClick={() => setActiveTab('shipping')}
        className={`px-6 py-3 font-medium transition-colors ${
          activeTab === 'shipping'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        Adresses de livraison
      </button>
      <button
        onClick={() => setActiveTab('billing')}
        className={`px-6 py-3 font-medium transition-colors ${
          activeTab === 'billing'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        Adresses de facturation
      </button>
    </div>
  </div>

  {/* Contenu des onglets */}
  <div className="p-6">
    {activeTab === 'shipping' && (
      <div className="space-y-4">
        {user.addresses?.filter(addr => addr.type === 'shipping').length > 0 ? (
          user.addresses
            .filter(addr => addr.type === 'shipping')
            .map((address) => (
              <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{address.title}</h4>
                  {address.is_default && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      Par défaut
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{address.first_name} {address.last_name}</p>
                  <p>{address.street}</p>
                  {address.address_complement && <p>{address.address_complement}</p>}
                  <p>{address.postal_code} {address.city}</p>
                  <p>{address.country}</p>
                  {address.phone && <p>📞 {address.phone}</p>}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune adresse de livraison enregistrée
          </div>
        )}
      </div>
    )}

    {activeTab === 'billing' && (
      <div className="space-y-4">
        {user.addresses?.filter(addr => addr.type === 'billing').length > 0 ? (
          user.addresses
            .filter(addr => addr.type === 'billing')
            .map((address) => (
              <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{address.title}</h4>
                  {address.is_default && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      Par défaut
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{address.first_name} {address.last_name}</p>
                  <p>{address.street}</p>
                  {address.address_complement && <p>{address.address_complement}</p>}
                  <p>{address.postal_code} {address.city}</p>
                  <p>{address.country}</p>
                  {address.phone && <p>📞 {address.phone}</p>}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune adresse de facturation enregistrée
          </div>
        )}
      </div>
    )}
  </div>
</div>


        {/* Dernières commandes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Dernières commandes</h2>
          </div>
          
          {user.orders && user.orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {user.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {Number(order.total_amount).toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status_label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Voir détails →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>Aucune commande pour cet utilisateur</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
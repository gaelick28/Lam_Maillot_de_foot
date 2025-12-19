import { Head, Link, router } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { useState } from "react"


export default function AdminOrdersShow({ order, auth }) {
  const [newStatus, setNewStatus] = useState(order.order_status)

  const handleStatusChange = () => {
    if (confirm('Êtes-vous sûr de vouloir changer le statut de cette commande ?')) {
      router.post(`/admin/orders/${order.id}/status`, {
        status: newStatus
      }, {
        preserveScroll: true,
      })
    }
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
      <Head title={`Commande ${order.order_number}`} />

      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/admin/orders" className="hover:text-blue-600">Commandes</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{order.order_number}</span>
        </div>

        {/* En-tête */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commande {order.order_number}</h1>
            <p className="text-gray-600 mt-1">
              Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Retour
          </Link>
        </div>

        {/* Cartes d'informations principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Statut et changement */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut de la commande</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Statut actuel :</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.order_status]}`}>
                  {statusLabels[order.order_status]}
                </span>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">Changer le statut :</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">En attente</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              {newStatus !== order.order_status && (
                <button
                  onClick={handleStatusChange}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Mettre à jour
                </button>
              )}
            </div>
          </div>

          {/* Client */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Nom :</p>
                <p className="font-medium text-gray-900">{order.user?.username || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600">Email :</p>
                <p className="font-medium text-gray-900">{order.user?.email || 'N/A'}</p>
              </div>
              <Link
                href={`/admin/users/${order.user_id}`}
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir le profil →
              </Link>
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paiement</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Méthode :</span>
                <span className="font-medium text-gray-900">
                  {order.payment_method === 'card' ? 'Carte bancaire' : 'Autre'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.payment_status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.payment_status === 'paid' ? 'Payée' : 'En attente'}
                </span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-600">Montant total :</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {Number(order.total_amount).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles commandés */}
<div className="bg-white rounded-lg shadow">
  <div className="p-6 border-b">
    <h2 className="text-xl font-semibold text-gray-900">Articles commandés</h2>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Personnalisation</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix perso.</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total ligne</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {order.items?.map((item) => {
          const unitPrice = Number(item.unit_price || 0);
          const persoPrice = Number(item.personalization_cost || 0);
          const quantity = Number(item.quantity || 1);
          const totalLine = Number(item.subtotal || 0);

          return (
            <tr key={item.id}>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {item.maillot?.image && (
                    <img 
                      src={`/${item.maillot.image}`} 
                      alt={item.maillot_name || 'Produit'}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.maillot_name || 'N/A'}</p>
                    {item.club_name && (
                      <p className="text-xs text-gray-500">{item.club_name}</p>
                    )}
                    {item.size && (
                      <p className="text-xs text-gray-500">Taille: {item.size}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {unitPrice.toFixed(2)} €
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 text-center font-medium">
                {quantity}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {item.nom || item.numero ? (
                  <div className="space-y-1">
                    {item.nom && (
                      <p className="font-medium">Nom: <span className="text-gray-900">{item.nom}</span></p>
                    )}
                    {item.numero && (
                      <p className="font-medium">N°: <span className="text-gray-900">{item.numero}</span></p>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Aucune</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {persoPrice > 0 ? `${persoPrice.toFixed(2)} €` : '-'}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                {totalLine.toFixed(2)} €
              </td>
            </tr>
          );
        })}
        
        {/* Ligne de total */}
        <tr className="bg-gray-50 font-bold">
          <td colSpan="5" className="px-6 py-4 text-right text-gray-900 text-base">
            TOTAL COMMANDE :
          </td>
          <td className="px-6 py-4 text-lg text-gray-900">
            {Number(order.total_amount || 0).toFixed(2)} €
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

        {/* Adresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       {/* Adresse de livraison */}
<div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse de livraison</h3>
  {order.shipping_address ? (
    <div className="text-sm text-gray-600 space-y-1">
      <p className="font-medium text-gray-900">
        {order.shipping_address.first_name} {order.shipping_address.last_name}
      </p>
      <p>{order.shipping_address.street}</p>
      {order.shipping_address.address_complement && (
        <p>{order.shipping_address.address_complement}</p>
      )}
      <p>{order.shipping_address.postal_code} {order.shipping_address.city}</p>
      <p>{order.shipping_address.country_name || order.shipping_address.country}</p>
      {order.shipping_address.phone && (
        <p className="pt-2">📞 {order.shipping_address.phone}</p>
      )}
    </div>
  ) : (
    <p className="text-gray-500">Aucune adresse de livraison</p>
  )}
</div>

{/* Adresse de facturation */}
<div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse de facturation</h3>
  {order.billing_address ? (
    <div className="text-sm text-gray-600 space-y-1">
      <p className="font-medium text-gray-900">
        {order.billing_address.first_name} {order.billing_address.last_name}
      </p>
      <p>{order.billing_address.street}</p>
      {order.billing_address.address_complement && (
        <p>{order.billing_address.address_complement}</p>
      )}
      <p>{order.billing_address.postal_code} {order.billing_address.city}</p>
      <p>{order.billing_address.country_name || order.billing_address.country}</p>
      {order.billing_address.phone && (
        <p className="pt-2">📞 {order.billing_address.phone}</p>
      )}
    </div>
  ) : (
    <p className="text-gray-500">Aucune adresse de facturation</p>
  )}
</div>
        </div>
      </div>
    </AdminLayout>
  )
}
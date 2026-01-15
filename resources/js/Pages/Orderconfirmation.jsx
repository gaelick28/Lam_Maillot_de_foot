import { Head, Link } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"

// Icônes
const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const TruckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
)

const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

export default function OrderConfirmation({ auth, order }) {
  return (
    <>
      <Head title="Commande confirmée" />
      <Header />

      <main className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Message de succès */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Merci pour votre commande !
            </h1>
            <p className="text-gray-600 mb-6">
              Votre commande a été validée avec succès. Vous allez recevoir un email de confirmation.
            </p>

            {/* Numéro de commande */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600">Numéro de commande</p>
              <p className="text-2xl font-bold text-blue-600">{order.order_number}</p>
            </div>
          </div>

          {/* Détails de la commande */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Détails de votre commande</h2>

            {/* Articles */}
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <img 
                    src={`/${item.image}`} 
                    alt={item.maillot_name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.maillot_name}</p>
                    {item.club_name && (
                      <p className="text-sm text-gray-600">{item.club_name}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Taille: {item.size} • Quantité: {item.quantity}
                    </p>
                    {item.personalization_text && (
                      <p className="text-sm text-blue-600 font-medium">
                        {item.personalization_text}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {Number(item.subtotal || 0).toFixed(2)}€
                    </p>
                    <p className="text-xs text-gray-500">
                      {Number(item.unit_price || 0).toFixed(2)}€ × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span>{Number(order.subtotal || 0).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Livraison</span>
                <span className="text-green-600">
                  {order.shipping_cost === 0 ? 'Gratuite' : `${Number(order.shipping_cost || 0).toFixed(2)}€`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total payé</span>
                <span className="text-blue-600">{Number(order.total_amount || 0).toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* Informations de livraison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Adresse de livraison */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Adresse de livraison</h3>
                </div>
                <p className="text-gray-700">
                  {order.shippingAddress.first_name} {order.shippingAddress.last_name}<br />
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.postal_code} {order.shippingAddress.city}<br />
                   {order.shippingAddress.country}
                </p>
              </div>
            )}

{/* ✅ NOUVELLE SECTION : Adresse de facturation */}
  {order.billingAddress && (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="font-bold text-gray-900">Adresse de facturation</h3>
      </div>
      <p className="text-gray-700">
        {order.billingAddress.first_name} {order.billingAddress.last_name}<br />
        {order.billingAddress.street}<br />
        {order.billingAddress.postal_code} {order.billingAddress.city}<br />
        {order.billingAddress.country}
      </p>
    </div>
  )}

            {/* Informations de paiement */}
            <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
              <h3 className="font-bold text-gray-900 mb-4">Informations de paiement</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-normal gap-4">
                  <span className="text-gray-600">Mode de paiement : </span>
                  <span className="font-medium"> {order.payment_method_label}</span>
                </div>
                <div className="flex justify-normal gap-4">
                  <span className="text-gray-600">Statut : </span>
                  <span className="text-green-600 font-medium"> ✓ Payé</span>
                </div>
                <div className="flex justify-normal gap-4">
                  <span className="text-gray-600">Date : </span>
                  <span className="font-medium"> {order.created_at}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Que faire maintenant ?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retour à l'accueil
              </Link>
              <Link
                href="/order"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-300 text-gray-700 rounded-lg hover:bg-red-400 transition-colors"
              >
                Mes commandes
              </Link>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-200 text-gray-700 rounded-lg hover:bg-orange-300 transition-colors"
              >
                <DownloadIcon className="w-5 h-5" />
                Imprimer
              </button>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-bold text-gray-900 mb-2">📧 Email de confirmation</h3>
            <p className="text-sm text-gray-700">
              Un email de confirmation a été envoyé à <strong>{auth.user.email}</strong>. 
              Vous y trouverez toutes les informations concernant votre commande et sa livraison.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
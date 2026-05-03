import { Head, Link } from "@inertiajs/react";
import { imageUrl } from "@/utils/imageUrl";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import Sidebar from "@/Components/Sidebar";

// Icônes SVG
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const TruckIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const InvoiceIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PrinterIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

// Helper pour la couleur du badge de statut
const getStatusBadgeClass = (status) => {
  const map = {
    "Livrée": "bg-green-100 text-green-800",
    "Expédiée": "bg-blue-100 text-blue-800",
    "En attente": "bg-yellow-100 text-yellow-800",
    "Annulée": "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

export default function OrderDetail({ auth, order }) {
  const displayStatus = order.status_label === "En attente"
    ? "En cours de préparation"
    : order.status_label;

  return (
    <>
      <Head title={`Commande ${order.order_number}`} />
      <Header />

      <div className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-100 flex">
        <Sidebar currentRoute="/order" />

        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">

            {/* Bouton retour */}
            <Link
              href="/order"
              className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 mb-6 font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Retour à mes commandes
            </Link>

            {/* En-tête de la commande */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-6">
              <div className="p-6 bg-red-300 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Commande {order.order_number}
                    </h1>
                    <p className="text-sm text-gray-800 mt-1">
                      Passée le {order.created_at}
                    </p>
                    {order.paid_at && (
                      <p className="text-sm text-gray-800">
                        Payée le {order.paid_at}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status_label)}`}>
                      {displayStatus}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {Number(order.total_amount || 0).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>

              {/* Articles */}
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Articles ({order.items.length})
                </h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        {item.image ? (
                          <img
                            src={imageUrl(item.image)}
                            alt={item.maillot_name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Infos produit */}
                      <div className="flex-1">
                        {item.club_name && (
                          <p className="font-semibold text-gray-900">{item.club_name}</p>
                        )}
                        <p className="text-sm text-gray-600">{item.maillot_name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Taille : {item.size} · Quantité : {item.quantity}
                        </p>
                        {(item.numero || item.nom) && (
                          <p className="text-xs text-blue-600 mt-1">
                            {item.numero && `N°${item.numero}`}
                            {item.numero && item.nom && ' - '}
                            {item.nom && item.nom.toUpperCase()}
                          </p>
                        )}
                        {item.patch_names?.length > 0 && (
                          <p className="text-xs text-blue-600 mt-1">
                            Patches : {item.patch_names.join(', ')}
                          </p>
                        )}
                      </div>

                      {/* Prix */}
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
                <div className="border-t mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span>{Number(order.subtotal || 0).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className={order.shipping_cost === 0 ? "text-green-600" : ""}>
                      {order.shipping_cost === 0 ? 'Gratuite' : `${Number(order.shipping_cost || 0).toFixed(2)}€`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600">{Number(order.total_amount || 0).toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Adresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Adresse de livraison */}
              {order.shippingAddress && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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

              {/* Adresse de facturation */}
              {order.billingAddress && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <InvoiceIcon className="w-5 h-5 text-green-600" />
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
            </div>

            {/* Informations de paiement */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Informations de paiement</h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-4">
                  <span className="text-gray-600 w-40">Mode de paiement :</span>
                  <span className="font-medium">{order.payment_method_label}</span>
                </div>
                {order.paid_at && (
                  <div className="flex gap-4">
                    <span className="text-gray-600 w-40">Statut :</span>
                    <span className="text-green-600 font-medium">✓ Payé</span>
                  </div>
                )}
                <div className="flex gap-4">
                  <span className="text-gray-600 w-40">Date de commande :</span>
                  <span className="font-medium">{order.created_at}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/order"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mes commandes
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-300 text-gray-700 rounded-lg hover:bg-red-400 transition-colors"
                >
                  Retour à l'accueil
                </Link>
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-200 text-gray-700 rounded-lg hover:bg-orange-300 transition-colors"
                >
                  <PrinterIcon className="w-5 h-5" />
                  Imprimer
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
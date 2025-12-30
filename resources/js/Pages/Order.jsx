import { Link } from "@inertiajs/react"
import { GiSoccerBall } from "react-icons/gi"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"
import Sidebar from "@/Components/Sidebar"
import WelcomeMessage from "@/Components/WelcomeMessage"




// La version commentée fonctionne pour WelcomeMessage pour la partie mise en commentaire : <p className="text-sm text-gray-600">Membre depuis le : {new Date(user.created_at).toLocaleDateString()}</p>
// Cependant, pour éviter toute confusion, on utilise la version décommentée avec "auth.user" remplacée par "user" directement en props.
// ceci permet de centraliser/uniformiser le passage des données utilisateur dans les composants.
//
// export default function OrderHistory({ auth, orders = [] }) {
//   return (
//     <>
//       <Header />

//       <div className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-100 flex">
//         <Sidebar currentRoute="/order" />
//         <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
//           <div className="max-w-7xl mx-auto">
//             {/* Message de bienvenue */}
//              <WelcomeMessage user={auth.user} />


export default function OrderHistory({ user, orders = [] }) {
  console.log('Orders reçus:', orders);
  console.log('Premier order:', orders[0]);
  
  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-r from-purple-200 to-blue-100 flex">
        <Sidebar currentRoute="/order" />
        <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Message de bienvenue */}
             <WelcomeMessage user={user} />
            <div className="flex items-center gap-3 mb-8">
              <GiSoccerBall className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Historique des commandes</h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="mb-4">
                    <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
                  <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande</p>
                  <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Commencer mes achats
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    {/* En-tête de commande */}
                    <div className="p-6 border-b border-gray-200 bg-red-300">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Commande {order.id}</h3>
                          <p className="text-sm text-gray-800 mt-1">{order.date}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === "Livrée"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Expédiée"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "En attente"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {/* {order.status} 
                  // order.status === "En attente"
                  Sinon version suivante Afficher "En cours de préparation" à la place de "En attente" */}
                {order.status === "En attente" ? "En cours de préparation" : order.status} 
                          </span>
                          <span className="text-xl font-bold text-gray-900">{Number(order.total).toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>

                    {/* Contenu de la commande */}
                    <div className="p-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Détails des articles */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Articles ({order.items})</h4>
                          <div className="space-y-4">
                            {order.itemsDetails.map((item, index) => (
                              <div key={index} className="flex items-start gap-4">
                                {/* Image du produit */}
                                <div className="flex-shrink-0">
                                  {item.image ? (
                                    <img
                                      src={`/${item.image}`}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                {/* Infos produit */}
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Taille: {item.size} · Quantité: {item.quantity}
                                  </p>
                                  {(item.numero || item.nom) && (
                                    <p className="text-xs text-blue-600 mt-1">
                                      {item.numero && `N°${item.numero}`}
                                      {item.numero && item.nom && ' - '}
                                      {item.nom && item.nom.toUpperCase()}
                                    </p>
                                  )}
                                  <p className="text-sm font-semibold text-gray-900 mt-2">
                                    {Number(item.price).toFixed(2)}€
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Informations de livraison et facturation */}
<div>
  <h4 className="font-semibold text-gray-900 mb-4">Adresses</h4>
  
  {/* Adresse de livraison */}
  <div className="bg-yellow-100 rounded-lg p-4 border border-gray-200 mb-3">
    <p className="text-xs font-semibold text-gray-600 mb-1">📦 LIVRAISON</p>
    <p className="text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
  </div>

  {/* Adresse de facturation - TOUJOURS affichée */}

    <div className="bg-blue-100 rounded-lg p-4 border border-gray-200 mb-3">
      <p className="text-xs font-semibold text-gray-600 mb-1">🧾 FACTURATION</p>
      <p className="text-gray-700 whitespace-pre-line">{order.billingAddress ?? "Adresse non disponible"}</p>
    </div>
  

  {order.trackingNumber && (
    <div className="mt-4">
      <p className="text-sm font-semibold text-gray-900 mb-2">Suivi de colis</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={order.trackingNumber}
          readOnly
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors">
          Suivre
        </button>
      </div>
    </div>
  )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
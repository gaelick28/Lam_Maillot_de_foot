"use client"

import { usePage, router, Link } from "@inertiajs/react"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

export default function Panier() {
  const { auth, cartItems = [] } = usePage().props
  const user = auth?.user
  const address = user?.billingAddress || user?.adresse || {}

  // Total global du panier
  const prixTotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0)

  function handleOrder() {
    router.post(
      "/api/commande",
      {
        items: cartItems,
        user_id: user.id,
        adresse_id: address?.id,
      },
      {
        onSuccess: () => {
          alert("Commande passée ! 🎉")
          router.visit("/order")
        },
      },
    )
  }

  function handleRemove(itemId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article du panier ?")) {
      router.delete(`/panier/item/${itemId}`, {
        onSuccess: () => {
          // afficher un message de succès
          console.log("Article supprimé avec succès")
        },
        onError: (errors) => {
          console.error("Erreur lors de la suppression:", errors)
          alert("Erreur lors de la suppression de l'article")
        },
      })
    }
  }

  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Mon panier</h1>

          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 bg-white rounded-lg p-8 shadow-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 17a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-lg mb-4">Votre panier est vide</p>
              <Link href="/" className="text-blue-700 underline hover:text-blue-900">
                Retour à la boutique
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Tableau avec bordures bien visibles */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="p-4 text-left font-semibold">Maillot</th>
                      <th className="p-4 text-left font-semibold">Taille</th>
                      <th className="p-4 text-left font-semibold">Quantité</th>
                      <th className="p-4 text-left font-semibold">Nom</th>
                      <th className="p-4 text-left font-semibold">Numéro</th>
                      <th className="p-4 text-left font-semibold">Prix maillot</th>
                      <th className="p-4 text-left font-semibold">Suppléments</th>
                      <th className="p-4 text-left font-semibold">Total ligne</th>
                      <th className="p-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{item.size}</td>
                        <td className="p-4">{item.quantity}</td>
                        <td className="p-4">
                          {item.nom ? (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{item.nom}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          {item.numero ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                              N° {item.numero}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4">{item.price} €</td>
                        <td className="p-4">
                          {item.supplement > 0 ? <span className="text-orange-600">+{item.supplement} €</span> : "-"}
                        </td>
                        <td className="p-4 font-bold text-blue-600">{item.total} €</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
                            title="Supprimer cet article"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total et actions */}
              <div className="p-6 bg-gray-50 border-t">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-2xl font-bold text-gray-900">Total panier : {prixTotal} €</div>
                  <button
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir vider complètement votre panier ?")) {
                        router.post("/panier/clear")
                      }
                    }}
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Vider le panier
                  </button>
                </div>

                <div className="mb-6">
                  <h2 className="font-semibold mb-3 text-lg">Adresse de livraison/facturation</h2>
                  {address && address.street ? (
                    <div className="bg-white p-4 rounded-md border">
                      <div className="font-medium">
                        {user.firstname} {user.lastname}
                      </div>
                      <div>{address.street}</div>
                      <div>
                        {address.city} {address.postalCode}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <p className="text-yellow-800 mb-2">Aucune adresse de livraison configurée</p>
                      <Link href="/addresses" className="text-blue-600 underline hover:text-blue-800">
                        Ajouter une adresse
                      </Link>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleOrder}
                  disabled={!address || !address.street}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
                >
                  Confirmer ma commande ({prixTotal} €)
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

"use client"

import { useState } from "react"
import { Head, useForm, usePage, Link } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"
import Sidebar from "@/Components/Sidebar"

// Icônes SVG
const HeartIcon = ({ className, filled = false }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

const ShoppingCartIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
)

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const StarIcon = ({ className, filled = false }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

export default function Wishlist({ wishlistItems = [],user }) {
  const { url } = usePage()
  const [removingItem, setRemovingItem] = useState(null)

  const { delete: destroy, processing } = useForm()

  const handleRemoveFromWishlist = (itemId) => {
    if (confirm("Supprimer cet article de votre liste de souhaits ?")) {
      setRemovingItem(itemId)
      destroy(`/wishlist/${itemId}`, {
        onFinish: () => setRemovingItem(null),
      })
    }
  }

  const handleAddToCart = (itemId) => {
    // Logique pour ajouter au panier
    console.log("Ajouter au panier:", itemId)
  }

  return (
    <>
      <Head title="Ma liste de souhaits" />
      <Header />

      <div className="min-h-screen bg-gray-300 flex">
        <Sidebar currentRoute={url} />

        <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
            {/* Message de bienvenue */}
                <div className="bg-blue-300 p-4 rounded shadow mb-6 text-center">
                  <h2 className="text-xl font-semibold text-gray-800">Bienvenue, {user.username} !</h2>
                  <p className="text-sm text-gray-600"> Votre Email : {user.email}</p>
                </div>

            {/* En-tête */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <HeartIcon className="w-8 h-8 text-red-500" filled aria-hidden="true" />
                <h1 className="text-3xl font-bold text-gray-900">Ma liste de souhaits</h1>
              </div>
              <p className="text-gray-600" aria-live="polite">
                {wishlistItems.length > 0
                  ? `${wishlistItems.length} article${wishlistItems.length > 1 ? "s" : ""} dans votre liste de souhaits`
                  : "Votre liste de souhaits est vide"}
              </p>
            </div>

            {wishlistItems.length === 0 ? (
              /* État vide */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Votre liste de souhaits est vide</h3>
                <p className="text-gray-600 mb-6">
                  Découvrez nos produits et ajoutez vos articles préférés à votre liste de souhaits
                </p>
                <Link
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              /* Liste des articles */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${
                      removingItem === item.id ? "opacity-50 scale-95" : "hover:shadow-md"
                    }`}
                  >
                    {/* Image du produit */}
                    <div className="relative">
                      <img
                        src={item.product.image || "/placeholder.svg?height=200&width=200"}
                        alt={item.product.name}
                        className="w-full h-48 object-cover"
                      />

                      {/* Badge de réduction */}
                      {item.product.discount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{item.product.discount}%
                        </span>
                      )}

                      {/* Bouton supprimer */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        disabled={processing}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        aria-label={`Supprimer ${item.product.name} de la liste de souhaits`}
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Informations du produit */}
                    <div className="p-4">
                      {/* Nom du produit */}
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2"
                        aria-label={`Voir les détails de ${item.product.name}`}
                      >
                        {item.product.name}
                      </Link>

                      {/* Équipe/Ligue */}
                      <p className="text-sm text-gray-500 mb-2">{item.product.team || item.product.league}</p>

                      {/* Note */}
                      {item.product.rating && (
                        <div
                          className="flex items-center gap-1 mb-2"
                          role="img"
                          aria-label={`Note: ${item.product.rating} sur 5 étoiles`}
                        >
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                              filled={i < Math.floor(item.product.rating)}
                              aria-hidden="true"
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">({item.product.reviews_count} avis)</span>
                        </div>
                      )}

                      {/* Prix */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          {item.product.sale_price ? item.product.sale_price : item.product.price}€
                        </span>
                        {item.product.sale_price && (
                          <span className="text-sm text-gray-500 line-through">{item.product.price}€</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleAddToCart(item.product.id)}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          aria-label={`Ajouter ${item.product.name} au panier`}
                        >
                          <ShoppingCartIcon className="w-4 h-4" aria-hidden="true" />
                          Ajouter au panier
                        </button>

                        <Link
                          href={`/products/${item.product.slug}`}
                          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block"
                          aria-label={`Voir les détails de ${item.product.name}`}
                       >
                          Voir le produit
                        </Link>
                      </div>

                      {/* Date d'ajout */}
                      <p className="text-xs text-gray-400 mt-3">
                        Ajouté le {new Date(item.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions en bas */}
            {wishlistItems.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900"
                        aria-label="Actions rapides pour la liste de souhaits"
                    >
                      Actions rapides</h3>
                    
                    <p className="text-sm text-gray-600"
                        aria-label="Gérez votre liste de souhaits"
                    >Gérez votre liste de souhaits</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (confirm("Vider complètement votre liste de souhaits ?")) {
                          destroy("/wishlist/clear")
                        }
                      }}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                      aria-label="Vider complètement la liste de souhaits"
                    >
                      Vider la liste
                    </button>
                    <Link
                      href="/wishlist/share"
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                      aria-label="Partager ma liste de souhaits"
                    >
                      Partager ma liste
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

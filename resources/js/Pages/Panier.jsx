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
    router.post('/api/commande', {
      items: cartItems,
      user_id: user.id,
      adresse_id: address?.id,
    }, {
      onSuccess: () => {
        alert("Commande passée ! 🎉")
        router.visit('/order')
      }
    })
  }

  function handleRemove(itemId) {
    router.delete(`/cart/item/${itemId}`)

const supprimerProduit = (id) => {
    Inertia.delete(route('panier.supprimer', id));
    // Optionnel: ajoute un toast/message ou gère le loading
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prix</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(panier).map(([id, item]) => (
          <tr key={id}>
            <td>{item.name}</td>
            <td>{item.price} €</td>
            <td>
              
              <button onClick={() => supprimerProduit(id)} className="btn btn-danger">
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  }

  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Mon panier</h1>
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500">
              Panier vide.<br />
              <Link href="/" className="text-blue-700 underline">Retour boutique</Link>
            </div>
          ) : (
            <>
              {/* Tableau avec bordures bien visibles */}
              <table className="w-full mb-6 border border-gray-400">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-400">
                    <th className="p-2 border-r border-gray-400">Produit</th>
                    <th className="p-2 border-r border-gray-400">Taille</th>
                    <th className="p-2 border-r border-gray-400">Quantité</th>
                    <th className="p-2 border-r border-gray-400">Nom</th>
                    <th className="p-2 border-r border-gray-400">Numéro</th>
                    <th className="p-2 border-r border-gray-400">Prix maillot</th>
                    <th className="p-2 border-r border-gray-400">Suppléments</th>
                    <th className="p-2 border-r border-gray-400">Total ligne</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id} className="border-b border-gray-400">
                      <td className="p-2 border-r border-gray-400">
                        {item.name}
                        {item.image && (
                          <img src={item.image} alt={item.name} style={{ maxWidth: 60, marginTop: 4 }} />
                        )}
                      </td>
                      <td className="p-2 border-r border-gray-400">{item.size}</td>
                      <td className="p-2 border-r border-gray-400">{item.quantity}</td>
                      <td className="p-2 border-r border-gray-400">{item.nom || <span className="text-gray-400">-</span>}</td>
                      <td className="p-2 border-r border-gray-400">{item.numero || <span className="text-gray-400">-</span>}</td>
                      <td className="p-2 border-r border-gray-400">{item.price} €</td>
                      <td className="p-2 border-r border-gray-400">{item.supplement > 0 ? `+${item.supplement} €` : "-"}</td>
                      <td className="p-2 border-r border-gray-400 font-bold">{item.total} €</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mb-4 text-lg font-bold">Total panier : {prixTotal} €</div>

              <div className="mb-6">
                <h2 className="font-semibold mb-2">Adresse de livraison/facturation</h2>
                {address && address.street ? (
                  <div>
                    <div>{user.firstname} {user.lastname}</div>
                    <div>{address.street} {address.city}</div>
                    <div>{address.postalCode}</div>
                  </div>
                ) : (
                  <Link href="/addresses" className="text-blue-600 underline">Ajouter une adresse</Link>
                )}
              </div>
              <button
                onClick={handleOrder}
                className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 font-semibold"
              >
                Confirmer ma commande
              </button>

              
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

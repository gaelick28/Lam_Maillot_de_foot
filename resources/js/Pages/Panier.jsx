import { useEffect, useState } from "react"
import { usePage, router, Link } from "@inertiajs/react"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

export default function Panier() {
  const { auth } = usePage().props
  const [cart, setCart] = useState([])

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"))
  }, [])

  // Récupère nom/prénom de l'utilisateur
  const user = auth.user
  // Option : récupérer l'adresse (soit dans user, soit via une API si plus dynamique)
  const address = user?.billingAddress || user?.adresse || {}

  const prixTotal = cart.reduce((sum, i) => sum + i.total, 0)

  function handleOrder() {
    // Envoie la commande au backend
    router.post('/api/commande', {
      items: cart,
      user_id: user.id,
      adresse_id: address?.id,
      // ... Autres infos à transmettre
    }, {
      onSuccess: () => {
        localStorage.removeItem("cart")
        setCart([])
        alert("Commande passée ! 🎉")
        router.visit('/order')
      }
    })
  }

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Mon panier</h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-500">
            Panier vide.<br />
            <Link href="/" className="text-blue-700 underline">Retour boutique</Link>
          </div>
        ) : (
          <>
            <table className="w-full mb-6">
              <thead>
                <tr className="font-semibold"><td>Produit</td><td>Taille</td><td>Quantité</td><td>Perso</td><td>Prix</td></tr>
              </thead>
              <tbody>
                {cart.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td>{item.nom}</td>
                    <td>{item.taille}</td>
                    <td>{item.quantite}</td>
                    <td>
                      {item.personnalisation.numero && <div>N° {item.personnalisation.numero}</div>}
                      {item.personnalisation.nom && <div>Nom : {item.personnalisation.nom}</div>}
                    </td>
                    <td>{item.total} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mb-4 text-lg font-bold">Total : {prixTotal} €</div>

            <div className="mb-6">
              <h2 className="font-semibold mb-2">Adresse de livraison/facturation</h2>
              {address ? (
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
      </main>
      <Footer />
    </>
  )
}

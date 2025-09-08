// import { usePage, router } from "@inertiajs/react";
// import Header from "@/Components/Header";
// import Footer from "@/Components/Footer";
// import { useState } from "react";

// export default function Checkout({ user, address, cartItems: initialItems }) {
//   const [items, setItems] = useState(initialItems);

//   function removeItem(index) {
//     setItems(prev => prev.filter((_, i) => i !== index));
//     // Optionnel : sync avec le backend/localStorage ici
//   }

//   function handleCheckout() {
//     // Appel API/Laravel, ex:
//     router.post('/api/orders', { items }); // Ou tout autre endpoint
//   }

//   function handleCancel() {
//     setItems([]);
//     // Optionnel : vider panier côté backend/localStorage aussi
//   }

//   return (
//     <>
//       <Header />
//       <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
//         <div className="container mx-auto py-8 px-4">
//         <h1 className="text-2xl mb-4">Finaliser votre commande</h1>
//         <section>
//           <h2 className="font-bold">Votre panier</h2>
//           {items.length === 0 ? (
//             <p>Panier vide.</p>
//           ) : (
//             items.map((item, idx) => (
//               <div key={idx} className="flex gap-4">
//                 <div>{item.name} (Taille {item.size}) x{item.quantity}</div>
//                 <button className="text-red-500" onClick={() => removeItem(idx)}>Retirer</button>
//               </div>
//             ))
//           )}
//         </section>
//         <section className="mt-8">
//           <h2 className="font-bold">Adresse de livraison</h2>
//           {/* Tu pré-remplis avec infos user / accountdetails */}
//           <div>{address?.line1} - {address?.city}</div>
//         </section>
//         <div className="mt-8 flex gap-4">
//           <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCheckout} disabled={items.length === 0}>Valider la commande</button>
//           <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={handleCancel} disabled={items.length === 0}>Annuler</button>
//         </div></div>
//       </main>
//       <Footer />
//     </>
//   );
// }

import { router, usePage } from "@inertiajs/react"
import React, { useState } from "react"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

export default function Checkout() {
  const { cartItems = [], auth } = usePage().props
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const address = auth.user?.billingAddress || auth.user?.adresse || {}

  function handleValidate() {
    if (loading) return;
    setLoading(true)
    router.post('/panier/checkout', {}, {
      onSuccess: () => {
        setSuccess(true)
        setLoading(false)
      },
      onError: () => setLoading(false)
    })
  }

  if(success) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex flex-col justify-center items-center bg-blue-50">
          <h1 className="text-3xl font-bold mb-4">Merci pour votre commande 🎉</h1>
          <p className="mb-4">Votre commande a bien été prise en compte.<br />Vous recevrez bientôt un email de confirmation.</p>
          <a href="/" className="mt-4 text-blue-600 underline">Retour à la boutique</a>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-[60vh] flex flex-col items-center justify-center py-10">
        <div className="bg-white shadow rounded-lg p-8 max-w-xl w-full">
          <h2 className="text-2xl font-bold mb-6">Récapitulatif de la commande</h2>
          <ul className="mb-6">
            {cartItems.map(item => (
              <li key={item.id} className="flex justify-between mb-2">
                <span>{item.maillot_name} (x{item.quantity})</span>
                <span>{Number(item.total).toFixed(2)} €</span>
              </li>
            ))}
          </ul>
          <div className="mb-8">
            <strong>Adresse de livraison :</strong><br/>
            {address.first_name} {address.last_name}<br/>
            {address.street}<br/>
            {address.postal_code} {address.city}<br/>
          </div>
          <button
            onClick={handleValidate}
            className={"bg-green-600 text-white px-6 py-3 rounded font-semibold text-lg w-full hover:bg-green-800 " + (loading && "opacity-60 cursor-wait")}
            disabled={loading}
          >
            {loading ? "Validation..." : "Valider la commande"}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

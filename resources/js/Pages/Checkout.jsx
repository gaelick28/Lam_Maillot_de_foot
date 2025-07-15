import { usePage, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { useState } from "react";

export default function Checkout({ user, address, cartItems: initialItems }) {
  const [items, setItems] = useState(initialItems);

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index));
    // Optionnel : sync avec le backend/localStorage ici
  }

  function handleCheckout() {
    // Appel API/Laravel, ex:
    router.post('/api/orders', { items }); // Ou tout autre endpoint
  }

  function handleCancel() {
    setItems([]);
    // Optionnel : vider panier côté backend/localStorage aussi
  }

  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
        <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl mb-4">Finaliser votre commande</h1>
        <section>
          <h2 className="font-bold">Votre panier</h2>
          {items.length === 0 ? (
            <p>Panier vide.</p>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div>{item.name} (Taille {item.size}) x{item.quantity}</div>
                <button className="text-red-500" onClick={() => removeItem(idx)}>Retirer</button>
              </div>
            ))
          )}
        </section>
        <section className="mt-8">
          <h2 className="font-bold">Adresse de livraison</h2>
          {/* Tu pré-remplis avec infos user / accountdetails */}
          <div>{address?.line1} - {address?.city}</div>
        </section>
        <div className="mt-8 flex gap-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleCheckout} disabled={items.length === 0}>Valider la commande</button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={handleCancel} disabled={items.length === 0}>Annuler</button>
        </div></div>
      </main>
      <Footer />
    </>
  );
}

import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { router } from "@inertiajs/react";
export default function MaillotDetail({ maillot, tailles, quantite, prix, prix_numero, prix_nom }) {
  const [taille, setTaille] = useState(tailles[0]);
  const [qte, setQte] = useState(1);
  const [numero, setNumero] = useState("");
  const [nom, setNom] = useState("");
  const [personnalisation, setPersonnalisation] = useState({ numero: false, nom: false });

  let total = prix + (personnalisation.numero && numero ? prix_numero : 0) + (personnalisation.nom && nom ? prix_nom : 0);

function handleAddToCart() {
  // ...tout ton code pour constituer 'item'
  router.post('/cart/add', {
    maillot_id: maillot.id,
    size: taille,
    quantity: qte,
    numero: personnalisation.numero ? numero : null,
    nom: personnalisation.nom ? nom : null,
  }, {
    onSuccess: () => alert("Produit ajouté au panier !"), // ou toast
  });
}


  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
        <div className="container mx-auto py-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <img src={`/${maillot.image}`} alt={maillot.nom} className="w-full max-w-md rounded shadow" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{maillot.nom}</h1>
            <div className="text-lg mb-4 text-gray-700">{maillot.club?.name}</div>
            <div className="mb-2">Type : <span className="font-semibold">{maillot.type || "Maillot"}</span></div>
            <div className="mb-2">Quantité disponible : <span className="font-semibold">{quantite}</span></div>
            <div className="mb-2">
              Taille :
              <select value={taille} onChange={e => setTaille(e.target.value)} className="ml-2 border rounded px-2 py-1">
                {tailles.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="mb-2">
              Quantité :
              <input
                type="number"
                min="1"
                max={quantite}
                value={qte}
                onChange={e => setQte(e.target.value)}
                className="ml-2 border rounded px-2 py-1 w-16"
              />
            </div>
            <div className="mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={personnalisation.numero}
                  onChange={e => setPersonnalisation(p => ({ ...p, numero: e.target.checked }))}
                  className="mr-2"
                />
                Ajouter un numéro (+{prix_numero} €)
              </label>
              {personnalisation.numero && (
                <input
                  type="text"
                  value={numero}
                  onChange={e => setNumero(e.target.value)}
                  placeholder="Numéro"
                  className="ml-2 border rounded px-2 py-1 w-20"
                />
              )}
            </div>
            <div className="mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={personnalisation.nom}
                  onChange={e => setPersonnalisation(p => ({ ...p, nom: e.target.checked }))}
                  className="mr-2"
                />
                Ajouter un nom (+{prix_nom} €)
              </label>
              {personnalisation.nom && (
                <input
                  type="text"
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                  placeholder="Nom"
                  className="ml-2 border rounded px-2 py-1 w-32"
                />
              )}
            </div>
            <div className="text-xl font-bold mt-4">Total : {total} €</div>
            <button
  onClick={handleAddToCart}
  className="mt-6 px-6 py-2 bg-gradient-to-r from-red-800 to-blue-500 text-white rounded shadow hover:bg-blue-900"
>
  AJOUTER AU PANIER
</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

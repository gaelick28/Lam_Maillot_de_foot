import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { router } from "@inertiajs/react";
import WishlistButton from "@/Components/WishlistButton";

export default function MaillotDetail({ maillot, tailles, quantite, prix, prix_numero, prix_nom }) {
  const [taille, setTaille] = useState(tailles[0]);
  const [qte, setQte] = useState(1);
  const [numero, setNumero] = useState("");
  const [nom, setNom] = useState("");
  const [personnalisation, setPersonnalisation] = useState({ numero: false, nom: false });

  // Validation identique à Panier.jsx pour le numéro
  const validateNumero = (val) => {
    if (val === "") return true;
    if (/^\d+$/.test(val)) {
      const num = parseInt(val, 10);
      return num >= 1 && num <= 99;
    }
    return false;
  };
  
 // Validation numéro : entre 1 et 99 uniquement
  const handleNumeroChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const num = parseInt(val, 10);
      if (val === "" || (num >= 1 && num <= 99)) {
        setNumero(val);
      }
    }
  };

    // Validation identique à Panier.jsx
    const validateNom = (val) => /^[A-Z'ÇÉÈÊËÏÄÜÖÔ\s-]*$/.test(val);
  
    // Validation nom : lettres majuscules uniquement
  const handleNomChange = (e) => {
    const val = e.target.value.toUpperCase();
    if (validateNom(val)) {
      setNom(val);
    }
  };

  // Calcul du supplément pour personnalisation
  const supplement =
    (personnalisation.numero && numero ? prix_numero : 0) +
    (personnalisation.nom && nom ? prix_nom : 0);

  // Multiplie bien par la quantité choisie
  const total = (prix + supplement) * parseInt(qte || 1, 10);

  function handleAddToCart() {
    router.post('/cart/add', {
      maillot_id: maillot.id,
      size: taille,
      quantity: qte,
      numero: personnalisation.numero ? numero : null,
      nom: personnalisation.nom ? nom : null,
    }, {
      onSuccess: () => alert("Maillot ajouté au panier !"), 
    });
  }

  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
        <div className="container mx-auto py-8 flex flex-col md:flex-row gap-8">
          {/* 🔥 Section image avec bouton wishlist - CORRECTION: wrapper qui épouse l'image */}
          <div className="flex-1 flex justify-center md:justify-start">
            <div className="relative w-full max-w-md">
              <img 
                src={`/${maillot.image}`} 
                alt={maillot.nom} 
                className="w-full rounded shadow" 
              />
              
              {/* Bouton Wishlist positionné en haut à droite de l'image */}
              <div className="absolute top-2 right-2 z-10">
                <WishlistButton maillotId={maillot.id} />
              </div>
            </div>
          </div>



         
          <div className="flex-1">  
            <h1 className="text-3xl font-bold mb-2">{maillot.club?.name}</h1>
            <h2 className="text-2xl font-semibold mb-4">{maillot.nom}</h2>
            <div className="mb-2">Prix : <span className="font-semibold">{prix} €</span></div>
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
                 onInput={(e) => {
    // parseInt retire automatiquement les 0 initiaux
    e.target.value = e.target.value.replace(/^0+/, '') || '1';
  }}
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
                Ajouter un numéro (+{prix_numero} €)
          </label>
          {personnalisation.numero && (
            <input
                  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
                  value={numero}
                  onChange={handleNumeroChange}
                 
                 
                  // onKeyDown={(e) => {
                  //   // Bloquer "e", "+", "-", ".", etc. - Identique à Panier.jsx
                  //   // if (
                  //   //   e.key === "e" ||
                  //   //   e.key === "E" ||
                  //   //   e.key === "+" ||
                  //   //   e.key === "-" ||
                  //   //   e.key === "."
                  //   // ) {
                  //   //   e.preventDefault();
                  //   // }
                  // }}
                  placeholder="Numéro (1-99)"
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
                Ajouter un nom (+{prix_nom} €)
          </label>
          {personnalisation.nom && (
            <input
                  type="text"
                  value={nom}
                  onChange={handleNomChange}
                  placeholder="NOM " //(nom en MAJUSCULES; espaces, - et ' autorisés)
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

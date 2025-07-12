import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function MaillotsList({ club, maillots }) {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Maillots de {club.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {maillots.map(maillot => (
            <div key={maillot.id} className="bg-white rounded shadow p-4">
              <img
                src={`/${maillot.image}`}
                alt={maillot.nom}
                className="w-medium h-48 object-cover mb-2"
              />
              <div className="font-semibold">{maillot.nom}</div>
            </div>
          ))}
        </div>
      </div>
  </main> 
  <Footer /> 
   </>
  );
}

import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Head, Link } from "@inertiajs/react"

export default function MaillotsList({ club, maillots }) {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Maillots de {club.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {maillots.map(maillot => (
  <Link
    key={maillot.id}
    href={`/maillots/${maillot.id}`}
    className="block bg-white rounded shadow p-4 hover:shadow-lg transition"
  >
    <img
      src={`/${maillot.image}`}
      alt={maillot.nom}
      className="w-medium h-48 object-cover mb-2"
    />
    <div className="font-semibold">{maillot.nom}</div>
  </Link>
))}
        </div>
      </div>
  </main> 
  <Footer /> 
   </>
  );
}

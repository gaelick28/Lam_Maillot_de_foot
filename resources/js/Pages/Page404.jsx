import React from 'react'

export default function Page404() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg mb-2">Oups... Cette page n'existe pas.</p>
      <a href="/" className="text-blue-400 hover:underline">Retour à l'accueil</a>
    </div>
  );
}

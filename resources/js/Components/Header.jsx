import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex space-x-4">
        <Link href="/" className="hover:underline">Accueil</Link>
        <Link href="/about" className="hover:underline">À propos</Link>
        {/* Ajoute d'autres liens si besoin */}
      </nav>
    </header>
  );
}
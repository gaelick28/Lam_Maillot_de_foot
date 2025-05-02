import React from 'react';
import { Link } from '@inertiajs/react';

export default function Header() {
  return (
    <header className="bg-[#2a3740] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">

        <div className="flex items-center pr-4 pl-12 gap-10 flex-1">
          <img src="images/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-[#495761] px-3 py-1 rounded focus:outline-none focus:ring w-full max-w-xs"
          />
        </div>

        <div className="text-2xl font-bold text-center tracking-wide flex-1 justify-center hidden md:flex">
          <Link href="/">MyScript</Link>
        </div>

        <div className="flex items-center pl-4 pr-12 gap-10 justify-end flex-1">
          <Link href="/login" className="hover:underline">
            Inscription
          </Link>
          <Link href="/login" className="hover:underline">
            Connexion
          </Link>
          <Link href="/cart" className="hover:underline">
            Panier
          </Link>
        </div>

      </div>
    </header>
  );
}

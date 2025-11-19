import React from 'react';
import { Link } from '@inertiajs/react';
import { BallonFootIcon } from '@/Components/Header';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-800 to-red-500 text-white py-6 mt-auto"
            role="contentinfo" //  accessibilité : identifie la section footer
            aria-label="Pied de page" //  accessibilité : description pour les lecteurs d’écran
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          
          {/* Colonne Logo */}
          <div className="flex flex-col items-center md:items-start">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 text-black" aria-label="Accueil de Fou2Foot">
            <BallonFootIcon className="h-9 w-9" />
            <span className="text-lg sm:text-xl font-bold">FOU2FOOT</span>
          </Link>
            <p className="text-sm text-center md:text-left text-gray-200">
              La passion du football au cœur de vos équipements
            </p>
          </div>

          {/* Colonne Informations */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-3 text-gray-200">Informations</h3>
            <div className="space-y-2" aria-label="Liens Informations">
              <Link href="/legal" className="block text-sm hover:text-blue-200">Mentions légales</Link>
              <Link href="/privacy" className="block text-sm hover:text-blue-200">Confidentialité</Link>
              <Link href="/terms" className="block text-sm hover:text-blue-200">CGU/CGV</Link>
            </div>
          </div>

          {/* Colonne Service client */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-3 text-gray-200">Service client</h3>
            <div className="space-y-2"aria-label="Liens Service client">
              <Link href="/delivery" className="block text-sm hover:text-blue-200">Livraisons</Link>
              <Link href="/returns" className="block text-sm hover:text-blue-200">Retours</Link>
              <Link href="/contact" className="block text-sm hover:text-blue-200">Contact</Link>
            </div>
          </div>

          {/* Colonne Réseaux sociaux */}
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-3 text-gray-200">Nous suivre</h3>
            <div className="flex justify-center md:justify-start gap-4" aria-label="Liens Réseaux sociaux">
              <a href="#" className="hover:text-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" aria-label="Twitter" >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-4 text-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Fou2Foot - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
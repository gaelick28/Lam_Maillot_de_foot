import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { FaBoxOpen, FaMapMarkerAlt, FaUser, FaHeart, FaSignOutAlt } from 'react-icons/fa';

export default function Dashboard() {
  return (
    <>
      <Head title="Dashboard" />
      <Header />
      <div className="min-h-screen bg-gray-300 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-500 text-white p-6 hidden md:block">
          <h2 className="text-lg font-bold mb-6 text-blue-900">Navigation</h2>
          <ul className="space-y-4">
            <li>
              <Link href="/account/Tableau de bord " className="flex items-center gap-2 text-black hover:text-blue-200">
                <FaMapMarkerAlt /> Tableau de bord
              </Link>
            </li>
           
            <li>
              <Link href="/account/orders" className="flex items-center gap-2 hover:text-blue-200">
                <FaBoxOpen /> Commandes
              </Link>
            </li>
            <li>
              <Link href="/account/address" className="flex items-center gap-2 hover:text-blue-200">
                <FaMapMarkerAlt /> Adresse
              </Link>
            </li>
            <li>
              <Link href="/account/details" className="flex items-center gap-2 hover:text-blue-200">
                <FaUser /> Détails du compte
              </Link>
            </li>
            <li>
              <Link href="/account/wishlist" className="flex items-center gap-2 hover:text-blue-200">
                <FaHeart /> Ma wishlist
              </Link>
            </li>
            <li>
              <Link href="/logout" className="flex items-center gap-2 text-red-300 hover:text-red-500">
                <FaSignOutAlt /> Se déconnecter
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Mon Tableau de Bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card: Commandes */}
              <Link href="/account/orders" className="bg-white p-6 rounded shadow flex items-center gap-4 hover:bg-gray-50">
                <FaBoxOpen className="text-blue-600 text-3xl" />
                <div>
                  <h2 className="font-bold text-lg">Mes Commandes</h2>
                  <p className="text-gray-600 text-sm">Suivez vos achats passés et en cours.</p>
                </div>
              </Link>

              {/* Card: Adresse */}
              <Link href="/account/address" className="bg-white p-6 rounded shadow flex items-center gap-4 hover:bg-gray-50">
                <FaMapMarkerAlt className="text-blue-600 text-3xl" />
                <div>
                  <h2 className="font-bold text-lg">Adresse</h2>
                  <p className="text-gray-600 text-sm">Gérez votre adresse de livraison.</p>
                </div>
              </Link>

              {/* Card: Détails compte */}
              <Link href="/account/details" className="bg-white p-6 rounded shadow flex items-center gap-4 hover:bg-gray-50">
                <FaUser className="text-blue-600 text-3xl" />
                <div>
                  <h2 className="font-bold text-lg">Détails du compte</h2>
                  <p className="text-gray-600 text-sm">Modifiez vos informations personnelles.</p>
                </div>
              </Link>

              {/* Card: Wishlist */}
              <Link href="/account/wishlist" className="bg-white p-6 rounded shadow flex items-center gap-4 hover:bg-gray-50">
                <FaHeart className="text-blue-600 text-3xl" />
                <div>
                  <h2 className="font-bold text-lg">Ma wishlist</h2>
                  <p className="text-gray-600 text-sm">Retrouvez vos articles favoris.</p>
                </div>
              </Link>
            </div>

            {/* Activité récente (placeholder) */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Activité récente</h2>
              <ul className="space-y-2">
                <li className="bg-white p-4 rounded shadow text-sm text-gray-700">Vous avez passé une commande le 21 mai.</li>
                <li className="bg-white p-4 rounded shadow text-sm text-gray-700">Adresse modifiée le 18 mai.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

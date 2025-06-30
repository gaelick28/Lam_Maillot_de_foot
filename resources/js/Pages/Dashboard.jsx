import { Head, Link } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"
import { FaBoxOpen, FaMapMarkerAlt, FaUser, FaHeart } from "react-icons/fa"
import Sidebar from "@/Components/Sidebar"

export default function Dashboard({ user }) {
  return (
    <>
      <Head title="Dashboard" />
      <Header />

      <div className="min-h-screen bg-gray-300 flex">
        <Sidebar />

        {/* Main Content */}
        <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Message de bienvenue */}
                <div className="bg-blue-300 p-4 rounded shadow mb-6 text-center">
                  <h2 className="text-xl font-semibold text-gray-800">Bienvenue, {user.username} !</h2>
                  <p className="text-sm text-gray-600"> Votre Email : {user.email}</p>
                </div>

            <h1 className="text-3xl font-bold text-center mb-8">Mon Tableau de Bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Card: Commandes */}
              <Link
                href="/order"
                className="bg-white p-6 rounded shadow flex items-center gap-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Accéder à mes commandes"
                role="button"
              >
                <FaBoxOpen className="text-blue-600 text-3xl" aria-hidden="true" />
                <div>
                  <h2 className="font-bold text-lg">Mes Commandes</h2>
                  <p className="text-gray-600 text-sm">Suivez vos achats passés et en cours.</p>
                </div>
              </Link>

              {/* Card: Adresse */}
              <Link
                href="/addresses"
                className="bg-white p-6 rounded shadow flex items-center gap-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Gérer mon adresse de livraison"
                role="button"
              >
                <FaMapMarkerAlt className="text-blue-600 text-3xl" aria-hidden="true" />
                <div>
                  <h2 className="font-bold text-lg">Adresse</h2>
                  <p className="text-gray-600 text-sm">Gérez votre adresse de livraison.</p>
                </div>
              </Link>

              {/* Card: Détails compte */}
              <Link
                href="/accountdetails"
                className="bg-white p-6 rounded shadow flex items-center gap-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Modifier mes informations personnelles"
                role="button"
              >
                <FaUser className="text-blue-600 text-3xl" aria-hidden="true" />
                <div>
                  <h2 className="font-bold text-lg">Détails du compte</h2>
                  <p className="text-gray-600 text-sm">Modifiez vos informations personnelles.</p>
                </div>
              </Link>

              {/* Card: Wishlist */}
              <Link
                href="/mywishlist"
                className="bg-white p-6 rounded shadow flex items-center gap-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Voir ma liste de souhaits"
                role="button"
              >
                <FaHeart className="text-blue-600 text-3xl" aria-hidden="true" />
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
                <li className="bg-white p-4 rounded shadow text-sm text-gray-700">
                  Vous avez passé une commande le 21 mai.
                </li>
                <li className="bg-white p-4 rounded shadow text-sm text-gray-700">Adresse modifiée le 18 mai.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

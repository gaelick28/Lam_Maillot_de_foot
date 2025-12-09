import { Head, Link } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"
import { FaBoxOpen, FaMapMarkerAlt, FaUser, FaHeart, FaBox, FaMap, FaSignInAlt } from "react-icons/fa"
import Sidebar from "@/Components/Sidebar"
import WelcomeMessage from "@/Components/WelcomeMessage"

export default function Dashboard({ user, activities = [] }) {
  // Icône selon le type d'activité
  const getIcon = (type) => {
    switch(type) {
      case 'order':
        return <FaBox className="text-blue-600 text-xl" />
      case 'address':
        return <FaMapMarkerAlt className="text-green-600 text-xl" />
      case 'account':
        return <FaUser className="text-purple-600 text-xl" />
      case 'login':
        return <FaSignInAlt className="text-gray-600 text-xl" />
      default:
        return <FaBox className="text-gray-600 text-xl" />
    }
  }

  // Couleur de bordure selon le type
  const getBorderColor = (type) => {
    switch(type) {
      case 'order':
        return 'border-l-blue-600'
      case 'address':
        return 'border-l-green-600'
      case 'account':
        return 'border-l-purple-600'
      case 'login':
        return 'border-l-gray-600'
      default:
        return 'border-l-gray-600'
    }
  }

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
            <WelcomeMessage user={user} />

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

            {/* Activité récente - DYNAMIQUE */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Activité récente</h2>
              
              {activities.length > 0 ? (
                <ul className="space-y-3">
                  {activities.map((activity, index) => (
                    <li 
                      key={index} 
                      className={`bg-white p-4 rounded shadow border-l-4 ${getBorderColor(activity.type)} flex items-start gap-4 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {activity.message}
                          {activity.details && (
                            <span className="ml-2 text-blue-600 font-semibold">
                              {activity.details}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1" title={activity.full_date}>
                          {activity.formatted_date}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-white p-8 rounded shadow text-center">
                  <p className="text-gray-500">Aucune activité récente</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
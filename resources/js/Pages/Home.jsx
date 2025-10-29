import React from "react"
import { Head, Link } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"

const FEATURED_MAILLOTS = [
  {
    id: 37,
    team: "Girondins de Bordeaux",
    type: "Maillot Domicile 2024/25",
    price: 20,
    image: "/images/maillot/images_maillot/girondins.jfif",
    badge: "",
  },
  {
    id: 38,
    team: "Girondins de Bordeaux",
    type: "Maillot Extérieur 2024/25",
    price: 20.0,
    image: "/images/maillot/images_maillot/girondins_ext_202425.JPG",
  },
  {
    id: 369,
    team: "Olympique Lyonnais",
    type: "Maillot Domicile 2025-26",
    price: 20,
    image: "/images/maillot/images_maillot/ol_25_26_domicile.webp",
    badge: "",
  },
  {
    id: 177,
    team: "Olympique Lyonnais",
    type: "Maillot Extérieur 2025-26",
    price: 20,
    image: "/images/maillot/images_maillot/ol_exterieur_25_26.jfif",
    badge: "",
  },
  {
    id: 1,
    team: "Equipe de France",
    type: "Maillot Domicile 2024",
    price: 20.0,
    image: "/images/maillot/images_maillot/france.JPG",
    badge: "Champions Edition",
  },
  {
    id: 2,
    team: "Equipe de France",
    type: "Maillot Extérieur 2024",
    price: 20.0,
    image: "/images/maillot/images_maillot/france_ext.jfif",
    badge: "Champions Edition",
  },
  {
    id: 187,
    team: "Japon",
    type: "Graffiti",
    price: 20,
    image: "/images/maillot/images_maillot/japon_graffiti.jpg",
    badge: "Limited Edition",
  },
  {
    id: "390",
    team: "Brésil",
    type: "Maillot concept 2025",
    price: 20.0,
    image: "/images/maillot/images_maillot/bresil2.jfif",
    badge: "Nouveauté",
  },
]

const NEW_MAILLOTS = [
  {
    id: 185,
    team: "Japon",
    type: "Geisha",
    price: 20,
    image: "/images/maillot/images_maillot/geisha.webp",
    badge: "Limited Edition",
  },
  {
    id: 382,
    team: "Japon spécial samourai",
    type: "Maillot 2024/25",
    price: 20.0,
    image: "/images/maillot/images_maillot/japon_special_samourai.webp",
    badge: "Nouveauté",
  },
  {
    id: 367,
    team: "Japon",
    type: "Temple blanc",
    price: 20.0,
    image: "/images/maillot/images_maillot/japon_temple_blanc.webp",
    badge: "Limited Edition",
  },
  {
    id: 368,
    team: "Japon",
    type: "Fox",
    price: 20.0,
    image: "/images/maillot/images_maillot/japon_fox.webp",
    badge: "Nouveauté",
  },
]

export default function Homepage({ maillots }) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Head title="Accueil - Fou2Foot" />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 to-blue-500 py-12 sm:py-16 md:py-20 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Maillots de Football Officiels
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6">
              Retrouvez les tenues des plus grands clubs et des plus grandes sélections
            </p>
            <p className="text-base sm:text-lg max-w-4xl mx-auto">
              Nous nous engageons à vous fournir des maillots de football officiels de la meilleure qualité,
              personnalisables, à partir d'un catalogue complet recensant les meilleures ligues, avec livraison rapide.
            </p>
          </div>
        </div>
      </section>

      {/* Maillots vedettes */}
      <section className="bg-gradient-to-r from-purple-200 to-blue-100 py-12 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Nos Maillots Phares
            </h2>

            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {FEATURED_MAILLOTS.map((maillot) => (
                <MaillotCard key={maillot.id} maillot={maillot} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nos nouveaux Maillots */}
      <section className="bg-gradient-to-r from-purple-200 to-blue-100 py-12 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Nos nouveaux Maillots
            </h2>

            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {NEW_MAILLOTS.map((maillot) => (
                <MaillotCard key={maillot.id} maillot={maillot} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Équipes */}
      <section className="bg-gray-100 py-12 w-full flex-grow">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">Nos Équipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <TeamCard team="Girondins de Bordeaux" image="/images/maillot/images_maillot/girondins.jfif" count={11} />
              <TeamCard team="Olympique Lyonnais" image="/images/maillot/images_maillot/lyon_75ans.jfif" count={8} />
              <TeamCard team="France" image="/images/maillot/images_maillot/france.jpg" count={8} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

const MaillotCard = React.memo(function MaillotCard({ maillot }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full">
      <Link href={`/maillots/${maillot.id}`} className="block w-full">
        <div className="relative w-full">
          <img
            src={maillot.image || "/placeholder.svg"}
            alt={`Maillot ${maillot.team}`}
            className="w-full h-48 sm:h-56 object-contain bg-white"
            loading="lazy"
          />
          {maillot.badge && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {maillot.badge}
            </span>
          )}
        </div>

        <div className="p-4 w-full">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 truncate">{maillot.team}</h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 truncate">{maillot.type}</p>
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-bold text-blue-800">{maillot.price.toFixed(2)}€</span>
          </div>
        </div>
      </Link>
    </div>
  )
})

const TeamCard = React.memo(function TeamCard({ team, image, count }) {
  const slug = team.toLowerCase().replace(/ /g, "-")

  return (
    <Link href={`/clubs/${slug}/maillots`} className="block w-full">
      <div className="relative rounded-lg overflow-hidden group cursor-pointer w-full">
        <img
          src={image || "/placeholder.svg"}
          alt={team}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center flex-col p-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">{team}</h3>
          <p className="text-white text-sm sm:text-base">{count} maillots disponibles</p>
        </div>
      </div>
    </Link>
  )
})

import React from "react"
import { Head, Link } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"
import WishlistButton from "@/Components/WishlistButton"

const BADGES = {
  1: "Champions Edition",
  2: "Champions Edition",
  187: "Limited Edition",
  390: "Nouveauté",
  185: "Limited Edition",
  382: "Nouveauté",
  367: "Limited Edition",
  363: "Nouveauté",
}

export default function Homepage({ featuredMaillots = [], newMaillots = [], featuredClubs = [] }) {
  
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Head title="Accueil - Fou2Foot" />
      <Header />

      {/* Hero Section - Accessible */}
      <section 
        className="bg-gradient-to-r from-red-700 to-blue-400 py-9 sm:py-12 md:py-15 w-full"
        aria-labelledby="hero-title"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="mx-auto max-w-7xl">
            <h1 id="hero-title" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              Maillots de Football Officiels
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-4">
              Retrouvez les tenues des plus grands clubs et des plus grandes sélections
            </p>
            <p className="text-sm sm:text-base max-w-4xl mx-auto">
              Nous nous engageons à vous fournir des maillots de football officiels de la meilleure qualité,
              personnalisables, à partir d'un catalogue complet recensant les meilleures ligues, avec livraison rapide.
            </p>
          </div>
        </div>
      </section>

      {/* Maillots vedettes */}
      <section 
        className="bg-gradient-to-r from-purple-200 to-blue-100 py-12 w-full"
        aria-labelledby="featured-title"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 id="featured-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Nos Maillots Phares
            </h2>

            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
  {featuredMaillots.map((maillot) => (
    <MaillotCard key={maillot.id} maillot={maillot} />
  ))}
</div>
          </div>
        </div>
      </section>

      {/* Nos nouveaux Maillots */}
      <section 
        className="bg-gradient-to-r from-purple-200 to-blue-100 py-12 w-full"
        aria-labelledby="new-title"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 id="new-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Nos nouveaux Maillots
            </h2>

           <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
  {newMaillots.map((maillot) => (
    <MaillotCard key={maillot.id} maillot={maillot} />
  ))}
</div>
          </div>
        </div>
      </section>

      {/* Section Équipes */}
      <section 
        className="bg-gray-100 py-12 w-full flex-grow"
        aria-labelledby="teams-title"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 id="teams-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Nos Équipes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredClubs.length > 0 ? (
                featuredClubs.map((club) => (
                  <TeamCard 
                    key={club.slug}
                    team={club.name} 
                    slug={club.slug}
                    image={club.image} 
                    count={club.maillots_count} 
                  />
                ))
              ) : (
                // Fallback si pas de données dynamiques (pour rétrocompatibilité)
                <>
                  <TeamCard team="Girondins de Bordeaux" slug="girondins-de-bordeaux" image="/images/maillot/images_maillot/girondins.jfif" count={0} />
                  <TeamCard team="Olympique Lyonnais" slug="olympique-lyonnais" image="/images/maillot/images_maillot/lyon_75ans.jfif" count={0} />
                  <TeamCard team="France" slug="france" image="/images/maillot/images_maillot/france.jpg" count={0} />
                </>
              )}
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
    <article 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full relative"
      aria-label={`Maillot ${maillot.nom}`}
    >
      <Link 
        href={`/maillots/${maillot.id}`} 
        className="block w-full"
        aria-label={`Voir les détails du maillot ${maillot.nom} à ${Number(maillot.price).toFixed(2)} euros`}
      >
        <div className="relative w-full">
          <img
            src={`/${maillot.image}`}
            alt={`Maillot ${maillot.nom}`}
            className="w-full h-48 sm:h-56 object-contain bg-white cursor-pointer"
            loading="lazy"
          />
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 truncate">
              {maillot.nom}
            </h3>
            <div className="flex justify-between items-center w-full">
              <span className="text-lg font-bold text-blue-800">
                <span className="sr-only">Prix : </span>
                {Number(maillot.price).toFixed(2)}€
              </span>
            </div>
          </div>
        </div>
      </Link>
      {BADGES[maillot.id] && (
  <span 
    className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium"
    aria-label={`Badge ${BADGES[maillot.id]}`}
  >
    {BADGES[maillot.id]}
  </span>
)}

      <div className="absolute top-2 right-2 z-10">
        <WishlistButton maillotId={maillot.id} />
      </div>
    </article>
  )
})

const TeamCard = React.memo(function TeamCard({ team, slug, image, count }) {
  return (
    <Link 
      href={`/clubs/${slug}/maillots`} 
      className="block w-full"
      aria-label={`Voir les ${count} maillots de ${team}`}
    >
      <article className="relative rounded-lg overflow-hidden group cursor-pointer w-full">
        <img
          src={image || "/placeholder.svg"}
          alt={`Logo ${team}`}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center flex-col p-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
            {team}
          </h3>
          <p className="text-white text-sm sm:text-base">
            {count} maillot{count > 1 ? 's' : ''} disponible{count > 1 ? 's' : ''}
          </p>
        </div>
      </article>
    </Link>
  )
})
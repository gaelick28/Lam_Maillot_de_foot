import { Link } from '@inertiajs/react'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer'

export default function Page404({ }) {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-blue-200">
        <div className="text-center px-4">
          <p className="text-9xl font-bold text-red-600">404</p>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Page introuvable</h1>
          <p className="text-gray-600 mt-2">La page que vous cherchez n'existe pas ou a été déplacée.</p>
          <Link href="/" className="mt-6 inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
            Retour à l'accueil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
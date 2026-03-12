import { Head, Link, router, useForm } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { useState } from "react"
import BackToDashboardButton from "@/Components/Admin/BackToDashboardButton"



export default function AdminClubsIndex({ clubs, filters, categories, auth }) {
  const [search, setSearch] = useState(filters.search || '')
  const [showModal, setShowModal] = useState(false)
  const [editingClub, setEditingClub] = useState(null)

  // Formulaire pour créer/éditer un club
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
   category: 'ligue-1',
    logo: null,
    image: null,
    is_featured_home: false,
    home_order: '',
  })

  const handleSearch = (e) => {
    e.preventDefault()
    router.get('/admin/clubs', { search }, { preserveState: true })
  }

  const openCreateModal = () => {
    reset()
    setEditingClub(null)
    setShowModal(true)
  }

  const openEditModal = (club) => {
    setData({
      name: club.name,
      category: club.category, 
      logo: null,
      image: null,
      is_featured_home: club.is_featured_home || false,
      home_order: club.home_order || '',
    })
    setEditingClub(club)
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('country', data.country)
    if (data.logo) {
      formData.append('logo', data.logo)
    }

    if (editingClub) {
      // Édition
      router.post(`/admin/clubs/${editingClub.id}`, {
        _method: 'PUT',
        ...data,
      }, {
        forceFormData: true,
        onSuccess: () => {
          setShowModal(false)
          reset()
        }
      })
    } else {
      // Création
      router.post('/admin/clubs', data, {
        forceFormData: true,
        onSuccess: () => {
          setShowModal(false)
          reset()
        }
      })
    }
  }

  const handleDelete = (club) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${club.name}" ?`)) {
      router.delete(`/admin/clubs/${club.id}`)
    }
  }

  return (
    <AdminLayout>
      <Head title="Gestion des clubs" />

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des clubs</h1>
            <p className="text-gray-600 mt-1">{clubs.total} club(s) au total</p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Créer un club
          </button>
        </div>

        {/* Recherche */}
        <div className="bg-white rounded-lg shadow p-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un club..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔍 Rechercher
            </button>
            {search && (
              <Link
                href="/admin/clubs"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Réinitialiser
              </Link>
            )}
          </form>
        </div>

        {/* Tableau des clubs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Nombre de Maillots</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clubs.data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Aucun club trouvé
                  </td>
                </tr>
              ) : (
                clubs.data.map((club) => (
                  <tr key={club.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {club.logo ? (
                        <img
                          src={`/${club.logo}`}
                          alt={club.name}
                          className="w-12 h-12 object-contain rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                          🏆
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{club.name}</div>                      
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {club.category_name || club.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {club.maillots_count}
                    </span>
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(club)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(club)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {clubs.last_page > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Page {clubs.current_page} sur {clubs.last_page}
              </div>
              <div className="flex gap-2">
                {clubs.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    disabled={!link.url}
                    className={`px-3 py-1 rounded ${
                      link.active
                        ? 'bg-blue-600 text-white'
                        : link.url
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Créer/Éditer */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingClub ? 'Modifier le club' : 'Créer un club'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du club 
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>

              {/* Catégorie */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Catégorie 
  </label>
  <select
    value={data.category}
    onChange={(e) => setData('category', e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    {categories.map((cat) => (
      <option key={cat.slug} value={cat.slug}>
        {cat.name}
      </option>
    ))}
  </select>
  {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
</div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo {editingClub && '(laisser vide pour garder l\'actuel)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setData('logo', e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.logo && <div className="text-red-500 text-sm mt-1">{errors.logo}</div>}
                
                {editingClub && editingClub.logo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Logo actuel :</p>
                    <img
                      src={`/${editingClub.logo}`}
                      alt={editingClub.name}
                      className="w-20 h-20 object-contain mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Image page d'accueil */}
<div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Image page d'accueil {editingClub && "(laisser vide pour garder l'actuelle)"}
    </label>
    <input
        type="file"
        accept="image/*"
        onChange={(e) => setData('image', e.target.files[0])}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {editingClub && editingClub.image && (
        <div className="mt-2">
            <p className="text-sm text-gray-600">Image actuelle :</p>
            <img
                src={`/${editingClub.image}`}
                alt={editingClub.name}
                className="w-32 h-20 object-cover mt-1 rounded"
            />
        </div>
    )}
</div>

{/* Afficher en page d'accueil */}
<div className="flex items-center gap-3">
    <input
        id="is_featured_home"
        type="checkbox"
        checked={data.is_featured_home}
        onChange={(e) => setData('is_featured_home', e.target.checked)}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
    />
    <label htmlFor="is_featured_home" className="text-sm font-medium text-gray-700">
        Afficher dans "Nos Équipes" en page d'accueil
    </label>
</div>

{/* Ordre d'affichage */}
{data.is_featured_home && (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordre d'affichage
        </label>
        <input
            type="number"
            min="1"
            value={data.home_order}
            onChange={(e) => setData('home_order', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 1, 2, 3..."
        />
    </div>
)}

              {/* Boutons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {processing ? 'Enregistrement...' : (editingClub ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <BackToDashboardButton />
    </AdminLayout>
    
  )
}
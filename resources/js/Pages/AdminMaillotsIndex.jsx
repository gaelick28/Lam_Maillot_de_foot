import { Head, Link, router, useForm } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { useState } from "react"

export default function AdminMaillotsIndex({ maillots, clubs, filters, auth }) {
  const [search, setSearch] = useState(filters.search || '')
  const [clubFilter, setClubFilter] = useState(filters.club || '')
  const [showModal, setShowModal] = useState(false)
  const [editingMaillot, setEditingMaillot] = useState(null)

  // Formulaire
  const { data, setData, post, processing, errors, reset } = useForm({
    club_id: '',
    nom: '',
    price: '',
    image: null,
  })

  const handleSearch = (e) => {
    e.preventDefault()
    router.get('/admin/maillots', { search, club: clubFilter }, { preserveState: true })
  }

  const openCreateModal = () => {
    reset()
    setEditingMaillot(null)
    setShowModal(true)
  }

  const openEditModal = (maillot) => {
    setData({
      club_id: maillot.club_id,
      nom: maillot.nom,
      price: maillot.price,
      image: null,
    })
    setEditingMaillot(maillot)
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingMaillot) {
      // Édition
      router.post(`/admin/maillots/${editingMaillot.id}`, {
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
      router.post('/admin/maillots', data, {
        forceFormData: true,
        onSuccess: () => {
          setShowModal(false)
          reset()
        }
      })
    }
  }

  const handleDelete = (maillot) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${maillot.nom}" ?`)) {
      router.delete(`/admin/maillots/${maillot.id}`)
    }
  }

  return (
    <AdminLayout>
      <Head title="Gestion des maillots" />

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des maillots</h1>
            <p className="text-gray-600 mt-1">{maillots.total} maillot(s) au total</p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Créer un maillot
          </button>
        </div>

        {/* Recherche et filtres */}
        <div className="bg-white rounded-lg shadow p-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un maillot..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={clubFilter}
              onChange={(e) => setClubFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les clubs</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>

            <button
              type="submit"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔍 Rechercher
            </button>
            
            {(search || clubFilter) && (
              <Link
                href="/admin/maillots"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Réinitialiser
              </Link>
            )}
          </form>
        </div>

        {/* Tableau des maillots */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Club</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {maillots.data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Aucun maillot trouvé
                  </td>
                </tr>
              ) : (
                maillots.data.map((maillot) => (
                  <tr key={maillot.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {maillot.image ? (
                        <img
                          src={`/${maillot.image}`}
                          alt={maillot.nom}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                          👕
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{maillot.nom}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {maillot.club?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {Number(maillot.price).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(maillot)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(maillot)}
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
          {/* Pagination */}
{maillots.last_page > 1 && (
  <div className="flex justify-between items-center bg-white rounded-lg shadow px-6 py-4">
    <p className="text-sm text-gray-600">
      Affichage de {maillots.from} à {maillots.to} sur {maillots.total} maillots
    </p>
    
    <div className="flex gap-2">
      {maillots.links.map((link, index) => (
        <Link
          key={index}
          href={link.url || '#'}
          preserveState
          className={`px-3 py-1 rounded text-sm ${
            link.active
              ? 'bg-blue-600 text-white'
              : link.url
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  </div>
)}

      {/* Modal Créer/Éditer */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingMaillot ? 'Modifier le maillot' : 'Créer un maillot'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Club */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Club *
                </label>
                <select
                  value={data.club_id}
                  onChange={(e) => setData('club_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez un club</option>
                  {clubs.map((club) => (
                    <option key={club.id} value={club.id}>
                      {club.name}
                    </option>
                  ))}
                </select>
                {errors.club_id && <div className="text-red-500 text-sm mt-1">{errors.club_id}</div>}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du maillot *
                </label>
                <input
                  type="text"
                  value={data.nom}
                  onChange={(e) => setData('nom', e.target.value)}
                  placeholder="Ex: Domicile 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.nom && <div className="text-red-500 text-sm mt-1">{errors.nom}</div>}
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  placeholder="20.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image {editingMaillot ? '(laisser vide pour garder l\'actuelle)' : '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setData('image', e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!editingMaillot}
                />
                {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
                
                {editingMaillot && editingMaillot.image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Image actuelle :</p>
                    <img
                      src={`/${editingMaillot.image}`}
                      alt={editingMaillot.nom}
                      className="w-32 h-32 object-cover mt-1 rounded"
                    />
                  </div>
                )}
              </div>

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
                  {processing ? 'Enregistrement...' : (editingMaillot ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
      </div>
    </AdminLayout>
  )
}
import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';


export default function AddressPage({ addresses }) {
  const [editingAddress, setEditingAddress] = useState(null);
  const { data, setData, post, put, delete: destroy, processing, errors } = useForm({
    id: null,
    first_name: '',
    last_name: '',
    street: '',
    city: '',
    postal_code: '',
    country: 'FR',
    phone: '',
    is_default: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    editingAddress 
      ? put(route('addresses.update', editingAddress))
      : post(route('addresses.store'));
  };

  const handleEdit = (address) => {
    setEditingAddress(address.id);
    setData(address);
  };

  const handleDelete = (id) => {
    if (confirm('Supprimer cette adresse ?')) {
      destroy(route('addresses.destroy', id));
    }
  };

  return (
       <>
      <Head title="Mes adresses" />
      
      <Header />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
        {/* Contenu inchangé de la page d'adresses */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes adresses</h1>
          <button
            onClick={() => setEditingAddress('new')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            + Ajouter une adresse
          </button>
        </div>

        {(editingAddress || addresses.length === 0) && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    value={data.first_name}
                    onChange={e => setData('first_name', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    value={data.last_name}
                    onChange={e => setData('last_name', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    value={data.street}
                    onChange={e => setData('street', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code postal
                  </label>
                  <input
                    value={data.postal_code}
                    onChange={e => setData('postal_code', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <input
                    value={data.city}
                    onChange={e => setData('city', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    value={data.phone}
                    onChange={e => setData('phone', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.is_default}
                    onChange={e => setData('is_default', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    Définir comme adresse par défaut
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {editingAddress ? 'Modifier' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingAddress(null)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {address.is_default && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mb-3 inline-block">
                  Par défaut
                </span>
              )}
              <div className="space-y-2">
                <p className="font-medium">{address.first_name} {address.last_name}</p>
                <p className="text-gray-600">{address.street}</p>
                <p className="text-gray-600">{address.postal_code} {address.city}</p>
                <p className="text-gray-600">{address.country}</p>
                <p className="text-gray-600">{address.phone}</p>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
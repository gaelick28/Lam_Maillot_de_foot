import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Adresse() {
  const { data, setData, post, processing, errors } = useForm({
    firstname: '',
    lastname: '',
    phone: '',
    address: '',
    city: '',
    zipcode: '',
    country: 'France',
  });

  const submit = (e) => {
    e.preventDefault();
    post('/account/address');
  };

  return (
    <>
      <Head title="Mon adresse" />
      <Header />
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Mon adresse de livraison</h1>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  value={data.firstname}
                  onChange={(e) => setData('firstname', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={data.lastname}
                  onChange={(e) => setData('lastname', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.lastname && <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Code postal</label>
                <input
                  type="text"
                  value={data.zipcode}
                  onChange={(e) => setData('zipcode', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.zipcode && <p className="text-red-500 text-sm mt-1">{errors.zipcode}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Pays</label>
                <select
                  value={data.country}
                  onChange={(e) => setData('country', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                </select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
                disabled={processing}
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

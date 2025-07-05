"use client"

import { useState } from "react"
import { Head, useForm, usePage } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"
import Sidebar from "@/Components/Sidebar"

// Icônes SVG
const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


export default function AccountDetails({ user = {}, defaultAddress = {} }) {
  const [editingSection, setEditingSection] = useState(null)
  const { url } = usePage()

  // Ajout de username dans le formulaire
  const personalInfoForm = useForm({
     username: user.username || "",
  first_name: defaultAddress.first_name || user.first_name || "",
  last_name: defaultAddress.last_name || user.last_name || "",
  email: user.email || "",
  phone: defaultAddress.phone || user.phone || "",
  birth_date: user.birth_date || "",
  gender: user.gender || "",
  })

  const passwordForm = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  })

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault()
    personalInfoForm.put("/account/personal-info", {
      onSuccess: () => {
        setEditingSection(null)
      },
    })
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    passwordForm.put("/account/password", {
      onSuccess: () => {
        setEditingSection(null)
        passwordForm.reset()
      },
    })
  }

  return (
    <>
      <Head title="Détails du compte" />
      <Header />

      <div className="min-h-screen bg-gray-300 flex">
        <Sidebar currentRoute={url} />

        <main className="bg-gradient-to-r from-purple-200 to-blue-100 flex-1 p-8">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
            
            {/* Message de bienvenue */}
            <div className="bg-blue-300 p-4 rounded shadow mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800">Bienvenue, {user.username} !</h2>
              <p className="text-sm text-gray-600">Votre Email : {user.email}</p>
            </div>
            
            {/* En-tête */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon compte</h1>
              <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
            </div>

            {/* Informations personnelles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                  </div>
                  {editingSection !== "personal" && (
                    <button
                      onClick={() => setEditingSection("personal")}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      aria-label="Modifier les informations personnelles"
                    >
                      Modifier
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {editingSection === "personal" ? (
                  <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Champ Identifiant */}
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Identifiant *
                        </label>
                        <input
                          id="username"
                          type="text"
                          required
                          value={personalInfoForm.data.username}
                          onChange={(e) => personalInfoForm.setData("username", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          aria-describedby={personalInfoForm.errors.username ? "username_error" : undefined}
                        />
                        {personalInfoForm.errors.username && (
                          <p id="username_error" className="text-red-500 text-sm mt-1" role="alert">
                            {personalInfoForm.errors.username}
                          </p>
                        )}
                      </div>
                      {/* Prénom */}
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom *
                        </label>
                        <input
                          id="first_name"
                          type="text"
                          required
                          value={personalInfoForm.data.first_name}
                          onChange={(e) => personalInfoForm.setData("first_name", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          aria-describedby={personalInfoForm.errors.first_name ? "first_name_error" : undefined}
                        />
                        {personalInfoForm.errors.first_name && (
                          <p id="first_name_error" className="text-red-500 text-sm mt-1" role="alert">
                            {personalInfoForm.errors.first_name}
                          </p>
                        )}
                      </div>
                      {/* Nom */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          type="text"
                          value={personalInfoForm.data.last_name}
                          onChange={(e) => personalInfoForm.setData("last_name", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {personalInfoForm.errors.last_name && (
                          <p className="text-red-500 text-sm mt-1">{personalInfoForm.errors.last_name}</p>
                        )}
                      </div>
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={personalInfoForm.data.email}
                          onChange={(e) => personalInfoForm.setData("email", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {personalInfoForm.errors.email && (
                          <p className="text-red-500 text-sm mt-1">{personalInfoForm.errors.email}</p>
                        )}
                      </div>
                      {/* Téléphone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                          type="tel"
                          value={personalInfoForm.data.phone}
                          onChange={(e) => personalInfoForm.setData("phone", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {personalInfoForm.errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{personalInfoForm.errors.phone}</p>
                        )}
                      </div>
                      {/* Date de naissance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                        <input
                          type="date"
                          value={personalInfoForm.data.birth_date}
                          onChange={(e) => personalInfoForm.setData("birth_date", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        {personalInfoForm.errors.birth_date && (
                          <p className="text-red-500 text-sm mt-1">{personalInfoForm.errors.birth_date}</p>
                        )}
                      </div>
                      {/* Genre */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                        <select
                          value={personalInfoForm.data.gender}
                          onChange={(e) => personalInfoForm.setData("gender", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="male">Homme</option>
                          <option value="female">Femme</option>
                          <option value="other">Autre</option>
                        </select>
                        {personalInfoForm.errors.gender && (
                          <p className="text-red-500 text-sm mt-1">{personalInfoForm.errors.gender}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={personalInfoForm.processing}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSection(null)}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Affichage Identifiant */}
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Identifiant</p>
                        <p className="font-medium">{user.username}</p>
                      </div>
                    </div>
                    {/* Nom complet */}
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">
                          {user.first_name} {user.last_name}
                        </p>
                      </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <MailIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    {/* Téléphone */}
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{user.phone || "Non renseigné"}</p>
                      </div>
                    </div>
                    {/* Date de naissance */}
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <span>
                            {user.birth_date
                              ? new Date(user.birth_date).toLocaleDateString('fr-FR') // ou autre locale
                              : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldIcon className="w-6 h-6 text-red-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
                  </div>
                  {editingSection !== "password" && (
                    <button
                      onClick={() => setEditingSection("password")}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      aria-label="Changer le mot de passe"
                    >
                      Changer le mot de passe
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {editingSection === "password" ? (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1"
                        aria-label="Mot de passe actuel"
                      >Mot de passe actuel</label>
                      <input
                        type="password"
                        value={passwordForm.data.current_password}
                        onChange={(e) => passwordForm.setData("current_password", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      {passwordForm.errors.current_password && (
                        <p className="text-red-500 text-sm mt-1">{passwordForm.errors.current_password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1"
                        aria-label="Nouveau mot de passe"
                      >Nouveau mot de passe</label>
                      
                      <input
                        type="password"
                        value={passwordForm.data.password}
                        onChange={(e) => passwordForm.setData("password", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      {passwordForm.errors.password && (
                        <p className="text-red-500 text-sm mt-1">{passwordForm.errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1"
                      aria-label="Confirmer le nouveau mot de passe">
                        Confirmer le nouveau mot de passe
                      </label>
                      
                      <input
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) => passwordForm.setData("password_confirmation", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      {passwordForm.errors.password_confirmation && (
                        <p className="text-red-500 text-sm mt-1">{passwordForm.errors.password_confirmation}</p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={passwordForm.processing}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        aria-label="Enregistrer le nouveau mot de passe"
                      >
                        Changer le mot de passe
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingSection(null)}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                        aria-label="Annuler la modification du mot de passe"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p className="text-gray-600">Mot de passe dernièrement modifié il y a 3 mois</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Pour votre sécurité, nous recommandons de changer votre mot de passe régulièrement.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Préférences */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900"
                    aria-label="Préférences"
                  >
                    Préférences</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900"
                        aria-label="Activer la newsletter"
                      >Newsletter</p>

                      <p className="text-sm text-gray-500"
                        aria-label="Recevoir les dernières actualités et offres"
                      >
                        Recevoir les dernières actualités et offres</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                        aria-describedby="newsletter-description"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="sr-only">Activer/désactiver la newsletter</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900"
                        aria-label="Notifications par SMS"
                      >
                        Notifications SMS</p>

                      <p className="text-sm text-gray-500"
                        aria-label="Recevoir des notifications par SMS"
                      >
                        Recevoir des notifications par SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900"
                        aria-label="Offres personnalisées"
                      >
                        Offres personnalisées</p>

                      <p className="text-sm text-gray-500"
                        aria-label="Recevoir des offres basées sur vos préférences"
                      >
                        Recevoir des offres basées sur vos préférences</p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

import React, { useState } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';


export default function AuthForm() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
// États pour la visibilité des mots de passe
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  
  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour gérer la soumission du formulaire
    console.log('Form submitted:', formData);
  };
 // Icône œil réutilisable
  const EyeIcon = ({ show }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      {show ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      ) : (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </>
      )}
    </svg>
  );
  return (
    <>
      <Header />

      {/* code1 */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 font-medium text-lg ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('login')}
            >
              Connexion
            </button>
            <button
              className={`px-4 py-2 font-medium text-lg ${activeTab === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('register')}
            >
              Inscription
            </button>
          </div>

          {activeTab === 'login' && (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="login" className="sr-only">
                    Email ou Identifiant
                  </label>
                    <input
                      id="login"
                      name="login"
                      type="text"
                      autoComplete="username"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Email ou Identifiant"
                      value={formData.login}
                      onChange={handleChange}
                    />
                </div>
                <div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Mot de passe"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                    >
                      <EyeIcon show={showLoginPassword} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Se connecter
                </button>
              </div>
            </form>
          )}

          {activeTab === 'register' && (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="username" className="sr-only">
                    Nom
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="identifiant"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
 {/* Nouveau champ Email */}
      <div>
        <label htmlFor="email" className="sr-only">
          Adresse Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Adresse Email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>


                <div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showRegisterPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Mot de passe"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                    >
                      <EyeIcon show={showRegisterPassword} />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <input
                      id="password-confirmation"
                      name="password_confirmation"
                      type={showRegisterConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Confirmer le mot de passe"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center z-20"
                    >
                      <EyeIcon show={showRegisterConfirmPassword} />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  S'inscrire
                </button>
              </div>
            </form>
          )}
        </div>
      </div>


 
      <Footer />
    </>
  );
}

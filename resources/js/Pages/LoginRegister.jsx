import { useForm } from "@inertiajs/react"
import { useState } from "react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  

  const { data, setData, post, processing, errors } = useForm({
    login: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
     remember: false,
  })

  const handleChange = (e) => {
    setData(e.target.name, e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post(isLogin ? "/login" : "/register")
  }

  const EyeIcon = ({ show }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {show ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24M6.23 6.23A10.46 10.46 0 0112 4.5c4.76 0 8.77 3.16 10.07 7.5a10.5 10.5 0 01-4.3 5.77M15.54 15.54a10.46 10.46 0 01-3.54.96c-4.76 0-8.77-3.16-10.07-7.5a10.47 10.47 0 012.04-3.78" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.04 12.32c1.38-4.81 5.32-7.82 9.96-7.82s8.58 3.01 9.96 7.18c.07.21.07.43 0 .64-1.38 4.81-5.32 7.82-9.96 7.82s-8.58-3.01-9.96-7.18z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      )}
    </svg>
  )

  return (
    <>
      <Header />

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Tabs */}
          <div className="flex justify-center mb-6" role="tablist" aria-label="Navigation formulaire">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 font-medium text-lg ${isLogin ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
              role="tab"
              aria-selected={isLogin}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 font-medium text-lg ${!isLogin ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
              role="tab"
              aria-selected={!isLogin}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow" aria-label={isLogin ? "Formulaire de connexion" : "Formulaire d'inscription"}>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                  <input
                    id="username"
                    name="username"
                    value={data.username}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mt-1"
                  />
                  {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mt-1"
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
              </>
            )}

            {isLogin && (
              <div>
                <label htmlFor="login" className="block text-sm font-medium text-gray-700">Nom d'utilisateur ou Email</label>
                <input
                  id="login"
                  name="login"
                  value={data.login}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mt-1"
                />
                {errors.login && <p className="text-sm text-red-600">{errors.login}</p>}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10 mt-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirm ? "text" : "password"}
                    value={data.password_confirmation}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10 mt-1"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
                    aria-label={showConfirm ? "Masquer la confirmation du mot de passe" : "Afficher la confirmation du mot de passe"}
                  >
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
                {errors.password_confirmation && <p className="text-sm text-red-600">{errors.password_confirmation}</p>}
              </div>
            )}
<div className="flex items-center">
  <input
    id="remember"
    name="remember"
    type="checkbox"
    checked={data.remember}
    onChange={e => setData('remember', e.target.checked)}
    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
  />
  <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
    Se souvenir de moi
  </label>
</div>
            <button
              type="submit"
              disabled={processing}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? "Se connecter" : "S'inscrire"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

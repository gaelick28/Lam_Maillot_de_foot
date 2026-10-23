import { useState } from "react"
import { useForm, Head } from "@inertiajs/react"
import Header from "@/Components/Header"
import Footer from "@/Components/Footer"

export default function ResetPassword({ token, email }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { data, setData, post, processing, errors } = useForm({
    token,
    email,
    password: "",
    password_confirmation: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post("/reset-password", {
      onSuccess: () => alert("Votre mot de passe a été modifié. Vous pouvez vous connecter."),
    })
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
      <Head title="Nouveau mot de passe - Fou2Foot" />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-blue-200 py-12 px-4">
        <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4 bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold text-center text-gray-900">Choisir un nouveau mot de passe</h1>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={data.email}
              onChange={e => setData("email", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mt-1"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={e => setData("password", e.target.value)}
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
            <p className="text-sm text-gray-500 mt-1">
              8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial
            </p>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                id="password_confirmation"
                type={showConfirm ? "text" : "password"}
                value={data.password_confirmation}
                onChange={e => setData("password_confirmation", e.target.value)}
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
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}
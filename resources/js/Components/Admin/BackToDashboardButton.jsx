/**
 * Composant bouton "Retour au Dashboard"
 * Réutilisable dans toutes les pages admin
 */
export default function BackToDashboardButton({ 
  text = "Retour au Tableau de Bord",
  url = "/admin/dashboard",
  className = ""
}) {
  return (
    <button
      onClick={() => window.location.href = url}
      className={`px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      {text}
    </button>
  )
}
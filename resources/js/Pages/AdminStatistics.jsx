import { Head, Link } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import BackToDashboardButton from "@/Components/Admin/BackToDashboardButton"

export default function AdminStatistics({ stats, auth }) {
  // Formater les données pour les graphiques
  const revenueData = stats.revenueEvolution.labels.map((label, index) => ({
    month: label,
    revenue: stats.revenueEvolution.data[index]
  }))

  const topMaillotsData = stats.topMaillots.map((item) => ({
    name: `${item.club} - ${item.name}`,
    quantity: item.quantity,
    revenue: item.revenue
  }))

  const topClubsData = stats.topClubs.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    revenue: item.revenue
  }))

  const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

  return (
    <AdminLayout>
      <Head title="Statistiques Avancées" />

      <div className="space-y-6">
        <div className="flex justify-between items-start">
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Statistiques Avancées</h1>
    <p className="text-gray-600 mt-1">Analyse détaillée de vos ventes et performances</p>
  </div>
 {/* <button
            onClick={() => window.location.href = '/admin/dashboard'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au Dashboard
          </button> */}
</div>
        {/* Statistiques par période */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques par période</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Aujourd'hui */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-2">Aujourd'hui</div>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.periodStats.today.orders_count}</p>
                  <p className="text-xs text-gray-500">Commandes</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{fmt.format(stats.periodStats.today.revenue)}</p>
                  <p className="text-xs text-gray-500">Revenus</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{fmt.format(stats.periodStats.today.average_order)}</p>
                  <p className="text-xs text-gray-500">Panier moyen</p>
                </div>
              </div>
            </div>

            {/* 7 derniers jours */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-2">7 derniers jours</div>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.periodStats.week.orders_count}</p>
                  <p className="text-xs text-gray-500">Commandes</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{fmt.format(stats.periodStats.week.revenue)}</p>
                  <p className="text-xs text-gray-500">Revenus</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{fmt.format(stats.periodStats.week.average_order)}</p>
                  <p className="text-xs text-gray-500">Panier moyen</p>
                </div>
              </div>
            </div>

            {/* 30 derniers jours */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-2">30 derniers jours</div>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.periodStats.month.orders_count}</p>
                  <p className="text-xs text-gray-500">Commandes</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{fmt.format(stats.periodStats.month.revenue)}</p>
                  <p className="text-xs text-gray-500">Revenus</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{fmt.format(stats.periodStats.month.average_order)}</p>
                  <p className="text-xs text-gray-500">Panier moyen</p>
                </div>
              </div>
            </div>

            {/* Année */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-2">Cette année</div>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.periodStats.year.orders_count}</p>
                  <p className="text-xs text-gray-500">Commandes</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{fmt.format(stats.periodStats.year.revenue)}</p>
                  <p className="text-xs text-gray-500">Revenus</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{fmt.format(stats.periodStats.year.average_order)}</p>
                  <p className="text-xs text-gray-500">Panier moyen</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique d'évolution des revenus */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Évolution des revenus (12 derniers mois)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => fmt.format(value)}
                labelStyle={{ color: '#000' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Revenus"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 10 Maillots */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top  20 Maillots Vendus</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Maillot</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Quantité</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.topMaillots.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.club}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                        {fmt.format(item.revenue)}
                      </td>
                    </tr>
                  ))}
                  {stats.topMaillots.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        Aucune vente enregistrée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 10 Clubs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top  20 Clubs</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Club</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Ventes</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.topClubs.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                        {fmt.format(item.revenue)}
                      </td>
                    </tr>
                  ))}
                  {stats.topClubs.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        Aucune vente enregistrée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Graphique Top Clubs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ventes par Club (Top  20)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topClubsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#3B82F6" name="Quantité vendue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Actions */}
        <BackToDashboardButton />
      </div>
    </AdminLayout>
  )
}
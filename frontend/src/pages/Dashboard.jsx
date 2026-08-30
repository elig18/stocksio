import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { getDashboardStats } from '../services/api'
import AlertBanner from '../components/AlertBanner'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function KpiCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-lg border border-gray-mid/20 p-5">
      <p className="text-gray-mid text-sm">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent ? 'text-teal-dark' : 'text-navy'}`}>{value}</p>
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch(() => setError("Impossible de charger les statistiques du dashboard."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="max-w-6xl mx-auto px-4 py-10 text-gray-mid">Chargement du dashboard…</p>
  }

  if (error) {
    return (
      <p role="alert" className="max-w-6xl mx-auto px-4 py-10 text-red-700">
        {error}
      </p>
    )
  }

  const chartData = {
    labels: stats.categories.map((c) => c.category),
    datasets: [
      {
        label: 'Quantité en stock',
        data: stats.categories.map((c) => c.total),
        backgroundColor: '#2ec4b6',
        borderRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>

      <AlertBanner alerts={stats.products_in_alert} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Produits" value={stats.total_products} />
        <KpiCard label="Entrepôts" value={stats.total_warehouses} />
        <KpiCard label="Stock total" value={stats.total_stock} />
        <KpiCard label="Produits en alerte" value={stats.alerts_count} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-mid/20 p-5">
          <h2 className="text-lg font-semibold text-navy mb-4">Répartition par catégorie</h2>
          {stats.categories.length > 0 ? (
            <Bar data={chartData} options={chartOptions} aria-label="Graphique de répartition du stock par catégorie" role="img" />
          ) : (
            <p className="text-gray-mid text-sm">Aucune donnée pour le moment.</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-mid/20 p-5">
          <h2 className="text-lg font-semibold text-navy mb-4">Derniers mouvements</h2>
          {stats.recent_movements.length === 0 ? (
            <p className="text-gray-mid text-sm">Aucun mouvement enregistré.</p>
          ) : (
            <ul className="divide-y divide-gray-mid/15 text-sm">
              {stats.recent_movements.map((m) => (
                <li key={m.id} className="py-2 flex items-center justify-between">
                  <span className="text-navy">
                    {m.movement_type === 'entree' ? 'Entrée' : 'Sortie'} — {m.note || 'Sans note'}
                  </span>
                  <span
                    className={`font-medium tabular-nums ${
                      m.movement_type === 'entree' ? 'text-teal-dark' : 'text-red-600'
                    }`}
                  >
                    {m.movement_type === 'entree' ? '+' : '-'}
                    {m.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}

export default Dashboard

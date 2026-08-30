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
import { getDashboardStats, getWarehouses, importProductsCSV } from '../services/api'
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

function CsvImportCard({ onImported }) {
  const [warehouses, setWarehouses] = useState([])
  const [warehouseId, setWarehouseId] = useState('')
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [feedback, setFeedback] = useState(null) // { type: 'success' | 'error', message }

  useEffect(() => {
    getWarehouses()
      .then((res) => {
        const list = res.data.data
        setWarehouses(list)
        if (list.length > 0) setWarehouseId(String(list[0].id))
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !warehouseId) return

    setImporting(true)
    setFeedback(null)
    try {
      const res = await importProductsCSV(file, warehouseId)
      setFeedback({ type: 'success', message: res.data.message })
      setFile(null)
      e.target.reset()
      onImported?.()
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || "Échec de l'import du fichier.",
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-mid/20 p-5 mb-8">
      <h2 className="text-lg font-semibold text-navy mb-1">Importer des produits (CSV)</h2>
      <p className="text-gray-mid text-sm mb-4">
        Colonnes attendues : Nom (obligatoire), Référence, Catégorie, Quantité, Seuil alerte, Unité.
      </p>

      {warehouses.length === 0 ? (
        <p className="text-gray-mid text-sm">
          Crée d'abord un entrepôt pour pouvoir importer des produits.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label htmlFor="import-warehouse" className="block text-sm font-medium text-navy mb-1">
              Entrepôt de destination
            </label>
            <select
              id="import-warehouse"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full rounded-md border border-gray-mid/30 px-3 py-2 text-sm"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="import-file" className="block text-sm font-medium text-navy mb-1">
              Fichier CSV
            </label>
            <input
              id="import-file"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-mid file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-navy file:text-offwhite file:text-sm file:cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={!file || importing}
            className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-navy hover:bg-teal-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
          >
            {importing ? 'Import…' : 'Importer'}
          </button>
        </form>
      )}

      {feedback && (
        <p
          role="status"
          className={`mt-3 text-sm ${feedback.type === 'success' ? 'text-teal-dark' : 'text-red-600'}`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadStats = () => {
    getDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch(() => setError("Impossible de charger les statistiques du dashboard."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStats()
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

      <CsvImportCard onImported={loadStats} />

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
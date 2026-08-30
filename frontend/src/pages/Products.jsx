import { useEffect, useState } from 'react'
import {
  getProducts,
  getWarehouses,
  createProduct,
  deleteProduct,
  exportCSV,
} from '../services/api'
import StockTable from '../components/StockTable'

const emptyForm = { name: '', reference: '', category: '', quantity: 0, alert_threshold: 5, unit: 'unité', warehouse_id: '' }

function Products() {
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadProducts = (p = page, s = search) => {
    setLoading(true)
    getProducts({ page: p, per_page: 20, search: s })
      .then((res) => {
        setProducts(res.data.data)
        setPages(res.data.pages || 1)
      })
      .catch(() => setError('Impossible de charger les produits.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts(1, '')
    getWarehouses().then((res) => setWarehouses(res.data.data)).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    loadProducts(1, search)
  }

  const changePage = (newPage) => {
    setPage(newPage)
    loadProducts(newPage, search)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return
    try {
      await deleteProduct(id)
      loadProducts(page, search)
    } catch {
      setError('Suppression impossible.')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.warehouse_id) {
      setError('Le nom et l\'entrepôt sont requis.')
      return
    }
    try {
      await createProduct({ ...form, quantity: Number(form.quantity), alert_threshold: Number(form.alert_threshold) })
      setForm(emptyForm)
      setShowForm(false)
      loadProducts(1, search)
      setPage(1)
    } catch (err) {
      setError(err.response?.data?.message || 'Création impossible.')
    }
  }

  const handleExport = async () => {
    const res = await exportCSV()
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'stocks.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-navy">Produits</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-mid/30 text-navy hover:border-teal cursor-pointer"
          >
            Exporter CSV
          </button>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-navy hover:bg-teal-dark hover:text-white cursor-pointer"
          >
            {showForm ? 'Annuler' : '+ Ajouter un produit'}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg border border-gray-mid/20 p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-navy mb-1">Nom *</label>
            <input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
          </div>
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-navy mb-1">Référence</label>
            <input id="reference" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-navy mb-1">Catégorie</label>
            <input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-navy mb-1">Quantité</label>
            <input id="quantity" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
          </div>
          <div>
            <label htmlFor="alert_threshold" className="block text-sm font-medium text-navy mb-1">Seuil d'alerte</label>
            <input id="alert_threshold" type="number" min="0" value={form.alert_threshold} onChange={(e) => setForm({ ...form, alert_threshold: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
          </div>
          <div>
            <label htmlFor="warehouse" className="block text-sm font-medium text-navy mb-1">Entrepôt *</label>
            <select id="warehouse" required value={form.warehouse_id} onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none">
              <option value="">Choisir…</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-navy hover:bg-teal-dark hover:text-white cursor-pointer">
              Créer le produit
            </button>
          </div>
        </form>
      )}

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <label htmlFor="search" className="sr-only">Rechercher un produit</label>
        <input
          id="search"
          type="search"
          placeholder="Rechercher un produit…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none bg-white"
        />
        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-navy text-offwhite hover:bg-navy-light cursor-pointer">
          Rechercher
        </button>
      </form>

      {loading ? (
        <p className="text-gray-mid text-sm py-8 text-center">Chargement…</p>
      ) : (
        <>
          <StockTable products={products} onDelete={handleDelete} />

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => changePage(p)}
                  aria-current={p === page ? 'page' : undefined}
                  className={`w-8 h-8 rounded-md text-sm cursor-pointer ${
                    p === page ? 'bg-teal text-navy font-semibold' : 'bg-white border border-gray-mid/30 text-navy'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default Products

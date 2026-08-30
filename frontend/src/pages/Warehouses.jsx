import { useEffect, useState } from 'react'
import { getWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../services/api'

const emptyForm = { name: '', location: '' }

function Warehouses() {
  const [warehouses, setWarehouses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getWarehouses()
      .then((res) => setWarehouses(res.data.data))
      .catch(() => setError('Impossible de charger les entrepôts.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const startEdit = (w) => {
    setEditingId(w.id)
    setForm({ name: w.name, location: w.location || '' })
    setShowForm(true)
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name) {
      setError('Le nom est requis.')
      return
    }
    try {
      if (editingId) {
        await updateWarehouse(editingId, form)
      } else {
        await createWarehouse(form)
      }
      resetForm()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Opération impossible.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet entrepôt ? Les produits associés seront affectés.')) return
    try {
      await deleteWarehouse(id)
      load()
    } catch {
      setError('Suppression impossible.')
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Entrepôts</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-navy hover:bg-teal-dark hover:text-white cursor-pointer"
        >
          {showForm ? 'Annuler' : '+ Ajouter un entrepôt'}
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-mid/20 p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="w-name" className="block text-sm font-medium text-navy mb-1">Nom *</label>
            <input id="w-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
          </div>
          <div>
            <label htmlFor="w-location" className="block text-sm font-medium text-navy mb-1">Localisation</label>
            <input id="w-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-navy hover:bg-teal-dark hover:text-white cursor-pointer">
              {editingId ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-mid text-sm py-8 text-center">Chargement…</p>
      ) : warehouses.length === 0 ? (
        <p className="text-gray-mid text-sm py-8 text-center">Aucun entrepôt pour le moment.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {warehouses.map((w) => (
            <li key={w.id} className="bg-white rounded-lg border border-gray-mid/20 p-4">
              <p className="font-semibold text-navy">{w.name}</p>
              <p className="text-gray-mid text-sm">{w.location || 'Localisation non renseignée'}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => startEdit(w)} className="text-teal-dark text-xs font-medium hover:underline cursor-pointer">
                  Modifier
                </button>
                <button onClick={() => handleDelete(w.id)} className="text-red-600 text-xs font-medium hover:underline cursor-pointer">
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default Warehouses

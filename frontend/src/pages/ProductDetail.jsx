import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProduct, updateProduct, deleteProduct, getMovements, addMovement } from '../services/api'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [movements, setMovements] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  const [moveForm, setMoveForm] = useState({ quantity: '', movement_type: 'entree', note: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    Promise.all([getProduct(id), getMovements(id)])
      .then(([p, m]) => {
        setProduct(p.data.data)
        setForm(p.data.data)
        setMovements(m.data.data)
      })
      .catch(() => setError('Produit introuvable.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [id])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const res = await updateProduct(id, form)
      setProduct(res.data.data)
      setEditing(false)
    } catch {
      setError('Mise à jour impossible.')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Supprimer définitivement ce produit ?')) return
    try {
      await deleteProduct(id)
      navigate('/products')
    } catch {
      setError('Suppression impossible.')
    }
  }

  const handleMovement = async (e) => {
    e.preventDefault()
    setError('')
    if (!moveForm.quantity || Number(moveForm.quantity) <= 0) {
      setError('Indique une quantité valide.')
      return
    }
    try {
      await addMovement({ product_id: Number(id), quantity: Number(moveForm.quantity), movement_type: moveForm.movement_type, note: moveForm.note })
      setMoveForm({ quantity: '', movement_type: 'entree', note: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Mouvement impossible.')
    }
  }

  if (loading) return <main className="max-w-3xl mx-auto px-4 py-10 text-gray-mid">Chargement…</main>
  if (!product) return <main className="max-w-3xl mx-auto px-4 py-10 text-red-700">{error || 'Produit introuvable.'}</main>

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/products" className="text-sm text-teal-dark hover:underline">&larr; Retour aux produits</Link>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="bg-white rounded-lg border border-gray-mid/20 p-6 mt-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-navy">{product.name}</h1>
            <p className="text-gray-mid text-sm">{product.reference || 'Sans référence'}</p>
          </div>
          {product.is_low_stock && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Rupture proche</span>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="e-name" className="block text-sm font-medium text-navy mb-1">Nom</label>
              <input id="e-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
            </div>
            <div>
              <label htmlFor="e-category" className="block text-sm font-medium text-navy mb-1">Catégorie</label>
              <input id="e-category" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
            </div>
            <div>
              <label htmlFor="e-threshold" className="block text-sm font-medium text-navy mb-1">Seuil d'alerte</label>
              <input id="e-threshold" type="number" min="0" value={form.alert_threshold} onChange={(e) => setForm({ ...form, alert_threshold: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
            </div>
            <div>
              <label htmlFor="e-unit" className="block text-sm font-medium text-navy mb-1">Unité</label>
              <input id="e-unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <button type="button" onClick={() => { setEditing(false); setForm(product) }} className="px-4 py-2 rounded-md text-sm bg-white border border-gray-mid/30 text-navy cursor-pointer">
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-navy hover:bg-teal-dark hover:text-white cursor-pointer">
                Enregistrer
              </button>
            </div>
          </form>
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <dt className="text-gray-mid">Quantité actuelle</dt>
                <dd className="text-navy font-semibold text-lg">{product.quantity} {product.unit}</dd>
              </div>
              <div>
                <dt className="text-gray-mid">Seuil d'alerte</dt>
                <dd className="text-navy font-semibold text-lg">{product.alert_threshold}</dd>
              </div>
              <div>
                <dt className="text-gray-mid">Catégorie</dt>
                <dd className="text-navy">{product.category || 'Sans catégorie'}</dd>
              </div>
              <div>
                <dt className="text-gray-mid">Dernière mise à jour</dt>
                <dd className="text-navy">{new Date(product.updated_at).toLocaleDateString('fr-FR')}</dd>
              </div>
            </dl>
            <div className="flex gap-2">
              <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-mid/30 text-navy hover:border-teal cursor-pointer">
                Modifier
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer">
                Supprimer
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-mid/20 p-6 mt-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Enregistrer un mouvement</h2>
        <form onSubmit={handleMovement} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label htmlFor="m-type" className="block text-sm font-medium text-navy mb-1">Type</label>
            <select id="m-type" value={moveForm.movement_type} onChange={(e) => setMoveForm({ ...moveForm, movement_type: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none">
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
            </select>
          </div>
          <div>
            <label htmlFor="m-qty" className="block text-sm font-medium text-navy mb-1">Quantité</label>
            <input id="m-qty" type="number" min="1" value={moveForm.quantity} onChange={(e) => setMoveForm({ ...moveForm, quantity: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="m-note" className="block text-sm font-medium text-navy mb-1">Note</label>
            <input id="m-note" value={moveForm.note} onChange={(e) => setMoveForm({ ...moveForm, note: e.target.value })}
              className="w-full rounded-md border border-gray-mid/40 px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal outline-none" />
          </div>
          <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-teal text-navy hover:bg-teal-dark hover:text-white cursor-pointer">
            Enregistrer
          </button>
        </form>

        <h3 className="text-sm font-semibold text-navy mt-6 mb-2">Historique</h3>
        {movements.length === 0 ? (
          <p className="text-gray-mid text-sm">Aucun mouvement enregistré.</p>
        ) : (
          <ul className="divide-y divide-gray-mid/15 text-sm">
            {movements.map((m) => (
              <li key={m.id} className="py-2 flex items-center justify-between">
                <span className="text-navy">
                  {new Date(m.date).toLocaleString('fr-FR')} — {m.note || 'Sans note'}
                </span>
                <span className={`font-medium tabular-nums ${m.movement_type === 'entree' ? 'text-teal-dark' : 'text-red-600'}`}>
                  {m.movement_type === 'entree' ? '+' : '-'}{m.quantity}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default ProductDetail

import { Link } from 'react-router-dom'

// Tableau produits réutilisable — scroll horizontal sur mobile pour éviter
// tout débordement de la page (cf. tests multi-résolutions).
function StockTable({ products, onDelete }) {
  if (!products || products.length === 0) {
    return <p className="text-gray-mid text-sm py-8 text-center">Aucun produit à afficher.</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-mid/20 bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-navy text-offwhite text-left">
            <th scope="col" className="px-4 py-3 font-medium">Nom</th>
            <th scope="col" className="px-4 py-3 font-medium">Référence</th>
            <th scope="col" className="px-4 py-3 font-medium">Catégorie</th>
            <th scope="col" className="px-4 py-3 font-medium text-right">Quantité</th>
            <th scope="col" className="px-4 py-3 font-medium">Statut</th>
            <th scope="col" className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-mid/15">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-offwhite/60">
              <td className="px-4 py-3 font-medium text-navy">
                <Link to={`/products/${p.id}`} className="hover:text-teal-dark underline-offset-2 hover:underline">
                  {p.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-gray-mid">{p.reference || '—'}</td>
              <td className="px-4 py-3 text-gray-mid">{p.category || 'Sans catégorie'}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {p.quantity} {p.unit}
              </td>
              <td className="px-4 py-3">
                {p.is_low_stock ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    Rupture proche
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-teal/15 text-teal-dark">
                    OK
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <Link
                  to={`/products/${p.id}`}
                  className="text-teal-dark hover:underline text-xs font-medium mr-3"
                >
                  Détail
                </Link>
                {onDelete && (
                  <button
                    onClick={() => onDelete(p.id)}
                    className="text-red-600 hover:underline text-xs font-medium cursor-pointer"
                  >
                    Supprimer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StockTable

import { Link } from 'react-router-dom'

// Bannière d'alerte critique en haut de dashboard (ruptures / stock bas)
function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <div
      role="alert"
      className="bg-red-50 border border-red-300 text-red-800 rounded-lg px-4 py-3 mb-6 flex items-start gap-3"
    >
      <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <div className="flex-1 text-sm">
        <p className="font-semibold">
          {alerts.length} produit{alerts.length > 1 ? 's' : ''} en alerte de rupture
        </p>
        <p className="text-red-700">
          {alerts.slice(0, 3).map((p) => p.name).join(', ')}
          {alerts.length > 3 ? `, +${alerts.length - 3} autre${alerts.length - 3 > 1 ? 's' : ''}` : ''}
        </p>
      </div>
      <Link to="/products" className="text-sm font-medium underline shrink-0">
        Voir les produits
      </Link>
    </div>
  )
}

export default AlertBanner

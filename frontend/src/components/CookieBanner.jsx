import { useEffect, useState } from 'react'

// Bandeau de consentement cookies — conformité RGPD.
// Uniquement des cookies fonctionnels (session), aucun tracking tiers.
function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const choice = localStorage.getItem('cookie_consent')
    if (!choice) setVisible(true)
  }, [])

  const choose = (value) => {
    localStorage.setItem('cookie_consent', value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed bottom-0 inset-x-0 z-50 bg-navy text-offwhite px-4 py-4 shadow-lg"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-offwhite/90">
          StockS.io utilise uniquement des cookies fonctionnels nécessaires à la connexion
          (aucun cookie de tracking tiers). Voir notre{' '}
          <a href="/mentions-legales" className="underline text-teal">
            politique de confidentialité
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => choose('refused')}
            className="px-3 py-2 text-sm rounded-md bg-navy-light text-offwhite hover:bg-white/10 cursor-pointer"
          >
            Refuser
          </button>
          <button
            onClick={() => choose('accepted')}
            className="px-3 py-2 text-sm rounded-md bg-teal text-navy font-medium hover:bg-teal-dark cursor-pointer"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner

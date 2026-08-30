import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logoLight from '../assets/logo-light.png'

const displayFont = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const bodyFont = "'Manrope', system-ui, sans-serif"

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b8cff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
    <path d="M5 12l4 4 10-10" />
  </svg>
)

const BellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9d5bff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a5 5 0 00-5 5v3.4c0 .6-.2 1.2-.6 1.7L5 15h14l-1.4-1.9c-.4-.5-.6-1.1-.6-1.7V8a5 5 0 00-5-5z" />
    <path d="M9.5 19a2.5 2.5 0 005 0" />
  </svg>
)

// Catégories illustratives pour le cas d'usage Jusdeliens (EdTech) — chiffres
// fictifs pour la démo, pas de vraies données de stock.
const STOCK_LEVELS = [
  { label: 'Kits robotique Junior', pct: 82, color: '#5b8cff' },
  { label: 'Cahiers & manuels CE2', pct: 28, color: '#ff8a65' },
  { label: 'Tablettes pédagogiques', pct: 91, color: '#9d5bff' },
  { label: 'Fournitures scolaires', pct: 63, color: '#5b8cff' },
]

const DEMO_ALERTS = [
  'Cahiers & manuels CE2 : stock bas, réassort recommandé',
  'Kits robotique Junior : réappro conseillé sous 4 jours',
  'Tablettes pédagogiques : niveau de stock optimal',
]

function Demo() {
  const [form, setForm] = useState({ nom: '', email: '', taille: '1 à 10 salariés' })
  const [sent, setSent] = useState(false)

  const [grown, setGrown] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 250)
    return () => clearTimeout(t)
  }, [])

  const [alertIndex, setAlertIndex] = useState(0)
  const [alertVisible, setAlertVisible] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setAlertVisible(false)
      setTimeout(() => {
        setAlertIndex((i) => (i + 1) % DEMO_ALERTS.length)
        setAlertVisible(true)
      }, 300)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Pas de backend de prise de rendez-vous branché pour l'instant — accusé de réception seulement
    setSent(true)
  }

  return (
    <div style={{ fontFamily: bodyFont }} className="min-h-screen bg-[#0c0a17] text-[#f3f1fb] antialiased">
      <header className="border-b border-white/10">
        <div className="max-w-[1080px] mx-auto px-6 md:px-10 flex items-center h-16">
          <Link to="/" className="flex items-center">
            <img src={logoLight} alt="StockS.io" className="h-7 w-auto" />
          </Link>
        </div>
      </header>

      <main className="max-w-[1080px] mx-auto px-6 md:px-10 py-14 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-14 items-start">
          <div>
            <span className="inline-flex text-[12.5px] font-semibold text-[#9d97b8] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              Cas d'usage réel
            </span>
            <h1 style={{ fontFamily: displayFont }} className="mt-5 text-[clamp(26px,4.2vw,32px)] leading-tight">
              Réservez une démo, testée sur un vrai cas d'usage PME
            </h1>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#9d97b8]">
              StockS.io a été conçu et éprouvé avec <strong className="text-[#f3f1fb]">Jusdeliens</strong>, une PME
              EdTech normande confrontée aux ruptures de stock et au temps perdu en gestion manuelle.
              En 30 minutes, on vous montre comment StockS.io s'applique à votre propre stock — pas une
              démo générique.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-8">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <div style={{ fontFamily: displayFont }} className="text-[22px] font-bold">43%</div>
                <div className="text-[12px] text-[#736d8f] mt-1">des PME subissent des ruptures de stock chaque année</div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <div style={{ fontFamily: displayFont }} className="text-[22px] font-bold">30%</div>
                <div className="text-[12px] text-[#736d8f] mt-1">du budget opérationnel gaspillé en surstock non géré</div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <div style={{ fontFamily: displayFont }} className="text-[22px] font-bold">~2h</div>
                <div className="text-[12px] text-[#736d8f] mt-1">perdues chaque jour en gestion manuelle des stocks</div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <div className="flex gap-2.5 text-sm text-[#9d97b8]"><CheckIcon />On regarde votre stock actuel et vos points de friction</div>
              <div className="flex gap-2.5 text-sm text-[#9d97b8]"><CheckIcon />Démonstration du dashboard et des prédictions de Stocky</div>
              <div className="flex gap-2.5 text-sm text-[#9d97b8]"><CheckIcon />Recommandation du plan adapté à votre taille</div>
            </div>

            {/* aperçu visuel du dashboard StockS.io, montré pendant la démo */}
            <div className="relative mt-8">
              {/* soft blurred glow behind the mockup, for a lifted 3D feel */}
              <div className="absolute -inset-5 md:-inset-8 -z-10 bg-gradient-to-br from-[#5b8cff]/40 via-[#9d5bff]/30 to-transparent blur-[50px] rounded-[32px]" />
              <div className="relative z-10 bg-[#161329] border border-white/10 rounded-2xl overflow-hidden shadow-[0_45px_100px_-30px_rgba(93,60,255,0.4),0_20px_50px_-20px_rgba(0,0,0,0.55)]">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
                <span className="w-[9px] h-[9px] rounded-full bg-[#4a4560]" />
                <span className="w-[9px] h-[9px] rounded-full bg-[#4a4560]" />
                <span className="w-[9px] h-[9px] rounded-full bg-[#4a4560]" />
                <span className="ml-2.5 text-[11.5px] text-[#736d8f]">app.stocksio.fr/dashboard</span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#9d97b8]">Niveaux de stock</span>
                    <span className="ml-2 text-[10.5px] text-[#736d8f]">· Jusdeliens</span>
                  </div>
                  <span className="text-[11px] text-[#9d5bff] bg-[#9d5bff]/15 px-2.5 py-1 rounded-full">Stocky IA</span>
                </div>

                <div className="flex flex-col gap-3">
                  {STOCK_LEVELS.map((cat, i) => (
                    <div key={cat.label}>
                      <div className="flex justify-between text-[11.5px] mb-1.5">
                        <span className="text-[#c9c5db]">{cat.label}</span>
                        <span className="text-[#736d8f] tabular-nums">{cat.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#120f21] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-[900ms] ease-out"
                          style={{
                            width: grown ? `${cat.pct}%` : '0%',
                            backgroundColor: cat.color,
                            transitionDelay: `${i * 120}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 bg-[#120f21] rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-[#9d5bff]/15 flex items-center justify-center">
                    <BellIcon />
                  </span>
                  <p
                    className={`text-[12.5px] text-[#e5e2f0] transition-opacity duration-300 ${
                      alertVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {DEMO_ALERTS[alertIndex]}
                  </p>
                </div>
              </div>
              </div>
            </div>
          </div>

          <div className="md:sticky md:top-8 bg-[#161329] border border-white/10 rounded-2xl p-8">
            {sent ? (
              <div className="text-center py-8">
                <h2 style={{ fontFamily: displayFont }} className="text-lg">Merci&nbsp;!</h2>
                <p className="text-sm text-[#9d97b8] mt-3">
                  On revient vers vous sous 24 à 48h pour caler un créneau de démo.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 style={{ fontFamily: displayFont }} className="text-lg">Choisissez votre créneau</h2>
                <div>
                  <label htmlFor="nom" className="block text-[13px] font-semibold text-[#9d97b8] mb-1.5">Nom</label>
                  <input
                    id="nom" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Votre nom"
                    className="w-full h-11 rounded-[10px] border border-white/10 bg-white/[0.03] px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9d5bff]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[13px] font-semibold text-[#9d97b8] mb-1.5">Email professionnel</label>
                  <input
                    id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="vous@entreprise.fr"
                    className="w-full h-11 rounded-[10px] border border-white/10 bg-white/[0.03] px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9d5bff]"
                  />
                </div>
                <div>
                  <label htmlFor="taille" className="block text-[13px] font-semibold text-[#9d97b8] mb-1.5">Taille de l'entreprise</label>
                  <select
                    id="taille" value={form.taille} onChange={(e) => setForm({ ...form, taille: e.target.value })}
                    className="w-full h-11 rounded-[10px] border border-white/10 bg-white/[0.03] px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9d5bff]"
                  >
                    <option>1 à 10 salariés</option>
                    <option>11 à 50 salariés</option>
                    <option>51 à 200 salariés</option>
                    <option>200+ salariés</option>
                  </select>
                </div>
                <button type="submit" className="mt-2 h-[46px] rounded-[10px] text-white font-semibold bg-gradient-to-r from-[#5b8cff] to-[#9d5bff]">
                  Réserver mon créneau
                </button>
                <p className="text-[12px] text-[#736d8f] text-center">30 minutes · Sans engagement</p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Demo

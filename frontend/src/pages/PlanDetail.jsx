import { useParams, Link, Navigate } from 'react-router-dom'
import logoLight from '../assets/logo-light.png'

const displayFont = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const bodyFont = "'Manrope', system-ui, sans-serif"

const CheckIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
    <path d="M5 12l4 4 10-10" />
  </svg>
)

const PLANS = {
  basic: {
    name: 'Basic',
    price: '19 €',
    period: '/mois',
    accent: '#5b8cff',
    tagline: 'Pour démarrer sereinement',
    description:
      "Idéal pour une petite structure avec un seul point de stockage qui veut sortir des fichiers Excel dispersés et avoir enfin une vision claire de son stock, en temps réel.",
    idealFor: 'PME de 1 à 10 salariés, un seul entrepôt.',
    features: [
      'Dashboard temps réel — vue d’ensemble du stock et des mouvements',
      'Alertes automatiques dès qu’un produit passe sous son seuil critique',
      '1 entrepôt',
      'Export CSV de votre stock',
      'Authentification sécurisée (JWT)',
      'Conformité RGPD et accessibilité dès la conception',
    ],
  },
  pro: {
    name: 'Pro',
    price: '49 €',
    period: '/mois',
    accent: '#9d5bff',
    tagline: 'Pour piloter et anticiper',
    description:
      "Pensé pour les PME qui gèrent plusieurs points de stockage et veulent anticiper leurs besoins grâce à l’IA plutôt que de réagir aux ruptures une fois qu’elles arrivent.",
    idealFor: 'PME en croissance, plusieurs entrepôts.',
    features: [
      'Tout ce qui est inclus dans Basic',
      'Prédictions de demande par Stocky, notre IA de gestion de stock',
      'Détection d’anomalies sur vos mouvements de stock',
      'Recommandations de réapprovisionnement automatiques',
      'Multi-entrepôts',
      'Export CSV illimité',
    ],
  },
}

function PlanDetail() {
  const { slug } = useParams()
  const plan = PLANS[slug]

  if (!plan) return <Navigate to="/" replace />

  return (
    <div style={{ fontFamily: bodyFont }} className="min-h-screen bg-[#0c0a17] text-[#f3f1fb] antialiased">
      <header className="border-b border-white/10">
        <div className="max-w-[900px] mx-auto px-6 md:px-10 flex items-center h-16">
          <Link to="/" className="flex items-center">
            <img src={logoLight} alt="StockS.io" className="h-7 w-auto" />
          </Link>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 md:px-10 py-14 md:py-20">
        <Link to="/#tarifs" className="text-[13px] text-[#736d8f] hover:text-[#9d97b8]">&larr; Voir tous les plans</Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span
              style={{ color: plan.accent, backgroundColor: `${plan.accent}26` }}
              className="inline-flex text-[12px] font-semibold px-3 py-1 rounded-full"
            >
              Plan {plan.name}
            </span>
            <h1 style={{ fontFamily: displayFont }} className="mt-4 text-[clamp(26px,4vw,32px)]">
              {plan.tagline}
            </h1>
          </div>
          <div className="text-right">
            <span style={{ fontFamily: displayFont }} className="text-[36px] font-bold">{plan.price}</span>
            <span className="text-[13px] text-[#736d8f]">{plan.period}</span>
          </div>
        </div>

        <p className="mt-6 text-[15.5px] leading-relaxed text-[#9d97b8] max-w-[640px]">{plan.description}</p>

        <div className="mt-4 inline-flex items-center gap-2 text-[13.5px] text-[#9d97b8] bg-white/[0.03] border border-white/10 rounded-full px-4 py-2">
          <span className="text-[#736d8f]">Idéal pour :</span> {plan.idealFor}
        </div>

        <div className="mt-10 bg-[#161329] border border-white/10 rounded-2xl p-8">
          <h2 style={{ fontFamily: displayFont }} className="text-lg mb-5">Ce qui est inclus</h2>
          <ul className="flex flex-col gap-3.5">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-3 text-[14.5px] text-[#e5e2f0]">
                <CheckIcon color={plan.accent} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to={`/register?plan=${slug}`}
            style={{ background: `linear-gradient(100deg, ${plan.accent}, #9d5bff)` }}
            className="inline-flex h-[48px] items-center justify-center px-7 rounded-[10px] text-[15px] font-semibold text-white"
          >
            Créer mon compte {plan.name}
          </Link>
          <Link to="/demo" className="text-[13.5px] text-[#9d97b8] hover:text-[#f3f1fb]">
            Pas encore sûr·e&nbsp;? Réservez une démo d'abord →
          </Link>
        </div>
      </main>
    </div>
  )
}

export default PlanDetail

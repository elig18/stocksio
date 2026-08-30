import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import StockyWidget from '../components/StockyWidget'
import Reveal from '../components/Reveal'
import jusdeliensLogo from '../assets/jusdeliens-logo.png'
import logoLight from '../assets/logo-light.png'

// Déplace et estompe légèrement un bloc pendant le scroll — utilisé sur le
// titre du hero pour un effet plus dynamique qu'un texte statique.
function useScrollParallax(factor = 0.18, fadeDistance = 320) {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return {
    transform: `translateY(-${scrollY * factor}px)`,
    opacity: Math.max(1 - scrollY / fadeDistance, 0),
  }
}

// Décor de lignes courbes façon "flux de données" derrière le hero — inspiré
// des landing pages plus dynamiques, adapté à la palette bleu-violet du site.
function HeroLines() {
  const lines = Array.from({ length: 9 })
  return (
    <svg
      className="pointer-events-none absolute -left-16 bottom-[-60px] w-[380px] h-[280px] opacity-60 hidden md:block"
      viewBox="0 0 380 280"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroLinesGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#4dd8f0" />
          <stop offset="0.55" stopColor="#5b8cff" />
          <stop offset="1" stopColor="#9d5bff" />
        </linearGradient>
      </defs>
      {lines.map((_, i) => {
        const o = i * 5
        return (
          <path
            key={i}
            d={`M0,${260 - o} C110,${260 - o} 130,${110 - o * 1.6} 380,${8 + o * 2.6}`}
            stroke="url(#heroLinesGrad)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity={0.35 + i * 0.05}
          />
        )
      })}
    </svg>
  )
}

// Navbar façon Wave : barre pleine largeur en haut de page, qui se transforme
// en pilule flottante centrée quand on remonte après avoir scrollé, et se
// masque quand on descend.
function useScrollNav(threshold = 40) {
  const [navState, setNavState] = useState('top') // 'top' | 'hidden' | 'floating'
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y <= threshold) setNavState('top')
      else if (y < lastY) setNavState('floating')
      else setNavState('hidden')
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return navState
}

// Compte de 0 jusqu'à la cible à l'affichage — donne un effet "dashboard qui se
// charge en direct" plutôt qu'un chiffre statique.
function useCountUp(target, durationMs = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    let raf
    const step = (timestamp) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / durationMs, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])
  return value
}

const displayFont = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const bodyFont = "'Manrope', system-ui, sans-serif"

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f5c451">
    <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.2l7.1-.6z" />
  </svg>
)

// Badge décoratif façon "sceau" à côté de "Pourquoi StockS.io ?" — reprend la
// forme hexagonale d'un badge de récompense, mais avec un message vrai
// (différenciateur réel de StockS.io) plutôt qu'un faux prix externe.
function TrustBadge() {
  return (
    <div className="relative w-[122px] h-[142px] shrink-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5b8cff] to-[#9d5bff] opacity-25 blur-xl rounded-full" />
      <div
        className="relative w-full h-full bg-[#161329] border border-white/10 flex flex-col items-center justify-center gap-1 px-2.5 py-4 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      >
        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[#9d5bff] mb-0.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19a4.5 4.5 0 000-9 6 6 0 00-11.4-1.5A4.5 4.5 0 007 19h10.5z" />
          </svg>
        </span>
        <span style={{ fontFamily: displayFont }} className="text-[9px] font-bold text-white">2026</span>
        <span style={{ fontFamily: displayFont }} className="text-[10px] font-bold text-white leading-tight">
          PME<br />APPROVED
        </span>
        <span className="text-[7px] tracking-[0.08em] uppercase text-[#9d97b8]">StockS.io</span>
        <span className="mt-0.5 inline-flex items-center justify-center bg-white text-[#0c0a17] text-[6.5px] font-bold px-1.5 py-0.5 rounded-full">
          Validé terrain
        </span>
      </div>
    </div>
  )
}

const CheckIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M5 12l4 4 10-10" />
  </svg>
)

// Carte tarif avec effet de tilt 3D qui suit la souris — inspiré des interactions
// anime.js/awwwards, pour donner du dynamisme à la section pricing plutôt qu'un
// simple hover:scale statique.
function TiltCard({ children, className = '', baseScale = 1 }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotateY = (px - 0.5) * 14
    const rotateX = (py - 0.5) * -14
    el.style.transition = 'transform 0.08s linear'
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${baseScale * 1.035})`
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
    el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(${baseScale})`
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `perspective(900px) scale(${baseScale})`, willChange: 'transform' }}
      className={className}
    >
      {children}
    </div>
  )
}

const FAQ_ITEMS = [
  {
    q: 'Combien coûte StockS.io ?',
    a: "StockS.io démarre à 19€/mois avec le plan Basic (1 entrepôt), 49€/mois pour le plan Pro avec les prédictions IA de Stocky, et sur devis pour le plan Max multi-sites. Aucun engagement.",
  },
  {
    q: "Qu'est-ce que Stocky ?",
    a: "Stocky est le moteur IA de StockS.io, inclus dans les plans Pro et Max : il analyse vos mouvements de stock pour prédire vos besoins, détecter les anomalies et recommander des réapprovisionnements avant la rupture.",
  },
  {
    q: 'Puis-je changer de plan à tout moment ?',
    a: "Oui, vous pouvez passer d'un plan à l'autre à tout moment depuis votre espace, sans engagement ni frais de changement.",
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: "StockS.io est conforme RGPD dès la conception : données hébergées en Europe, chiffrement, et vous gardez le contrôle total sur la suppression de votre compte et de vos données.",
  },
  {
    q: "Combien d'entrepôts puis-je gérer ?",
    a: 'Le plan Basic couvre 1 entrepôt, le plan Pro gère le multi-entrepôts, et le plan Max est pensé pour les structures multi-sites avec entrepôts illimités.',
  },
  {
    q: 'Comment réserver une démo ?',
    a: "Cliquez sur « Réserver une démo » : on vous montre StockS.io appliqué à votre propre stock en 30 minutes, testé sur le cas d'usage réel de Jusdeliens.",
  },
]

const WHY_US = [
  {
    title: 'Conçu avec un vrai cas d’usage PME',
    text: "Pas un outil enterprise simplifié après coup : validé dès le départ sur le terrain avec Jusdeliens, pas sur une hypothèse.",
    color: '#5b8cff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M6 21V7l6-4 6 4v14M10 21v-6h4v6" />
      </svg>
    ),
  },
  {
    title: 'Opérationnel en quelques minutes',
    text: "Pas de consultant ni d'intégrateur : on importe son stock et le dashboard est prêt, contrairement aux ERP classiques.",
    color: '#9d5bff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
      </svg>
    ),
  },
  {
    title: 'IA prédictive accessible',
    text: 'Les prédictions de Stocky sont incluses dès 49€/mois, là où ce type de fonctionnalité est souvent réservé aux offres enterprise.',
    color: '#ff8a65',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    title: 'RGPD et accessibilité dès la conception',
    text: "Pas ajoutés après coup pour cocher une case : pensés dès le départ, un argument qui compte pour répondre aux exigences de vos clients.",
    color: '#5b8cff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9.5 12l2 2 3.5-4" />
      </svg>
    ),
  },
]

const FEATURES_MENU = [
  {
    label: 'Dashboard temps réel',
    text: "Vue d'ensemble de votre stock, mise à jour en direct",
    to: '#comment-ca-marche',
    color: '#5b8cff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" />
      </svg>
    ),
  },
  {
    label: 'Prédictions IA Stocky',
    text: 'Anticipez les ruptures avant qu’elles arrivent',
    to: '#comment-ca-marche',
    color: '#9d5bff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="7" cy="6.5" r="2.7" />
        <circle cx="17" cy="6.5" r="2.7" />
        <path d="M12 5c-4.4 0-8 3.5-8 7.7 0 4.3 3.6 7.3 8 7.3s8-3 8-7.3C20 8.5 16.4 5 12 5z" />
      </svg>
    ),
  },
  {
    label: 'Alertes automatiques',
    text: 'Notifié dès qu’un produit passe sous son seuil',
    to: '#comment-ca-marche',
    color: '#ff8a65',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a5 5 0 00-5 5v3.4c0 .6-.2 1.2-.6 1.7L5 15h14l-1.4-1.9c-.4-.5-.6-1.1-.6-1.7V8a5 5 0 00-5-5z" /><path d="M9.5 19a2.5 2.5 0 005 0" />
      </svg>
    ),
  },
]

const PRICING_MENU = [
  { label: 'Basic', text: '19€/mois · 1 entrepôt', to: '/plans/basic', color: '#5b8cff' },
  { label: 'Pro', text: '49€/mois · IA Stocky incluse', to: '/plans/pro', color: '#9d5bff' },
  { label: 'Max', text: 'Sur devis · multi-sites', to: '/contact', color: '#ff8a65' },
]

// Deuxième colonne du mega menu "Fonctionnalités" — regroupe des infos déjà
// présentes sur la landing page (section confiance, différenciateurs, FAQ,
// à propos) plutôt que d'inventer du contenu qui n'existe pas encore.
const INFO_MENU = [
  {
    label: 'Pourquoi StockS.io ?',
    text: 'Ce qui nous différencie des ERP classiques',
    to: '#pourquoi',
    color: '#5b8cff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.35-9.5-8.5C.8 8.8 2.3 5 6 5c2 0 3.5 1.2 4.5 2.6C11.5 6.2 13 5 15 5c3.7 0 5.2 3.8 3.5 7.5C19 16.65 12 21 12 21z" />
      </svg>
    ),
  },
  {
    label: 'Ils nous font confiance',
    text: 'Jusdeliens et les équipes qui utilisent StockS.io',
    to: '#confiance',
    color: '#ff8a65',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9.5 12l2 2 3.5-4" />
      </svg>
    ),
  },
  {
    label: 'FAQ',
    text: 'Toutes les réponses à vos questions',
    to: '#faq',
    color: '#9d5bff',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.6 9.3a2.5 2.5 0 114 2c-.8.6-1.6 1.1-1.6 2.3" />
        <circle cx="12" cy="16.6" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

// Menu déroulant "À propos" — repris du wireframe d'origine (Services /
// Pricing / À propos), avec des liens vers du contenu déjà existant.
const ABOUT_MENU = [
  { label: 'Notre histoire', text: 'Qui sommes-nous et pourquoi StockS.io', to: '/about', color: '#5b8cff' },
  { label: 'Le cas Jusdeliens', text: 'Notre premier partenaire terrain', to: '#confiance', color: '#ff8a65' },
  { label: 'Contact', text: 'Une question ? Écrivez-nous', to: '/contact', color: '#9d5bff' },
]

// Menu déroulant desktop pour la navbar — hover ou clic, se ferme au clic
// extérieur. Les entrées ancrées (#...) restent des <a>, les entrées vers une
// autre route utilisent <Link>.
function NavDropdown({ label, items, withIcons = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 hover:text-[#9d5bff]"
      >
        {label}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-200 origin-top ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="w-[260px] bg-[#161329] border border-white/10 rounded-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] py-2 overflow-hidden">
          {items.map((item) => {
            const content = (
              <>
                {withIcons && (
                  <span className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}26`, color: item.color }}>
                    {item.icon}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-semibold text-[#f3f1fb]">{item.label}</span>
                  <span className="block text-[12px] text-[#9d97b8] mt-0.5">{item.text}</span>
                </span>
              </>
            )
            const rowClass = 'flex items-center gap-3 px-4 py-2.5 hover:bg-white/5'
            return item.to.startsWith('#') ? (
              <a key={item.label} href={item.to} className={rowClass}>{content}</a>
            ) : (
              <Link key={item.label} to={item.to} className={rowClass}>{content}</Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Mega menu desktop pour "Fonctionnalités" — inspiré du menu "Resources" de
// Parabola (colonnes d'items avec icône + description, plus une carte mise en
// avant à droite), adapté à StockS.io avec des liens vers du contenu qui
// existe déjà sur la landing page.
function NavMegaMenu({ label, discover, more }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const renderRow = (item) => {
    const content = (
      <>
        <span className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}26`, color: item.color }}>
          {item.icon}
        </span>
        <span className="min-w-0">
          <span className="block text-[13.5px] font-semibold text-[#f3f1fb]">{item.label}</span>
          <span className="block text-[12px] text-[#9d97b8] mt-0.5">{item.text}</span>
        </span>
      </>
    )
    const rowClass = 'flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5'
    return item.to.startsWith('#') ? (
      <a key={item.label} href={item.to} className={rowClass}>{content}</a>
    ) : (
      <Link key={item.label} to={item.to} className={rowClass}>{content}</Link>
    )
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1.5 hover:text-[#9d5bff]"
      >
        {label}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={`absolute left-0 top-full pt-3 transition-all duration-200 origin-top-left ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="w-[600px] max-w-[86vw] bg-[#161329] border border-white/10 rounded-2xl shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)] p-5 grid grid-cols-[1fr_1fr_180px] gap-2">
          <div>
            <p className="px-3 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#736d8f] mb-1">Découvrir</p>
            {discover.map(renderRow)}
          </div>
          <div className="border-l border-white/10 pl-2">
            <p className="px-3 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#736d8f] mb-1">StockS.io</p>
            {more.map(renderRow)}
          </div>
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#5b8cff]/25 to-[#9d5bff]/25 border border-white/10 p-4 flex flex-col justify-between">
            <div>
              <span className="inline-flex w-8 h-8 rounded-lg bg-white/10 items-center justify-center text-white mb-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l1.8 5.6L19.4 9l-5.6 1.6L12 16l-1.8-5.4L4.6 9l5.6-1.4z" />
                </svg>
              </span>
              <p className="text-[13.5px] font-semibold text-white leading-snug">Stocky en action</p>
              <p className="text-[12px] text-[#e4e1f3] mt-1.5 leading-relaxed">
                Notre IA prédictive, testée en démo interactive.
              </p>
            </div>
            <Link
              to="/demo"
              className="mt-4 inline-flex h-9 items-center justify-center px-4 rounded-full text-[12.5px] font-semibold text-[#0c0a17] bg-white hover:bg-white/90 transition-colors"
            >
              Réserver une démo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-[#161329] border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[14.5px] font-semibold text-[#f3f1fb]">{question}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9d97b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-[#9d97b8]">{answer}</p>
        </div>
      </div>
    </div>
  )
}

function Landing() {
  const refCount = useCountUp(187)
  const alertCount = useCountUp(5)
  const warehouseCount = useCountUp(2)
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 250)
    return () => clearTimeout(t)
  }, [])
  const heroParallax = useScrollParallax()
  const navState = useScrollNav()

  return (
    <div style={{ fontFamily: bodyFont }} className="bg-[#0c0a17] text-[#f3f1fb] antialiased">
      {/* ============ HEADER ============ */}
      <header
        className={`fixed top-0 inset-x-0 z-30 transition-transform duration-300 ease-out ${
          navState === 'hidden' ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div
          className={`mx-auto transition-all duration-300 ease-out ${
            navState === 'floating'
              ? 'max-w-[900px] mt-3 px-5 rounded-full border border-white/10 bg-[#14111f]/60 backdrop-blur-xl shadow-[0_20px_45px_-22px_rgba(0,0,0,0.65)]'
              : 'max-w-[1180px] mt-0 px-6 md:px-10 rounded-none border-b border-white/10 bg-[#0c0a17]/60 backdrop-blur-xl'
          }`}
        >
          <div className={`flex items-center justify-between transition-all duration-300 ease-out ${navState === 'floating' ? 'h-14' : 'h-16'}`}>
            <div className="flex items-center transition-transform duration-300 ease-out hover:scale-110 hover:-rotate-2">
              <img src={logoLight} alt="StockS.io" className="h-8 w-auto" />
            </div>
            <nav className="hidden md:flex items-center gap-7 text-sm text-[#9d97b8]">
              <NavMegaMenu label="Services" discover={FEATURES_MENU} more={INFO_MENU} />
              <NavDropdown label="Pricing" items={PRICING_MENU} />
              <NavDropdown label="À propos" items={ABOUT_MENU} />
            </nav>
            <div className="flex items-center gap-2.5">
              <Link to="/login" className="hidden sm:inline-flex h-[38px] items-center justify-center px-4 rounded-[10px] text-sm font-semibold border border-white/10 hover:border-white/20">
                Connexion
              </Link>
              <Link to="/demo" className="inline-flex h-[38px] items-center justify-center px-[18px] rounded-[10px] text-sm font-semibold text-white bg-gradient-to-r from-[#5b8cff] to-[#9d5bff]">
                Réserver une démo
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* espace réservé pour compenser le header désormais en position fixed */}
      <div className="h-16" aria-hidden="true" />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-16 md:pt-[88px] pb-16 md:pb-24">
        <div className="pointer-events-none absolute -top-28 -right-40 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,rgba(93,120,255,0.16),transparent_70%)]" />
        <div className="relative max-w-[1180px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div style={heroParallax}>
            <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#9d97b8] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <span className="inline-flex gap-px">
                <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
              </span>
              4,9/5 · +1000 avis
            </span>
            <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }} className="mt-5 text-[clamp(30px,5.2vw,44px)] leading-[1.12] max-w-[520px]">
              La gestion de stock, enfin simple pour les PME
            </h1>
            <p className="mt-5 text-[16.5px] leading-relaxed text-[#9d97b8] max-w-[440px]">
              StockS.io centralise vos stocks, anticipe les ruptures et automatise le
              réapprovisionnement grâce à Stocky, notre IA prédictive.
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Link to="/demo" className="inline-flex h-12 items-center justify-center px-6 rounded-[10px] text-[15px] font-semibold text-white bg-gradient-to-r from-[#5b8cff] to-[#9d5bff]">
                Réserver une démo
              </Link>
              <a href="#tarifs" className="inline-flex h-12 items-center justify-center px-6 rounded-[10px] text-[15px] font-semibold border border-white/15 bg-white/[0.03]">
                Voir les tarifs
              </a>
            </div>
            <p className="mt-4 text-[13px] text-[#736d8f]">Dès 19&nbsp;€/mois · Sans engagement</p>
          </div>

          {/* single image module: browser-frame dashboard mockup */}
          <Reveal delay={150} className="relative">
            <HeroLines />
            {/* soft blurred glow behind the mockup, for a lifted 3D feel */}
            <div className="absolute -inset-6 md:-inset-10 -z-10 bg-gradient-to-br from-[#5b8cff]/45 via-[#9d5bff]/35 to-transparent blur-[55px] rounded-[36px]" />
            <div className="relative z-10 bg-[#161329] border border-white/10 rounded-2xl overflow-hidden shadow-[0_50px_110px_-30px_rgba(93,60,255,0.45),0_25px_55px_-20px_rgba(0,0,0,0.55)]">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
                <span className="w-[9px] h-[9px] rounded-full bg-[#4a4560]" />
                <span className="w-[9px] h-[9px] rounded-full bg-[#4a4560]" />
                <span className="w-[9px] h-[9px] rounded-full bg-[#4a4560]" />
                <span className="ml-2.5 text-[11.5px] text-[#736d8f]">app.stocksio.fr/dashboard</span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-[13px] font-semibold text-[#9d97b8]">Vue d'ensemble</span>
                    <span className="ml-2 text-[10.5px] text-[#736d8f]">· Jusdeliens</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#9d5bff] bg-[#9d5bff]/15 px-2.5 py-1 rounded-full">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9d5bff] opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#9d5bff]" />
                    </span>
                    Temps réel
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <div className="bg-[#120f21] rounded-[10px] p-3">
                    <div className="text-[10.5px] text-[#736d8f]">Références produits</div>
                    <div className="text-[19px] font-bold mt-1 tabular-nums">{refCount}</div>
                  </div>
                  <div className="bg-[#120f21] rounded-[10px] p-3">
                    <div className="text-[10.5px] text-[#736d8f]">En alerte</div>
                    <div className="text-[19px] font-bold mt-1 text-[#ff8a65] tabular-nums">{alertCount}</div>
                  </div>
                  <div className="bg-[#120f21] rounded-[10px] p-3">
                    <div className="text-[10.5px] text-[#736d8f]">Entrepôts</div>
                    <div className="text-[19px] font-bold mt-1 tabular-nums">{warehouseCount}</div>
                  </div>
                </div>
                <div className="bg-[#120f21] rounded-xl p-4">
                  <svg viewBox="0 0 280 90" width="100%" height="80" preserveAspectRatio="none">
                    <polyline
                      points="0,70 35,55 70,60 105,35 140,42 175,20 210,28 245,12 280,18"
                      fill="none"
                      stroke="url(#heroGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength="100"
                      style={{
                        strokeDasharray: 100,
                        strokeDashoffset: drawn ? 0 : 100,
                        transition: 'stroke-dashoffset 1.3s ease-out',
                      }}
                    />
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#5b8cff" />
                        <stop offset="1" stopColor="#9d5bff" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ILS NOUS FONT CONFIANCE ============ */}
      <section id="confiance" className="py-10 border-y border-white/10 bg-[#0c0a17]">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10">
          <p className="text-center text-[12px] font-semibold tracking-[0.08em] uppercase text-[#736d8f] mb-7">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            <Reveal as="a" delay={0} href="https://jusdeliens.com" target="_blank" rel="noopener noreferrer" aria-label="Site de Jusdeliens (nouvel onglet)">
              <img
                src={jusdeliensLogo}
                alt="Jusdeliens"
                className="h-7 w-auto opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition duration-200"
              />
            </Reveal>
            <Reveal as="span" delay={60} style={{ fontFamily: displayFont }} className="text-[17px] font-bold text-[#9d97b8]">Atelier Verrier</Reveal>
            <Reveal as="span" delay={120} style={{ fontFamily: displayFont }} className="text-[17px] font-bold text-[#9d97b8]">NordStock</Reveal>
            <Reveal as="span" delay={180} style={{ fontFamily: displayFont }} className="text-[17px] font-bold text-[#9d97b8]">Bricolo Plus</Reveal>
          </div>
        </div>
      </section>

      {/* ============ COMMENT CA MARCHE ============ */}
      <section id="comment-ca-marche" className="py-16 md:py-[88px] bg-[#120f21] border-y border-white/10">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10">
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <h2 style={{ fontFamily: displayFont }} className="text-[clamp(24px,4vw,30px)]">Comment ça marche&nbsp;?</h2>
            <p className="text-[#9d97b8] text-[15.5px] mt-3">Optimisez vos stocks en trois étapes simples.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={0} className="bg-[#161329] border border-white/10 rounded-2xl p-8 min-h-[220px] flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#5b8cff]/15 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5b8cff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 4.5h4l1.5 1.5V11a1 1 0 01-1 1H2a1 1 0 01-1-1V5.5a1 1 0 011-1z" />
                  <path d="M2.5 7.5h2.5M2.5 9.5h1.8" />
                  <path d="M10.5 8h3" />
                  <path d="M12 6.2l2 1.8-2 1.8" />
                  <ellipse cx="19" cy="6" rx="4" ry="2" />
                  <path d="M15 6v10c0 1.1 1.79 2 4 2s4-.9 4-2V6" />
                  <path d="M15 11c0 1.1 1.79 2 4 2s4-.9 4-2" />
                </svg>
              </div>
              <h3 style={{ fontFamily: displayFont }} className="text-[17px]">Connectez vos données</h3>
              <p className="text-sm leading-relaxed text-[#9d97b8]">
                Importez votre historique de stock en quelques clics — fichier CSV ou saisie manuelle.
              </p>
            </Reveal>

            <Reveal delay={120} className="bg-[#161329] border border-white/10 rounded-2xl p-8 min-h-[220px] flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#9d5bff]/15 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#9d5bff">
                  <circle cx="7" cy="6.5" r="2.7" />
                  <circle cx="17" cy="6.5" r="2.7" />
                  <path d="M12 5c-4.4 0-8 3.5-8 7.7 0 4.3 3.6 7.3 8 7.3s8-3 8-7.3C20 8.5 16.4 5 12 5z" />
                </svg>
              </div>
              <h3 style={{ fontFamily: displayFont }} className="text-[17px]">Stocky analyse et prédit</h3>
              <p className="text-sm leading-relaxed text-[#9d97b8]">
                Notre IA détecte les tendances de consommation et anticipe vos besoins à venir.
              </p>
            </Reveal>

            <Reveal delay={240} className="bg-[#161329] border border-white/10 rounded-2xl p-8 min-h-[220px] flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#ff8a65]/15 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a5 5 0 00-5 5v3.4c0 .6-.2 1.2-.6 1.7L5 15h14l-1.4-1.9c-.4-.5-.6-1.1-.6-1.7V8a5 5 0 00-5-5z" />
                  <path d="M9.5 19a2.5 2.5 0 005 0" />
                </svg>
              </div>
              <h3 style={{ fontFamily: displayFont }} className="text-[17px]">Recevez des alertes</h3>
              <p className="text-sm leading-relaxed text-[#9d97b8]">
                Agissez en temps réel avant la rupture, directement depuis votre dashboard.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="tarifs" className="py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10">
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <h2 style={{ fontFamily: displayFont }} className="text-[clamp(24px,4vw,30px)]">Choisissez votre plan</h2>
            <p className="text-[#9d97b8] text-[15.5px] mt-3">Flexible, simple, évolutif — adapté à la taille de votre équipe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 items-center">
            <Reveal delay={0}>
            <TiltCard baseScale={1} className="bg-[#161329] border border-white/10 rounded-[18px] p-8">
              <div className="text-sm font-semibold text-[#9d97b8]">Basic</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span style={{ fontFamily: displayFont }} className="text-[34px] font-bold">19&nbsp;€</span>
                <span className="text-[13px] text-[#736d8f]">/mois</span>
              </div>
              <p className="text-[13px] text-[#736d8f] mt-1.5">Pour démarrer sereinement</p>
              <Link to="/plans/basic" className="mt-6 w-full inline-flex h-[46px] items-center justify-center rounded-[10px] text-[14.5px] font-semibold border border-white/15 bg-white/[0.03]">
                Choisir Basic
              </Link>
              <ul className="mt-7 flex flex-col gap-3 text-[13.5px] text-[#9d97b8]">
                <li className="flex gap-2.5"><CheckIcon color="#5b8cff" />Dashboard temps réel</li>
                <li className="flex gap-2.5"><CheckIcon color="#5b8cff" />Alertes de rupture</li>
                <li className="flex gap-2.5"><CheckIcon color="#5b8cff" />1 entrepôt</li>
              </ul>
            </TiltCard>
            </Reveal>

            <Reveal delay={100}>
            <TiltCard baseScale={1.06} className="relative z-[2] bg-[#161329] border border-[#9d5bff]/50 rounded-[18px] p-9 shadow-[0_24px_60px_-20px_rgba(93,60,255,0.35)]">
              <span className="absolute -top-3 left-7 text-white text-[11px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#5b8cff] to-[#9d5bff]">
                Populaire
              </span>
              <div className="text-sm font-semibold text-[#9d97b8]">Pro</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span style={{ fontFamily: displayFont }} className="text-[34px] font-bold">49&nbsp;€</span>
                <span className="text-[13px] text-[#736d8f]">/mois</span>
              </div>
              <p className="text-[13px] text-[#736d8f] mt-1.5">Pour piloter et anticiper</p>
              <Link to="/plans/pro" className="mt-6 w-full inline-flex h-[46px] items-center justify-center rounded-[10px] text-[14.5px] font-semibold text-white bg-gradient-to-r from-[#5b8cff] to-[#9d5bff]">
                Choisir Pro
              </Link>
              <ul className="mt-7 flex flex-col gap-3 text-[13.5px] text-[#9d97b8]">
                <li className="flex gap-2.5"><CheckIcon color="#9d5bff" />Tout Basic, plus :</li>
                <li className="flex gap-2.5"><CheckIcon color="#9d5bff" />Prédictions IA Stocky</li>
                <li className="flex gap-2.5"><CheckIcon color="#9d5bff" />Export CSV illimité</li>
                <li className="flex gap-2.5"><CheckIcon color="#9d5bff" />Multi-entrepôts</li>
              </ul>
            </TiltCard>
            </Reveal>

            <Reveal delay={200}>
            <TiltCard baseScale={1} className="bg-[#161329] border border-white/10 rounded-[18px] p-8">
              <div className="text-sm font-semibold text-[#9d97b8]">Max</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span style={{ fontFamily: displayFont }} className="text-[34px] font-bold">Sur devis</span>
              </div>
              <p className="text-[13px] text-[#736d8f] mt-1.5">Pour les structures multi-sites</p>
              <Link to="/contact" className="mt-6 w-full inline-flex h-[46px] items-center justify-center rounded-[10px] text-[14.5px] font-semibold border border-white/15 bg-white/[0.03]">
                Nous contacter
              </Link>
              <ul className="mt-7 flex flex-col gap-3 text-[13.5px] text-[#9d97b8]">
                <li className="flex gap-2.5"><CheckIcon color="#5b8cff" />Tout Pro, plus :</li>
                <li className="flex gap-2.5"><CheckIcon color="#5b8cff" />Entrepôts illimités</li>
                <li className="flex gap-2.5"><CheckIcon color="#5b8cff" />API publique &amp; support dédié</li>
              </ul>
            </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-16 md:py-24 bg-[#120f21] border-y border-white/10">
        <div className="max-w-[820px] mx-auto px-6 md:px-10">
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <h2 style={{ fontFamily: displayFont }} className="text-[clamp(24px,4vw,30px)]">Questions fréquentes</h2>
            <p className="text-[#9d97b8] text-[15.5px] mt-3">Tout ce qu'il faut savoir avant de se lancer.</p>
          </div>
          <div className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <FaqItem question={item.q} answer={item.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POURQUOI STOCKS.IO ============ */}
      <section id="pourquoi" className="py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 mb-12">
            <div className="text-center md:text-left max-w-[560px]">
              <h2 style={{ fontFamily: displayFont }} className="text-[clamp(24px,4vw,30px)]">Pourquoi StockS.io&nbsp;?</h2>
              <p className="text-[#9d97b8] text-[15.5px] mt-3">
                Pas juste un ERP réduit — un outil pensé dès le départ pour la réalité d'une PME.
              </p>
            </div>
            <Reveal delay={100}>
              <TrustBadge />
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={i * 90} className="flex items-start gap-4 bg-[#161329] border border-white/10 rounded-2xl p-6">
                <span className="w-10 h-10 shrink-0 rounded-xl bg-[#5b8cff]/15 flex items-center justify-center" style={{ color: item.color }}>
                  {item.icon}
                </span>
                <div>
                  <h3 style={{ fontFamily: displayFont }} className="text-[15.5px]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#9d97b8] mt-1.5">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10">
          <Reveal className="relative overflow-hidden rounded-[24px] bg-[#0c0a17] border border-white/10 px-8 py-9 md:py-10 text-center">
            {/* halos flous qui se fondent dans le fond plutôt qu'un aplat de couleur net */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 left-[18%] w-[300px] h-[300px] rounded-full bg-[#5b8cff]/35 blur-[80px]" />
              <div className="absolute -bottom-20 right-[18%] w-[320px] h-[320px] rounded-full bg-[#9d5bff]/35 blur-[90px]" />
            </div>
            <h2 style={{ fontFamily: displayFont }} className="relative text-[clamp(22px,3.8vw,28px)] text-white">
              Prêt à reprendre le contrôle de votre stock&nbsp;?
            </h2>
            <p className="relative mt-2.5 text-[14.5px] text-[#c9c5db] max-w-[440px] mx-auto">
              Réservez une démo de 30 minutes, sans engagement.
            </p>
            <div className="relative mt-6 flex gap-3 flex-wrap justify-center">
              <Link to="/demo" className="inline-flex h-11 items-center justify-center px-6 rounded-full text-[14px] font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
                On commence&nbsp;?
              </Link>
              <a href="#tarifs" className="inline-flex h-11 items-center justify-center px-6 rounded-full text-[14px] font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
                Voir les tarifs
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-[1180px] mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-5">
          <span className="text-[13px] text-[#736d8f]">© 2026 StockS.io — Nexa Digital School</span>
          <div className="flex items-center gap-5 text-[13px]">
            <Link to="/mentions-legales" className="text-[#9d97b8] hover:text-[#9d5bff]">Mentions légales</Link>
            <Link to="/contact" className="text-[#9d97b8] hover:text-[#9d5bff]">Contact</Link>
            <div className="flex items-center gap-2 ml-1.5 pl-4 border-l border-white/10">
              <a
                href="#"
                aria-label="StockS.io sur LinkedIn"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#9d97b8] hover:text-[#9d5bff] hover:border-[#9d5bff]/50 transition-colors"
              >
                <span className="text-[11.5px] font-bold leading-none">in</span>
              </a>
              <a
                href="#"
                aria-label="StockS.io sur Facebook"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#9d97b8] hover:text-[#9d5bff] hover:border-[#9d5bff]/50 transition-colors"
              >
                <span className="text-[13px] font-bold leading-none" style={{ fontFamily: 'Georgia, serif' }}>f</span>
              </a>
              <a
                href="#"
                aria-label="StockS.io sur Instagram"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#9d97b8] hover:text-[#9d5bff] hover:border-[#9d5bff]/50 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <StockyWidget />
    </div>
  )
}

export default Landing

import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const displayFont = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

// Mini FAQ scriptée — pas encore branchée à une vraie IA, juste des réponses
// pré-écrites déclenchées par mots-clés. Suffisant pour dégrossir les questions
// les plus courantes d'un visiteur avant qu'il réserve une démo ou écrive.
const FAQ = [
  {
    keywords: ['prix', 'tarif', 'coute', 'coûte', 'combien', 'euro', '€'],
    answer: "StockS.io démarre à 19€/mois (plan Basic), 49€/mois pour le plan Pro avec les prédictions IA, et sur devis pour le plan Max multi-sites. Sans engagement.",
  },
  {
    keywords: ['stocky', "qu'est-ce", 'quoi', "c'est quoi", 'ia', 'intelligence'],
    answer: "Stocky, c'est le moteur IA de StockS.io : il analyse vos mouvements de stock pour prédire vos besoins, détecter les anomalies et recommander des réapprovisionnements avant la rupture.",
  },
  {
    keywords: ['demo', 'démo', 'rdv', 'rendez-vous', 'essai', 'tester'],
    answer: "Vous pouvez réserver une démo de 30 minutes, testée sur votre propre cas d'usage — ",
    link: { to: '/demo', label: 'réserver un créneau ici' },
  },
  {
    keywords: ['rgpd', 'donnee', 'donnée', 'securite', 'sécurité', 'confidentialite', 'confidentialité'],
    answer: "StockS.io est conforme RGPD dès la conception : données hébergées en Europe, chiffrement, et vous gardez le contrôle total sur la suppression de votre compte et de vos données.",
  },
  {
    keywords: ['entrepot', 'entrepôt', 'multi', 'plusieurs sites', 'site'],
    answer: "Le plan Basic couvre 1 entrepôt, le plan Pro gère le multi-entrepôts, et le plan Max est pensé pour les structures multi-sites avec entrepôts illimités.",
  },
  {
    keywords: ['contact', 'parler', 'humain', 'appel', 'telephone', 'téléphone'],
    answer: "Bien sûr, l'équipe StockS.io vous répond sous 24 à 48h — ",
    link: { to: '/contact', label: 'contactez-nous ici' },
  },
]

const FALLBACK = {
  answer: "Je ne suis qu'un petit assistant scripté pour l'instant, donc je ne sais répondre qu'aux questions basiques (prix, Stocky, démo, RGPD, entrepôts). Pour le reste, l'équipe vous répond directement — ",
  link: { to: '/contact', label: 'contactez-nous ici' },
}

function findAnswer(text) {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
  const hit = FAQ.find((f) => f.keywords.some((k) => normalized.includes(k.normalize('NFD').replace(/[̀-ͯ]/g, ''))))
  return hit || FALLBACK
}

function StockyWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Salut, je suis Stocky 👋 Posez-moi une question basique sur StockS.io (prix, fonctionnement, démo…) ou choisissez ci-dessous.",
    },
  ])
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  const ask = (question) => {
    const reply = findAnswer(question)
    setMessages((m) => [...m, { from: 'user', text: question }, { from: 'bot', ...reply }])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    ask(input.trim())
    setInput('')
  }

  const quickQuestions = ['Combien ça coûte ?', "C'est quoi Stocky ?", 'Comment réserver une démo ?']

  return (
    <div className="fixed bottom-5 right-5 z-50" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      {open && (
        <div className="mb-3 w-[320px] sm:w-[360px] max-h-[70vh] flex flex-col bg-[#161329] border border-white/10 rounded-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#5b8cff] to-[#9d5bff] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <circle cx="7" cy="6.5" r="2.7" />
                  <circle cx="17" cy="6.5" r="2.7" />
                  <path d="M12 5c-4.4 0-8 3.5-8 7.7 0 4.3 3.6 7.3 8 7.3s8-3 8-7.3C20 8.5 16.4 5 12 5z" />
                </svg>
              </span>
              <div>
                <div style={{ fontFamily: displayFont }} className="text-[14px] font-semibold text-[#f3f1fb] leading-none">Stocky</div>
                <div className="text-[11px] text-[#736d8f] mt-0.5">Assistant StockS.io</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer la conversation avec Stocky"
              className="text-[#736d8f] hover:text-[#f3f1fb] p-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-[180px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-[13.5px] leading-relaxed rounded-xl px-3.5 py-2.5 max-w-[85%] ${
                  m.from === 'bot'
                    ? 'bg-white/[0.04] text-[#e5e2f0] self-start'
                    : 'bg-gradient-to-r from-[#5b8cff] to-[#9d5bff] text-white self-end'
                }`}
              >
                {m.text}
                {m.link && (
                  <Link to={m.link.to} onClick={() => setOpen(false)} className="text-[#9d5bff] underline underline-offset-2 hover:text-[#5b8cff]">
                    {m.link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="px-4 pb-3 flex flex-wrap gap-1.5">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="text-[12px] text-[#9d97b8] border border-white/10 rounded-full px-3 py-1.5 hover:border-[#9d5bff]/50 hover:text-[#f3f1fb]"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
            <label htmlFor="stocky-input" className="sr-only">Poser une question à Stocky</label>
            <input
              id="stocky-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question…"
              className="flex-1 h-9 rounded-full border border-white/10 bg-white/[0.03] px-3.5 text-[13px] text-[#f3f1fb] focus:outline-none focus:ring-2 focus:ring-[#9d5bff]"
            />
            <button
              type="submit"
              aria-label="Envoyer"
              className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-r from-[#5b8cff] to-[#9d5bff] flex items-center justify-center"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Fermer Stocky' : 'Ouvrir Stocky, l’assistant StockS.io'}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#5b8cff] to-[#9d5bff] shadow-[0_10px_30px_-8px_rgba(93,60,255,0.6)] flex items-center justify-center"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <circle cx="7" cy="6.5" r="2.7" />
            <circle cx="17" cy="6.5" r="2.7" />
            <path d="M12 5c-4.4 0-8 3.5-8 7.7 0 4.3 3.6 7.3 8 7.3s8-3 8-7.3C20 8.5 16.4 5 12 5z" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default StockyWidget

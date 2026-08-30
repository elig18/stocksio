import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoLight from '../assets/logo-light.png'

const displayFont = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const bodyFont = "'Manrope', system-ui, sans-serif"

function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', entreprise: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Pas de backend de messagerie branché pour l'instant — accusé de réception seulement
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
        <div className="text-center max-w-[560px] mx-auto mb-14">
          <h1 style={{ fontFamily: displayFont }} className="text-[clamp(26px,4vw,32px)]">Parlons de vos stocks</h1>
          <p className="text-[#9d97b8] text-[15.5px] mt-3">
            Une question, un besoin de devis pour le plan Max, un projet pour votre PME&nbsp;? Écrivez-nous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-12">
          <div className="flex flex-col gap-7">
            <div className="flex items-start gap-3.5">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#5b8cff]/15 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b8cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7l9 6 9-6" /><rect x="3" y="5" width="18" height="14" rx="2" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] text-[#736d8f]">Email</div>
                <div className="text-[15px] mt-0.5">elisabeth.gil@edu.nexa.fr</div>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#9d5bff]/15 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9d5bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-7-6.1-7-11a7 7 0 0114 0c0 4.9-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] text-[#736d8f]">Basé en Normandie</div>
                <div className="text-[15px] mt-0.5">Caen, France</div>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-[38px] h-[38px] rounded-[10px] bg-[#ff8a65]/15 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
                </svg>
              </div>
              <div>
                <div className="text-[13px] text-[#736d8f]">Réponse sous</div>
                <div className="text-[15px] mt-0.5">24 à 48h ouvrées</div>
              </div>
            </div>
          </div>

          <div className="bg-[#161329] border border-white/10 rounded-2xl p-8">
            {sent ? (
              <div className="text-center py-8">
                <h2 style={{ fontFamily: displayFont }} className="text-lg">Message envoyé&nbsp;!</h2>
                <p className="text-sm text-[#9d97b8] mt-3">Merci, on vous répond sous 24 à 48h ouvrées.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nom" className="block text-[13px] font-semibold text-[#9d97b8] mb-1.5">Nom</label>
                    <input
                      id="nom" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full h-11 rounded-[10px] border border-white/10 bg-white/[0.03] px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9d5bff]"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[13px] font-semibold text-[#9d97b8] mb-1.5">Email</label>
                    <input
                      id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="vous@entreprise.fr"
                      className="w-full h-11 rounded-[10px] border border-white/10 bg-white/[0.03] px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9d5bff]"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="entreprise" className="block text-[13px] font-semibold text-[#9d97b8] mb-1.5">Entreprise</label>
                  <input
                    id="entreprise" value={form.entreprise} onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
                    placeholder="Nom de votre PME"
                    className="w-full h-11 rounded-[10px] border border-white/10 bg-white/[0.03] px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#9d5bff]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-[13px] font-semibold text-[#9d97b8] mb-1.5">Message</label>
                  <textarea
                    id="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Parlez-nous de votre besoin en gestion de stock…"
                    rows={4}
                    className="w-full rounded-[10px] border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#9d5bff]"
                  />
                </div>
                <button type="submit" className="mt-1 h-[46px] rounded-[10px] text-white font-semibold bg-gradient-to-r from-[#5b8cff] to-[#9d5bff]">
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contact

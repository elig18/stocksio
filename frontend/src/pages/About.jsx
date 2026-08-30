import { Link } from 'react-router-dom'
import logoLight from '../assets/logo-light.png'

const displayFont = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const bodyFont = "'Manrope', system-ui, sans-serif"

function About() {
  return (
    <div style={{ fontFamily: bodyFont }} className="min-h-screen bg-[#0c0a17] text-[#f3f1fb] antialiased">
      <header className="border-b border-white/10">
        <div className="max-w-[820px] mx-auto px-6 md:px-10 flex items-center h-16">
          <Link to="/" className="flex items-center">
            <img src={logoLight} alt="StockS.io" className="h-7 w-auto" />
          </Link>
        </div>
      </header>

      <main className="max-w-[820px] mx-auto px-6 md:px-10 py-14 md:py-20">
        <span className="inline-flex text-[12.5px] font-semibold text-[#9d97b8] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          À propos
        </span>
        <h1 style={{ fontFamily: displayFont }} className="mt-5 text-[clamp(26px,4.2vw,34px)] leading-tight max-w-[600px]">
          La promesse d'une gestion de stock simple, intelligente et à la portée de toutes les PME
        </h1>

        <div className="mt-10 flex flex-col gap-8 text-[15px] leading-relaxed text-[#c9c5db]">
          <p>
            StockS.io est né d'un constat de terrain, pas d'une idée en l'air. Pendant un stage de développeur
            chez <strong className="text-[#f3f1fb]">Jusdeliens</strong>, une start-up EdTech normande, on a observé
            au quotidien les mêmes symptômes qui touchent la plupart des petites structures&nbsp;: des stocks
            suivis sur des fichiers tableurs non partagés, des ruptures découvertes au dernier moment, et aucune
            visibilité en temps réel sur ce qui manque.
          </p>
          <p>
            Le constat est vérifié par les chiffres&nbsp;: 43% des PME subissent des ruptures de stock chaque année,
            et 30% de leur budget opérationnel part en surstock mal géré. Pourtant, la plupart des outils du marché
            sont pensés pour de grandes structures — trop lourds, trop chers, trop longs à mettre en place pour une
            équipe de quelques personnes.
          </p>
          <p>
            StockS.io part de l'autre sens&nbsp;: un dashboard clair, des alertes automatiques avant la rupture, et
            <strong className="text-[#f3f1fb]"> Stocky</strong>, une IA qui apprend des mouvements de stock pour
            anticiper les besoins plutôt que de simplement les constater. Le tout pensé mobile-first, accessible, et
            conforme RGPD dès la conception.
          </p>
          <p>
            Le projet est développé par <strong className="text-[#f3f1fb]">Elisabeth Gil</strong> dans le cadre de
            son projet de fin d'études du Bachelor Chef de projet Web à la Nexa Digital School, avec Jusdeliens comme
            premier cas d'usage réel pour valider chaque fonctionnalité sur un besoin concret plutôt que théorique.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div style={{ fontFamily: displayFont }} className="text-[15px] font-semibold">Simple</div>
            <p className="text-[13px] text-[#9d97b8] mt-2">Pensé pour une équipe sans data analyst, pas pour un service IT dédié.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div style={{ fontFamily: displayFont }} className="text-[15px] font-semibold">Concret</div>
            <p className="text-[13px] text-[#9d97b8] mt-2">Construit et testé avec un vrai cas d'usage PME, pas une hypothèse.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div style={{ fontFamily: displayFont }} className="text-[15px] font-semibold">Accessible</div>
            <p className="text-[13px] text-[#9d97b8] mt-2">Tarification transparente dès 19€/mois, sans devis obligatoire.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/demo" className="inline-flex h-[46px] items-center justify-center px-6 rounded-[10px] text-[14.5px] font-semibold text-white bg-gradient-to-r from-[#5b8cff] to-[#9d5bff]">
            Réserver une démo
          </Link>
          <Link to="/contact" className="inline-flex h-[46px] items-center justify-center px-6 rounded-[10px] text-[14.5px] font-semibold border border-white/15 bg-white/[0.03]">
            Nous contacter
          </Link>
        </div>
      </main>
    </div>
  )
}

export default About

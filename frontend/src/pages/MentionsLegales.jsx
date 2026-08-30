import { Link } from 'react-router-dom'

function MentionsLegales() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/" className="text-sm text-teal-dark hover:underline">&larr; Retour à l'accueil</Link>

      <h1 className="text-2xl font-bold text-navy mt-4 mb-6">Mentions légales &amp; confidentialité</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-navy mb-2">Éditeur</h2>
        <p className="text-sm text-gray-mid">
          StockS.io — projet réalisé par Elisabeth Gil dans le cadre du Bachelor Chef de projet Web
          (RNCP40857), Nexa Digital School.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-navy mb-2">Hébergement</h2>
        <p className="text-sm text-gray-mid">
          Application hébergée sur une infrastructure cloud européenne, conforme au RGPD
          (données stockées en France/UE).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-navy mb-2">Données collectées</h2>
        <p className="text-sm text-gray-mid">
          StockS.io collecte uniquement l'adresse email et le mot de passe (haché) nécessaires à la
          création de votre compte, ainsi que les données de gestion de stock que vous saisissez
          (produits, entrepôts, mouvements). Aucune donnée n'est transmise à des tiers, aucun
          cookie de tracking n'est utilisé.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-navy mb-2">Vos droits (RGPD)</h2>
        <p className="text-sm text-gray-mid">
          Conformément au Règlement Général sur la Protection des Données, vous disposez d'un
          droit d'accès, de rectification et de suppression de vos données. Vous pouvez modifier
          ou supprimer votre compte directement depuis votre espace utilisateur, ce qui entraîne
          la suppression définitive de vos données personnelles.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-navy mb-2">Cookies</h2>
        <p className="text-sm text-gray-mid">
          Seuls des cookies fonctionnels, nécessaires au maintien de votre session, sont utilisés.
          Aucun cookie publicitaire ou de mesure d'audience tiers n'est déposé.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-navy mb-2">Contact</h2>
        <p className="text-sm text-gray-mid">
          Pour toute question relative à vos données, contactez : elisabeth.gil@edu.nexa.fr
        </p>
      </section>
    </main>
  )
}

export default MentionsLegales

import { Link } from 'react-router-dom'

export default function LegalTerms() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <Link to="/" className="legal-back">← Retour</Link>
        <h1>Conditions Générales d'Utilisation</h1>
        <p className="legal-date">Dernière mise à jour : avril 2026</p>

        <section>
          <h2>1. Objet</h2>
          <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme CUTLAB, service de mise en relation entre créateurs de contenu vidéo et monteurs professionnels.</p>
        </section>

        <section>
          <h2>2. Acceptation</h2>
          <p>L'utilisation de CUTLAB implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.</p>
        </section>

        <section>
          <h2>3. Description du service</h2>
          <p>CUTLAB est une plateforme d'intermédiation qui permet :</p>
          <ul>
            <li>Aux <strong>monteurs</strong> : de créer un profil public, d'être découverts par des créateurs, et de recevoir des offres de mission</li>
            <li>Aux <strong>créateurs</strong> : de parcourir les profils, de contacter des monteurs et d'envoyer des offres de mission</li>
          </ul>
          <p>CUTLAB n'est pas partie aux contrats conclus entre créateurs et monteurs.</p>
        </section>

        <section>
          <h2>4. Inscription et compte</h2>
          <p>L'inscription est ouverte à toute personne majeure. Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité de vos identifiants. Tout accès non autorisé doit être signalé immédiatement.</p>
        </section>

        <section>
          <h2>5. Obligations des utilisateurs</h2>
          <p>Vous vous engagez à :</p>
          <ul>
            <li>Ne pas usurper l'identité d'un tiers</li>
            <li>Ne pas publier de contenu illicite, diffamatoire ou trompeur</li>
            <li>Ne pas utiliser le service à des fins de spam ou de démarchage non sollicité</li>
            <li>Respecter les droits de propriété intellectuelle</li>
          </ul>
        </section>

        <section>
          <h2>6. Propriété intellectuelle</h2>
          <p>Les contenus publiés sur votre profil vous appartiennent. Vous accordez à CUTLAB une licence non exclusive pour afficher ces contenus dans le cadre du service. CUTLAB conserve tous les droits sur sa plateforme, son interface et sa marque.</p>
        </section>

        <section>
          <h2>7. Limitation de responsabilité</h2>
          <p>CUTLAB agit en qualité d'intermédiaire et ne saurait être tenu responsable des manquements contractuels entre créateurs et monteurs, ni des contenus publiés par les utilisateurs.</p>
        </section>

        <section>
          <h2>8. Suspension et résiliation</h2>
          <p>CUTLAB se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU, sans préavis ni indemnité.</p>
        </section>

        <section>
          <h2>9. Modification des CGU</h2>
          <p>CUTLAB peut modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email des modifications substantielles. La poursuite de l'utilisation du service vaut acceptation des nouvelles conditions.</p>
        </section>

        <section>
          <h2>10. Droit applicable</h2>
          <p>Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux français.</p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p><a href="mailto:legal@cutlab.io">legal@cutlab.io</a></p>
        </section>
      </div>
    </div>
  )
}

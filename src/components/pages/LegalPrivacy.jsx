import { Link } from 'react-router-dom'

export default function LegalPrivacy() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <Link to="/" className="legal-back">← Retour</Link>
        <h1>Politique de confidentialité</h1>
        <p className="legal-date">Dernière mise à jour : avril 2026</p>

        <section>
          <h2>1. Responsable du traitement</h2>
          <p>CUTLAB — plateforme de mise en relation entre créateurs de contenu et monteurs vidéo. Pour toute question relative à vos données : <a href="mailto:privacy@cutlab.io">privacy@cutlab.io</a></p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <p>Nous collectons les données que vous nous fournissez directement :</p>
          <ul>
            <li>Données d'identification : prénom, nom, adresse email</li>
            <li>Données de profil : compétences, biographie, portfolio, tarifs</li>
            <li>Données de communication : messages échangés sur la plateforme</li>
            <li>Données techniques : adresse IP, type de navigateur, pages visitées</li>
          </ul>
        </section>

        <section>
          <h2>3. Finalités du traitement</h2>
          <ul>
            <li>Fourniture du service de mise en relation</li>
            <li>Gestion de votre compte et de votre profil</li>
            <li>Communication entre utilisateurs</li>
            <li>Amélioration du service</li>
            <li>Respect de nos obligations légales</li>
          </ul>
        </section>

        <section>
          <h2>4. Base légale</h2>
          <p>Le traitement de vos données repose sur l'exécution du contrat (conditions d'utilisation) que vous acceptez lors de votre inscription, ainsi que sur notre intérêt légitime à améliorer le service.</p>
        </section>

        <section>
          <h2>5. Conservation des données</h2>
          <p>Vos données sont conservées pendant la durée de votre compte et supprimées dans un délai de 30 jours suivant la fermeture de votre compte, sauf obligation légale contraire.</p>
        </section>

        <section>
          <h2>6. Vos droits (RGPD)</h2>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong>Droit à l'effacement</strong> : supprimer votre compte et vos données</li>
            <li><strong>Droit à la portabilité</strong> : exporter vos données au format JSON</li>
            <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements</li>
          </ul>
          <p>Pour exercer ces droits : <a href="mailto:privacy@cutlab.io">privacy@cutlab.io</a> ou depuis votre profil (section Compte).</p>
        </section>

        <section>
          <h2>7. Hébergement et transferts</h2>
          <p>Vos données sont hébergées par Supabase (infrastructure AWS, région EU-West). Aucun transfert vers des pays tiers sans garanties adéquates.</p>
        </section>

        <section>
          <h2>8. Cookies</h2>
          <p>Nous utilisons uniquement des cookies techniques strictement nécessaires au fonctionnement de la plateforme (session d'authentification). Aucun cookie publicitaire ou de tracking tiers.</p>
        </section>

        <section>
          <h2>9. Contact & réclamations</h2>
          <p>Pour toute réclamation, vous pouvez contacter la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
        </section>
      </div>
    </div>
  )
}

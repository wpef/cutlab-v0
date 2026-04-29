import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'

export default function LandingAgencePme() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.agencePme} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      <section className="persona-hero">
        <h1>
          Vos contenus social media méritent{' '}
          <em>un studio à la demande</em>.
        </h1>
        <p>
          PME, ETI, agences — externalisez votre montage vidéo sans signer de contrat
          agence. Trouvez des monteurs vérifiés à la demande, pour vos LinkedIn, Reels,
          vidéos corporate, formations internes.
        </p>
        <Link to="/catalog" className="persona-hero-cta">
          Parcourir les monteurs →
        </Link>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">💼</span>
            <span className="persona-pain-text">
              Recruter un monteur en interne représente 50K€/an minimum. Pour un volume
              irrégulier, c'est sur-dimensionné.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🏢</span>
            <span className="persona-pain-text">
              Les agences créatives facturent à des tarifs prohibitifs. Vous payez le
              brand, pas le monteur.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">📈</span>
            <span className="persona-pain-text">
              Votre besoin en vidéo grimpe avec les réseaux sociaux, mais reste
              imprévisible mois par mois.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🤝</span>
            <span className="persona-pain-text">
              Vous avez besoin de fiabilité B2B : factures, NDA, deadlines tenues,
              qualité constante.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">✅</span>
            <h3>Monteurs vérifiés</h3>
            <p>
              Filtres expérience, formats Corporate/B2B, et niches. Profils complets
              avec portfolio et niveau.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💶</span>
            <h3>Tarifs transparents</h3>
            <p>
              Grille tarifaire visible avant contact. Vous budgétisez sans devis
              interminable.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">📋</span>
            <h3>Gestion structurée</h3>
            <p>
              Offres détaillées, livrables, deadlines, messagerie traçable. Vos équipes
              pilotent comme avec un prestataire.
            </p>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ol className="persona-steps">
          <li className="persona-step">
            <span className="persona-step-num">1</span>
            <div className="persona-step-content">
              <h3>Briefez votre besoin</h3>
              <p>
                Créez un projet structuré : format, livrables, délai, budget.
                Centralisé pour vos équipes.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Sélectionnez le monteur</h3>
              <p>
                Comparez profils, tarifs, et expérience. Contactez directement, sans
                intermédiaire.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Pilotez la livraison</h3>
              <p>
                Échanges traçables, livrables structurés, validation simple.
                Refacturable à votre client final.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-stat-row">
          <div className="persona-stat">
            <span className="persona-stat-value">100%</span>
            <span className="persona-stat-label">Gratuit</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">0%</span>
            <span className="persona-stat-label">Commission</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">70%</span>
            <span className="persona-stat-label">Économies vs agence</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à externaliser intelligemment ?</h2>
        <p>
          Trouvez votre prestataire vidéo à la demande. Sans engagement, sans agence,
          sans commission.
        </p>
        <Link to="/catalog">Parcourir les monteurs →</Link>
      </section>
    </div>
  );
}

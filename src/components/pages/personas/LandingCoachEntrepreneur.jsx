import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'
import { MockupChat } from '../../mockups'

export default function LandingCoachEntrepreneur() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.coachEntrepreneur} />
      <header className="persona-header">
        <div className="logo">CUT<span>LAB</span></div>
      </header>

      <section className="persona-hero">
        <h1>
          Votre contenu pro, monté par un expert.{' '}
          <em>Sans passer par une agence.</em>
        </h1>
        <p>
          Formations, webinaires, vidéos LinkedIn — votre contenu mérite un montage
          professionnel. CUTLAB vous connecte avec des monteurs expérimentés, sans
          intermédiaire.
        </p>
        <Link to="/catalog" className="persona-hero-cta">
          Trouver mon monteur →
        </Link>
      </section>

      <section className="persona-mockup-section">
        <MockupChat />
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">📅</span>
            <span className="persona-pain-text">
              Vous devez produire du contenu régulièrement, mais le montage prend un
              temps fou.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🏢</span>
            <span className="persona-pain-text">
              Les agences vidéo facturent des milliers d'euros pour quelques vidéos.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎯</span>
            <span className="persona-pain-text">
              Vous avez besoin de fiabilité : des deadlines respectées, une qualité
              constante.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🔄</span>
            <span className="persona-pain-text">
              Les freelances génériques ne comprennent pas le contenu business.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">👨‍💼</span>
            <h3>Monteurs expérimentés</h3>
            <p>
              Filtrez par années d'expérience. Trouvez des monteurs qui ont l'habitude
              du contenu corporate et éducatif.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">📋</span>
            <h3>Gestion de projet</h3>
            <p>
              Créez des projets structurés avec brief, livrables, deadline et budget.
              Tout est centralisé.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💶</span>
            <h3>Tarifs sans surprise</h3>
            <p>
              Chaque monteur affiche sa grille tarifaire. Vous savez exactement à quoi
              vous attendre.
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
              <h3>Parcourez le catalogue</h3>
              <p>
                Filtrez par expérience, compétences et disponibilité. Consultez les
                portfolios.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Contactez un monteur</h3>
              <p>
                Présentez votre projet. Le monteur vous répond avec une proposition
                détaillée.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Lancez la collaboration</h3>
              <p>
                Acceptez la proposition, échangez via la messagerie intégrée, suivez
                l'avancement.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-stat-row">
          <div className="persona-stat">
            <span className="persona-stat-value">Brief structuré</span>
            <span className="persona-stat-label">Pas de devis flou</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">Vérifiés</span>
            <span className="persona-stat-label">Profils</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">15 min</span>
            <span className="persona-stat-label">Pour trouver</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à professionnaliser votre contenu ?</h2>
        <p>Trouvez un monteur fiable et expérimenté. Sans agence, sans intermédiaire.</p>
        <Link to="/catalog">Trouver mon monteur →</Link>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO';
import { SEO_CONFIG } from '../../seo/seoConfig';
import { MockupPricing } from '../../mockups'

export default function LandingColorist() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.colorist} />
      <header className="persona-header">
        <div className="logo">CUT<span>LAB</span></div>
      </header>

      <section className="persona-hero">
        <h1>
          L'image te parle.{' '}
          <em>Aux créateurs aussi.</em>
        </h1>
        <p>
          Étalonnage, look development, color grading cinéma — ton œil mérite une
          plateforme spécialisée. CUTLAB te connecte avec des créateurs qui cherchent
          un vrai colorist, pas un monteur qui sait pousser un curseur.
        </p>
        <Link to="/onboarding/1" className="persona-hero-cta">
          Créer mon profil →
        </Link>
      </section>

      <section className="persona-mockup-section">
        <MockupPricing />
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎨</span>
            <span className="persona-pain-text">
              On te confond avec un monteur qui sait appliquer une LUT. Ton œil de
              colorist est invisible.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">📦</span>
            <span className="persona-pain-text">
              Les LUTs gratuites tuent la valeur perçue de ton métier.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🔍</span>
            <span className="persona-pain-text">
              Pas de filtre "colorist" sur les marketplaces. Tu es noyé dans les
              monteurs.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎬</span>
            <span className="persona-pain-text">
              Tu cherches des projets cinéma, clips, doc — pas des Reels avec un
              filtre instagram.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">🌈</span>
            <h3>Color grading comme skill</h3>
            <p>
              Étalonnage est une compétence à part entière. Les créateurs te trouvent
              spécifiquement pour ton œil.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🎞️</span>
            <h3>Filtres formats</h3>
            <p>
              Clips, doc, cinéma, formats long — où l'étalonnage compte vraiment.
              Choisis tes terrains de jeu.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🏆</span>
            <h3>Niveaux qui valorisent</h3>
            <p>
              Ton expertise visuelle te positionne haut sur la grille. Tu factures à
              la hauteur de ton œil.
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
              <h3>Crée ton profil colorist</h3>
              <p>
                Compétences color grading, portfolio (avant/après, looks signatures),
                logiciels (DaVinci, Baselight).
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Définis tes tarifs</h3>
              <p>
                Grille tarifaire color dédiée. Étalonnage par minute, par projet, ou
                par module.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois des projets cinéma</h3>
              <p>
                Les créateurs qui cherchent un look pro te contactent. Plus de
                confusion avec un colorimétriste de base.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-stat-row">
          <div className="persona-stat">
            <span className="persona-stat-value">Vitrine</span>
            <span className="persona-stat-label">Pour se faire trouver</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">7</span>
            <span className="persona-stat-label">Niveaux</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">Color</span>
            <span className="persona-stat-label">Reconnu</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à être reconnu pour ton œil ?</h2>
        <p>
          Rejoins CUTLAB. Une plateforme où le colorist a sa place — et son tarif.
        </p>
        <Link to="/onboarding/1">Créer mon profil →</Link>
      </section>
    </div>
  );
}

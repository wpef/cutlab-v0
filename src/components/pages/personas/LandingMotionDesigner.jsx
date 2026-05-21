import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO';
import { SEO_CONFIG } from '../../seo/seoConfig';
import { MockupPricing } from '../../mockups'

export default function LandingMotionDesigner() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.motionDesigner} />
      <header className="persona-header">
        <div className="logo">CUT<span>LAB</span></div>
      </header>

      <section className="persona-hero">
        <h1>
          Tu fais du motion, pas du montage basique.{' '}
          <em>Montre-le.</em>
        </h1>
        <p>
          Sur les plateformes généralistes, motion design = montage vidéo. Sur CUTLAB,
          tes compétences motion sont identifiées, valorisées, et tarifées séparément.
        </p>
        <Link to="/onboarding/1" className="persona-hero-cta">
          Créer mon profil motion →
        </Link>
      </section>

      <section className="persona-mockup-section">
        <MockupPricing />
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎭</span>
            <span className="persona-pain-text">
              Les clients confondent montage et motion design. Tes skills After Effects
              sont sous-valorisées.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🔍</span>
            <span className="persona-pain-text">
              Pas de filtre "Motion Design" sur les marketplaces. Tu es rangé avec les
              monteurs basiques.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">💰</span>
            <span className="persona-pain-text">
              Tu factures au même tarif qu'un monteur junior alors que ton travail
              demande 3x plus de technique.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">😐</span>
            <span className="persona-pain-text">
              Les projets qu'on te propose sont des cuts basiques, pas du motion.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">✨</span>
            <h3>Motion comme skill</h3>
            <p>
              Motion Design est une compétence à part entière sur CUTLAB. Les créateurs
              te trouvent spécifiquement pour ça.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💎</span>
            <h3>Tarifs motion dédiés</h3>
            <p>
              3 lignes tarifaires dédiées au motion (court, moyen, long). Tes tarifs
              reflètent la complexité de ton travail.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">📈</span>
            <h3>Niveaux qui te valorisent</h3>
            <p>
              7 niveaux basés sur ton profil et ton expérience. Plus tu es expert, plus
              ton positionnement tarifaire est élevé.
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
              <h3>Crée ton profil</h3>
              <p>
                Mets en avant tes compétences motion, ton portfolio After Effects, tes
                réalisations.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Fixe tes tarifs</h3>
              <p>
                Ajuste ta grille motion indépendamment du montage classique. ±10% par
                ligne.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois des projets motion</h3>
              <p>
                Les créateurs qui cherchent du motion te trouvent et te contactent
                directement.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-stat-row">
          <div className="persona-stat">
            <span className="persona-stat-value">7</span>
            <span className="persona-stat-label">Niveaux</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">Vitrine</span>
            <span className="persona-stat-label">Pour se faire trouver</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">3 lignes</span>
            <span className="persona-stat-label">Tarifs motion</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à être reconnu pour ton motion ?</h2>
        <p>
          Rejoins CUTLAB. Un catalogue où le motion design a sa place — et son tarif.
        </p>
        <Link to="/onboarding/1">Créer mon profil motion →</Link>
      </section>
    </div>
  );
}

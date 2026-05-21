import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO';
import { SEO_CONFIG } from '../../seo/seoConfig';
import { MockupCatalog } from '../../mockups'

export default function LandingSpecialisteShorts() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.specialisteShorts} />
      <header className="persona-header">
        <div className="logo">CUT<span>LAB</span></div>
      </header>

      <section className="persona-hero">
        <h1>
          Tu fais du vertical comme personne.{' '}
          <em>Sois trouvé pour ça.</em>
        </h1>
        <p>
          Shorts, Reels, TikToks, hooks de 3 secondes — tu maîtrises le format court.
          Sur CUTLAB, les créateurs qui cherchent du vertical te trouvent en quelques
          clics, sans te confondre avec un monteur longue durée.
        </p>
        <Link to="/onboarding/1" className="persona-hero-cta">
          Créer mon profil →
        </Link>
      </section>

      <section className="persona-mockup-section">
        <MockupCatalog />
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">📱</span>
            <span className="persona-pain-text">
              Sur les marketplaces, tu te bats contre les monteurs longue-durée. Pas de
              filtre 'shorts'.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">💸</span>
            <span className="persona-pain-text">
              Le format court est dévalorisé alors qu'il demande un sens du timing rare.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎣</span>
            <span className="persona-pain-text">
              Tes hooks de 3 secondes sont de l'art, mais personne ne les voit avant de
              scroller.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">📉</span>
            <span className="persona-pain-text">
              Tu factures comme un junior alors que tes vidéos cartonnent en views.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">📲</span>
            <h3>Filtres formats courts</h3>
            <p>
              Shorts, Reels, TikTok comme formats à part entière. Les créateurs te
              trouvent spécifiquement pour ça.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🏆</span>
            <h3>Niveaux qui te valorisent</h3>
            <p>
              7 niveaux basés sur ton profil. Plus ton expertise est claire, plus ton
              positionnement est haut.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🎬</span>
            <h3>Portfolio short-friendly</h3>
            <p>
              Mets en avant tes meilleurs hooks et tes shorts les plus vus. Pas de
              besoin de monter une vidéo de 10 min pour prouver tes skills.
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
              <h3>Crée ton profil shorts</h3>
              <p>
                Compétences, formats verticaux, niches. L'onboarding te guide en 7
                étapes.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Mets en avant tes hooks</h3>
              <p>
                Ton portfolio = tes meilleurs hooks et tes shorts viraux. Les créateurs
                voient direct ton style.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois des projets shorts</h3>
              <p>
                Les créateurs qui cherchent du vertical te contactent. Plus de mauvais
                matchs.
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
            <span className="persona-stat-value">Profil complet</span>
            <span className="persona-stat-label">Skills, niveau, tarifs</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">Spécialisé</span>
            <span className="persona-stat-label">Vertical only</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à être reconnu pour ton vertical ?</h2>
        <p>
          Rejoins CUTLAB. Une plateforme où les shorts ont leur propre filtre — et leur
          propre tarif.
        </p>
        <Link to="/onboarding/1">Créer mon profil →</Link>
      </section>
    </div>
  );
}

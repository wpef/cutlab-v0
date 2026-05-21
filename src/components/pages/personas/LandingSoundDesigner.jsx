import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO';
import { SEO_CONFIG } from '../../seo/seoConfig';
import { MockupPricing } from '../../mockups'

export default function LandingSoundDesigner() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.soundDesigner} />
      <header className="persona-header">
        <div className="logo">CUT<span>LAB</span></div>
      </header>

      <section className="persona-hero">
        <h1>
          Tu fais du son, pas du montage image.{' '}
          <em>Trouve les projets qui le valorisent.</em>
        </h1>
        <p>
          Sound design, mixage, doublage, sound branding — tes skills audio méritent une
          plateforme dédiée. Sur CUTLAB, tu apparais avec ton vrai métier, pas comme un
          sous-monteur générique.
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
            <span className="persona-pain-icon">🎙️</span>
            <span className="persona-pain-text">
              Tu es confondu avec un monteur vidéo lambda. Le sound design est invisible
              sur les marketplaces.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🤷</span>
            <span className="persona-pain-text">
              Personne ne valorise vraiment le sound design. "C'est juste du bruit en
              plus, non ?"
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">💸</span>
            <span className="persona-pain-text">
              Tu factures un mix pro au prix d'un cut basique. Ton expertise est dévaluée.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎯</span>
            <span className="persona-pain-text">
              Tu cherches des projets qui demandent vraiment du son : doc, podcast vidéo,
              gaming, clip.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">🔊</span>
            <h3>Sound design comme skill</h3>
            <p>
              Sound design est une compétence à part entière sur CUTLAB. Les créateurs te
              trouvent spécifiquement pour ça.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🎚️</span>
            <h3>Tarifs sound dédiés</h3>
            <p>
              La grille tarifaire intègre tes spécificités. Tu factures à ta vraie valeur,
              pas à celle d'un monteur junior.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🎬</span>
            <h3>Filtres niche</h3>
            <p>
              Musique, podcast, doc, gaming — choisis les niches où ton expertise sonore
              brille.
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
              <h3>Crée ton profil son</h3>
              <p>
                Compétences sound design, portfolio audio (clips de mix, sound libraries),
                formats maîtrisés.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Définis tes tarifs</h3>
              <p>
                Grille spécifique son. Mix, doublage, sound design — chaque service a sa
                ligne tarifaire.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois des projets son</h3>
              <p>
                Les créateurs qui cherchent du sound design te contactent. Plus de
                confusion avec le montage classique.
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
            <span className="persona-stat-value">Audio</span>
            <span className="persona-stat-label">Reconnu</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à être reconnu pour ton oreille ?</h2>
        <p>
          Rejoins CUTLAB. Une plateforme où le sound design a sa place — et son tarif.
        </p>
        <Link to="/onboarding/1">Créer mon profil →</Link>
      </section>
    </div>
  );
}

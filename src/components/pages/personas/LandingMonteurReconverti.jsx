import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO';
import { SEO_CONFIG } from '../../seo/seoConfig';

export default function LandingMonteurReconverti() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.monteurReconverti} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      <section className="persona-hero">
        <h1>
          Tu te reconvertis. <em>Tes premiers vrais clients t'attendent.</em>
        </h1>
        <p>
          Tu sors de formation continue, de bootcamp, ou tu changes de carrière vers le montage
          vidéo. Tu sais monter, mais tu n'as pas de réseau pro. CUTLAB te donne une vitrine et
          des opportunités sans avoir 5 ans d'expérience.
        </p>
        <Link to="/onboarding/1" className="persona-hero-cta">
          Commencer gratuitement →
        </Link>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎓</span>
            <span className="persona-pain-text">
              Tu sors d'une formation continue, pas d'une école d'audiovisuel. Personne ne te
              connaît dans le milieu.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🤝</span>
            <span className="persona-pain-text">
              Pas de réseau pro = pas de clients. Tu envoies des CV dans le vide.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">💸</span>
            <span className="persona-pain-text">
              Tu doutes de tes tarifs : trop bas tu te brûles, trop hauts tu n'as personne.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🚪</span>
            <span className="persona-pain-text">
              Malt, LinkedIn, Upwork te demandent 5 ans d'XP avant de te visibiliser.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">🚀</span>
            <h3>Onboarding guidé</h3>
            <p>
              7 étapes pour créer un profil pro complet. Pas besoin de portfolio béton — tes
              formations comptent.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">📊</span>
            <h3>Niveaux progressifs</h3>
            <p>
              Tu commences au niveau de ton expérience réelle. Plus tu enrichis ton profil, plus
              tu montes.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💶</span>
            <h3>Tarifs de référence</h3>
            <p>
              La grille CUTLAB te donne une base. Plus besoin de deviner combien facturer ta
              première mission.
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
              <h3>Inscris-toi gratuitement</h3>
              <p>Compte créé en 2 minutes. L'onboarding te guide étape par étape.</p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Construis ta vitrine</h3>
              <p>
                Skills, portfolio (même formations), bio, disponibilité. Ton profil est calibré
                pour les créateurs.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois tes premières demandes</h3>
              <p>
                Les créateurs te trouvent dans le catalogue. Premières missions sans prospection.
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
            <span className="persona-stat-value">10 min</span>
            <span className="persona-stat-label">Pour s'inscrire</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à lancer ta nouvelle carrière ?</h2>
        <p>
          Sans réseau, sans expérience pro, sans portfolio béton. CUTLAB te donne ta première
          chance.
        </p>
        <Link to="/onboarding/1" className="persona-hero-cta">
          Commencer gratuitement →
        </Link>
      </section>
    </div>
  );
}

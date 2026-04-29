import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO';
import { SEO_CONFIG } from '../../seo/seoConfig';
import { MockupOnboarding } from '../../mockups'

export default function LandingEtudiantAudiovisuel() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.etudiantAudiovisuel} />
      <header className="persona-header">
        <div className="logo">CUT<span>LAB</span></div>
      </header>

      <section className="persona-hero">
        <h1>
          Premier portfolio ? <em>Premiers clients.</em> CUTLAB te lance.
        </h1>
        <p>
          Tu sors de formation, tu maîtrises Premiere ou DaVinci, mais tu n'as pas encore de
          clients. CUTLAB t'offre une vitrine pour te faire trouver.
        </p>
        <Link to="/onboarding/1" className="persona-hero-cta">
          Lancer mon profil →
        </Link>
      </section>

      <section className="persona-mockup-section">
        <MockupOnboarding />
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎓</span>
            <span className="persona-pain-text">
              Tu sors de formation mais personne ne te connaît dans le milieu.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🌐</span>
            <span className="persona-pain-text">
              Tu n'as pas de réseau pro. Les créateurs ne savent pas que tu existes.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">📁</span>
            <span className="persona-pain-text">
              Ton portfolio est sur un Google Drive que personne ne visite.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">❓</span>
            <span className="persona-pain-text">
              Tu ne sais pas combien facturer. Trop cher tu perds le client, trop bas tu te brûles.
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
              7 étapes pour créer ton profil pro : compétences, portfolio, bio, disponibilité. Pas
              besoin de site web.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">📊</span>
            <h3>Niveaux progressifs</h3>
            <p>
              Tu commences au niveau 1, et tu montes avec l'expérience. Chaque enrichissement de
              profil peut faire évoluer ton niveau.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💶</span>
            <h3>Tarifs de référence</h3>
            <p>
              La grille tarifaire CUTLAB te donne une base. Plus besoin de deviner combien
              facturer.
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
              <h3>Inscris-toi</h3>
              <p>Crée ton compte en 2 minutes. Email et mot de passe, c'est tout.</p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Construis ton profil</h3>
              <p>
                L'onboarding te guide : ajoute tes skills, ton portfolio, ta bio. Ton niveau est
                calculé automatiquement.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois tes premières demandes</h3>
              <p>
                Les créateurs te trouvent dans le catalogue et te contactent. Tu discutes et tu
                lances ta première mission.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-stat-row">
          <div className="persona-stat">
            <span className="persona-stat-value">Niveau adapté</span>
            <span className="persona-stat-label">À ton expérience</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">Vitrine</span>
            <span className="persona-stat-label">Pour se faire trouver</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">10 min</span>
            <span className="persona-stat-label">Pour s'inscrire</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à lancer ta carrière ?</h2>
        <p>Inscription rapide, profil guidé, premiers clients. C'est le moment.</p>
        <Link to="/onboarding/1" className="persona-hero-cta">
          Lancer mon profil →
        </Link>
      </section>
    </div>
  );
}

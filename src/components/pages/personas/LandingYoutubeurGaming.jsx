import { Link } from 'react-router-dom'

export default function LandingYoutubeurGaming() {
  return (
    <div className="persona-page">
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      {/* Hero */}
      <section className="persona-hero">
        <h1>Tu postes 3 vidéos par semaine. <em>Qui les monte ?</em></h1>
        <p>Tu passes plus de temps à monter qu'à créer. CUTLAB te connecte avec des monteurs spécialisés gaming pour scaler ton contenu sans sacrifier la qualité.</p>
        <Link to="/catalog" className="persona-hero-cta">Trouver mon monteur →</Link>
      </section>

      {/* Pain points */}
      <section className="persona-section">
        <h2>Ce que tu vis au quotidien</h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">⏰</span>
            <span className="persona-pain-text">Tu montes tes vidéos toi-même le soir, au lieu de préparer ton prochain contenu</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📉</span>
            <span className="persona-pain-text">La qualité de tes vidéos baisse parce que tu rush le montage</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🔄</span>
            <span className="persona-pain-text">Tu n'arrives pas à scaler : plus de vidéos = plus de montage = plus de stress</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">💸</span>
            <span className="persona-pain-text">Les agences sont trop chères, Fiverr trop aléatoire</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="persona-section">
        <h2>Ce que <em>CUTLAB</em> change pour toi</h2>
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">🎮</span>
            <h3>Monteurs Gaming</h3>
            <p>Filtre par niche Gaming. Des monteurs qui connaissent les codes : cuts dynamiques, overlays, sound design.</p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💰</span>
            <h3>Tarifs transparents</h3>
            <p>Chaque monteur affiche sa fourchette de prix. Pas de négociation aveugle, pas de mauvaise surprise.</p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">📊</span>
            <h3>Pipeline intégré</h3>
            <p>Suis tous tes projets sur un tableau visuel. Tu sais où en est chaque vidéo.</p>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      {/* How it works */}
      <section className="persona-section">
        <h2>Comment ça marche</h2>
        <div className="persona-steps">
          <div className="persona-step">
            <span className="persona-step-num">1</span>
            <div className="persona-step-content">
              <h3>Parcours le catalogue</h3>
              <p>Filtre par compétences, niche Gaming, disponibilité. Compare les profils et les tarifs.</p>
            </div>
          </div>
          <div className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Contacte ton monteur</h3>
              <p>Envoie un message directement. Décris ton projet, tes attentes, ton rythme.</p>
            </div>
          </div>
          <div className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Lance la collaboration</h3>
              <p>Reçois une proposition structurée. Accepte, et c'est parti.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
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
          <span className="persona-stat-value">15 min</span>
          <span className="persona-stat-label">Pour trouver</span>
        </div>
      </div>

      <div className="persona-divider" />

      {/* Bottom CTA */}
      <section className="persona-cta-section">
        <h2>Prêt à scaler ton contenu ?</h2>
        <p>Trouve un monteur gaming qui comprend tes codes. Gratuit, sans commission.</p>
        <Link to="/catalog" className="persona-hero-cta">Parcourir les monteurs →</Link>
      </section>
    </div>
  )
}

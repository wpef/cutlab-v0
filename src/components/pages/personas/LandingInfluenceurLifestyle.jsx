import { Link } from 'react-router-dom'
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'

export default function LandingInfluenceurLifestyle() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.influenceurLifestyle} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      {/* Hero */}
      <section className="persona-hero">
        <h1>Ton feed mérite un monteur qui <em>comprend ton univers</em>.</h1>
        <p>YouTube, Reels, TikTok — ton contenu doit être impeccable partout. CUTLAB te connecte avec des monteurs qui maîtrisent ton aesthetic.</p>
        <Link to="/catalog" className="persona-hero-cta">Trouver mon monteur →</Link>
      </section>

      {/* Pain points */}
      <section className="persona-section">
        <h2>Ce que tu vis au quotidien</h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📱</span>
            <span className="persona-pain-text">Tu publies sur 3 plateformes avec 3 formats différents. Impossible de tout monter seul(e).</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🎨</span>
            <span className="persona-pain-text">Tu cherches un monteur qui comprend ton univers visuel, pas juste quelqu'un qui coupe des clips.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">😤</span>
            <span className="persona-pain-text">La qualité varie d'un freelance à l'autre. Ton feed perd en cohérence.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">💳</span>
            <span className="persona-pain-text">Les agences facturent des fortunes pour du contenu social.</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="persona-section">
        <h2>Ce que <em>CUTLAB</em> change pour toi</h2>
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">✂️</span>
            <h3>Formats courts</h3>
            <p>Des monteurs spécialisés Reels, Shorts et TikTok. Ils connaissent les trends et les formats qui performent.</p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🔍</span>
            <h3>Filtres par niche</h3>
            <p>Lifestyle, Fashion, Food, Travel — trouve un monteur qui parle ton langage visuel.</p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">📂</span>
            <h3>Portfolio consultable</h3>
            <p>Regarde le travail de chaque monteur avant de le contacter. Pas de surprise.</p>
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
              <h3>Explore le catalogue</h3>
              <p>Filtre par niche, format, et disponibilité. Compare les styles.</p>
            </div>
          </div>
          <div className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Contacte un monteur</h3>
              <p>Un message suffit. Décris ton univers et tes besoins.</p>
            </div>
          </div>
          <div className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois une proposition</h3>
              <p>Le monteur t'envoie une offre détaillée. Tu acceptes ou tu passes.</p>
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
        <h2>Prêt(e) à élever ton contenu ?</h2>
        <p>Trouve un monteur qui comprend ton univers. Gratuit, direct, sans intermédiaire.</p>
        <Link to="/catalog" className="persona-hero-cta">Parcourir les monteurs →</Link>
      </section>
    </div>
  )
}

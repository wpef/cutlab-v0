import { Link } from 'react-router-dom'
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'
import { MockupPipeline } from '../../mockups'

export default function LandingStreamerTwitch() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.streamerTwitch} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      {/* Hero */}
      <section className="persona-hero">
        <h1>Tu streames 30h par semaine. <em>Combien ça reste sur YouTube ?</em></h1>
        <p>Tes meilleurs moments dorment dans tes VODs. Un monteur transforme tes lives en highlights, en shorts viraux, et en contenu YouTube qui drive du nouveau public.</p>
        <Link to="/catalog" className="persona-hero-cta">Trouver mon monteur →</Link>
      </section>

      <section className="persona-mockup-section">
        <MockupPipeline />
      </section>

      <div className="persona-divider" />

      {/* Pain points */}
      <section className="persona-section">
        <h2>Ce que tu vis au quotidien</h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📅</span>
            <span className="persona-pain-text">Tes VODs Twitch s'auto-suppriment au bout de 14 jours. Tout ton contenu meurt sans archive.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📉</span>
            <span className="persona-pain-text">Tes clips Twitch font 50 vues, ton stream live 5K viewers. Le format clip est mort, YouTube/Shorts c'est l'avenir.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">⏰</span>
            <span className="persona-pain-text">Monter des highlights, c'est 10h/semaine que tu n'as pas — surtout si tu streames en parallèle.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🚀</span>
            <span className="persona-pain-text">YouTube et TikTok sont des goldmines pour streamers, mais sans monteur tu rates le potentiel.</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="persona-section">
        <h2>Ce que <em>CUTLAB</em> change pour toi</h2>
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">🎮</span>
            <h3>Monteurs Gaming/Streaming</h3>
            <p>Filtres niche Gaming et formats courts. Des monteurs qui kiffent ton contenu et savent ce qui buzz.</p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">⚡</span>
            <h3>Spécialisation highlights</h3>
            <p>Cherche des monteurs habitués au workflow VOD → highlights → shorts → cross-platform.</p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">📊</span>
            <h3>Pipeline pour le volume</h3>
            <p>Plusieurs streams par semaine = plusieurs livrables. Pipeline visuel pour ne rien rater.</p>
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
              <h3>Trouve ton monteur Gaming</h3>
              <p>Filtre par niche Gaming + formats Reels/Shorts. Compare les portfolios highlights.</p>
            </div>
          </div>
          <div className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Mets en place ton flow</h3>
              <p>Brief une fois, applique à chaque stream : VOD → highlight YouTube → 3 shorts.</p>
            </div>
          </div>
          <div className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Récolte sur toutes les plateformes</h3>
              <p>YouTube grow, TikTok perce, ton stream prend de l'audience entrante.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="persona-stat-row">
        <div className="persona-stat">
          <span className="persona-stat-value">Highlights</span>
          <span className="persona-stat-label">VOD → Shorts</span>
        </div>
        <div className="persona-stat">
          <span className="persona-stat-value">Pipeline</span>
          <span className="persona-stat-label">Suivi visuel</span>
        </div>
        <div className="persona-stat">
          <span className="persona-stat-value">5x</span>
          <span className="persona-stat-label">Audience cross-platform</span>
        </div>
      </div>

      <div className="persona-divider" />

      {/* Bottom CTA */}
      <section className="persona-cta-section">
        <h2>Prêt à exploiter tes VODs ?</h2>
        <p>Transforme tes streams en machine à contenu. Trouve ton monteur Gaming aujourd'hui.</p>
        <Link to="/catalog" className="persona-hero-cta">Parcourir les monteurs →</Link>
      </section>
    </div>
  )
}

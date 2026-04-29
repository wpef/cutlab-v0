import { Link } from 'react-router-dom'

export default function LandingFreelanceYoutube() {
  return (
    <div className="persona-page">
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      {/* Hero */}
      <section className="persona-hero">
        <h1>Arrête de chercher des clients. <em>Laisse-les te trouver.</em></h1>
        <p>Marre de Fiverr et des plateformes généralistes ? CUTLAB est un catalogue dédié au montage vidéo. Les créateurs te contactent directement.</p>
        <Link to="/onboarding/1" className="persona-hero-cta">Rejoindre le catalogue →</Link>
      </section>

      {/* Pain points */}
      <section className="persona-section">
        <h2>Ce que tu vis au quotidien</h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">😩</span>
            <span className="persona-pain-text">Fiverr, Malt, Upwork... tu es noyé parmi des milliers de freelances qui n'ont rien à voir avec le montage.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">💸</span>
            <span className="persona-pain-text">Les plateformes prennent 10 à 20% de commission sur chaque mission.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🤷</span>
            <span className="persona-pain-text">Tes clients ne comprennent pas la différence entre un cut basique et un montage pro.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📄</span>
            <span className="persona-pain-text">Ton portfolio est une ligne dans une fiche générique. Tes compétences ne sont pas mises en valeur.</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="persona-section">
        <h2>Ce que <em>CUTLAB</em> change pour toi</h2>
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">🎬</span>
            <h3>Catalogue 100% montage</h3>
            <p>Pas de graphistes, pas de devs — uniquement des monteurs vidéo. Les créateurs viennent ici pour ça.</p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🏷️</span>
            <h3>Profil complet</h3>
            <p>Skills, portfolio, niveau, tarifs, formats, niches — tout est visible. Les créateurs savent ce qu'ils trouvent.</p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🚫</span>
            <h3>0% commission</h3>
            <p>CUTLAB ne prend aucune commission. Ce que le créateur paye, c'est ce que tu reçois.</p>
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
              <h3>Inscris-toi en 7 étapes</h3>
              <p>Crée ton profil guidé : compétences, portfolio, bio, disponibilité. En moins de 10 minutes.</p>
            </div>
          </div>
          <div className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Publie ton profil</h3>
              <p>Ton profil apparaît dans le catalogue. Les créateurs peuvent te trouver et te contacter.</p>
            </div>
          </div>
          <div className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois des demandes</h3>
              <p>Les créateurs t'envoient des messages. Tu discutes, tu reçois des propositions, tu choisis.</p>
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
          <span className="persona-stat-value">7 étapes</span>
          <span className="persona-stat-label">Pour s'inscrire</span>
        </div>
      </div>

      <div className="persona-divider" />

      {/* Bottom CTA */}
      <section className="persona-cta-section">
        <h2>Prêt à recevoir des demandes ?</h2>
        <p>Rejoins le catalogue CUTLAB. Inscription gratuite, 0 commission, créateurs qui viennent à toi.</p>
        <Link to="/onboarding/1" className="persona-hero-cta">S'inscrire gratuitement →</Link>
      </section>
    </div>
  )
}

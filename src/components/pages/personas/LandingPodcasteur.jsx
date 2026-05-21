import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'
import { MockupCatalog } from '../../mockups'

export default function LandingPodcasteur() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.podcasteur} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      <section className="persona-hero">
        <h1>
          Ton podcast existe en audio.{' '}
          <em>Et en vidéo ?</em>
        </h1>
        <p>
          Podcast vidéo, clips YouTube, snippets Reels, TikToks — un seul enregistrement,
          mille déclinaisons. Trouve un monteur qui sait découper et repackager ton contenu
          audio en formats vidéo qui performent.
        </p>
        <Link to="/catalog" className="persona-hero-cta">
          Trouver mon monteur →
        </Link>
      </section>

      <section className="persona-mockup-section">
        <MockupCatalog />
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎙️</span>
            <span className="persona-pain-text">
              Tu es sur Spotify, mais 90% des podcasts à succès ont aussi du contenu vidéo.
              Tu rates l'audience YouTube et TikTok.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">✂️</span>
            <span className="persona-pain-text">
              Découper un épisode d'1h en 10 clips, c'est 5h de boulot. Tu n'as pas le temps.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">📐</span>
            <span className="persona-pain-text">
              Les monteurs vidéo classiques ne savent pas cadrer un visage parlant ni gérer
              le multi-cam podcast.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">📊</span>
            <span className="persona-pain-text">
              Tes meilleurs moments dorment dans ton flux audio. Personne ne les voit passer.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">🎧</span>
            <h3>Monteurs spécialisés podcast</h3>
            <p>
              Filtre par niche Podcast. Des monteurs qui maîtrisent les codes : multi-cam,
              sous-titres dynamiques, B-roll.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🔄</span>
            <h3>Multi-format</h3>
            <p>
              Un seul enregistrement, déclinaisons multiples : épisode YouTube long + clips
              Reels + Shorts TikTok.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💬</span>
            <h3>Brief simple</h3>
            <p>
              Tu envoies l'épisode, tu indiques le format. Le monteur te livre les
              déclinaisons clé en main.
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
              <h3>Filtre les monteurs podcast</h3>
              <p>
                Catalogue filtré par compétence Podcast et formats courts. Compare
                portfolios et tarifs.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Envoie ton épisode</h3>
              <p>
                Une fois la mission acceptée, tu transfères ton enregistrement. Brief
                en 2 minutes.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois tes déclinaisons</h3>
              <p>
                Épisode monté + clips courts livrés selon le délai convenu. Tu publies,
                tu cartonnes.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-stat-row">
          <div className="persona-stat">
            <span className="persona-stat-value">Multi-format</span>
            <span className="persona-stat-label">1 brief, X livrables</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">Direct</span>
            <span className="persona-stat-label">Sans intermédiaire</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">10x</span>
            <span className="persona-stat-label">Plus de portée</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à exister en vidéo ?</h2>
        <p>
          Multiplie ta portée sans multiplier ton temps de travail. Trouve un monteur
          podcast aujourd'hui.
        </p>
        <Link to="/catalog">Parcourir les monteurs →</Link>
      </section>
    </div>
  );
}

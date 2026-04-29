import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'
import { MockupCatalog } from '../../mockups'

export default function LandingMusicienIndependant() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.musicienIndependant} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      <section className="persona-hero">
        <h1>
          Ta musique mérite{' '}
          <em>plus qu'un fond noir</em>.
        </h1>
        <p>
          Lyric videos, clips musicaux, live sessions, visualizers — donne à tes morceaux
          le visuel qu'ils méritent. CUTLAB te connecte avec des monteurs qui aiment la
          musique et savent la mettre en image.
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
            <span className="persona-pain-icon">🎵</span>
            <span className="persona-pain-text">
              Sans label, tu galères à trouver un monteur qui comprend ton univers musical.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">💸</span>
            <span className="persona-pain-text">
              Sur Fiverr, c'est 100€ pour du sous-traité au Vietnam. Sur Malt, c'est 5K€
              pour une "agence".
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎨</span>
            <span className="persona-pain-text">
              Les monteurs vidéo classiques ne savent pas mixer image et son rythmiquement.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎬</span>
            <span className="persona-pain-text">
              Tu veux du qualitatif (clips, live sessions) mais ton budget est celui d'un
              artiste indé.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">🎶</span>
            <h3>Monteurs Music</h3>
            <p>
              Filtre par niche Music. Des monteurs qui kiffent la musique et savent monter
              au beat.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🎥</span>
            <h3>Tous formats</h3>
            <p>
              Lyric video, clip musical, live session, visualizer, behind-the-scenes —
              choisis ton format selon ton budget.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💶</span>
            <h3>Tarifs par projet</h3>
            <p>
              Pas d'abonnement, pas de retainer. Un projet, un tarif, un livrable.
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
              <h3>Filtre par niche Music</h3>
              <p>
                Catalogue de monteurs qui ont déjà bossé sur du clip et de la lyric video.
                Vérifie leur portfolio.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Brief ton projet</h3>
              <p>
                Track audio + références visuelles + délai. Le monteur te propose une offre
                détaillée.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Reçois ton clip</h3>
              <p>
                Livraison aux délais convenus. Tu publies sur YouTube, Spotify Canvas, Reels.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-stat-row">
          <div className="persona-stat">
            <span className="persona-stat-value">Direct</span>
            <span className="persona-stat-label">Sans intermédiaire</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">Vérifiés</span>
            <span className="persona-stat-label">Profils</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">1 projet</span>
            <span className="persona-stat-label">1 tarif</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à mettre ta musique en image ?</h2>
        <p>
          Trouve un monteur qui comprend ton son. Sans label, sans intermédiaire.
        </p>
        <Link to="/catalog">Parcourir les monteurs →</Link>
      </section>
    </div>
  );
}

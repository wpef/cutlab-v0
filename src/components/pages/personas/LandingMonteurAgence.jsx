import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO';
import { SEO_CONFIG } from '../../seo/seoConfig';
import { MockupLevels } from '../../mockups'

export default function LandingMonteurAgence() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.monteurAgence} />
      <header className="persona-header">
        <div className="logo">CUT<span>LAB</span></div>
      </header>

      <section className="persona-hero">
        <h1>
          10 ans d'agence. <em>Et si tu choisissais tes projets ?</em>
        </h1>
        <p>
          Tu en as marre des briefs absurdes, des deadlines impossibles, et des comptes Excel pour
          tes heures sup. CUTLAB te permet de passer en freelance sans repartir de zéro — ton
          expérience est ton meilleur atout.
        </p>
        <Link to="/onboarding/1" className="persona-hero-cta">
          Rejoindre le catalogue →
        </Link>
      </section>

      <section className="persona-mockup-section">
        <MockupLevels />
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">⏱️</span>
            <span className="persona-pain-text">
              50h+ par semaine pour un fixe qui ne suit plus l'inflation. Et toujours pas de
              remerciement.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">💰</span>
            <span className="persona-pain-text">
              Tu sais ce que tu vaux, mais tu ne sais pas comment le facturer en solo, sans la
              marque de l'agence.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🥊</span>
            <span className="persona-pain-text">
              Les marketplaces freelances généralistes = course au moins-disant face à des juniors
              low-cost.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎯</span>
            <span className="persona-pain-text">
              Tu veux choisir tes projets et tes clients. Plus de briefs absurdes, plus de retouches
              infinies.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">⭐</span>
            <h3>Niveau élevé d'entrée</h3>
            <p>
              Ton expérience te positionne directement haut sur la grille. Pas de
              "prouve-toi à partir de zéro".
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💎</span>
            <h3>Tarifs alignés</h3>
            <p>
              Ta grille tarifaire reflète ta vraie valeur. Pas de dumping, pas de
              Fiverr-isation.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">🎬</span>
            <h3>Choisis tes projets</h3>
            <p>
              Filtres formats, niches, expérience client. Tu acceptes ce qui te plaît, tu refuses
              le reste.
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
              <h3>Crée ton profil senior</h3>
              <p>
                Onboarding qui valorise ton expérience : portfolio agence, types de mission,
                expertise spécifique.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Positionne tes tarifs</h3>
              <p>
                La grille officielle CUTLAB te donne une baseline indicative selon ton niveau,
                mais tu fixes le prix de ton choix ligne par ligne. Tu te positionnes haut sans
                surenchère, à ta vraie valeur.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Choisis tes missions</h3>
              <p>
                Les créateurs te contactent. Tu acceptes les projets qui te plaisent, sans pression
                hiérarchique.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-stat-row">
          <div className="persona-stat">
            <span className="persona-stat-value">Sans agence</span>
            <span className="persona-stat-label">Direct freelance</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">7</span>
            <span className="persona-stat-label">Niveaux</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">Toi</span>
            <span className="persona-stat-label">Décides</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à monétiser tes 10 ans d'XP ?</h2>
        <p>
          Quitte l'agence sans repartir de zéro. CUTLAB valorise ton expérience — pas le contraire.
        </p>
        <Link to="/onboarding/1" className="persona-hero-cta">
          Rejoindre le catalogue →
        </Link>
      </section>
    </div>
  );
}

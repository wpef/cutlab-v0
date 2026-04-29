import { Link } from 'react-router-dom';
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'
import { MockupChat } from '../../mockups'

export default function LandingFormateurEnLigne() {
  return (
    <div className="persona-page">
      <SEO {...SEO_CONFIG.formateurEnLigne} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      <section className="persona-hero">
        <h1>
          Votre formation mérite mieux qu'<em>un screen recording</em>.
        </h1>
        <p>
          Cours en ligne, webinaires, masterclass — votre contenu pédagogique doit captiver.
          CUTLAB vous connecte avec des monteurs spécialisés en contenu éducatif, sans passer
          par une agence.
        </p>
        <Link to="/catalog" className="persona-hero-cta">
          Trouver mon monteur →
        </Link>
      </section>

      <section className="persona-mockup-section">
        <MockupChat />
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <ul className="persona-pain-list">
          <li className="persona-pain-item">
            <span className="persona-pain-icon">📺</span>
            <span className="persona-pain-text">
              Vos vidéos ressemblent à du screen recording brut. Vos étudiants décrochent au
              bout de 5 minutes.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">💸</span>
            <span className="persona-pain-text">
              Les agences vidéo facturent 5K à 10K€ par module. Votre catalogue de cours vous
              coûte une fortune.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🎬</span>
            <span className="persona-pain-text">
              Vous refondez régulièrement votre offre — le volume de montage est constant,
              l'équipe interne pas viable.
            </span>
          </li>
          <li className="persona-pain-item">
            <span className="persona-pain-icon">🤔</span>
            <span className="persona-pain-text">
              Vous ne savez pas comment trouver un monteur qui comprend la pédagogie, le
              rythme, les sous-titres dynamiques.
            </span>
          </li>
        </ul>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-features">
          <div className="persona-feature">
            <span className="persona-feature-icon">🎓</span>
            <h3>Spécialisés pédagogie</h3>
            <p>
              Filtre par niche Education. Monteurs qui maîtrisent les codes du cours en ligne :
              zooms, motifs, sous-titres dynamiques, B-roll explicatif.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">💶</span>
            <h3>Tarifs sans surprise</h3>
            <p>
              Chaque monteur affiche sa grille tarifaire. Vous calibrez votre budget formation
              à la ligne près.
            </p>
          </div>
          <div className="persona-feature">
            <span className="persona-feature-icon">📦</span>
            <h3>Volume négociable</h3>
            <p>
              Filtres par disponibilité et type de mission. Trouvez des monteurs prêts pour des
              collaborations long-terme.
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
              <h3>Parcourez les profils</h3>
              <p>
                Filtrez par expérience pédagogique, formats vidéo, et tarifs. Examinez les
                portfolios.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">2</span>
            <div className="persona-step-content">
              <h3>Lancez la collaboration</h3>
              <p>
                Brief structuré : objectifs pédagogiques, livrables, délais. Le monteur vous
                propose une offre adaptée.
              </p>
            </div>
          </li>
          <li className="persona-step">
            <span className="persona-step-num">3</span>
            <div className="persona-step-content">
              <h3>Suivez votre catalogue</h3>
              <p>
                Suivez chaque module via la messagerie intégrée. Stable, traçable, scalable.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <div className="persona-divider" />

      <section className="persona-section">
        <div className="persona-stat-row">
          <div className="persona-stat">
            <span className="persona-stat-value">Pédagogie</span>
            <span className="persona-stat-label">Monteurs spécialisés</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">Sans agence</span>
            <span className="persona-stat-label">Direct freelance</span>
          </div>
          <div className="persona-stat">
            <span className="persona-stat-value">5K€</span>
            <span className="persona-stat-label">Économisés/module</span>
          </div>
        </div>
      </section>

      <div className="persona-divider" />

      <section className="persona-cta-section">
        <h2>Prêt à industrialiser votre catalogue ?</h2>
        <p>
          Trouvez un monteur expert en contenu pédagogique. Sans agence, sans abonnement,
          sans intermédiaire.
        </p>
        <Link to="/catalog">Parcourir les monteurs →</Link>
      </section>
    </div>
  );
}

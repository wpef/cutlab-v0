import { Link } from 'react-router-dom'
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'
import { MockupProject } from '../../mockups'

export default function ComparisonAgences() {
  return (
    <div className="comparison-page">
      <SEO {...SEO_CONFIG.vsAgences} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      {/* Hero */}
      <section className="comparison-hero">
        <div className="comparison-logos">
          <div className="comparison-logo-block comparison-logo-block--cutlab">CUTLAB</div>
          <div className="comparison-logo-block comparison-logo-block--vs">vs</div>
          <div className="comparison-logo-block comparison-logo-block--competitor">Agences</div>
        </div>
        <h1>CUTLAB vs <em>Agences vidéo</em></h1>
        <p>L'expertise d'une agence, sans le tarif d'agence.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
          <Link to="/catalog" className="persona-hero-cta">Parcourir les monteurs →</Link>
          <Link to="/guide/createur" className="comparison-cta-btn comparison-cta-btn--secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>Voir le guide créateur →</Link>
        </div>
      </section>

      {/* Mockup hero */}
      <section className="comparison-mockup-section">
        <MockupProject />
      </section>

      {/* Section 2 — Pain points */}
      <section className="comparison-section">
        <h2>Pourquoi vous cherchez une alternative aux <em>agences vidéo</em></h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">💶</span>
            <span className="persona-pain-text">Les agences facturent 5 000 à 15 000 € pour des projets qu'un monteur freelance expérimenté réalise entre 500 et 3 000 €. Une grande partie va aux frais de structure, pas à la production.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📅</span>
            <span className="persona-pain-text">Les engagements sont lourds : un mois minimum, des contrats à négocier, des délais de brief allongés. Pas adapté si vous produisez régulièrement du contenu court.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🎭</span>
            <span className="persona-pain-text">Vous ne choisissez pas qui monte votre vidéo. Le monteur assigné change d'un projet à l'autre, ce qui nuit à la cohérence éditoriale de votre contenu.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🐢</span>
            <span className="persona-pain-text">Le process de brief prend 2 à 3 réunions avant même de démarrer la production. Pour des formats courts ou des volumes réguliers, c'est une friction inutile.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📦</span>
            <span className="persona-pain-text">Les agences ne sont pas adaptées aux volumes irréguliers ou aux projets ponctuels. Elles cherchent des clients récurrents avec des budgets annuels.</span>
          </div>
        </div>
      </section>

      {/* Section 3 — Comparison table */}
      <section className="comparison-section">
        <h2>Comparaison point par point</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Critère</th>
                <th className="comparison-col-cutlab" style={{ width: '30%' }}>CUTLAB</th>
                <th style={{ width: '30%' }}>Agences vidéo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Niveau d'expertise disponible</td>
                <td><span className="comparison-yes">✓</span> 7 niveaux structurés jusqu'à Expert</td>
                <td><span className="comparison-yes">✓</span> Équipes expérimentées, seniors confirmés</td>
              </tr>
              <tr>
                <td>Tarification structurée</td>
                <td><span className="comparison-yes">✓</span> Grille 7 lignes tarifaires, transparente</td>
                <td><span className="comparison-warn">⚠</span> Devis sur-mesure, marges agence incluses</td>
              </tr>
              <tr>
                <td>Choix du monteur</td>
                <td><span className="comparison-yes">✓</span> Vous choisissez le profil qui vous correspond</td>
                <td><span className="comparison-no">✗</span> Monteur assigné par l'agence, pas toujours le même</td>
              </tr>
              <tr>
                <td>Délai de démarrage</td>
                <td><span className="comparison-yes">✓</span> Premier contact en quelques minutes</td>
                <td><span className="comparison-warn">⚠</span> 2 à 3 réunions avant la production</td>
              </tr>
              <tr>
                <td>Engagement minimum</td>
                <td><span className="comparison-yes">✓</span> Mission à la vidéo, sans engagement</td>
                <td><span className="comparison-warn">⚠</span> Contrats mensuels, retainers, budgets annuels</td>
              </tr>
              <tr>
                <td>Adapté aux volumes irréguliers</td>
                <td><span className="comparison-yes">✓</span> 1 vidéo ou 20, selon vos besoins du moment</td>
                <td><span className="comparison-no">✗</span> Pensé pour les clients récurrents à budget fixe</td>
              </tr>
              <tr>
                <td>Pipeline de gestion projet</td>
                <td><span className="comparison-yes">✓</span> Kanban intégré, suivi en temps réel</td>
                <td><span className="comparison-warn">⚠</span> Outils propres à l'agence, peu de visibilité côté client</td>
              </tr>
              <tr>
                <td>Messagerie + propositions structurées</td>
                <td><span className="comparison-yes">✓</span> Deliverables, délai, budget, révisions dans chaque offre</td>
                <td><span className="comparison-warn">⚠</span> Devis PDF, échanges email, moins de réactivité</td>
              </tr>
              <tr>
                <td>Spécialisation créateurs de contenu</td>
                <td><span className="comparison-yes">✓</span> Monteurs spécialisés YouTube, TikTok, Reels, podcast</td>
                <td><span className="comparison-warn">⚠</span> Souvent orienté corporate, publicité, institutionnel</td>
              </tr>
              <tr>
                <td>Relation directe client-monteur</td>
                <td><span className="comparison-yes">✓</span> Contact direct, pas d'intermédiaire</td>
                <td><span className="comparison-no">✗</span> Chef de projet / account manager en intermédiaire</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4 — Quand choisir CUTLAB */}
      <section className="comparison-section">
        <h2>Quand choisir <em>CUTLAB</em></h2>
        <div className="comparison-cases">
          <div className="comparison-case">
            <div className="comparison-case-icon">🎬</div>
            <h3>Vous voulez un monteur qui comprend votre marché</h3>
            <p>Les monteurs CUTLAB sont spécialisés dans les formats créateurs. Ils connaissent les codes YouTube, TikTok, Reels et podcast vidéo — sans formation préalable de votre part.</p>
          </div>
          <div className="comparison-case">
            <div className="comparison-case-icon">📊</div>
            <h3>Vous voulez suivre vos projets visuellement</h3>
            <p>Le pipeline Kanban intégré vous donne une visibilité en temps réel sur l'avancement de chaque projet, sans passer par un chef de projet ou des mails.</p>
          </div>
          <div className="comparison-case">
            <div className="comparison-case-icon">💡</div>
            <h3>Vous produisez de manière irrégulière</h3>
            <p>Un lancement, une campagne, une série ponctuelle — CUTLAB s'adapte à vos volumes sans engagement. Activez ou suspendez selon vos besoins.</p>
          </div>
        </div>
      </section>

      {/* Section 5 — Quand les agences restent pertinentes */}
      <section className="comparison-section">
        <h2>Quand une <em>agence vidéo</em> reste pertinente</h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🏆</span>
            <span className="persona-pain-text">Votre projet requiert une production très haut de gamme avec réalisateur, chef opérateur et post-production multi-équipes sur un budget de plusieurs dizaines de milliers d'euros.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📺</span>
            <span className="persona-pain-text">Vous avez besoin d'une prestation clé en main incluant tournage, script, direction artistique et diffusion — au-delà du seul montage.</span>
          </div>
        </div>
      </section>

      {/* Section 6 — CTA bottom */}
      <section className="comparison-cta">
        <h2>Prêt à essayer CUTLAB ?</h2>
        <p>Accédez à des monteurs vidéo expérimentés, directement, sans contrat ni intermédiaire. Tarification structurée et transparente.</p>
        <div className="comparison-cta-buttons">
          <Link to="/catalog" className="comparison-cta-btn comparison-cta-btn--primary">Parcourir les monteurs →</Link>
          <Link to="/guide/createur" className="comparison-cta-btn comparison-cta-btn--secondary">Voir le guide créateur →</Link>
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'
import { MockupCatalog } from '../../mockups'

export default function ComparisonFiverr() {
  return (
    <div className="comparison-page">
      <SEO {...SEO_CONFIG.vsFiverr} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      {/* Hero */}
      <section className="comparison-hero">
        <div className="comparison-logos">
          <div className="comparison-logo-block comparison-logo-block--cutlab">CUTLAB</div>
          <div className="comparison-logo-block comparison-logo-block--vs">vs</div>
          <div className="comparison-logo-block comparison-logo-block--competitor">Fiverr</div>
        </div>
        <h1>CUTLAB vs <em>Fiverr</em></h1>
        <p>Au-delà du gigwork, un catalogue dédié au montage vidéo.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
          <Link to="/catalog" className="persona-hero-cta">Parcourir les monteurs →</Link>
          <Link to="/onboarding/1" className="comparison-cta-btn comparison-cta-btn--secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>Rejoindre comme monteur →</Link>
        </div>
      </section>

      {/* Mockup hero */}
      <section className="comparison-mockup-section">
        <MockupCatalog />
      </section>

      {/* Section 2 — Pain points */}
      <section className="comparison-section">
        <h2>Pourquoi tu cherches une alternative à <em>Fiverr</em></h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🔍</span>
            <span className="persona-pain-text">Tu cherches "video editor" sur Fiverr et tu tombes sur 50 000 résultats. Impossible de filtrer par niche (gaming, lifestyle, corporate) ou par format (Reels, longform, motion).</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">⭐</span>
            <span className="persona-pain-text">Le système d'évaluation est saturé : pratiquement tout le monde affiche 4.9 étoiles. Distinguer un monteur solide d'un profil gonflé devient impossible.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🌍</span>
            <span className="persona-pain-text">La barrière de qualité est faible. Beaucoup de gigs reposent sur de la sous-traitance internationale à bas coût, avec peu de transparence sur qui monte réellement ta vidéo.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">💬</span>
            <span className="persona-pain-text">Pas de grille tarifaire de référence pour le marché français. Tu négocies à l'aveugle, sans repère sur ce que vaut réellement une prestation de montage.</span>
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
                <th style={{ width: '30%' }}>Fiverr</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spécialisation montage vidéo</td>
                <td><span className="comparison-yes">✓</span> Catalogue 100% montage</td>
                <td><span className="comparison-warn">⚠</span> Marketplace généraliste, tous métiers</td>
              </tr>
              <tr>
                <td>Filtres niche, format, niveau</td>
                <td><span className="comparison-yes">✓</span> Filtres dédiés montage (niche, format, logiciel)</td>
                <td><span className="comparison-warn">⚠</span> Filtres génériques, peu adaptés à la vidéo</td>
              </tr>
              <tr>
                <td>Système de niveaux d'expertise</td>
                <td><span className="comparison-yes">✓</span> 7 niveaux structurés (Débutant → Expert)</td>
                <td><span className="comparison-no">✗</span> Pas de système de niveau métier</td>
              </tr>
              <tr>
                <td>Grille tarifaire structurée</td>
                <td><span className="comparison-yes">✓</span> 7 lignes tarifaires (montage / motion / miniature)</td>
                <td><span className="comparison-warn">⚠</span> Tarifs libres sans référentiel commun</td>
              </tr>
              <tr>
                <td>Portfolio mis en valeur</td>
                <td><span className="comparison-yes">✓</span> Clips, chaînes créditées, bio + compétences</td>
                <td><span className="comparison-warn">⚠</span> Portfolio générique, pas orienté vidéo</td>
              </tr>
              <tr>
                <td>Pipeline de gestion projet</td>
                <td><span className="comparison-yes">✓</span> Kanban intégré pour les monteurs</td>
                <td><span className="comparison-no">✗</span> Pas de pipeline projet côté prestataire</td>
              </tr>
              <tr>
                <td>Messagerie + offres structurées</td>
                <td><span className="comparison-yes">✓</span> Propositions avec deliverables, délai, budget</td>
                <td><span className="comparison-warn">⚠</span> Chat basique sans structure de mission</td>
              </tr>
              <tr>
                <td>Spécifique au marché français</td>
                <td><span className="comparison-yes">✓</span> FR par défaut, interface française, RGPD</td>
                <td><span className="comparison-warn">⚠</span> Interface anglaise, USD, marché global</td>
              </tr>
              <tr>
                <td>Transparence tarifaire</td>
                <td><span className="comparison-yes">✓</span> Tarification directe, structurée</td>
                <td><span className="comparison-warn">⚠</span> Frais de service sur chaque transaction</td>
              </tr>
              <tr>
                <td>Public ciblé créateurs / monteurs</td>
                <td><span className="comparison-yes">✓</span> B2B2C dédié créateurs de contenu</td>
                <td><span className="comparison-warn">⚠</span> Tous secteurs, tous profils</td>
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
            <h3>Tu veux un monteur qui comprend ton marché</h3>
            <p>Créateur YouTube, TikTok, Reels ou podcast vidéo — les monteurs CUTLAB sont spécialisés dans ces formats et ces codes.</p>
          </div>
          <div className="comparison-case">
            <div className="comparison-case-icon">📋</div>
            <h3>Tu veux un brief structuré, pas un thread infini</h3>
            <p>Les propositions incluent deliverables, délai, budget et révisions. Tout est cadré dès le départ, pas de malentendu.</p>
          </div>
          <div className="comparison-case">
            <div className="comparison-case-icon">📊</div>
            <h3>Tu veux suivre tes projets visuellement</h3>
            <p>Le pipeline Kanban intégré permet aux monteurs de gérer leur production et à toi de voir l'avancement de ta commande.</p>
          </div>
        </div>
      </section>

      {/* Section 5 — Quand Fiverr reste pertinent */}
      <section className="comparison-section">
        <h2>Quand <em>Fiverr</em> reste pertinent</h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🌐</span>
            <span className="persona-pain-text">Tu as besoin d'un prestataire international, avec paiement en USD, pour un projet non-francophone.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🔧</span>
            <span className="persona-pain-text">Ta mission dépasse la vidéo : tu cherches aussi du design, du développement ou de la rédaction en un seul endroit.</span>
          </div>
        </div>
      </section>

      {/* Section 6 — CTA bottom */}
      <section className="comparison-cta">
        <h2>Prêt à essayer CUTLAB ?</h2>
        <p>Parcours le catalogue de monteurs vidéo spécialisés et envoie ta première demande en quelques minutes.</p>
        <div className="comparison-cta-buttons">
          <Link to="/catalog" className="comparison-cta-btn comparison-cta-btn--primary">Parcourir les monteurs →</Link>
          <Link to="/guide/createur" className="comparison-cta-btn comparison-cta-btn--secondary">Voir le guide créateur →</Link>
        </div>
      </section>
    </div>
  )
}

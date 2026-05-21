import { Link } from 'react-router-dom'
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'
import { MockupPricing } from '../../mockups'

export default function ComparisonUpwork() {
  return (
    <div className="comparison-page">
      <SEO {...SEO_CONFIG.vsUpwork} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      {/* Hero */}
      <section className="comparison-hero">
        <div className="comparison-logos">
          <div className="comparison-logo-block comparison-logo-block--cutlab">CUTLAB</div>
          <div className="comparison-logo-block comparison-logo-block--vs">vs</div>
          <div className="comparison-logo-block comparison-logo-block--competitor">Upwork</div>
        </div>
        <h1>CUTLAB vs <em>Upwork</em></h1>
        <p>Pour le marché français, sans la friction internationale.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
          <Link to="/catalog" className="persona-hero-cta">Parcourir les monteurs →</Link>
          <Link to="/onboarding/1" className="comparison-cta-btn comparison-cta-btn--secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>Rejoindre comme monteur →</Link>
        </div>
      </section>

      {/* Mockup hero */}
      <section className="comparison-mockup-section">
        <MockupPricing />
      </section>

      {/* Section 2 — Pain points */}
      <section className="comparison-section">
        <h2>Pourquoi tu cherches une alternative à <em>Upwork</em></h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🌍</span>
            <span className="persona-pain-text">Upwork est majoritairement anglophone et facture en USD. Pour un projet francophone avec un monteur basé en France, la friction administrative est inutile.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">⚙️</span>
            <span className="persona-pain-text">Le système d'enchères est chronophage pour les monteurs, qui doivent rédiger des propositions payantes pour chaque offre sans garantie de retour.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📝</span>
            <span className="persona-pain-text">Les tests obligatoires et la phase de vérification pour les nouveaux prestataires sont lourds, surtout pour des monteurs en reconversion ou en début de carrière.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🎥</span>
            <span className="persona-pain-text">Pas de spécialisation créateur de contenu vidéo. Trouver un monteur qui comprend YouTube, les Reels ou le podcast vidéo demande de trier parmi des centaines de profils génériques.</span>
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
                <th style={{ width: '30%' }}>Upwork</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spécialisation montage vidéo</td>
                <td><span className="comparison-yes">✓</span> Catalogue 100% montage</td>
                <td><span className="comparison-warn">⚠</span> Marketplace généraliste, tous métiers tech</td>
              </tr>
              <tr>
                <td>Filtres niche, format, niveau</td>
                <td><span className="comparison-yes">✓</span> Filtres dédiés montage (niche, format, logiciel)</td>
                <td><span className="comparison-warn">⚠</span> Filtres génériques, peu adaptés à la vidéo créateur</td>
              </tr>
              <tr>
                <td>Système de niveaux d'expertise</td>
                <td><span className="comparison-yes">✓</span> 7 niveaux structurés (Débutant → Expert)</td>
                <td><span className="comparison-warn">⚠</span> Badges Rising Talent / Top Rated basés sur le volume</td>
              </tr>
              <tr>
                <td>Grille tarifaire structurée</td>
                <td><span className="comparison-yes">✓</span> 7 lignes tarifaires (montage / motion / miniature)</td>
                <td><span className="comparison-warn">⚠</span> Tarifs horaires libres en USD, sans référentiel</td>
              </tr>
              <tr>
                <td>Portfolio mis en valeur</td>
                <td><span className="comparison-yes">✓</span> Clips, chaînes créditées, formats, niches</td>
                <td><span className="comparison-warn">⚠</span> Portfolio générique, orienté missions passées</td>
              </tr>
              <tr>
                <td>Pipeline de gestion projet</td>
                <td><span className="comparison-yes">✓</span> Kanban intégré pour les monteurs</td>
                <td><span className="comparison-no">✗</span> Pas de pipeline projet visuel côté prestataire</td>
              </tr>
              <tr>
                <td>Messagerie + offres structurées</td>
                <td><span className="comparison-yes">✓</span> Propositions avec deliverables, délai, budget</td>
                <td><span className="comparison-warn">⚠</span> Propositions et contrats, mais peu adaptés aux missions vidéo courtes</td>
              </tr>
              <tr>
                <td>Spécifique au marché français</td>
                <td><span className="comparison-yes">✓</span> FR natif, interface française, RGPD, €</td>
                <td><span className="comparison-no">✗</span> Interface anglaise, USD, marché global anglophone</td>
              </tr>
              <tr>
                <td>Accès sans friction pour nouveaux monteurs</td>
                <td><span className="comparison-yes">✓</span> Onboarding guidé en 7 étapes</td>
                <td><span className="comparison-warn">⚠</span> Tests obligatoires, vérification d'identité, phase de rodage</td>
              </tr>
              <tr>
                <td>Public ciblé créateurs / monteurs</td>
                <td><span className="comparison-yes">✓</span> B2B2C dédié créateurs de contenu</td>
                <td><span className="comparison-warn">⚠</span> Entreprises tech + freelances toutes disciplines</td>
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
            <div className="comparison-case-icon">🇫🇷</div>
            <h3>Tu veux travailler avec un monteur français</h3>
            <p>Toute la plateforme est en français. Les monteurs comprennent les codes du marché francophone : YouTube FR, créateurs locaux, formats courts.</p>
          </div>
          <div className="comparison-case">
            <div className="comparison-case-icon">📋</div>
            <h3>Tu veux un brief structuré, pas un thread infini</h3>
            <p>Les propositions incluent deliverables clairs, délai, budget et révisions. Tout est cadré avant le début de la production.</p>
          </div>
          <div className="comparison-case">
            <div className="comparison-case-icon">⚡</div>
            <h3>Tu veux démarrer vite, sans friction</h3>
            <p>Pas d'enchères, pas de tests d'entrée. Tu parcours le catalogue, tu contactes directement. Le premier échange peut avoir lieu en quelques minutes.</p>
          </div>
        </div>
      </section>

      {/* Section 5 — Quand Upwork reste pertinent */}
      <section className="comparison-section">
        <h2>Quand <em>Upwork</em> reste pertinent</h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🌐</span>
            <span className="persona-pain-text">Tu produis du contenu en anglais pour une audience internationale et tu as besoin d'un monteur anglophone basé hors de France.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🔧</span>
            <span className="persona-pain-text">Ton projet combine vidéo, développement et design dans une mission longue avec un budget en USD.</span>
          </div>
        </div>
      </section>

      {/* Section 6 — CTA bottom */}
      <section className="comparison-cta">
        <h2>Prêt à essayer CUTLAB ?</h2>
        <p>Un catalogue de monteurs vidéo francophones spécialisés. Pas d'enchères, pas de friction, directement entre toi et le monteur.</p>
        <div className="comparison-cta-buttons">
          <Link to="/catalog" className="comparison-cta-btn comparison-cta-btn--primary">Parcourir les monteurs →</Link>
          <Link to="/guide/createur" className="comparison-cta-btn comparison-cta-btn--secondary">Voir le guide créateur →</Link>
        </div>
      </section>
    </div>
  )
}

import { Link } from 'react-router-dom'
import SEO from '../../seo/SEO'
import { SEO_CONFIG } from '../../seo/seoConfig'
import { MockupLevels } from '../../mockups'

export default function ComparisonMalt() {
  return (
    <div className="comparison-page">
      <SEO {...SEO_CONFIG.vsMalt} />
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>

      {/* Hero */}
      <section className="comparison-hero">
        <div className="comparison-logos">
          <div className="comparison-logo-block comparison-logo-block--cutlab">CUTLAB</div>
          <div className="comparison-logo-block comparison-logo-block--vs">vs</div>
          <div className="comparison-logo-block comparison-logo-block--competitor">Malt</div>
        </div>
        <h1>CUTLAB vs <em>Malt</em></h1>
        <p>Spécialisé montage vidéo. Pas une marketplace freelance généraliste.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
          <Link to="/catalog" className="persona-hero-cta">Parcourir les monteurs →</Link>
          <Link to="/onboarding/1" className="comparison-cta-btn comparison-cta-btn--secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>Rejoindre comme monteur →</Link>
        </div>
      </section>

      {/* Mockup hero */}
      <section className="comparison-mockup-section">
        <MockupLevels />
      </section>

      {/* Section 2 — Pain points */}
      <section className="comparison-section">
        <h2>Pourquoi tu cherches une alternative à <em>Malt</em></h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🗂️</span>
            <span className="persona-pain-text">Sur Malt, le montage vidéo est noyé parmi plus de 100 métiers. Développeurs, comptables, traducteurs... trouver un bon monteur vidéo demande du temps et de la chance.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🔍</span>
            <span className="persona-pain-text">Il n'existe pas de filtre dédié niche ou format vidéo. Tu ne peux pas chercher "monteur TikTok gaming" ou "monteur longform YouTube".</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📄</span>
            <span className="persona-pain-text">Les profils Malt sont orientés CV et expériences professionnelles, pas portfolio créatif. Les clips et les chaînes créditées ne sont pas mis en valeur.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">💼</span>
            <span className="persona-pain-text">L'approche "consultant journalier" de Malt est peu adaptée aux missions courtes type "1 vidéo YouTube" ou "5 Reels par semaine".</span>
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
                <th style={{ width: '30%' }}>Malt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spécialisation montage vidéo</td>
                <td><span className="comparison-yes">✓</span> Catalogue 100% montage</td>
                <td><span className="comparison-warn">⚠</span> Marketplace 100+ métiers, vidéo parmi d'autres</td>
              </tr>
              <tr>
                <td>Filtres niche, format, niveau</td>
                <td><span className="comparison-yes">✓</span> Filtres dédiés montage (niche, format, logiciel)</td>
                <td><span className="comparison-no">✗</span> Pas de filtre niche ou format vidéo</td>
              </tr>
              <tr>
                <td>Système de niveaux d'expertise</td>
                <td><span className="comparison-yes">✓</span> 7 niveaux structurés (Débutant → Expert)</td>
                <td><span className="comparison-warn">⚠</span> Évaluation basée sur l'ancienneté et les avis</td>
              </tr>
              <tr>
                <td>Grille tarifaire structurée</td>
                <td><span className="comparison-yes">✓</span> 7 lignes tarifaires (montage / motion / miniature)</td>
                <td><span className="comparison-warn">⚠</span> TJM libre sans référentiel spécifique montage</td>
              </tr>
              <tr>
                <td>Portfolio mis en valeur</td>
                <td><span className="comparison-yes">✓</span> Clips, chaînes créditées, formats, niches</td>
                <td><span className="comparison-warn">⚠</span> Profil orienté CV, portfolio peu mis en avant</td>
              </tr>
              <tr>
                <td>Pipeline de gestion projet</td>
                <td><span className="comparison-yes">✓</span> Kanban intégré pour les monteurs</td>
                <td><span className="comparison-no">✗</span> Pas de pipeline projet intégré</td>
              </tr>
              <tr>
                <td>Messagerie + offres structurées</td>
                <td><span className="comparison-yes">✓</span> Propositions avec deliverables, délai, budget</td>
                <td><span className="comparison-warn">⚠</span> Messagerie + devis standard, peu structuré pour la vidéo</td>
              </tr>
              <tr>
                <td>Spécifique au marché français</td>
                <td><span className="comparison-yes">✓</span> FR natif, interface française, RGPD</td>
                <td><span className="comparison-yes">✓</span> Plateforme française, €, RGPD</td>
              </tr>
              <tr>
                <td>Adapté aux missions courtes</td>
                <td><span className="comparison-yes">✓</span> Mission par vidéo, volume hebdomadaire</td>
                <td><span className="comparison-warn">⚠</span> Modèle TJM orienté missions longues</td>
              </tr>
              <tr>
                <td>Public ciblé créateurs / monteurs</td>
                <td><span className="comparison-yes">✓</span> B2B2C dédié créateurs de contenu</td>
                <td><span className="comparison-warn">⚠</span> Tous secteurs, profils consultant/entreprise</td>
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
            <p>CUTLAB est pensé pour les créateurs de contenu. Chaque monteur connaît les codes YouTube, TikTok, Reels et podcast vidéo.</p>
          </div>
          <div className="comparison-case">
            <div className="comparison-case-icon">📋</div>
            <h3>Tu veux un brief structuré, pas un thread infini</h3>
            <p>Les propositions incluent deliverables clairs, délai de livraison, budget et révisions. Tout est cadré avant de commencer.</p>
          </div>
          <div className="comparison-case">
            <div className="comparison-case-icon">🔁</div>
            <h3>Tu travailles en volume régulier</h3>
            <p>1 vidéo par semaine, 4 Reels par mois — le modèle CUTLAB est adapté aux missions récurrentes courtes, pas aux contrats journaliers.</p>
          </div>
        </div>
      </section>

      {/* Section 5 — Quand Malt reste pertinent */}
      <section className="comparison-section">
        <h2>Quand <em>Malt</em> reste pertinent</h2>
        <div className="persona-pain-list">
          <div className="persona-pain-item">
            <span className="persona-pain-icon">🏢</span>
            <span className="persona-pain-text">Tu cherches un freelance multi-disciplines capable de gérer à la fois la vidéo, le design et la stratégie sur un même projet.</span>
          </div>
          <div className="persona-pain-item">
            <span className="persona-pain-icon">📅</span>
            <span className="persona-pain-text">Ta mission est longue (plusieurs semaines) et se facture mieux en TJM qu'au projet.</span>
          </div>
        </div>
      </section>

      {/* Section 6 — CTA bottom */}
      <section className="comparison-cta">
        <h2>Prêt à essayer CUTLAB ?</h2>
        <p>Trouve un monteur vidéo spécialisé en quelques minutes. Filtres dédiés, profils complets, propositions structurées.</p>
        <div className="comparison-cta-buttons">
          <Link to="/catalog" className="comparison-cta-btn comparison-cta-btn--primary">Parcourir les monteurs →</Link>
          <Link to="/guide/createur" className="comparison-cta-btn comparison-cta-btn--secondary">Voir le guide créateur →</Link>
        </div>
      </section>
    </div>
  )
}

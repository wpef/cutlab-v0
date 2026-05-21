# Plan — Documentation, Admin Doc, Personas & Landing Pages

## Context
CUTLAB is a Vite+React 18 platform connecting content creators (créateurs) with video editors (monteurs). We need to create:
1. User-facing documentation pages (one for monteurs, one for créateurs)
2. An admin documentation file (admindoc.md) at project root
3. Persona-specific landing pages to drive signups (dedicated routes under `/pour/...`)
4. Link documentation from the home page
5. CSS for all new pages

All pages are in French. Code is in English. Dark theme: accent `#d4f000`, bg `#0a0a0a`, surface `#111111`. Fonts: Inter (body), Syne (headings, 800 weight).

## Architecture notes
- Standalone public pages (no AppLayout, no auth guard) — same pattern as `src/components/pages/LegalPrivacy.jsx`
- Each page: `import { Link } from 'react-router-dom'`, logo header, back link to `/`
- CSS in `src/styles/global.css` — reuse `.legal-page` / `.legal-content` base, add `.doc-*` and `.persona-*` classes
- Routes in `src/App.jsx` — lazy imports, public (no guard)
- Persona pages go in `src/components/pages/personas/` directory (create it)
- Documentation pages go in `src/components/pages/`

### Reference: existing page pattern (LegalPrivacy.jsx)
```jsx
import { Link } from 'react-router-dom'
export default function LegalPrivacy() {
  return (
    <div className="legal-page">
      <div className="legal-content">
        <Link to="/" className="legal-back">← Retour</Link>
        <h1>Title</h1>
        <section><h2>Section</h2><p>Content</p></section>
      </div>
    </div>
  )
}
```

### Reference: existing CSS variables
```css
:root {
  --bg: #0a0a0a; --surface: #111111; --surface2: #1a1a1a;
  --border: #252525; --accent: #d4f000; --text: #f0f0f0;
  --text-muted: #666; --text-dim: #999;
  --radius: 12px; --radius-sm: 8px;
}
```

### Reference: Landing.jsx structure
The landing page has a `.landing-hero` with two `.landing-panel` divs (dark + accent). Below is a `.landing-demo-section`. We add guide links BELOW the demo section, as a `.landing-guides` div with two Link elements.

## Tasks

### B0.1 — Add CSS for documentation and persona pages
- **File**: `src/styles/global.css`
- **Model**: sonnet
- **What**: Append new CSS classes at the end of the file (before any final closing comments). Add:

**Documentation page styles** (`.doc-page` extending `.legal-page` pattern):
```css
/* ── DOCUMENTATION PAGES ── */
.doc-page { min-height: 100vh; background: var(--bg); padding: 60px 24px; }
.doc-content { max-width: 780px; margin: 0 auto; }
.doc-back { display: inline-block; color: var(--text-muted); font-size: 14px; margin-bottom: 32px; text-decoration: none; transition: color 0.2s; }
.doc-back:hover { color: var(--text); }
.doc-page h1 { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 8px; }
.doc-page .doc-subtitle { color: var(--text-muted); font-size: 15px; margin-bottom: 48px; line-height: 1.6; }
.doc-section { margin-bottom: 48px; }
.doc-section h2 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--accent); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
.doc-section h3 { font-size: 15px; font-weight: 600; color: var(--text); margin: 20px 0 10px; }
.doc-section p, .doc-section li { font-size: 14px; color: var(--text-dim); line-height: 1.8; }
.doc-section ul, .doc-section ol { padding-left: 20px; display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.doc-section ol { list-style: decimal; }
.doc-section strong { color: var(--text); font-weight: 600; }
.doc-nav { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px; }
.doc-nav a { font-size: 13px; color: var(--accent); background: var(--surface); border: 1px solid var(--border); padding: 6px 14px; border-radius: 20px; text-decoration: none; transition: all 0.2s; }
.doc-nav a:hover { background: var(--surface2); border-color: var(--accent); }
.doc-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0; }
.doc-feature-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
.doc-feature-card h4 { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
.doc-feature-card p { font-size: 13px; color: var(--text-dim); line-height: 1.6; }
.doc-step { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
.doc-step-num { flex-shrink: 0; width: 32px; height: 32px; background: var(--accent); color: var(--bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
.doc-step-content h4 { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.doc-step-content p { font-size: 13px; color: var(--text-dim); line-height: 1.6; }
.doc-cta { text-align: center; margin-top: 60px; padding: 48px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.doc-cta h3 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; margin-bottom: 12px; }
.doc-cta p { color: var(--text-dim); font-size: 14px; margin-bottom: 24px; }
.doc-cta-btn { display: inline-block; background: var(--accent); color: var(--bg); font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: var(--radius); text-decoration: none; transition: opacity 0.2s; border: none; cursor: pointer; }
.doc-cta-btn:hover { opacity: 0.9; }
```

**Persona landing page styles**:
```css
/* ── PERSONA LANDING PAGES ── */
.persona-page { min-height: 100vh; background: var(--bg); }
.persona-header { padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; max-width: 960px; margin: 0 auto; }
.persona-header .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: var(--accent); text-decoration: none; }
.persona-header .logo span { color: var(--text); }
.persona-hero { max-width: 960px; margin: 0 auto; padding: 80px 24px 60px; text-align: center; }
.persona-hero h1 { font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800; line-height: 1.15; margin-bottom: 20px; }
.persona-hero h1 em { font-style: normal; color: var(--accent); }
.persona-hero p { font-size: 17px; color: var(--text-dim); max-width: 600px; margin: 0 auto 32px; line-height: 1.6; }
.persona-hero-cta { display: inline-block; background: var(--accent); color: var(--bg); font-weight: 700; font-size: 16px; padding: 16px 36px; border-radius: var(--radius); text-decoration: none; transition: opacity 0.2s; }
.persona-hero-cta:hover { opacity: 0.9; }
.persona-section { max-width: 960px; margin: 0 auto; padding: 60px 24px; }
.persona-section h2 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; text-align: center; margin-bottom: 40px; }
.persona-section h2 em { font-style: normal; color: var(--accent); }
.persona-pain-list { display: flex; flex-direction: column; gap: 16px; max-width: 600px; margin: 0 auto; }
.persona-pain-item { display: flex; align-items: flex-start; gap: 14px; padding: 16px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.persona-pain-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.persona-pain-text { font-size: 14px; color: var(--text-dim); line-height: 1.6; }
.persona-pain-text strong { color: var(--text); }
.persona-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.persona-feature { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px; text-align: center; transition: border-color 0.2s; }
.persona-feature:hover { border-color: var(--accent); }
.persona-feature-icon { font-size: 28px; margin-bottom: 12px; }
.persona-feature h3 { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
.persona-feature p { font-size: 13px; color: var(--text-dim); line-height: 1.6; }
.persona-steps { display: flex; flex-direction: column; gap: 24px; max-width: 600px; margin: 0 auto; }
.persona-step { display: flex; align-items: flex-start; gap: 20px; }
.persona-step-num { flex-shrink: 0; width: 40px; height: 40px; background: var(--accent); color: var(--bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; font-family: 'Syne', sans-serif; }
.persona-step-content h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.persona-step-content p { font-size: 13px; color: var(--text-dim); line-height: 1.6; }
.persona-divider { height: 1px; background: var(--border); max-width: 960px; margin: 0 auto; }
.persona-cta-section { text-align: center; padding: 80px 24px; }
.persona-cta-section h2 { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; margin-bottom: 16px; }
.persona-cta-section p { font-size: 15px; color: var(--text-dim); margin-bottom: 32px; }
.persona-cta-section .persona-hero-cta { font-size: 17px; padding: 18px 40px; }
.persona-stat-row { display: flex; justify-content: center; gap: 48px; margin: 40px 0; }
.persona-stat { text-align: center; }
.persona-stat-value { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; color: var(--accent); }
.persona-stat-label { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
```

**Landing guides link section**:
```css
/* ── LANDING GUIDES ── */
.landing-guides { text-align: center; padding: 24px 16px 48px; }
.landing-guides-label { font-size: 13px; color: var(--text-muted); margin-bottom: 12px; }
.landing-guides-links { display: flex; justify-content: center; gap: 24px; }
.landing-guides-links a { font-size: 14px; color: var(--text-dim); text-decoration: none; transition: color 0.2s; }
.landing-guides-links a:hover { color: var(--accent); }
```

**Mobile responsive for new classes**:
```css
@media (max-width: 768px) {
  .doc-feature-grid { grid-template-columns: 1fr; }
  .persona-hero h1 { font-size: 28px; }
  .persona-hero p { font-size: 15px; }
  .persona-features { grid-template-columns: 1fr; }
  .persona-stat-row { flex-direction: column; gap: 24px; }
  .persona-hero { padding: 48px 24px 40px; }
  .persona-section { padding: 40px 24px; }
}
```

### B1.1 — Create DocumentationMonteur.jsx
- **File**: `src/components/pages/DocumentationMonteur.jsx`
- **Model**: sonnet
- Create a comprehensive documentation page for video editors (monteurs). All content in French.
- Use className `doc-page` as outer wrapper, `doc-content` for inner container.
- Include a `<Link to="/">← Retour</Link>` with className `doc-back`.
- Include logo: `<div className="logo" style={{marginBottom: '24px'}}>CUT<span>LAB</span></div>`

**Sections to include** (each wrapped in `<section className="doc-section">`):

1. **Quick nav** (`.doc-nav`): links that anchor to each section via `#id` attributes

2. **Introduction** (id="intro"): What is CUTLAB — a platform that connects you directly with content creators looking for monteurs. No commissions, no intermediaries.

3. **S'inscrire** (id="inscription"): Use `.doc-step` pattern (numbered steps 1-7):
   - Step 1: Create account (email + password)
   - Step 2: Identity (name, avatar, languages, availability)
   - Step 3: Skills (competences, formats, niches, experience, software)
   - Step 4: Portfolio (links to clips, credited channels)
   - Step 5: Presentation (bio, mission types, response time, social links)
   - Step 6: Level reveal (automatic level based on profile)
   - Step 7: Preview and publish

4. **Mon profil** (id="profil"): How to edit profile after publishing. Access via "Mon profil" tab. Explain: all info editable, pricing section, social links, avatar.

5. **Système de niveaux** (id="niveaux"): 7 levels computed from profile completeness and experience. Level affects pricing grid baseline. Level can increase when profile is enriched.

6. **Tarifs** (id="tarifs"): Pricing grid with 7 rows (3 montage + 3 motion + 1 miniature). Baseline from level. Adjustable ±10% per row. Explain the range shown to creators.

7. **Recevoir des demandes** (id="demandes"): Creators browse the catalog, see your card, and contact you. You receive a notification and see the request in Messagerie.

8. **Messagerie** (id="messagerie"): How conversations work. Receive messages, proposals (offers with budget, deadline, deliverables). Accept or refuse offers.

9. **Pipeline** (id="pipeline"): Visual board to track project stages. Columns for different statuses.

10. **Mes projets** (id="projets"): Project management — view active projects, candidatures, details.

11. **CTA section** (`.doc-cta`): "Prêt à rejoindre le catalogue ?" with button "S'inscrire gratuitement →" linking to `/onboarding/1`

- Export as default function component

### B1.2 — Create DocumentationCreateur.jsx
- **File**: `src/components/pages/DocumentationCreateur.jsx`
- **Model**: sonnet
- Create a comprehensive documentation page for content creators (créateurs). All content in French.
- Same structure as B1.1 but adapted for creators.

**Sections** (each wrapped in `<section className="doc-section">`):

1. **Quick nav** (`.doc-nav`)

2. **Introduction** (id="intro"): What is CUTLAB — find verified video editors for your content. Browse, compare, contact directly.

3. **Parcourir le catalogue** (id="catalogue"): How to browse editors. Explain the EditorCard info: name, availability badge, skills, formats, level, pricing range, rating. Click to see full profile (EditorDetail).

4. **Contacter un monteur** (id="contact"): How to send a contact request. Inline form on catalog card. Write a short message describing your needs.

5. **Créer un projet** (id="projet"): How to create a project (via "Créer" button or `/project/new`). Fields: title, description, format, niche, software, deliverables, budget, deadline.

6. **Messagerie** (id="messagerie"): How conversations work after contact. Exchange messages. Receive structured proposals (ProjectProposalCard with budget, deliverables, deadline, revisions).

7. **Gérer mes projets** (id="projets"): Track projects in "Mes projets". View candidates, accept/refuse applications.

8. **Comprendre les tarifs** (id="tarifs"): How pricing works. Explain price range on cards. Refer to monteur levels. Budget is negotiated per project.

9. **CTA section** (`.doc-cta`): "Prêt à trouver votre monteur ?" with button "Parcourir les monteurs →" linking to `/catalog`

### B2.1 — Create admindoc.md
- **File**: `admindoc.md` (project root)
- **Model**: sonnet
- Read `src/components/pages/admin/AdminUsers.jsx` and `src/components/pages/admin/AdminReports.jsx` to understand the admin features accurately.
- Read `src/lib/demoData.js` for demo account info.
- Read `supabase/migrations/` directory listing for migration names.

Write a comprehensive admin guide in French covering:

1. **Accès admin**: Routes `/admin/users` and `/admin/reports`. Requires `role='admin'` in `profiles` table. How to set a user as admin: `UPDATE profiles SET role = 'admin' WHERE id = '<user-id>'`

2. **Gestion des utilisateurs** (`/admin/users`): What the page shows, how to search, suspend/restore accounts, view profile details

3. **Modération** (`/admin/reports`): How reports work, reviewing mod_reports, resolving/dismissing

4. **Base de données Supabase**: Key tables overview with columns:
   - profiles, contact_requests, messages, offers, projects, notifications, mod_reports, favorites, deliverable_rounds, project_reviews

5. **Migrations SQL**: List all migration files from `supabase/migrations/` in order. How to apply them.

6. **Comptes démo**: Demo accounts config, where credentials are stored

7. **Variables d'environnement**: Required `.env` vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

8. **Build et déploiement**: `npm run build`, output in `dist/`, Vercel config in `vercel.json`

9. **Politiques RLS**: Summary of Row Level Security policies per table

10. **Dépannage courant**: Common issues and solutions

### B3.1 — Create LandingYoutubeurGaming.jsx
- **File**: `src/components/pages/personas/LandingYoutubeurGaming.jsx`
- **Model**: sonnet
- **Persona**: YouTubeur Gaming — creator who posts 3-5 videos/week, overwhelmed by editing
- **Structure** (use `.persona-page`, `.persona-header`, `.persona-hero`, `.persona-section`, etc.):

```jsx
import { Link } from 'react-router-dom'
export default function LandingYoutubeurGaming() {
  return (
    <div className="persona-page">
      <header className="persona-header">
        <Link to="/" className="logo">CUT<span>LAB</span></Link>
      </header>
      {/* hero, sections, CTA */}
    </div>
  )
}
```

- **Hero**: h1: "Tu postes 3 vidéos par semaine. <em>Qui les monte ?</em>" / subtitle about scaling without burning out / CTA "Trouver mon monteur →" to `/catalog`
- **Pain points section** (h2: "Ce que tu vis au quotidien"): 4 items with icons — too many videos to edit alone, quality dropping, can't scale, spending evenings editing instead of creating
- **Features section** (h2: "Ce que CUTLAB change pour toi"): 3-column grid — Monteurs spécialisés Gaming (filtered by niche), Tarifs transparents (price range visible), Pipeline intégré (track all projects)
- **How it works** (h2: "Comment ça marche"): 3 steps — Browse catalog → Contact a monteur → Start collaborating
- **Stats row**: "100% gratuit", "0% commission", "En 15 min" (time to find a monteur)
- **Bottom CTA**: "Prêt à scaler ton contenu ?" + button "Parcourir les monteurs Gaming →" to `/catalog`

### B3.2 — Create LandingInfluenceurLifestyle.jsx
- **File**: `src/components/pages/personas/LandingInfluenceurLifestyle.jsx`
- **Model**: sonnet
- **Persona**: Influenceur Lifestyle — polished Reels/TikToks + YouTube
- Same `.persona-page` structure as B3.1
- **Hero**: h1: "Ton feed mérite un monteur qui <em>comprend ton univers</em>." / subtitle about multi-platform, aesthetic content
- **Pain points**: 4 items — multi-platform editing (YT + Reels + TikTok), finding someone who gets the aesthetic, quality inconsistency, too expensive agencies
- **Features**: Formats courts spécialisés, Filtres par niche (Lifestyle, Fashion), Portfolio consultable, Messagerie directe
- **How it works**: 3 steps
- **Stats row**: same pattern
- **CTA**: "Parcourir les monteurs →" to `/catalog`

### B3.3 — Create LandingCoachEntrepreneur.jsx
- **File**: `src/components/pages/personas/LandingCoachEntrepreneur.jsx`
- **Model**: sonnet
- **Persona**: Coach / Entrepreneur — pro business content, courses, webinars
- Same structure
- **Hero**: h1: "Votre contenu pro, monté par un expert. <em>Sans passer par une agence.</em>"
- **Pain points**: produce content regularly, can't afford agencies, need reliability and deadlines met, inconsistent freelancers
- **Features**: Monteurs expérimentés (experience filter), Formats Corporate/B2B, Tarifs sans surprise, Gestion de projet intégrée, Offres structurées
- **CTA**: "Trouver mon monteur →" to `/catalog`

### B3.4 — Create LandingFreelanceYoutube.jsx
- **File**: `src/components/pages/personas/LandingFreelanceYoutube.jsx`
- **Model**: sonnet
- **Persona**: Freelance YouTube Editor — tired of generic marketplaces
- Same structure
- **Hero**: h1: "Arrête de chercher des clients. <em>Laisse-les te trouver.</em>"
- **Pain points**: Fiverr/Malt fatigue, high commissions, clients who don't understand, portfolio not showcased
- **Features**: Catalogue dédié montage vidéo, Profil complet (skills/portfolio/level/pricing), Créateurs viennent à vous, 0 commission, Messagerie directe
- **How it works**: 3 steps (S'inscrire → Publier profil → Recevoir demandes)
- **CTA**: "Rejoindre le catalogue →" to `/onboarding/1`

### B3.5 — Create LandingMotionDesigner.jsx
- **File**: `src/components/pages/personas/LandingMotionDesigner.jsx`
- **Model**: sonnet
- **Persona**: Motion Designer — AE/motion specialist
- Same structure
- **Hero**: h1: "Tu fais du motion, pas du montage basique. <em>Montre-le.</em>"
- **Pain points**: boring projects on marketplaces, no motion filter, clients confuse editing and motion, undervalued skills
- **Features**: Motion design comme skill, Tarifs motion dédiés (3 lignes), Niveaux qui valorisent l'expertise, Portfolio visible
- **CTA**: "Créer mon profil motion →" to `/onboarding/1`

### B3.6 — Create LandingEtudiantAudiovisuel.jsx
- **File**: `src/components/pages/personas/LandingEtudiantAudiovisuel.jsx`
- **Model**: sonnet
- **Persona**: Student — first portfolio, first clients
- Same structure
- **Hero**: h1: "Premier portfolio ? <em>Premiers clients.</em> CUTLAB te lance."
- **Pain points**: no pro experience, no network, no client portfolio, don't know how to price
- **Features**: Inscription gratuite, Onboarding guidé (7 étapes), Niveaux progressifs, Tarifs de référence, Premiers clients sans prospection
- **CTA**: "Commencer gratuitement →" to `/onboarding/1`

### B4.1 — Register all routes in App.jsx
- **File**: `src/App.jsx`
- **Model**: sonnet
- **Depends on**: B1.1, B1.2, B3.1, B3.2, B3.3, B3.4, B3.5, B3.6
- Add lazy imports for all new pages:
```js
const DocumentationMonteur = lazy(() => import('./components/pages/DocumentationMonteur'))
const DocumentationCreateur = lazy(() => import('./components/pages/DocumentationCreateur'))
const LandingYoutubeurGaming = lazy(() => import('./components/pages/personas/LandingYoutubeurGaming'))
const LandingInfluenceurLifestyle = lazy(() => import('./components/pages/personas/LandingInfluenceurLifestyle'))
const LandingCoachEntrepreneur = lazy(() => import('./components/pages/personas/LandingCoachEntrepreneur'))
const LandingFreelanceYoutube = lazy(() => import('./components/pages/personas/LandingFreelanceYoutube'))
const LandingMotionDesigner = lazy(() => import('./components/pages/personas/LandingMotionDesigner'))
const LandingEtudiantAudiovisuel = lazy(() => import('./components/pages/personas/LandingEtudiantAudiovisuel'))
```
- Add routes AFTER the legal pages block and BEFORE the onboarding route:
```jsx
{/* Documentation — public */}
<Route path="/guide/monteur" element={<DocumentationMonteur />} />
<Route path="/guide/createur" element={<DocumentationCreateur />} />

{/* Persona landing pages — public, dedicated */}
<Route path="/pour/youtubeur-gaming" element={<LandingYoutubeurGaming />} />
<Route path="/pour/influenceur-lifestyle" element={<LandingInfluenceurLifestyle />} />
<Route path="/pour/coach-entrepreneur" element={<LandingCoachEntrepreneur />} />
<Route path="/pour/freelance-youtube" element={<LandingFreelanceYoutube />} />
<Route path="/pour/motion-designer" element={<LandingMotionDesigner />} />
<Route path="/pour/etudiant-audiovisuel" element={<LandingEtudiantAudiovisuel />} />
```

### B4.2 — Add guide links to Landing.jsx
- **File**: `src/components/pages/Landing.jsx`
- **Model**: sonnet
- **Depends on**: B1.1, B1.2
- Add `import { Link } from 'react-router-dom'` at the top (if not already imported)
- AFTER the `.landing-demo-section` closing div and BEFORE the closing `.landing` div, add:
```jsx
<div className="landing-guides">
  <div className="landing-guides-label">Guides d'utilisation</div>
  <div className="landing-guides-links">
    <Link to="/guide/monteur">Guide monteur →</Link>
    <Link to="/guide/createur">Guide créateur →</Link>
  </div>
</div>
```

## Execution order
1. **B0.1** first (CSS foundation — all other tasks need these classes)
2. **B1.1, B1.2, B2.1, B3.1, B3.2, B3.3, B3.4, B3.5, B3.6** in parallel (independent page/file creation)
3. **B4.1, B4.2** last (route registration + landing links — depend on pages existing)

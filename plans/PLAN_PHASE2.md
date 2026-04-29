# Plan Phase 2 — CUTLAB

> Branche de planification uniquement — aucun code à implémenter ici.  
> À lancer après validation commerciale (traction utilisateurs confirmée).

Regroupe : Accessibilité WCAG, Observabilité, Emails transactionnels, PWA, SEO, i18n, Web Push.

---

## Contexte & prérequis

Ces axes ne sont pas bloquants pour le MVP mais deviennent prioritaires dès que :
- Le produit est publiquement accessible avec trafic réel
- Des obligations légales EU d'accessibilité s'appliquent (RGAA, EN 301 549)
- Des métriques produit sont nécessaires pour piloter la croissance
- Le trafic organique devient un canal d'acquisition

---

## AX1 — Accessibilité WCAG 2.1 AA

**Obligation légale EU** dès qu'un service public ou commercial dépasse certains seuils.

### AX1.1 — Audit outillé

Outils à utiliser :
- **axe DevTools** (extension Chrome) sur toutes les routes
- **WAVE** (web.aimlab.com) pour rapport visuel
- **Lighthouse** (tab Accessibility) : objectif score ≥ 90

Routes à auditer : `/`, `/catalog`, `/editor/:id`, `/onboarding/*`, `/messaging/:id`, `/project/:id`

### AX1.2 — Corrections systématiques

**Images :**
```jsx
// Avant
<img src={profile.avatar_url} className="catalog-card-media" />
// Après
<img src={profile.avatar_url} alt={`Photo de profil de ${name}`} className="catalog-card-media" loading="lazy" />
```

**Boutons sans texte visible :**
```jsx
// Avant
<button onClick={close}>✕</button>
// Après
<button onClick={close} aria-label="Fermer">✕</button>
```

**Inputs sans label :**
```jsx
// Avant
<input type="text" placeholder="Rechercher..." />
// Après
<label htmlFor="search-input" className="sr-only">Rechercher un monteur</label>
<input id="search-input" type="text" placeholder="Rechercher..." />
```

Ajouter dans global.css :
```css
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); border: 0;
}
```

**Focus visible :**
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Skip link (toutes les pages) :**
```jsx
// Dans AppLayout, avant <TopNav>
<a href="#main-content" className="skip-link">Sauter au contenu principal</a>
// Sur la main.main, ajouter id="main-content"
```

### AX1.3 — Navigation clavier

- **Onboarding** : vérifier tabindex logique sur les 7 steps (formulaires à onglets)
- **CollabTrackerDrawer** : focus trap quand ouvert + Escape pour fermer (framer-motion + `focus-trap-react` ou implémentation manuelle)
- **Modales** (contact form inline) : même traitement
- **Bottom nav mobile** : s'assurer que les items ont des labels `aria-label`

**Pattern focus trap :**
```jsx
useEffect(() => {
  if (!isOpen) return
  const focusable = drawerRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  focusable?.[0]?.focus()
  const handleKeyDown = (e) => { if (e.key === 'Escape') onClose() }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [isOpen])
```

---

## OB1 — Observabilité

### OB1.1 — Sentry (crash tracking)

**Installation :**
```
npm install @sentry/react
```

**Configuration dans main.jsx :**
```js
import * as Sentry from '@sentry/react'
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.1,
})
```

**Ajout dans ErrorBoundary.jsx :**
```js
componentDidCatch(error, info) {
  Sentry.captureException(error, { extra: info })
}
```

**User context (dans OnboardingContext, après login) :**
```js
Sentry.setUser({ id: user.id, role: userRole })
// Sur logout :
Sentry.setUser(null)
```

**Env vars à ajouter dans .env.example :**
```
VITE_SENTRY_DSN=https://xxx@sentry.io/yyy
```

### OB1.2 — Analytics produit (PostHog)

PostHog recommandé : open-source, RGPD-friendly, auto-hébergeable (Docker) ou cloud EU.

**Installation :**
```
npm install posthog-js
```

**Events clés à tracker :**

| Event | Trigger | Propriétés |
|-------|---------|-----------|
| `profile_published` | `saveProfile('published')` | `{ level, score }` |
| `offer_sent` | `sendOffer()` dans MessagingContext | `{ budget, format }` |
| `offer_accepted` | Créateur accepte dans CollabTracker | `{ budget }` |
| `project_created` | `createProject()` dans ProjectContext | `{ format, budget_range }` |
| `contact_request_sent` | `sendContactRequest()` | `{ editor_level }` |
| `review_submitted` | `submitReview()` dans CollabContext | `{ rating }` |

**Pattern d'appel :**
```js
import posthog from 'posthog-js'
posthog.capture('offer_sent', { budget: offer.budget, format: offer.format })
```

**Éviter GA4** : transfert données vers USA, complexité RGPD, consent banner obligatoire.

### OB1.3 — Structured logging (Supabase Functions)

Pour toutes les Edge Functions existantes et futures :
```ts
function log(level: 'info' | 'warn' | 'error', action: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ level, action, timestamp: new Date().toISOString(), ...data }))
}
// Usage :
log('info', 'delete_account', { user_id: userId })
```

**Table `audit_logs` (optionnel, pour conformité) :**
```sql
CREATE TABLE audit_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action     text NOT NULL,
  metadata   jsonb,
  created_at timestamptz DEFAULT now()
);
-- INSERT via service role uniquement — pas de RLS write pour les users
```

---

## EM1 — Emails transactionnels

**Service recommandé :** Resend (simple, API moderne, quota gratuit généreux).  
Alternative : Postmark (meilleure délivrabilité, plus cher).

**Installation :**
```
npm install resend  # dans les Edge Functions
```

### EM1.1 — Events à déclencher

| Déclencheur | Destinataire | Template |
|-------------|-------------|---------|
| Offre reçue | Monteur | "Vous avez reçu une offre de mission" |
| Offre acceptée | Créateur | "Votre offre a été acceptée" |
| Livrable partagé | Créateur | "Un livrable est disponible pour révision" |
| Révision demandée | Monteur | "Une révision a été demandée" |
| Mission terminée | Les deux | "Mission terminée — laissez un avis" |
| Inscription | Nouveau user | "Bienvenue sur CUTLAB" |

### EM1.2 — Edge Function `send-email`

```ts
// supabase/functions/send-email/index.ts
import { Resend } from 'resend'
const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

// Templates HTML dark theme CUTLAB
// Couleurs : bg #0a0a0a, accent #d4f000, text #f0f0f0
// Fonts : system-ui (pas de Google Fonts dans les emails)
```

### EM1.3 — Env vars à ajouter

```
RESEND_API_KEY=re_xxx
CUTLAB_EMAIL_FROM=noreply@cutlab.io
```

---

## PWA1 — Progressive Web App

### PWA1.1 — Manifest

```json
// public/manifest.json
{
  "name": "CUTLAB",
  "short_name": "CUTLAB",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

```html
<!-- index.html -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0a0a0a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

### PWA1.2 — Service Worker (vite-plugin-pwa)

```
npm install -D vite-plugin-pwa
```

```js
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,woff2}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/.*\.supabase\.co\/storage/,
          handler: 'CacheFirst',
          options: { cacheName: 'supabase-storage', expiration: { maxAgeSeconds: 86400 } },
        }],
      },
    }),
  ],
})
```

### PWA1.3 — UX Install prompt

```jsx
// src/hooks/usePWAInstall.js
export function usePWAInstall() {
  const [prompt, setPrompt] = useState(null)
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); setPrompt(e)
    })
  }, [])
  return { canInstall: !!prompt, install: () => prompt?.prompt() }
}
```

---

## SEO1 — SEO & Partageabilité

### SEO1.1 — react-helmet-async

```
npm install react-helmet-async
```

**Titres par route :**
```jsx
// Catalog
<Helmet><title>Catalog — Trouvez votre monteur | CUTLAB</title></Helmet>
// EditorDetail
<Helmet><title>{name} — Monteur vidéo | CUTLAB</title></Helmet>
// ProjectDetail
<Helmet><title>{project.title} — CUTLAB</title></Helmet>
```

### SEO1.2 — Open Graph sur profils et projets

```jsx
// EditorDetail
<Helmet>
  <meta property="og:title" content={`${name} — Monteur vidéo`} />
  <meta property="og:description" content={profile.bio?.slice(0, 150)} />
  <meta property="og:image" content={profile.avatar_url} />
  <meta property="og:type" content="profile" />
</Helmet>
```

### SEO1.3 — Fichiers statiques

```
// public/robots.txt
User-agent: *
Allow: /catalog
Allow: /editor/
Disallow: /messaging
Disallow: /admin
Sitemap: https://cutlab.io/sitemap.xml
```

Sitemap généré au build via script Vite ou manuellement.

**Note :** SSR/SSG non prioritaire pour une marketplace B2B avec auth. Les pages publiques (catalog, profils) sont indexables côté client — suffisant pour MVP.

---

## I18N1 — Internationalisation (préparation)

**Objectif :** Ne pas bloquer une expansion EN plus tard en extrayant les strings dès maintenant.

### I18N1.1 — Installation

```
npm install i18next react-i18next i18next-browser-languagedetector
```

### I18N1.2 — Structure

```
src/
  i18n/
    index.js          # config i18next
    locales/
      fr/
        common.json   # boutons, labels génériques
        catalog.json  # strings Catalog
        onboarding.json
        messaging.json
```

### I18N1.3 — Migration progressive

Wrapper les strings en `t('key')` namespace par namespace :
```jsx
// Avant
<button>Envoyer la proposition</button>
// Après
import { useTranslation } from 'react-i18next'
const { t } = useTranslation('messaging')
<button>{t('send_proposal')}</button>
```

Priorité de migration : strings UI répétitives en premier (boutons, labels, toasts), puis textes longs (bios, descriptions).

---

## WP1 — Web Push Notifications

**Dépend de PWA1** (service worker requis).

### WP1.1 — Architecture

```
Supabase Realtime (INSERT notification)
    → Supabase Edge Function trigger
        → web-push (npm)
            → Browser Push API
                → Affichage notification OS
```

### WP1.2 — Implémentation

**Edge Function `send-push` :**
```ts
import webpush from 'npm:web-push'
webpush.setVapidDetails('mailto:push@cutlab.io', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
await webpush.sendNotification(subscription, JSON.stringify({ title, body, icon, url }))
```

**Opt-in UX dans l'app :**
```jsx
async function requestPushPermission() {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return
  const sub = await sw.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: VAPID_PUBLIC })
  await supabase.from('push_subscriptions').upsert({ user_id: user.id, subscription: sub })
}
```

**Table à créer :**
```sql
CREATE TABLE push_subscriptions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES profiles(id) ON DELETE CASCADE,
  subscription jsonb NOT NULL,
  created_at   timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
```

**Env vars :**
```
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

---

## Feuille de route Phase 2

```
Semaines 1–2 : OB1 (Sentry + PostHog) — ROI immédiat sur la visibilité crashes
Semaines 2–3 : EM1 (emails transactionnels) — rétention et engagement
Semaines 3–4 : AX1 (accessibilité WCAG) — obligation légale, audit + correctifs
Semaines 4–5 : SEO1 + PWA1 (découvrabilité + UX mobile)
Semaines 5–6 : I18N1 (préparation expansion) + WP1 (push — si PWA déployée)
```

**Estimation totale Phase 2 : 6–8 semaines** — 1 dev + 1 designer (templates email + icônes PWA)

---

## Métriques de succès Phase 2

| Métrique | Cible |
|---------|-------|
| Lighthouse Accessibility | ≥ 90 |
| Lighthouse SEO | ≥ 90 |
| Lighthouse PWA | ≥ 80 |
| Taux d'ouverture emails | ≥ 40% |
| Crash rate (Sentry) | < 0.5% sessions |
| Opt-in push | ≥ 30% utilisateurs actifs |

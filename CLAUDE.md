# CUTLAB — Context for Claude Code

## Stack
- Vite + React 18 (no TypeScript)
- Fonts: DM Sans (body), Syne (headings, logo)
- Dark theme: accent `#d4f000`, bg `#0a0a0a`, surface `#111111`
- Supabase (auth, DB, storage)
- react-router-dom (BrowserRouter)
- framer-motion (page transitions, list stagger, tab indicators)

## Roles (mutually exclusive)
- **Monteur** (`role='editor'`): video editor. Home = `/projects`
- **Createur** (`role='creator'`): content creator. Home = `/catalog`

## Auth & Access Control

### Route protection (App.jsx)
Three guard components wrap routes:
- **`RequireAuth`**: redirects to `/` if not logged in (waits for `authReady` to avoid flash).
- **`RequireRole({ allowed })`**: redirects to `/` if user's role is not in `allowed` list.
- **`PublicOnly`**: redirects logged-in users to their role-appropriate home.

### Access rules
| Role | Accessible pages |
|------|-----------------|
| **Creator** | `/catalog`, `/messaging`, `/messaging/:id`, `/offer/new`, `/offer/preview`, `/project/new`, `/project/:id`, `/my-projects` |
| **Editor** | `/projects`, `/editor`, `/messaging`, `/messaging/:id`, `/pipeline`, `/project/:id` |
| **Not logged in** | `/` (Landing), `/catalog`, `/creator-signup`, `/onboarding/:step` (step 1 only for auth) |

- Logged-in users cannot access the Landing page — they are auto-redirected to their home.
- Logged-out users cannot access most app routes — they are redirected to Landing. **Exception:** `/catalog` is open to guests (so they can browse monteurs before signing up).
- **Editors are blocked from `/catalog`** (auto-redirected to `/projects`) — the catalog is a creator-facing discovery surface.
- Each user only sees their own projects, messages, and offers (queries scoped by `user.id`).

### Auth state
- `user`: Supabase user object (null when logged out).
- `authReady`: boolean, true once the initial session check completes. Guards render nothing until this is true.
- `userRole`: derived from `formData.role`. Loaded from DB on session restore (page refresh).

### Logout (`signOut`)
1. Calls `supabase.auth.signOut()`.
2. If `demoMode === 'onboarding'`, deletes the temporary profile from DB.
3. Clears **all** `localStorage` and `sessionStorage` (prevents data leaks between accounts).
4. Resets all in-memory state (formData, step, level, demoMode).
5. Navigates to `/`.

### Demo modes
Three demo modes, controlled by `demoMode` state in OnboardingContext:

| Mode | Trigger | Behavior |
|------|---------|----------|
| **`'creator'`** | Landing "Démo créateur" / CreatorSignup "Compte démo créateur" | Logs into `DEMO_CREATOR_EMAIL` account, redirects to `/catalog` |
| **`'editor'`** | Landing "Démo monteur" | Logs into `DEMO_EMAIL` account, redirects to `/projects` |
| **`'onboarding'`** | Landing "Tester l'onboarding" / Step1 "Tester l'onboarding" | Creates a throwaway Supabase account with unique email, redirects to step 2. **Account profile is deleted on logout.** |

Demo credentials are in `src/lib/demoData.js`. Demo accounts (creator/editor) must be pre-created in Supabase with matching credentials.

## Routes
| Path | Component | Layout | Guard |
|------|-----------|--------|-------|
| `/` | Landing | none | PublicOnly |
| `/onboarding/:step` | OnboardingLayout (Sidebar + Steps 1-8) | none | none (step 1 handles auth) |
| `/creator-signup` | CreatorSignup | none | none (handles both logged-in and anonymous) |
| `/catalog` | Catalog | AppLayout | RequireAuth |
| `/projects` | MesProjetsMonteur | AppLayout | RequireAuth + RequireRole(editor) |
| `/editor` | ProfileEditor | AppLayout (fill) | RequireAuth + RequireRole(editor) |
| `/messaging` | MessagingHub | AppLayout | RequireAuth |
| `/messaging/:id` | ChatView | AppLayout (fill) | RequireAuth |
| `/pipeline` | EditorPipeline | AppLayout (fill) | RequireAuth + RequireRole(editor) |
| `/offer/new` | OfferForm | AppLayout | RequireAuth + RequireRole(creator) |
| `/offer/preview` | OfferPreview | AppLayout | RequireAuth + RequireRole(creator) |
| `/project/new` | ProjectForm | AppLayout | RequireAuth + RequireRole(creator) |
| `/project/:id` | ProjectDetail | AppLayout | RequireAuth |
| `/my-projects` | MyProjects | AppLayout | RequireAuth + RequireRole(creator) |

## Layout system
- **AppLayout** (`src/components/layout/AppLayout.jsx`): wraps authenticated routes. Contains TopNav + Outlet (with AnimatePresence) + BottomNav + Toast.
- **TopNav**: desktop only, role-based tabs, animated indicator (layoutId).
- **BottomNav**: mobile = in-flow flex child (NOT position:fixed). Desktop = hidden.
- **PageTitle**: sticky sub-header with title + action buttons (`position: sticky; top: 0`).
- **OnboardingLayout**: Sidebar + Steps 1-7 (+ Step 8 success) with progress bar. Separate from AppLayout.

### Mobile viewport strategy
- `.app-layout` is `position: fixed` on mobile (no `bottom`, height via JS).
- `useViewportHeight()` hook tracks `window.visualViewport.height` — handles keyboard open/close.
- **Fill pages** (editor, chat, pipeline): `app-layout-content--fill` disables outer scroll. Page manages its own internal scroll.
- **Normal pages** (catalog, projects, messaging): outer `overflow-y: auto` scrolls naturally.
- Pages never use `min-height: 100vh` inside AppLayout.

## Key contexts
- **OnboardingContext** (`src/context/OnboardingContext.jsx`): auth (Supabase), formData, goTo* navigation (uses navigateRef from React Router), saveProfile, loadProfile, demo mode, signOut with full cleanup.
- **MessagingContext** (`src/context/MessagingContext.jsx`): requests, messages, offers, signUpCreator.
- **ProjectContext** (`src/context/ProjectContext.jsx`): project CRUD, candidatures (via contact_requests with project_id), notifications (30s polling), application management (accept/refuse cascade). Auto-resets on logout.

## Navigation pattern
- `navigateRef` in OnboardingContext is injected by `NavigationBridge` component (in main.jsx).
- All `goTo*` functions call `navigateRef.current('/path')` — components don't need to import useNavigate.
- `goToHome()` redirects to role-appropriate home.

## Toast notifications
- `src/components/ui/Toast.jsx` — CustomEvent-based, no context/provider.
- Usage: `import { toast } from '../ui/Toast'; toast.success('msg'); toast.error('msg')`
- Auto-dismiss 3s, max 3 stacked, framer-motion animations.

## Animation conventions
- `AnimatedList` / `AnimatedItem` for staggered list appearances (spring, 0.06s stagger).
- Page transitions: fade + slide (0.25s ease) via AnimatePresence in AppLayout.
- Tab indicators: `layoutId` spring animation.
- `whileTap={{ scale: 0.98 }}`, `whileHover={{ scale: 1.01 }}` on list items.

## CSS
- Single file: `src/styles/global.css`
- Mobile breakpoint: `@media (max-width: 768px)`
- Touch targets: min 44px on mobile
- `.catalog-header-btn` is a shared utility button class (not tied to catalog)
- Fill pages use `flex: 1; min-height: 0; overflow: hidden` — internal scroll via child elements
- Chat: `flex-shrink: 0` on header/input/actions to survive keyboard resize

## Onboarding flow (7 steps + success)
1. **Step1Account** — auth (email/password or OAuth)
2. **Step2Identity** — prénom, nom, avatar, langues, disponibilité
3. **Step3Skills** — compétences, formats, niches, expérience, logiciels
4. **Step4Portfolio** — liens clips, chaînes créditées
5. **Step5Presentation** — bio, types de mission, délai de réponse, **liens sociaux structurés** (Instagram, TikTok, YouTube, Portfolio, LinkedIn)
6. **Step6Level** — révélation du niveau avec animation "unlock" (badge + particules + score counter) via [LevelUnlockAnimation](src/components/ui/LevelUnlockAnimation.jsx). Respecte `prefers-reduced-motion`.
7. **Step7Preview** — aperçu du profil avant publication
8. **Step8Success** — écran post-publication

Les tarifs ne sont PAS demandés pendant l'onboarding. Ils sont configurés depuis ProfileEditor (section-pricing) après révélation du niveau.

## Pricing system
- Grille officielle (7 niveaux × 7 tarifs) dans [`src/constants/pricing.js`](src/constants/pricing.js) : `PRICING_ROWS`, `PRICING_GRID`, `ADJUSTMENT_OPTIONS` (-10, 0, +10).
- Fonctions pures dans [`src/lib/pricing.js`](src/lib/pricing.js) : `computePricing(levelIndex, adjustments)`, `computePricingRange`, `applyAdjustment`, `emptyPricingAdjustments`.
- Stockage DB : `profiles.pricing` (jsonb) = `{ baseline_level, adjustments }`. Prix finaux calculés côté client (source de vérité = grille officielle).
- Edition : ProfileEditor section-pricing affiche 7 lignes (3 montage + 3 motion + miniature) avec toggle 3 positions ±10%.
- Catalog : `EditorCard` affiche fourchette "X – Y €" via `computePricingRange`. Pas de range si `assigned_level` null.
- EditorDetail : grille complète affichée (7 lignes).

## Social links system
- Stockage DB : `profiles.social_links` (jsonb) = `{ instagram?, tiktok?, youtube?, portfolio?, linkedin? }`.
- Config dans [`src/constants/options.js`](src/constants/options.js) : `SOCIAL_PLATFORMS` + `buildSocialLinkUrl`.
- Composants : [`SocialLinksInput`](src/components/ui/SocialLinksInput.jsx) (éditeur, 5 champs), [`SocialLinksDisplay`](src/components/ui/SocialLinksDisplay.jsx) (icônes cliquables).
- Icônes affichées uniquement sur EditorDetail (page profil), pas sur EditorCard (catalog).

## Messaging & proposals
- **ProjectProposalCard** ([src/components/messaging/ProjectProposalCard.jsx](src/components/messaging/ProjectProposalCard.jsx)) : card structurée affichée dans ChatView avec tous les détails d'une offer (title, description, deliverables, format, deadline, budget, revisions, status badge).
- Wording pro : "Offre de mission" (pas "projet"), "Envoyer la proposition" (pas "Confirmer l'envoi"), vouvoiement dans les formulaires.

## Post-onboarding level-up
- Quand `saveProfile('published')` détecte `levelIndex > prevLevelIndex`, un `toast.success("Niveau débloqué : [emoji] [nom]")` est émis. Pas de rejeu d'animation (réservée au 1er unlock onboarding).

## DB migrations (ordered, destructive)
Migrations SQL à la racine du repo, à exécuter dans cet ordre avec backup préalable :
1. [`supabase-migration-social-links-jsonb.sql`](supabase-migration-social-links-jsonb.sql) — `social_links` text → jsonb
2. [`cleanup-videos-bucket.md`](cleanup-videos-bucket.md) + [`scripts/cleanup-videos-bucket.mjs`](scripts/cleanup-videos-bucket.mjs) — wipe orphelins du bucket `videos`
3. [`supabase-migration-drop-legacy-fields.sql`](supabase-migration-drop-legacy-fields.sql) — DROP `username` + `presentation_video_url`
4. [`supabase-migration-pricing.sql`](supabase-migration-pricing.sql) — ADD `pricing` jsonb + DROP `hourly_rate` + DROP `delivery_time`

## Conventions
- Each step: reads from `formData` context, calls `save()` + `goToStep()` on navigation.
- Sets for multi-select in local state, converted to arrays before context/DB.
- French UI, code comments in English.
- Update CLAUDE.md and MEMORY.md after every significant feature merge to main.

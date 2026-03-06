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
| **Creator** | `/catalog`, `/messaging`, `/messaging/:id`, `/offer/new`, `/offer/preview` |
| **Editor** | `/projects`, `/editor`, `/messaging`, `/messaging/:id`, `/pipeline`, `/catalog` |
| **Not logged in** | `/` (Landing), `/creator-signup`, `/onboarding/:step` (step 1 only for auth) |

- Logged-in users cannot access the Landing page — they are auto-redirected to their home.
- Logged-out users cannot access any app route — they are redirected to Landing.
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
| `/onboarding/:step` | OnboardingLayout (Sidebar + Steps 1-9) | none | none (step 1 handles auth) |
| `/creator-signup` | CreatorSignup | none | none (handles both logged-in and anonymous) |
| `/catalog` | Catalog | AppLayout | RequireAuth |
| `/projects` | MesProjetsMonteur | AppLayout | RequireAuth + RequireRole(editor) |
| `/editor` | ProfileEditor | AppLayout (fill) | RequireAuth + RequireRole(editor) |
| `/messaging` | MessagingHub | AppLayout | RequireAuth |
| `/messaging/:id` | ChatView | AppLayout (fill) | RequireAuth |
| `/pipeline` | EditorPipeline | AppLayout (fill) | RequireAuth + RequireRole(editor) |
| `/offer/new` | OfferForm | AppLayout | RequireAuth + RequireRole(creator) |
| `/offer/preview` | OfferPreview | AppLayout | RequireAuth + RequireRole(creator) |

## Layout system
- **AppLayout** (`src/components/layout/AppLayout.jsx`): wraps authenticated routes. Contains TopNav + Outlet (with AnimatePresence) + BottomNav + Toast.
- **TopNav**: desktop only, role-based tabs, animated indicator (layoutId).
- **BottomNav**: mobile = in-flow flex child (NOT position:fixed). Desktop = hidden.
- **PageTitle**: sticky sub-header with title + action buttons (`position: sticky; top: 0`).
- **OnboardingLayout**: Sidebar + Steps 1-9 with progress bar. Separate from AppLayout.

### Mobile viewport strategy
- `.app-layout` is `position: fixed` on mobile (no `bottom`, height via JS).
- `useViewportHeight()` hook tracks `window.visualViewport.height` — handles keyboard open/close.
- **Fill pages** (editor, chat, pipeline): `app-layout-content--fill` disables outer scroll. Page manages its own internal scroll.
- **Normal pages** (catalog, projects, messaging): outer `overflow-y: auto` scrolls naturally.
- Pages never use `min-height: 100vh` inside AppLayout.

## Key contexts
- **OnboardingContext** (`src/context/OnboardingContext.jsx`): auth (Supabase), formData, goTo* navigation (uses navigateRef from React Router), saveProfile, loadProfile, demo mode, signOut with full cleanup.
- **MessagingContext** (`src/context/MessagingContext.jsx`): requests, messages, offers, signUpCreator.

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

## Conventions
- Each step: reads from `formData` context, calls `save()` + `goToStep()` on navigation.
- Sets for multi-select in local state, converted to arrays before context/DB.
- French UI, code comments in English.
- Update CLAUDE.md and MEMORY.md after every significant feature merge to main.

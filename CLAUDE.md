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

## Routes
| Path | Component | Layout |
|------|-----------|--------|
| `/` | Landing | none (public) |
| `/onboarding/:step` | OnboardingLayout (Sidebar + Steps 1-9) | none |
| `/creator-signup` | CreatorSignup | none (public) |
| `/catalog` | Catalog | AppLayout |
| `/projects` | MesProjetsMonteur | AppLayout |
| `/editor` | ProfileEditor | AppLayout |
| `/messaging` | MessagingHub | AppLayout |
| `/messaging/:id` | ChatView | AppLayout |
| `/pipeline` | EditorPipeline | AppLayout |
| `/offer/new` | OfferForm | AppLayout |
| `/offer/preview` | OfferPreview | AppLayout |

## Layout system
- **AppLayout** (`src/components/layout/AppLayout.jsx`): wraps authenticated routes. Contains TopNav + Outlet (with AnimatePresence) + BottomNav.
- **TopNav**: desktop only, role-based tabs, animated indicator (layoutId).
- **BottomNav**: mobile only (fixed bottom), role-based tabs, animated indicator.
- **PageTitle**: optional sub-header with title + action buttons.
- **OnboardingLayout**: Sidebar + Steps 1-9 with progress bar. Separate from AppLayout.

## Key contexts
- **OnboardingContext** (`src/context/OnboardingContext.jsx`): auth (Supabase), formData, goTo* navigation (uses navigateRef from React Router), saveProfile.
- **MessagingContext** (`src/context/MessagingContext.jsx`): requests, messages, offers, signUpCreator.

## Navigation pattern
- `navigateRef` in OnboardingContext is injected by `NavigationBridge` component (in main.jsx).
- All `goTo*` functions call `navigateRef.current('/path')` — components don't need to import useNavigate.
- `goToHome()` redirects to role-appropriate home.

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

## Conventions
- Each step: reads from `formData` context, calls `save()` + `goToStep()` on navigation.
- Sets for multi-select in local state, converted to arrays before context/DB.
- French UI, code comments in English.

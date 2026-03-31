<!--
  === Sync Impact Report ===
  Version change: N/A (initial) -> 1.0.0
  Modified principles: N/A (initial creation)
  Added sections: Core Principles (7), Technology Constraints, Development Workflow, Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md: no update needed (Constitution Check section is generic)
    - .specify/templates/spec-template.md: no update needed (spec structure compatible)
    - .specify/templates/tasks-template.md: no update needed (task phases compatible)
  Follow-up TODOs: None
-->

# CUTLAB Constitution

## Core Principles

### I. Mobile-First UX

Every page and component MUST be designed for mobile viewports first,
then enhanced for desktop. Specific rules:

- Touch targets MUST be at least 44px on mobile.
- Mobile layout uses `position: fixed` with dynamic `visualViewport`
  height — pages MUST NOT use `min-height: 100vh` inside AppLayout.
- Fill pages (editor, chat, pipeline) MUST manage their own internal
  scroll. Normal pages (catalog, projects, messaging) use the outer
  scroll container.
- BottomNav MUST remain an in-flow flex child on mobile (never
  `position: fixed`).

**Rationale**: The primary audience (creators and editors) uses the
app on mobile devices. A broken mobile experience is a broken product.

### II. Role-Based Isolation

The two user roles (Monteur/editor, Createur/creator) are mutually
exclusive and MUST remain strictly separated:

- Route guards (`RequireAuth`, `RequireRole`, `PublicOnly`) MUST
  protect every authenticated route.
- Database queries MUST be scoped by `user.id` — no user may see
  another user's projects, messages, or offers.
- Navigation (TopNav, BottomNav, `goToHome()`) MUST adapt to the
  current user's role.
- Adding a new role requires updating guards, navigation, and
  home-redirect logic.

**Rationale**: Data privacy and UX clarity depend on strict role
boundaries. Leaking data between roles is a security incident.

### III. Single-File Styling

All styles MUST live in `src/styles/global.css`. No CSS modules,
CSS-in-JS, or component-scoped stylesheets:

- Mobile breakpoint: `@media (max-width: 768px)`.
- Dark theme tokens: accent `#d4f000`, bg `#0a0a0a`, surface
  `#111111`.
- Shared utility classes (e.g., `.catalog-header-btn`) MUST be
  documented with a comment if their name does not match their
  general purpose.

**Rationale**: A single CSS file keeps specificity predictable,
avoids duplication, and makes global theme changes trivial.

### IV. Consistent Motion Language

All animations MUST use framer-motion and follow these conventions:

- Page transitions: fade + slide (0.25s ease) via AnimatePresence.
- List animations: `AnimatedList` / `AnimatedItem` (spring, 0.06s
  stagger).
- Tab indicators: `layoutId` spring animation.
- Interactive feedback: `whileTap={{ scale: 0.98 }}`,
  `whileHover={{ scale: 1.01 }}` on tappable list items.
- Toast: framer-motion AnimatePresence, auto-dismiss 3s, max 3.

New animations MUST NOT introduce a second animation library or
deviate from these patterns without an explicit constitution amendment.

**Rationale**: Consistent motion makes the app feel polished and
professional. Mixing animation approaches creates jank and
maintenance burden.

### V. Auth Cleanup on Logout

The `signOut` function MUST perform a full state reset:

1. Call `supabase.auth.signOut()`.
2. Delete temporary demo profiles if `demoMode === 'onboarding'`.
3. Clear all `localStorage` and `sessionStorage`.
4. Reset all in-memory state (formData, step, level, demoMode).
5. Navigate to `/`.

No shortcut logout (e.g., just clearing the session cookie) is
acceptable. Every logout MUST prevent data leakage between accounts.

**Rationale**: Multiple demo modes and real accounts share the same
browser. Incomplete cleanup causes data leaks and ghost state bugs.

### VI. French UI, English Code

- All user-facing text (labels, buttons, toasts, placeholders) MUST
  be in French.
- All code (variable names, comments, commit messages, docs) MUST be
  in English.
- No mixing: a French string in a variable name or an English label
  in the UI is a defect.

**Rationale**: The target market is French-speaking. Developer
tooling, search, and collaboration work best in English.

### VII. Simplicity Over Abstraction

- The stack is vanilla React 18 + Vite. No TypeScript, no test
  framework, no CSS preprocessor.
- Do not introduce abstractions (HOCs, render props, generic
  utilities) for problems that appear only once.
- Prefer flat file structures and co-located logic over deep
  nesting.
- Each onboarding step reads from `formData`, calls `save()` +
  `goToStep()` — do not add middleware or state machines to this
  flow.

**Rationale**: The project is a v0 prototype. Premature abstraction
slows iteration and obscures intent. Complexity MUST be justified
by a real, current need.

## Technology Constraints

- **Runtime**: Vite 5 + React 18 (no TypeScript, no SSR).
- **Backend**: Supabase (auth, PostgreSQL, storage). No custom
  backend server.
- **Routing**: react-router-dom with BrowserRouter. Navigation via
  `navigateRef` in OnboardingContext — components MUST NOT import
  `useNavigate` directly for cross-page navigation.
- **Fonts**: DM Sans (body), Syne (headings, logo). No additional
  font families without justification.
- **Dependencies**: Adding a new npm dependency requires
  justification. The dependency count MUST stay minimal for a v0.

## Development Workflow

- One conversation scope per feature/bugfix/review.
- `CLAUDE.md` and `MEMORY.md` MUST be updated after every
  significant feature merge to main.
- Sets for multi-select in local component state, converted to
  arrays before writing to context or DB.
- Commits SHOULD be granular (one logical change per commit).
- Demo accounts (creator/editor) MUST be pre-created in Supabase
  with credentials matching `src/lib/demoData.js`.

## Governance

This constitution is the authoritative source of project-level rules
for CUTLAB. It supersedes ad-hoc decisions and informal conventions.

- **Amendments**: Any change to a Core Principle requires updating
  this file, incrementing the version, and propagating changes to
  dependent templates (plan, spec, tasks).
- **Versioning**: MAJOR for principle removal/redefinition, MINOR for
  new principles or material expansions, PATCH for wording
  clarifications.
- **Compliance**: All PRs and code reviews SHOULD verify alignment
  with these principles. Violations MUST be justified in the PR
  description.
- **Guidance**: Use `CLAUDE.md` for runtime development guidance and
  detailed architectural reference.

**Version**: 1.0.0 | **Ratified**: 2026-03-31 | **Last Amended**: 2026-03-31

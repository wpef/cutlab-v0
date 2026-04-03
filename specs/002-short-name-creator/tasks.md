# Tasks: Projet Createur — Publication & Mise en Relation Monteurs

**Input**: Design documents from `/specs/002-short-name-creator/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/supabase-api.md, quickstart.md

**Tests**: No automated tests (no test framework per constitution VII). Manual testing via quickstart.md checklist.

**Organization**: Tasks grouped by user story (US1–US6) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1–US6) this task belongs to
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database migration and shared constants extraction

- [x] T001 Run SQL migration in Supabase SQL Editor: create `projects` table, create `notifications` table, add `project_id` column + unique constraint to `contact_requests`, enable RLS and create all policies per `contracts/supabase-api.md` § "SQL Migration"
- [x] T002 [P] Extract shared field options (formats, niches, software, languages, experience levels, mission types) from hardcoded values in step components into `src/constants/options.js` — single source of truth for both profile onboarding and project forms
- [x] T003 [P] Update existing step components (Step2, Step3, Step5, Step6) to import options from `src/constants/options.js` instead of hardcoded arrays — verify no regressions in onboarding flow

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core context, routing, and navigation plumbing that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `src/context/ProjectContext.jsx` with provider, initial state (`projects: [], currentProject: null, applications: [], notifications: [], unreadCount: 0, loading: false`), and Supabase client reference. Wrap in App alongside OnboardingContext and MessagingContext in `src/main.jsx`
- [x] T005 [P] Implement core project CRUD functions in `src/context/ProjectContext.jsx`: `createProject(data)`, `updateProject(id, data)`, `fetchMyProjects()`, `fetchPublishedProjects(filters)`, `fetchProjectById(id)` — all using Supabase queries from `contracts/supabase-api.md` §1
- [x] T006 [P] Implement notification functions in `src/context/ProjectContext.jsx`: `createNotification(params)`, `fetchNotifications()`, `fetchUnreadCount()`, `markAsRead(id)`, `markAllAsRead()` — with 30s polling via `useEffect` + `setInterval` per research.md R10
- [x] T007 [P] Implement candidature functions in `src/context/ProjectContext.jsx`: `submitApplication(project)`, `withdrawApplication(requestId)`, `checkExistingApplication(projectId)`, `fetchProjectApplications(projectId)`, `acceptApplication(requestId, projectId)`, `refuseApplication(requestId)`, `fetchMyApplications()` — using `contact_requests` with `project_id` per contracts §2
- [x] T008 Add navigation functions to `src/context/OnboardingContext.jsx`: `goToMyProjects()` → `/my-projects`, `goToProjectForm(id?)` → `/project/new` or `/project/edit/:id`, `goToProjectDetail(id)` → `/project/:id`
- [x] T009 Add new routes to `src/App.jsx`: `/project/new` → ProjectForm (RequireAuth + RequireRole['creator']), `/project/:id` → ProjectDetail (RequireAuth), `/my-projects` → MyProjects (RequireAuth + RequireRole['creator']). Import new page components.
- [x] T010 [P] Update `src/components/layout/TopNav.jsx`: add "Projets" tab for creators linking to `/my-projects`, keep "Monteurs" (renamed from "Catalogue") for creators, keep existing editor tabs unchanged
- [x] T011 [P] Update `src/components/layout/BottomNav.jsx`: add "Projets" tab for creators linking to `/my-projects`, update "+" button to link to `/project/new` for creators, keep existing editor tabs unchanged
- [x] T012 [P] Create `src/components/projects/ProjectStatusBadge.jsx` — small badge component displaying project status (brouillon/publié/pourvu/terminé/annulé) with appropriate colors using accent palette. Used across MyProjects, ProjectCard, and ProjectDetail.
- [x] T013 Add base CSS styles for project pages to `src/styles/global.css`: `.project-form`, `.project-detail`, `.my-projects`, `.project-card`, `.project-filters`, `.application-card`, `.project-status-badge`, `.notification-bell` — mobile-first with `@media (max-width: 768px)` overrides, 44px touch targets

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Création de projet par le créateur (Priority: P1) 🎯 MVP

**Goal**: Creators can create a project via a detailed form, save it as draft, and publish it to make it visible to editors.

**Independent Test**: Create a project with all required fields (title, description, deliverable, budget, deadline), save as draft, reload page → data persists. Click "Publier" → status changes to published. Attempt publish with past deadline → error shown. Omit required field → inline validation error without data loss.

### Implementation for User Story 1

- [x] T014 [P] [US1] Create `src/components/pages/ProjectForm.jsx` — single scrollable form with 5 sections: "Informations générales" (title, description, content_format, niches multi-select), "Livrables" (dynamic deliverable rows: type select + quantity + duration), "Budget & Calendrier" (budget_type toggle fixed/range, budget fields, start_date, deadline date pickers), "Préférences techniques" (quality, preferred_software multi-select, required_languages multi-select, experience_level select, mission_type select, revision_count), "Détails supplémentaires" (thumbnail_included toggle, video_count, video_duration, rushes_info textarea). Uses shared options from `src/constants/options.js`. Local state for form, calls `createProject()` or `updateProject()` from ProjectContext on save.
- [x] T015 [P] [US1] Create `src/components/pages/MyProjects.jsx` — creator project dashboard listing all their projects via `fetchMyProjects()`. Uses PageTitle with "Mes Projets" + action button "Nouveau projet" linking to `/project/new`. Lists projects as ProjectCard components grouped by status (published first, then drafts, then filled/completed/cancelled). Each card shows title, status badge, deadline, budget, application count. Tap navigates to `/project/:id`.
- [x] T016 [P] [US1] Create `src/components/projects/ProjectCard.jsx` — card component displaying project summary: title, content_format icon, budget display (fixed or range), deadline, status badge (ProjectStatusBadge), application count (if creator view). Uses AnimatedItem wrapper, `whileTap={{ scale: 0.98 }}`, `whileHover={{ scale: 1.01 }}`. Accepts `onClick` prop for navigation.
- [x] T017 [US1] Add form validation to `src/components/pages/ProjectForm.jsx`: required field checks (title 3-120 chars, description 10-2000 chars, at least 1 deliverable, budget > 0, deadline future date), inline error messages in French, prevent submission on validation failure, preserve form data on error. Add "Enregistrer le brouillon" and "Publier" buttons — draft saves with `status: 'draft'`, publish validates deadline is future then saves with `status: 'published'`.
- [x] T018 [US1] Add draft auto-recovery to `src/components/pages/ProjectForm.jsx`: on mount, if route has project ID parameter, call `fetchProjectById(id)` and populate form with existing data. Support edit mode for draft projects (all fields editable). Show toast on successful save/publish.
- [x] T019 [US1] Add project form and dashboard styles to `src/styles/global.css`: `.project-form-section` with clear section headers, `.deliverable-row` with inline add/remove buttons, `.budget-toggle` for fixed/range switch, `.my-projects-list` with status grouping, responsive layout for form sections on mobile (stack vertically) and desktop (2-column grid for short fields). Use AnimatedList for project list in MyProjects.

**Checkpoint**: Creator can create, save drafts, edit, and publish projects. MyProjects dashboard shows all projects with status.

---

## Phase 4: User Story 2 — Recherche et consultation de projets par les monteurs (Priority: P2)

**Goal**: Editors can browse published projects, apply filters, and view detailed project information.

**Independent Test**: Log in as editor, navigate to Catalog → "Projets" tab. See published projects sorted by date. Apply format filter → list updates. Select a project → detail page shows all parameters. Remove filter → full list returns. No projects match → empty state message shown.

### Implementation for User Story 2

- [x] T020 [P] [US2] Create `src/components/projects/ProjectFilters.jsx` — horizontal scrollable filter bar with chips/dropdowns for: content_format, niche, budget range (min/max inputs), deadline (before date), preferred_software, mission_type, thumbnail_included. Uses options from `src/constants/options.js`. Emits `onFilterChange(filters)` callback. Clear all button. AnimatePresence for filter expand/collapse on mobile.
- [x] T021 [P] [US2] Create `src/components/pages/ProjectDetail.jsx` — project detail page loading project via `fetchProjectById(id)` from route param. Displays all project fields in organized sections matching the form structure. Shows creator info (name, avatar) via joined profile data. Role-aware: editors see "Candidater" button area (implemented in US3), creators see application management area (implemented in US4). Uses PageTitle with project title. Back navigation to previous page.
- [x] T022 [US2] Modify `src/components/pages/Catalog.jsx` — add tab switching for editors: "Monteurs" (existing profile catalog) and "Projets disponibles" (new project browse). Tab state managed locally. When "Projets" tab active, render ProjectFilters + AnimatedList of ProjectCard components using `fetchPublishedProjects(filters)` from ProjectContext. Creators see only "Monteurs" tab (existing behavior unchanged). Use framer-motion layoutId for tab indicator animation matching existing TopNav pattern.
- [x] T023 [US2] Add empty state to Catalog projects tab: when no projects match filters, show message "Aucun projet ne correspond à vos critères. Essayez d'élargir votre recherche." with icon. Style in `src/styles/global.css`.
- [x] T024 [US2] Add project browsing and detail styles to `src/styles/global.css`: `.project-filters` horizontal scroll with snap, `.project-detail-section` consistent with form sections, `.catalog-tabs` for tab switching UI, `.project-creator-info` for creator profile display on detail page. Mobile-first responsive adjustments.

**Checkpoint**: Editors can browse, filter, and view project details from the Catalog page.

---

## Phase 5: User Story 3 — Candidature d'un monteur à un projet (Priority: P3)

**Goal**: Editors can apply to a project with a single click. The system prevents duplicate applications, enforces profile publication requirement, and allows withdrawal of pending applications.

**Independent Test**: Log in as editor with published profile, open a published project detail → click "Candidater" → confirmation shown, button changes to status display. Return to project → see "En attente" status. Click "Retirer" → application withdrawn, "Candidater" button returns. Attempt to apply with draft profile → blocked with message. Attempt to apply to expired project → button disabled.

### Implementation for User Story 3

- [x] T025 [US3] Add candidature UI to `src/components/pages/ProjectDetail.jsx` (editor view): on mount, call `checkExistingApplication(projectId)`. If no application → show "Candidater" button (enabled only if profile.status === 'published' AND project.status === 'published' AND deadline >= today). If application exists → show status badge ("En attente" / "Acceptée" / "Refusée") instead of button. If pending → show "Retirer ma candidature" secondary button. Disabled state with tooltip for unpublished profile or expired deadline.
- [x] T026 [US3] Wire candidature actions in `src/components/pages/ProjectDetail.jsx`: "Candidater" click → call `submitApplication(project)` → on success toast "Candidature envoyée !" and update local state. "Retirer" click → confirm dialog → call `withdrawApplication(requestId)` → on success toast "Candidature retirée" and reset to apply state. Handle errors with toast.error().
- [x] T027 [US3] Add notification creation on candidature submission in `src/context/ProjectContext.jsx` → `submitApplication()`: after creating contact_request, call `createNotification({ user_id: project.creator_id, type: 'application_received', project_id, request_id, actor_name, project_title })`.
- [x] T028 [US3] Add notification creation on candidature withdrawal in `src/context/ProjectContext.jsx` → `withdrawApplication()`: after deleting/updating contact_request, call `createNotification({ user_id: project.creator_id, type: 'application_withdrawn', ... })`.
- [x] T029 [US3] Add candidature button and status styles to `src/styles/global.css`: `.candidature-button` primary accent style, `.candidature-status` badge display, `.candidature-withdraw` secondary/danger button, `.candidature-disabled` greyed out with tooltip. 44px touch targets on mobile.

**Checkpoint**: Editors can apply to projects, see application status, and withdraw pending applications.

---

## Phase 6: User Story 4 — Gestion des demandes par le créateur (Priority: P4)

**Goal**: Creators can view applications for their projects, see editor profile previews, accept or refuse applications. Acceptance opens a conversation and marks the project as filled.

**Independent Test**: Log in as creator with a project that has applications. Open project detail → see application count and list. Click an application → see editor profile preview (skills, level, rate, bio). Click "Accepter" → application accepted, conversation opens in messaging, project becomes "pourvu", other pending applicants auto-refused and notified. Click "Refuser" → application refused, editor notified.

### Implementation for User Story 4

- [x] T030 [P] [US4] Create `src/components/projects/ApplicationCard.jsx` — card showing editor profile summary for a candidature: avatar, name, level badge, key skills (top 4), formats, experience, hourly rate, bio excerpt (truncated). Accept/Refuse action buttons (only for pending applications). Uses AnimatedItem. Accepts `onAccept(requestId)` and `onRefuse(requestId)` callbacks.
- [x] T031 [P] [US4] Create `src/components/projects/ApplicationList.jsx` — list component receiving applications array, renders ApplicationCard for each. Shows count header "X candidature(s)". Empty state when no applications. Groups by status: pending first, then accepted, then refused. Uses AnimatedList for stagger animation.
- [x] T032 [US4] Add application management to `src/components/pages/ProjectDetail.jsx` (creator view): when user is the project creator, load applications via `fetchProjectApplications(projectId)`. Render ApplicationList below project details. Wire accept/refuse callbacks to ProjectContext functions.
- [x] T033 [US4] Implement accept cascade in `src/context/ProjectContext.jsx` → `acceptApplication(requestId, projectId)`: 1) Update selected contact_request status to 'accepted'. 2) Update all other pending contact_requests for same project_id to 'refused'. 3) Update project status to 'filled'. 4) Create notification for accepted editor (type: 'application_accepted'). 5) Create notifications for all refused editors (type: 'project_filled'). 6) Navigate to conversation via `goToChat(requestId)` from OnboardingContext.
- [x] T034 [US4] Implement refuse action in `src/context/ProjectContext.jsx` → `refuseApplication(requestId)`: update contact_request status to 'refused', create notification for editor (type: 'application_refused'). Show toast confirmation.
- [x] T035 [US4] Add application management styles to `src/styles/global.css`: `.application-card` with editor profile layout, `.application-actions` accept (accent) and refuse (danger) buttons, `.application-list` with status grouping, responsive cards on mobile (full width stacked).

**Checkpoint**: Creators can review applications, see editor profiles, accept (opening conversation + marking project filled) or refuse them.

---

## Phase 7: User Story 5 — Gestion du cycle de vie du projet (Priority: P5)

**Goal**: Creators can edit published projects (non-structural fields), close candidatures, mark projects as completed, or cancel them. Status changes notify affected editors.

**Independent Test**: Edit a published project's description → save → applicants notified. Cancel a published project → status changes to "annulé", disappears from editor browse, applicants notified. Mark a filled project as "terminé" → status changes. Edit a draft project → all fields editable.

### Implementation for User Story 5

- [x] T036 [US5] Add project actions to `src/components/pages/ProjectDetail.jsx` (creator view): action menu or buttons based on project status. Draft → "Modifier" (full edit) + "Publier". Published → "Modifier" (limited fields: description, deadline, rushes_info) + "Annuler le projet". Filled → "Marquer comme terminé" + "Annuler le projet". Completed/Cancelled → read-only, no actions.
- [x] T037 [US5] Implement edit mode in `src/components/pages/ProjectForm.jsx`: accept project ID from route `/project/new?edit=:id` or dedicated edit route. When editing a published project, disable structural fields (title, deliverables, budget_type) and only allow non-structural edits per FR-020. Show visual distinction for locked fields.
- [x] T038 [US5] Implement lifecycle transitions in `src/context/ProjectContext.jsx`: `cancelProject(projectId)` → update status to 'cancelled', notify all pending/accepted applicants (type: 'project_cancelled'). `completeProject(projectId)` → update status to 'completed'. `publishProject(projectId)` → validate deadline future, update status to 'published'. `updatePublishedProject(projectId, changes)` → update allowed fields, notify existing applicants (type: 'project_modified').
- [x] T039 [US5] Add confirmation dialogs for destructive actions: cancel project → "Êtes-vous sûr de vouloir annuler ce projet ? Les monteurs ayant candidaté seront notifiés." Uses a simple confirm() or a modal component consistent with existing patterns.

**Checkpoint**: Full project lifecycle management works — draft → published → filled → completed, with cancel available at any active stage.

---

## Phase 8: User Story 6 — Suivi des candidatures du monteur (Priority: P6)

**Goal**: Editors can see all their applications organized by project with current status, and navigate to conversations for accepted applications.

**Independent Test**: Log in as editor with multiple applications across different projects. Navigate to application tracking → see applications grouped by status (en attente, acceptée, refusée). Click an accepted application → navigate to conversation. Status changes reflect immediately.

### Implementation for User Story 6

- [x] T040 [US6] Add "Mes candidatures" section to `src/components/pages/MesProjetsMonteur.jsx` — below existing contact requests section, add a new section showing project applications via `fetchMyApplications()` from ProjectContext. Group by status: pending ("En attente"), accepted ("Acceptées"), refused ("Refusées"). Each item shows project title, creator name, budget, deadline, application date, and status badge. Accepted items have "Voir la conversation" link → `goToChat(requestId)`.
- [x] T041 [US6] Add application tracking styles to `src/styles/global.css`: `.my-applications` section layout, `.application-item` with project info and status, `.application-status-group` for grouping with headers. Use AnimatedList for stagger. Consistent with existing MesProjetsMonteur styles.
- [x] T042 [US6] Wire real-time status updates in `src/components/pages/MesProjetsMonteur.jsx`: refetch applications on component mount and when navigating back to page. Show unread indicator on items whose status changed since last view (compare with notification timestamps).

**Checkpoint**: Editors have full visibility of their application history organized by project and status.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Notification UI, auth cleanup, and cross-cutting improvements

- [x] T043 [P] Create `src/components/projects/NotificationBell.jsx` — bell icon with unread count badge (red dot with number). On click, show dropdown/panel listing recent notifications with icon per type, actor name, project title, timestamp, and read/unread styling. "Tout marquer comme lu" link. Click a notification → navigate to relevant project or conversation. Uses `notifications` and `unreadCount` from ProjectContext.
- [x] T044 [P] Add NotificationBell to `src/components/layout/TopNav.jsx` (desktop) and `src/components/layout/AppLayout.jsx` (mobile header area). Visible for both roles. Position: right side of top bar.
- [x] T045 Add auth cleanup for ProjectContext in `src/context/ProjectContext.jsx`: expose a `resetProjectState()` function that clears all state (projects, applications, notifications, unreadCount). Call this from OnboardingContext `signOut()` function — update `src/context/OnboardingContext.jsx` to import and call `resetProjectState()` during logout sequence (after step 3, before step 5 per existing logout flow).
- [x] T046 Add notification bell and dropdown styles to `src/styles/global.css`: `.notification-bell` with badge positioning, `.notification-dropdown` with max-height scroll, `.notification-item` with unread highlight, `.notification-item--read` dimmed style. AnimatePresence for dropdown open/close.
- [x] T047 Update access rules documentation in CLAUDE.md: add new routes (`/project/new`, `/project/:id`, `/my-projects`) to the routes table and access rules table. Add ProjectContext to key contexts section.
- [x] T048 Run full manual validation per `quickstart.md` testing checklist: verify all 17 test scenarios pass across both roles (creator and editor) on mobile (375px) and desktop viewports.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001 for DB, T002 for constants)
- **User Stories (Phase 3–8)**: All depend on Phase 2 completion
  - **US1 (Phase 3)**: Can start after Phase 2 — no other story dependencies
  - **US2 (Phase 4)**: Can start after Phase 2 — needs published projects for testing (seed or use US1)
  - **US3 (Phase 5)**: Depends on US2 (needs ProjectDetail page from T021)
  - **US4 (Phase 6)**: Depends on US3 (needs candidatures to exist)
  - **US5 (Phase 7)**: Depends on US1 only — can run in parallel with US2/US3
  - **US6 (Phase 8)**: Depends on US3 (needs candidatures to track)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependency Graph

```
Phase 2 (Foundation)
    │
    ├── US1 (P1) ─── Creator creates projects
    │     │
    │     ├── US2 (P2) ─── Editor browses projects
    │     │     │
    │     │     └── US3 (P3) ─── Editor applies to project
    │     │           │
    │     │           ├── US4 (P4) ─── Creator manages applications
    │     │           │
    │     │           └── US6 (P6) ─── Editor tracks applications
    │     │
    │     └── US5 (P5) ─── Creator manages project lifecycle
    │
    └── Polish (Phase 9)
```

### Parallel Opportunities

- **Phase 1**: T002 ∥ T003 (constants extraction ∥ step component updates)
- **Phase 2**: T005 ∥ T006 ∥ T007 (CRUD ∥ notifications ∥ candidatures — separate functions in same file), T010 ∥ T011 ∥ T012 ∥ T013 (TopNav ∥ BottomNav ∥ StatusBadge ∥ CSS — different files)
- **Phase 3**: T014 ∥ T015 ∥ T016 (ProjectForm ∥ MyProjects ∥ ProjectCard — different files)
- **Phase 4**: T020 ∥ T021 (ProjectFilters ∥ ProjectDetail — different files)
- **Phase 5**: US5 can run in parallel with US2/US3 (different files, independent functionality)
- **Phase 6**: T030 ∥ T031 (ApplicationCard ∥ ApplicationList — different files)
- **Phase 9**: T043 ∥ T044 ∥ T046 (NotificationBell ∥ layout integration ∥ CSS — different files)

---

## Parallel Example: Phase 2 (Foundational)

```
# Wave 1 — Context functions (same file, but independent sections):
Task T005: "Project CRUD functions in src/context/ProjectContext.jsx"
Task T006: "Notification functions in src/context/ProjectContext.jsx"
Task T007: "Candidature functions in src/context/ProjectContext.jsx"

# Wave 2 — Different files, fully parallel:
Task T010: "Update TopNav in src/components/layout/TopNav.jsx"
Task T011: "Update BottomNav in src/components/layout/BottomNav.jsx"
Task T012: "Create ProjectStatusBadge in src/components/projects/ProjectStatusBadge.jsx"
Task T013: "Add CSS styles in src/styles/global.css"
```

## Parallel Example: Phase 3 (User Story 1)

```
# Wave 1 — Different files, fully parallel:
Task T014: "Create ProjectForm in src/components/pages/ProjectForm.jsx"
Task T015: "Create MyProjects in src/components/pages/MyProjects.jsx"
Task T016: "Create ProjectCard in src/components/projects/ProjectCard.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (database + constants)
2. Complete Phase 2: Foundational (context + routes + nav)
3. Complete Phase 3: User Story 1 (project form + dashboard)
4. **STOP and VALIDATE**: Creator can create, save, edit, and publish projects
5. Deploy/demo if ready

### Incremental Delivery

1. Phase 1 + Phase 2 → Foundation ready
2. Add US1 → Creators can create/publish projects → **Deploy (MVP!)**
3. Add US2 → Editors can browse/filter projects → Deploy
4. Add US3 → Editors can apply to projects → Deploy
5. Add US4 → Creators can accept/refuse → Deploy (full matching loop!)
6. Add US5 → Lifecycle management → Deploy
7. Add US6 → Editor application tracking → Deploy
8. Polish → Notifications UI, cleanup → Deploy (feature complete)

### Parallel Team Strategy

With 2 developers after Foundation:

```
Dev A: US1 → US2 → US3 → US4
Dev B: US5 (parallel with US2) → US6 (after US3) → Polish
```

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story
- No automated tests — use quickstart.md manual checklist
- All UI labels in French, all code in English
- All styles in `src/styles/global.css` — no component CSS files
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently

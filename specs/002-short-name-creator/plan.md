# Implementation Plan: Projet Createur — Publication & Mise en Relation Monteurs

**Branch**: `002-short-name-creator` | **Date**: 2026-04-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-short-name-creator/spec.md`

## Summary

Creators can publish detailed project postings (title, deliverables, budget, deadlines, etc.) that editors discover, filter, and apply to with a single click. Applications reuse the existing `contact_requests` mechanism (with a new `project_id` foreign key), so acceptance automatically opens a conversation in the existing messaging system. In-app notifications track all status changes. The feature introduces two new Supabase tables (`projects`, `notifications`), extends `contact_requests`, adds a `ProjectContext` for state management, and creates four new pages (project form, project detail, creator project dashboard, editor project browser).

## Technical Context

**Language/Version**: JavaScript (ES2022+), React 18.3, Vite 5  
**Primary Dependencies**: react-router-dom 7, framer-motion, @supabase/supabase-js  
**Storage**: Supabase PostgreSQL with Row-Level Security (RLS)  
**Testing**: None (no test framework per constitution VII)  
**Target Platform**: Web SPA, mobile-first (mobile breakpoint 768px)  
**Project Type**: Web application (SPA with Supabase BaaS)  
**Performance Goals**: <2s acceptance-to-conversation transition (SC-004), <30s project discovery via filters (SC-002), <5min project creation (SC-001)  
**Constraints**: Single CSS file, no TypeScript, no additional animation library, mobile touch targets 44px minimum, French UI / English code  
**Scale/Scope**: v0 prototype, ~15 existing pages/components, adding ~4 new pages + ~8 new components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Mobile-First UX | PASS | All new pages designed mobile-first. Project form, browse, and detail pages use standard scroll. Touch targets 44px. |
| II. Role-Based Isolation | PASS | New routes guarded by `RequireRole`. Creator-only: `/project/new`, `/my-projects`. Shared with role-aware UI: `/project/:id`. Editor browse via role-aware `/catalog` tab. All DB queries scoped by `user.id` with RLS. |
| III. Single-File Styling | PASS | All new styles added to `src/styles/global.css`. |
| IV. Consistent Motion | PASS | AnimatedList for project listings, AnimatePresence for filters/modals, whileTap/whileHover on cards. No new animation library. |
| V. Auth Cleanup on Logout | PASS | New `ProjectContext` state reset on logout. No new localStorage keys that could leak. |
| VI. French UI, English Code | PASS | All labels in French, all code in English. |
| VII. Simplicity Over Abstraction | PASS | Direct implementation. No generic "posting system" — purpose-built for projects. Reuses existing contact_requests mechanism instead of building new messaging. |

**Gate result**: ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-short-name-creator/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── supabase-api.md  # Table schemas, RLS policies, storage
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── pages/
│   │   ├── ProjectForm.jsx        # NEW: Creator project creation/edit form
│   │   ├── ProjectDetail.jsx      # NEW: Project detail view (role-aware)
│   │   ├── MyProjects.jsx         # NEW: Creator project dashboard
│   │   └── Catalog.jsx            # MODIFIED: Add project browsing tab for editors
│   ├── projects/                  # NEW: Project-specific components
│   │   ├── ProjectCard.jsx        # Project listing card
│   │   ├── ProjectFilters.jsx     # Filter bar for project browsing
│   │   ├── ApplicationCard.jsx    # Application preview (editor profile summary)
│   │   ├── ApplicationList.jsx    # List of applications for a project
│   │   ├── ProjectStatusBadge.jsx # Status indicator (draft/published/filled/etc.)
│   │   └── NotificationBell.jsx   # Notification icon with unread count
│   ├── layout/
│   │   ├── TopNav.jsx             # MODIFIED: Add creator project nav items
│   │   └── BottomNav.jsx          # MODIFIED: Add creator project nav items
│   └── ui/                        # Existing reusable components (no changes)
├── context/
│   ├── OnboardingContext.jsx      # MODIFIED: Add goToMyProjects(), goToProjectForm(), goToProjectDetail()
│   └── ProjectContext.jsx         # NEW: Project CRUD, applications, notifications
├── lib/
│   └── supabase.js                # Existing Supabase client (no changes)
├── App.jsx                        # MODIFIED: Add new routes + guards
└── styles/
    └── global.css                 # MODIFIED: Add project page styles
```

**Structure Decision**: Follows existing SPA structure. New `projects/` component directory groups project-specific components parallel to existing `editor/` directory. New `ProjectContext` manages project state separately from messaging (separation of concerns), but bridges to `contact_requests` on application acceptance.

## Complexity Tracking

> No constitution violations detected — this section is empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

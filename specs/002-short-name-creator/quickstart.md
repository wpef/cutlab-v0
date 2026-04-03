# Quickstart: Projet Createur — Publication & Mise en Relation Monteurs

**Feature Branch**: `002-short-name-creator`  
**Date**: 2026-04-03

## Prerequisites

- Node.js 18+, npm
- Supabase project with existing schema (profiles, contact_requests, messages, offers)
- Demo accounts created (demo@cutlab.io, demo-creator@cutlab.io)

## Setup Steps

### 1. Apply Database Migration

Run the SQL from `contracts/supabase-api.md` § "SQL Migration" in the Supabase SQL Editor:
- Creates `projects` table
- Adds `project_id` column to `contact_requests`
- Creates `notifications` table
- Sets up RLS policies and indexes

### 2. Implementation Order

The feature should be implemented in this dependency order:

```
Phase A: Data Layer (no UI)
  1. Database migration (Supabase SQL)
  2. ProjectContext (CRUD functions, state management)
  3. Notification polling logic

Phase B: Creator Flow
  4. ProjectForm page (create/edit project)
  5. MyProjects page (project dashboard)
  6. ProjectDetail page — creator view (manage applications)
  7. Navigation updates (creator BottomNav + TopNav)

Phase C: Editor Flow
  8. Catalog modification (add "Projets" tab for editors)
  9. ProjectDetail page — editor view (browse + apply)
  10. ProjectFilters component
  11. Application tracking (extend /projects page or add section)

Phase D: Cross-Cutting
  12. NotificationBell component + notification list
  13. Accept/refuse flow with auto-conversation opening
  14. Status change notifications (batch creation)
  15. Project lifecycle management (cancel, complete)
```

### 3. Key Integration Points

| What | Where | How |
|------|-------|-----|
| Navigation functions | `OnboardingContext.jsx` | Add `goToMyProjects()`, `goToProjectForm()`, `goToProjectDetail(id)` |
| New routes | `App.jsx` | Add `/project/new`, `/project/:id`, `/my-projects` with guards |
| Creator nav | `TopNav.jsx`, `BottomNav.jsx` | Add "Projets" tab for creators |
| Editor browse | `Catalog.jsx` | Add tab switching between editor profiles and project listings |
| Candidature → conversation | `ProjectContext.jsx` | On accept: update contact_request + create conversation (reuse MessagingContext) |
| Notifications | `AppLayout.jsx` | Add NotificationBell to TopNav, polling in ProjectContext |

### 4. Field Option Reuse

These values must be imported from existing constants to ensure filter consistency:

| Field | Source | Values |
|-------|--------|--------|
| `content_format` | Profile formats | portrait, youtube, pub, docu, corporate, clips, gaming, sport |
| `niches` | Profile niches | Gaming, Finance, Lifestyle, Tech, Food, Sport, Mode, Education, Voyage, Musique, Business, Humour, Science, Politique |
| `preferred_software` | Profile software | Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro, CapCut, Canva, Photoshop, Illustrator, Audition, Figma |
| `required_languages` | Profile languages | fr, en, es, pt, de, it, zh, ja, ar, ru, ko |
| `experience_level` | Profile experience | <6m, 6m1y, 1-3y, 3-5y, 5-7y, 7y+ |
| `mission_type` | Profile missionTypes | ponctuelle, long-terme (+ recurring for projects) |

**Action**: Extract these into shared constants in `src/constants/` if not already centralized, so both profile and project forms reference the same source of truth.

### 5. Testing Checklist

Manual testing scenarios for the feature (no automated test framework):

- [ ] Creator: create draft project with all required fields
- [ ] Creator: save draft, reload page, verify data persists
- [ ] Creator: publish project, verify it appears in editor browse
- [ ] Creator: attempt publish with past deadline → error
- [ ] Editor: browse published projects, apply filters
- [ ] Editor: click "Candidater" → request created, button changes to status
- [ ] Editor: attempt double candidature → blocked
- [ ] Editor: withdraw pending candidature
- [ ] Creator: view applications with editor profile previews
- [ ] Creator: accept application → conversation opens
- [ ] Creator: accept application → other applicants auto-refused + notified
- [ ] Creator: refuse application → editor notified
- [ ] Creator: cancel project → all applicants notified
- [ ] Editor: notification bell shows unread count
- [ ] Editor: notification list shows status changes
- [ ] Mobile: all pages render correctly on 375px viewport
- [ ] Mobile: touch targets ≥ 44px
- [ ] Logout: all project/notification state cleared

# Research: Projet Createur — Publication & Mise en Relation Monteurs

**Feature Branch**: `002-short-name-creator`  
**Date**: 2026-04-03  
**Status**: Complete

## R1: Candidature Mechanism — Reuse contact_requests or New Table?

### Decision: Extend `contact_requests` with a `project_id` foreign key

### Rationale
The spec explicitly states: "La candidature utilise le même mécanisme de mise en relation que le contact existant." By adding a nullable `project_id` column to `contact_requests`, we:
- Reuse the entire messaging pipeline (messages, offers, pipeline stages) without duplication
- Keep a single inbox for creators (both catalog contacts and project candidatures appear in `/messaging`)
- Maintain the same accept/refuse/conversation flow
- Avoid building a parallel communication system

When `project_id IS NULL`, it's a traditional catalog contact (creator → editor). When `project_id IS NOT NULL`, it's a project application (editor → creator).

### Alternatives considered
1. **Separate `project_applications` table**: Would require duplicating messaging infrastructure or building a bridge. More tables, more joins, more RLS policies for the same behavior.
2. **Generic `applications` table that creates `contact_requests` on acceptance**: Two-step process adds latency and complexity. Acceptance wouldn't be instant.
3. **Add `direction` or `initiated_by` field**: Redundant — `project_id` presence already distinguishes the flow direction.

---

## R2: Project Status Lifecycle

### Decision: Five statuses — `draft`, `published`, `filled`, `completed`, `cancelled`

### Rationale
Maps directly to spec FR-017 and the lifecycle described in US5:
- `draft` → project being composed, not visible to editors
- `published` → visible, accepting candidatures
- `filled` → a candidature was accepted, no more applications
- `completed` → mission done, archived
- `cancelled` → creator withdrew the project

Transitions:
```
draft → published (creator publishes)
published → filled (creator accepts a candidature)
published → cancelled (creator cancels)
filled → completed (creator marks done)
filled → cancelled (creator cancels, notify editor)
```

### Alternatives considered
1. **Add `closed` status**: Redundant with `cancelled` for v0. Can split later if needed.
2. **Add `paused` status**: Over-engineering for v0. Creator can cancel and re-create.

---

## R3: Notification Strategy — In-App Only

### Decision: Dedicated `notifications` table with polling

### Rationale
Spec assumption: "Les notifications sont in-app uniquement (pas d'email/push en v1)." A `notifications` table with:
- `user_id`, `type`, `project_id`, `request_id`, `message`, `read`, `created_at`
- Polling via `setInterval` (30s) or Supabase realtime subscription
- Notification bell in TopNav/BottomNav with unread count badge

Event types:
- `application_received` — creator gets notified when an editor applies
- `application_accepted` — editor gets notified when accepted
- `application_refused` — editor gets notified when refused
- `project_filled` — other pending applicants notified
- `project_cancelled` — all applicants notified
- `project_modified` — existing applicants notified of changes

### Alternatives considered
1. **Supabase Realtime subscriptions only (no table)**: No persistence means missed notifications when offline. Table ensures read/unread tracking.
2. **Toast-only notifications**: Ephemeral, easily missed. Not suitable for important status changes.
3. **Email/push**: Out of scope for v1 per spec assumptions.

---

## R4: Routing Strategy — New Routes vs. Repurposing Existing

### Decision: Add 3 new routes + modify Catalog for dual-purpose

### Rationale

**New routes:**
| Route | Component | Guard | Purpose |
|-------|-----------|-------|---------|
| `/project/new` | ProjectForm | RequireAuth + RequireRole(['creator']) | Create/edit project |
| `/project/:id` | ProjectDetail | RequireAuth | View project detail (role-aware UI) |
| `/my-projects` | MyProjects | RequireAuth + RequireRole(['creator']) | Creator's project dashboard |

**Modified route:**
| Route | Change | Purpose |
|-------|--------|---------|
| `/catalog` | Add "Projets" tab for editors | Editors browse published projects alongside existing profile catalog |

The Catalog page already supports both roles. Adding a role-aware tab (editors see "Projets disponibles" / "Monteurs", creators see only "Monteurs") keeps the navigation simple without adding another BottomNav item.

### Alternatives considered
1. **Dedicated `/browse-projects` route**: Adds a nav item on mobile. Editors already have 5 bottom tabs — a 6th would be cramped.
2. **Replace `/catalog` for editors entirely**: Removes ability for editors to see other editor profiles, which may have value (benchmarking, networking).
3. **Tab on `/projects` page for editors**: `/projects` is their home (contact requests). Mixing project browse with request management overloads the page.

---

## R5: Project Form — Single Page vs. Multi-Step

### Decision: Single scrollable form with sections (not multi-step wizard)

### Rationale
The project form has ~15 fields but they're all on one conceptual level (project parameters). Unlike onboarding (which has distinct conceptual stages: identity, skills, portfolio, pricing), a project posting is one coherent unit. A single scrollable form with clear section headers is:
- Faster for repeat users (creators may post multiple projects)
- Simpler to implement (no step state management)
- Mobile-friendly with the existing scroll pattern (normal page, outer scroll)
- Supports draft save via a single "Enregistrer le brouillon" button

Sections: Informations generales, Livrables, Budget & Calendrier, Preferences techniques, Details supplementaires.

### Alternatives considered
1. **Multi-step wizard (like onboarding)**: Overkill for a form that should be fast. Creators want to post quickly.
2. **Tabbed form**: Hides fields, making it harder to review before publishing.

---

## R6: Budget Model — Fixed vs. Range

### Decision: Support both fixed amount and min/max range via `budget_type` field

### Rationale
Spec FR-001 says "budget (montant fixe ou fourchette)". The data model uses:
- `budget_type`: `'fixed'` or `'range'`
- `budget_fixed`: used when type is `'fixed'`
- `budget_min`, `budget_max`: used when type is `'range'`

This matches the existing `offers` table pattern (which has a single `budget` field) but extends it for the browse/filter use case where ranges help editors find projects in their price range.

### Alternatives considered
1. **Single `budget` field + convention**: Ambiguous. "500" could mean "exactly 500" or "up to 500".
2. **Always use range (min=max for fixed)**: Confusing UX. Creator sees two fields when they want to enter one number.

---

## R7: Deliverables Model — Structured vs. Free Text

### Decision: JSONB array of `{type, quantity, duration}` objects

### Rationale
The spec lists deliverables as a key entity attribute with "types et quantites." A structured format enables:
- Future filtering by deliverable type
- Clear display in project cards and detail pages
- Validation (at least one deliverable required per FR-001)

Types reuse existing format options: `video`, `thumbnail`, `reels`, `motion_graphics`, `color_grading`, `subtitles`, `sound_design`.

### Alternatives considered
1. **Free text field**: No structure, can't filter or validate. Poor UX consistency.
2. **Separate `project_deliverables` join table**: Over-normalized for v0. JSONB is simpler and sufficient.

---

## R8: Editor Profile Published Requirement

### Decision: Check `profiles.status = 'published'` before allowing candidature

### Rationale
Spec assumption: "Le profil du monteur doit être au statut 'publié' pour pouvoir candidater." This ensures:
- Creators reviewing applications always see complete profiles
- Editors are incentivized to complete their profile before engaging
- Consistent with the existing catalog visibility rule (only published profiles shown)

Implementation: Check in the UI (disable "Candidater" button + show tooltip) AND in RLS policy (INSERT on contact_requests requires editor's profile.status = 'published').

### Alternatives considered
1. **Allow draft profiles to apply**: Creates poor first impressions for creators. Rejected per spec assumption.

---

## R9: Navigation Updates — Creator BottomNav

### Decision: Add "Projets" tab to creator BottomNav, keep "Catalogue" as "Monteurs"

### Rationale
Creators currently have: Catalogue, Messagerie, + (offre). With this feature:
- Rename "Catalogue" → "Monteurs" (same page, clearer label)
- Add "Projets" tab → links to `/my-projects`
- Keep "+" button → now links to `/project/new` (instead of `/offer/new` which requires an active conversation)
- Keep "Messagerie"

This gives creators a clear mental model: "Projets" for their postings, "Monteurs" for browsing editors, "Messagerie" for conversations.

### Alternatives considered
1. **Keep creator nav unchanged, access projects via Catalogue**: Hidden feature, poor discoverability.
2. **Replace Catalogue entirely**: Creators still need to browse editor profiles proactively.

---

## R10: Supabase Realtime vs. Polling for Notifications

### Decision: Start with polling (30s interval), migrate to Supabase Realtime later if needed

### Rationale
Supabase Realtime requires WebSocket connections and channel management. For v0:
- Polling is simpler to implement and debug
- 30s interval is acceptable for non-urgent notifications (spec doesn't require real-time)
- The existing messaging system already uses fetch-on-mount patterns, not realtime
- Can add Realtime subscription as a progressive enhancement

### Alternatives considered
1. **Supabase Realtime from day one**: More complex, requires channel lifecycle management. Over-engineering for v0.
2. **No polling, fetch on page mount only**: Notifications would feel stale. 30s polling is a good middle ground.

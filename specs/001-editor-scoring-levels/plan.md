# Implementation Plan: Editor Scoring System & Levels

**Branch**: `001-editor-scoring-levels` | **Date**: 2026-04-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-editor-scoring-levels/spec.md`

## Summary

Replace the existing 5-parameter / 3-threshold scoring system with a
7-parameter / 7-tier model (100 points total). The scoring function
computes a deterministic score from profile data (portfolio count,
experience, skills+software, credited channels, profile completeness,
response time) plus a placeholder for future client reviews (0/20 for
now). The level is auto-assigned — the manual picker in Step 7 is
removed. Score breakdown is shown in Step 7 (onboarding) and in the
profile editor. Level badges appear on catalog cards.

## Technical Context

**Language/Version**: JavaScript (ES modules), React 18.3
**Primary Dependencies**: React, framer-motion, @supabase/supabase-js
**Storage**: Supabase PostgreSQL (`profiles` table, `assigned_level` column)
**Testing**: Manual (no test framework in project — constitution: simplicity)
**Target Platform**: Web (mobile-first SPA, Vite 5 dev server)
**Project Type**: Single-page web application (client-side only)
**Performance Goals**: Score computation < 1ms (pure function), UI update < 1s
**Constraints**: No new npm dependencies, no TypeScript, all CSS in global.css
**Scale/Scope**: ~100-1000 editor profiles, 7 modified files, 2 new files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Mobile-First UX | PASS | Score breakdown + badge designed mobile-first, 44px touch targets |
| II. Role-Based Isolation | PASS | Scoring applies to editors only; catalog shows level to creators (read-only) |
| III. Single-File Styling | PASS | All new styles added to `src/styles/global.css` |
| IV. Consistent Motion Language | PASS | Score bar animations use framer-motion; no new animation library |
| V. Auth Cleanup on Logout | PASS | `assignedLevel` already reset on signOut; no new state to clean up |
| VI. French UI, English Code | PASS | Level names in French UI, code variables/functions in English |
| VII. Simplicity Over Abstraction | PASS | Single scoring function, no middleware/state machines. Flat bracket tables. |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-editor-scoring-levels/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── lib/
│   └── computeLevel.js          # REWRITE: 7-param scoring engine
├── constants/
│   └── levels.js                 # REWRITE: 7 levels replacing 10
├── components/
│   ├── steps/
│   │   └── Step7Level.jsx        # MODIFY: remove picker, read-only preview + breakdown
│   ├── editor/
│   │   └── ProfileEditor.jsx     # MODIFY: add score breakdown section, recalc on save
│   ├── ui/
│   │   ├── EditorCard.jsx        # MODIFY: update level badge rendering
│   │   └── ScoreBreakdown.jsx    # NEW: reusable score breakdown component
│   └── pages/
│       └── Catalog.jsx           # MINOR: ensure assigned_level in query (already there)
├── context/
│   └── OnboardingContext.jsx     # MODIFY: compute level before save, remove manual picker state
└── styles/
    global.css                    # ADD: score breakdown, level badge styles

supabase-schema.sql               # DOCUMENT: no schema change needed (assigned_level stays integer)
```

**Structure Decision**: Single project, frontend-only. The scoring engine
is a pure function in `src/lib/`. UI components consume it. No backend
changes needed — `assigned_level` column already exists as integer.

## Key Implementation Decisions

### Level index mapping (current → new)

Current `levels.js` has 10 levels (indices 0-9). New system has 7.
The `assigned_level` column in Supabase stores an integer index.

**Decision**: Redefine the LEVELS array to 7 entries (indices 0-6):
- 0: Debutant, 1: Prospect, 2: Confirme, 3: Expert, 4: Star, 5: Elite, 6: Legende

Existing profiles with `assigned_level` > 6 or using old indices will be
re-scored on next profile save or page load. The `computeAutoLevel`
function always returns a fresh index based on current data.

### Scoring architecture

The `computeScoreDetails(formData, reviewData)` function returns:
```
{ total: number, details: { portfolio, reviews, experience, skills, references, completion, reactivity }, level: number }
```

- `reviewData` parameter defaults to `{ count: 0, avgRating: 0 }` — future-proofed for review system.
- Called in: Step 7 (onboarding), ProfileEditor (on mount + save), and eventually on review submission.
- Pure function, no side effects, no async.

### Experience field extension

Current values: `<6m`, `6m1y`, `1-3y`, `3-5y`, `5y+`
New values: `<6m`, `6m1y`, `1-3y`, `3-5y`, `5-7y`, `7y+`

Migration: `5y+` maps to `7y+` (generous — assume long tenure). Step 3
UI updated with the two new options.

### Response time field extension

Current values: `<1h`, `<4h`, `<24h`, `<48h`
New values: (not set), `<1w`, `<48h`, `<24h`, `<12h`, `<4h`

Migration: `<1h` maps to `<4h` (closest bracket). Step 6 UI updated.

### creditedChannels parsing

Currently a single text field. To count references, split on commas,
newlines, or semicolons and count non-empty entries.

## Complexity Tracking

> No Constitution Check violations — no entries needed.

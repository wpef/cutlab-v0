# Tasks: Editor Scoring System & Levels

**Input**: Design documents from `/specs/001-editor-scoring-levels/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No test framework in project. Manual testing only (see quickstart.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Rewrite the scoring engine and level definitions — foundation for all user stories.

- [x] T001 Rewrite `src/constants/levels.js` — replace 10-level array with 7 levels: Debutant (0-15), Prospect (16-25), Confirme (26-50), Expert (51-65), Star (66-80), Elite (81-90), Legende (91-100). Each entry: `{ name, emoji, description, minScore, maxScore }`. Export `LEVELS` array and `getLevelByScore(score)` helper.
- [x] T002 Rewrite `src/lib/computeLevel.js` (depends on T001 for level thresholds) — replace 5-param/3-threshold system with 7-param scoring engine. Export `computeScoreDetails(formData, reviewData = { count: 0, avgRating: 0 })` returning `{ total, details: { portfolio, reviews, experience, skills, references, completion, reactivity }, levelIndex }`. Implement all 7 bracket tables from data-model.md. Export `SCORE_PARAMS` array (name, maxPoints, key) for UI rendering. Parse `creditedChannels` by splitting on commas/newlines/semicolons for reference count.

**Checkpoint**: Scoring engine and level definitions ready. No UI changes yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update onboarding field options and context to support new scoring parameters. MUST complete before user story work.

- [x] T003 Update experience options in `src/components/steps/Step3Skills.jsx` — add '5-7y' (5-7 ans) and '7y+' (7 ans et plus) options. Reorder: '<6m', '6m1y', '1-3y', '3-5y', '5-7y', '7y+'.
- [x] T004 [P] Update response time options in `src/components/steps/Step6Presentation.jsx` — replace current options with: (not set), '<1w' (moins d'1 semaine), '<48h' (moins de 48h), '<24h' (moins de 24h), '<12h' (moins de 12h), '<4h' (moins de 4h).
- [x] T005 [P] Update `src/context/OnboardingContext.jsx` — remove manual `assignedLevel`/`setAssignedLevel` state. In `saveProfile()`, call `computeScoreDetails(formData)` to get `levelIndex` and save as `assigned_level`. Remove level picker references. Also remove `setAssignedLevel(2)` from `signOut()` (level is now derived from formData which is already reset). Requires T002.
- [x] T006 Add legacy value migration in `loadProfile()` of `src/context/OnboardingContext.jsx` — map `experience: '5y+'` to `'7y+'`, map `responseTime: '<1h'` to `'<4h'`, recalculate `assigned_level` if current value > 6.

**Checkpoint**: Foundation ready — all onboarding fields support new scoring, context computes level automatically.

---

## Phase 3: User Story 1 — Automatic Level Calculation During Onboarding (Priority: P1) MVP

**Goal**: Editor completes onboarding, Step 7 shows auto-calculated level as read-only preview.

**Independent Test**: Complete onboarding with known inputs → Step 7 displays correct score and level.

### Implementation for User Story 1

- [x] T007 [US1] Rewrite `src/components/steps/Step7Level.jsx` — remove the level picker (radio/select UI and `pickLevel` function). Keep the loading animation phase. In result phase, call `computeScoreDetails(formData)` and display: level name + emoji, total score (X/100), and a simple score bar. Keep certification request button. Remove `localLevel` state.
- [x] T008 [US1] Add CSS for Step 7 level preview in `src/styles/global.css` — style the read-only level display: level badge (large, centered), score bar (accent color fill), score text. Mobile-first, 44px touch targets on certification button.
- [x] T009 [US1] Verify `src/components/steps/Step8Preview.jsx` works with new level system — ensure EditorCard receives correct level index (0-6) and displays the right badge from the new LEVELS array.

**Checkpoint**: Onboarding flow end-to-end works with new scoring. Editor sees auto-calculated level at Step 7, no manual override.

---

## Phase 4: User Story 2 — Score Breakdown Visibility (Priority: P2)

**Goal**: Editor sees detailed 7-parameter score breakdown in Step 7 and profile editor.

**Independent Test**: View breakdown → 7 rows with correct points per parameter, total matches displayed score.

### Implementation for User Story 2

- [x] T010 [US2] Create `src/components/ui/ScoreBreakdown.jsx` — reusable component accepting `scoreDetails` prop (output of `computeScoreDetails`). Render 7 rows: parameter label (French), current points / max points, visual progress bar (framer-motion animated width). Import `SCORE_PARAMS` from computeLevel.js for labels and maxPoints. Show total at bottom.
- [x] T011 [US2] Integrate ScoreBreakdown into `src/components/steps/Step7Level.jsx` — add collapsible breakdown section below the level badge (use existing pattern: toggle button + AnimatePresence height animation). Pass `computeScoreDetails(formData)` result.
- [x] T012 [US2] Add CSS for ScoreBreakdown component in `src/styles/global.css` — parameter rows, progress bars (accent `#d4f000` fill on `#1a1a1a` track), responsive layout. Mobile: full width rows. Desktop: compact grid.

**Checkpoint**: Score breakdown visible in Step 7 with all 7 parameters correctly computed and displayed.

---

## Phase 5: User Story 3 — Score Recalculation on Profile Edit (Priority: P3)

**Goal**: Editor edits profile, score recalculates live. Breakdown visible in profile editor.

**Independent Test**: Edit a profile field → save → score and level update within 2 seconds.

### Implementation for User Story 3

- [x] T013 [US3] Add score breakdown section to `src/components/editor/ProfileEditor.jsx` — compute score on mount via `computeScoreDetails(formData)`. Show ScoreBreakdown component in a new section (above or below the existing profile fields). Recalculate after each successful `saveProfile()` call and update displayed breakdown.
- [x] T014 [US3] Add CSS for score section in ProfileEditor in `src/styles/global.css` — section card styling matching existing editor sections, mobile-first layout. On mobile: above the form fields. On desktop: in sidebar or top section.

**Checkpoint**: Profile editor shows live score. Editing and saving profile updates the score breakdown and level.

---

## Phase 6: User Story 4 — Level Badge in Catalog (Priority: P4)

**Goal**: Creator sees level badge on each editor card in catalog.

**Independent Test**: View catalog as creator → each editor card shows correct level badge.

### Implementation for User Story 4

- [x] T015 [US4] Update `src/components/ui/EditorCard.jsx` — update level badge rendering to use new 7-level LEVELS array. Ensure fallback: if `assigned_level` is null/undefined, compute from profile data if available, else show "Debutant". Update badge styling to show emoji + level name.
- [x] T016 [US4] Add/update level badge CSS in `src/styles/global.css` — badge styling: compact pill shape, dark surface background, accent text for high levels (Star+). Ensure badge is visible but not dominant on the card.

**Checkpoint**: Catalog displays correct level badges for all published editors.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, legacy migration verification, and demo data.

- [x] T017 Verify legacy profile migration end-to-end — load a profile with `assigned_level: 8` (old index), `experience: '5y+'`, `responseTime: '<1h'`. Confirm values are migrated and level is recalculated correctly on load in `src/context/OnboardingContext.jsx`.
- [x] T018 [P] Validate all 7 scoring brackets with boundary inputs — test: exactly 0, 1, 5, 8 portfolio links; experience at each tier; skills+software at 3, 4, 9, 10 combined; 0 and 11+ references; all profile completion combos; each response time value. Verify totals and levels match data-model.md.
- [x] T019 [P] Update demo editor profile data to show varied levels in catalog — ensure at least 2-3 demo profiles with different scores to validate SC-005 (distribution across 4+ levels).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001, T002 must complete first)
- **US1 (Phase 3)**: Depends on Phase 2 completion — first user story
- **US2 (Phase 4)**: Depends on US1 (T007 must exist for T011 integration)
- **US3 (Phase 5)**: Depends on US2 (T010 ScoreBreakdown component must exist)
- **US4 (Phase 6)**: Depends on Phase 1 (T001 + T002) — can run parallel to US2/US3
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational — no dependency on other stories
- **US2 (P2)**: Depends on US1 (Step 7 must be rewritten first)
- **US3 (P3)**: Depends on US2 (ScoreBreakdown component needed)
- **US4 (P4)**: Depends on Setup (T001 + T002) — can start after Phase 1

### Within Each User Story

- UI component before CSS
- Integration before polish
- Core functionality before edge cases

### Parallel Opportunities

```text
# Phase 1: Both setup tasks in parallel
T001 (levels.js) || T002 (computeLevel.js)

# Phase 2: Three foundational tasks in parallel
T003 (Step3 experience) || T004 (Step6 response time) || T005 (context update)
T006 depends on T005

# US4 can run in parallel with US2 and US3 (after Phase 1)
T015 + T016 can start once T001 is done

# Phase 7: Validation tasks in parallel
T017 || T018 || T019
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: Foundational (T003-T006)
3. Complete Phase 3: US1 (T007-T009)
4. **STOP and VALIDATE**: Complete onboarding, verify level is auto-calculated
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Scoring engine ready
2. US1 → Onboarding shows auto level (MVP!)
3. US2 → Detailed breakdown visible
4. US3 → Profile editor has live scoring
5. US4 → Catalog shows badges (can run parallel to US2/US3)
6. Polish → Edge cases and demo data

### Suggested Execution

Single developer, sequential:
1. T001 + T002 (parallel) → T003 + T004 + T005 (parallel) → T006
2. T007 → T008 → T009 (US1 complete)
3. T010 → T011 → T012 (US2 complete)
4. T013 → T014 (US3 complete)
5. T015 → T016 (US4 complete)
6. T017 + T018 + T019 (parallel, polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test framework tasks — manual testing per quickstart.md
- US4 is independent of US2/US3 and can be parallelized
- Total: 19 tasks across 7 phases

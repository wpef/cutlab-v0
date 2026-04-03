# Feature Specification: Editor Scoring System & Levels

**Feature Branch**: `001-editor-scoring-levels`
**Created**: 2026-03-31
**Status**: Draft
**Input**: Brief technique — scoring and level system for editors (monteurs)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Level Calculation During Onboarding (Priority: P1)

A new editor completes the onboarding flow, filling in their experience,
skills, software, portfolio links, credited channels, bio, availability,
pricing, and response time. When they reach the level preview step (Step 7),
the system automatically computes a score out of 100 from 7 weighted
parameters and assigns the corresponding level (one of 7 tiers).

The editor sees their assigned level and the score breakdown. The level is
saved to their profile and visible on their public card in the catalog.

**Why this priority**: The core value proposition. Without automatic scoring,
levels are arbitrary. This replaces the existing simpler 5-parameter system
with the full 7-parameter, 7-tier model.

**Independent Test**: Complete an onboarding flow with known inputs and verify
the computed score and level match the expected values from the scoring tables.

**Acceptance Scenarios**:

1. **Given** an editor has filled all onboarding steps with: 3 portfolio links,
   2 years experience, 3 skills + 3 software, 2 credited channels, bio filled,
   avatar set, availability set, pricing filled, response time "<24h",
   **When** they reach Step 7,
   **Then** the system displays a score of approximately 52/100 and assigns
   level "Expert" (51-65 range).

2. **Given** an editor has filled minimal data: 0 portfolio links, <6 months
   experience, 1 skill + 1 software, no credited channels, no bio,
   **When** they reach Step 7,
   **Then** the system displays a score of approximately 5/100 and assigns
   level "Debutant" (0-15 range).

3. **Given** an editor has filled all fields to maximum values,
   **When** they reach Step 7,
   **Then** the system displays a score of 100/100 and assigns level "Legende"
   (91-100 range).

---

### User Story 2 - Score Breakdown Visibility (Priority: P2)

An editor on their profile page (or Step 7 during onboarding) can see not
just their total score and level, but a breakdown of all 7 parameters showing
how many points each parameter contributed. This helps them understand what
to improve to reach a higher level.

**Why this priority**: Transparency drives engagement. Editors who understand
the scoring will complete their profile more thoroughly and return to improve
weak areas.

**Independent Test**: Display the score breakdown for a profile and verify
each parameter's contribution matches the scoring rules.

**Acceptance Scenarios**:

1. **Given** an editor with a score of 52/100,
   **When** they view their score breakdown,
   **Then** they see 7 rows: Portfolio (X/30), Avis clients (X/20),
   Experience (X/15), Competences (X/10), References (X/10),
   Profil (X/8), Reactivite (X/7) — totaling 52.

2. **Given** an editor with 0 portfolio links and 0 client reviews,
   **When** they view their score breakdown,
   **Then** Portfolio shows 0/30 and Avis clients shows 0/20, clearly
   indicating these are the biggest areas for improvement.

---

### User Story 3 - Score Recalculation on Profile Edit & Activity (Priority: P3)

An editor's score and level are recalculated automatically whenever
relevant data changes. There are three triggers:

1. **Profile edit**: The editor updates their profile (adds portfolio links,
   changes bio, updates response time, etc.). The score recalculates
   immediately on save.
2. **New client review**: A creator leaves a review/rating after a completed
   project. The "Avis clients" parameter recalculates based on the updated
   review count and average rating.
3. **Completed project**: When a project is marked as completed, any
   associated review data feeds into the score. The editor's level reflects
   their growing track record.

If the recalculated score crosses a level threshold, the level updates
everywhere (profile, catalog badge, score breakdown).

**Why this priority**: The scoring system loses credibility if it only runs
once at onboarding. Editors must see their level evolve as they build
their reputation. Creators must see up-to-date levels in the catalog.

**Independent Test**: Trigger each of the 3 recalculation events and verify
the score updates correctly.

**Acceptance Scenarios**:

1. **Given** an editor with score 48 (Confirme) adds 2 more portfolio links,
   **When** they save their profile,
   **Then** their score updates to reflect the new portfolio count and their
   level may change accordingly.

2. **Given** an editor removes their bio,
   **When** they save their profile,
   **Then** the profile completion score drops by 1 point and the total
   score reflects this change.

3. **Given** an editor with 0 reviews (0/20 Avis clients) completes a project,
   **When** the creator leaves a 5-star review,
   **Then** the Avis clients parameter updates to 5/20 (1-2 reviews,
   rating >=4.5) and the total score increases by 5 points.

4. **Given** an editor with 10 reviews averaging 4.8 (17/20),
   **When** a new review brings the total to 11 reviews averaging 4.85,
   **Then** the Avis clients score remains 17/20 (still in the 10-20
   reviews, >=4.8 bracket).

5. **Given** an editor with score 64 (Expert, near threshold),
   **When** a new 5-star review pushes their total score to 69,
   **Then** their level changes from "Expert" to "Star" and the catalog
   badge updates accordingly.

---

### User Story 4 - Level Badge in Catalog (Priority: P4)

When a creator browses the editor catalog, each editor card displays the
editor's level name (e.g., "Expert", "Star") as a badge. The level
provides a quick trust signal without exposing the raw score.

**Why this priority**: The catalog is where creators make hiring decisions.
Level badges are the primary consumer-facing output of the scoring system.

**Independent Test**: View the catalog as a creator and verify each editor
card shows their correct level badge.

**Acceptance Scenarios**:

1. **Given** a creator viewing the catalog,
   **When** an editor has level "Star" (score 66-80),
   **Then** their catalog card displays a "Star" badge.

2. **Given** an editor's level changes from "Confirme" to "Expert" after a
   profile update or new review,
   **When** a creator views the catalog,
   **Then** the editor's badge shows the updated "Expert" level.

---

### Edge Cases

- What happens when a field collected during onboarding is later deleted
  (e.g., all portfolio links removed)? The score for that parameter drops
  to 0 and level is recalculated downward.
- What happens when an editor has exactly a threshold score (e.g., 15, 25,
  50)? The thresholds are inclusive on the lower bound: 0-15 = Debutant,
  16-25 = Prospect, etc.
- What happens with the "Avis clients" parameter before any reviews exist?
  It scores 0/20. The scoring system MUST work correctly with 0 reviews.
- What happens if `creditedChannels` is a single text field with multiple
  channels separated by commas or newlines? The system counts individual
  references from the parsed field.
- What is the 8th profile completion point? Assumed to be
  `presentationVideoUrl` (presentation video uploaded).
- What happens when a review is deleted or modified? The score
  recalculates based on current review data (updated count + average).
- What happens when a project is completed but the creator never
  leaves a review? The Avis clients score is unaffected — only
  submitted reviews count.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST compute an editor's total score (0-100) from
  exactly 7 weighted parameters: Portfolio (30), Avis clients (20),
  Experience (15), Competences & logiciels (10), References externes (10),
  Completion du profil (8), Reactivite declaree (7).
- **FR-002**: System MUST assign one of 7 levels based on the total score:
  Debutant (0-15), Prospect (16-25), Confirme (26-50), Expert (51-65),
  Star (66-80), Elite (81-90), Legende (91-100).
- **FR-003**: Portfolio scoring MUST follow these non-overlapping brackets
  based on clip count: 0-1 clips = 0pt, 2-3 = 10pt, 4-5 = 18pt,
  6-7 = 22pt, 8+ = 26pt. The 30pt tier (8+ clips all formats with
  references) is deferred to a future version with quality tagging.
- **FR-004**: Avis clients scoring MUST follow these brackets based on
  review count and average rating: 0 reviews = 0pt, 1-2 reviews
  rating <4.0 = 3pt, 1-2 rating >=4.5 = 5pt, 3-5 rating >=4.5 = 9pt,
  5-10 rating >=4.5 = 14pt, 10-20 rating >=4.8 = 17pt,
  20+ rating >=4.9 = 20pt. For undefined ranges (e.g., 1-2 reviews
  with rating 4.0-4.49, or 3+ reviews with rating below threshold),
  the editor receives the highest bracket whose conditions are fully
  met (best qualifying bracket, fall-through approach).
- **FR-005**: Experience scoring MUST map declared experience: <6m = 2pt,
  6m-1y = 5pt, 1-3y = 8pt, 3-5y = 11pt, 5-7y = 13pt, 7y+ = 15pt.
- **FR-006**: Competences & logiciels scoring MUST be based on combined
  total selections (skills + software): 0-3 total = 0pt, 4-5 = 4pt,
  6-7 = 6pt, 8-9 = 8pt, 10+ total = 10pt.
- **FR-007**: References externes scoring MUST count credited channels:
  0 = 0pt, 1 = 3pt, 2-3 = 5pt, 4-5 = 7pt, 6-10 = 9pt, 11+ = 10pt.
- **FR-008**: Profil completion scoring MUST award 1 point each for: bio,
  avatar, availability, pricing grid, response time, external
  reference/personal site, presentation video. +1 bonus if all 7
  elements are filled (total 8 points max).
- **FR-009**: Reactivite scoring MUST map declared response time:
  not set = 0pt, <1 week = 1pt, <48h = 2pt, <24h = 3pt,
  <12h = 5pt, <4h = 7pt.
- **FR-010**: The score MUST be recalculated on three triggers:
  (a) onboarding completion, (b) profile edit/save, (c) new client
  review received after a completed project. Each trigger MUST
  persist the updated score and level to the profile.
- **FR-011**: The level name MUST be displayed on the editor's catalog
  card visible to creators.
- **FR-012**: The score breakdown (per-parameter points) MUST be
  visible in two locations: (a) Step 7 during onboarding, and
  (b) a dedicated section in the profile editor page.
- **FR-013**: The scoring function MUST be deterministic — same inputs
  always produce the same score.
- **FR-014**: The total score MUST equal the sum of all 7 individual
  parameter scores (no rounding or capping beyond parameter maximums).
- **FR-015**: Levels MUST reflect the current score at all times. If an
  editor's score decreases (e.g., removing portfolio links), their
  level MUST drop accordingly. No high-watermark protection.
- **FR-016**: Step 7 of onboarding MUST display the auto-calculated level
  and score breakdown as a read-only preview. The manual level picker
  MUST be removed. The editor cannot override their computed level.

### Key Entities

- **EditorScore**: The computed score for an editor profile. Contains
  total score (0-100), individual parameter scores (7 values),
  and the derived level name. Linked 1:1 to a profile.
- **Level**: One of 7 tiers (Debutant, Prospect, Confirme, Expert,
  Star, Elite, Legende) with fixed score thresholds.
- **ScoringParameter**: One of 7 scoring dimensions with a name,
  max points, and bracket rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of editors completing onboarding are assigned a level
  matching the scoring rules — no manual intervention needed.
- **SC-002**: Score breakdown is visible within 1 second of reaching
  the level step or profile page.
- **SC-003**: Level badges appear on all editor cards in the catalog
  without additional loading time.
- **SC-004**: When an editor updates their profile, their score and
  level reflect the change within 2 seconds.
- **SC-005**: The scoring system distributes editors across at least
  4 of the 7 levels (not clustering everyone in a single tier),
  validated against demo/test profiles with varied data.

## Clarifications

### Session 2026-03-31

- Q: Is the review/rating system in scope for this feature? → A: OUT of scope. Scoring accepts review data as input but scores 0/20 until a separate review feature is built.
- Q: How to handle Avis clients rating gaps (e.g., 1-2 reviews at 4.3)? → A: Best qualifying bracket — fall through to the highest bracket whose conditions are fully met.
- Q: Portfolio overlap at 5 clips (4-5 vs 5-7 brackets)? → A: Redefine as non-overlapping: 0=0, 2-3=10, 4-5=18, 6-7=22, 8+=26/30.
- Q: Where does the score breakdown appear? → A: Both Step 7 during onboarding AND a new section in the profile editor page.
- Q: What does "all checked" mean for Competences & logiciels (10pt)? → A: Combined count: 10+ total selections across skills and software combined = 10pt.
- Q: Can an editor's level go down? → A: Yes, levels are always live and reflect current profile state. No high-watermark protection.
- Q: Remove manual level override from Step 7? → A: Yes, remove the picker. Step 7 remains as a read-only preview of the auto-calculated level and badge.

## Assumptions

- The "Avis clients" parameter (20 pts) requires review data (count +
  average rating) as input. The scoring function MUST accept this data
  and compute the correct bracket. If no reviews exist yet for an
  editor, the parameter scores 0/20. The review collection system
  (table, UI, submission flow) is OUT of scope for this feature and
  will be built as a separate feature. The scoring function is designed
  to integrate review data when it becomes available.
- The existing `creditedChannels` field (single text) will need to
  support counting individual references. Assumption: references
  are parsed by splitting on commas or newlines.
- The 8th profile completion point is awarded for having a
  presentation video (`presentationVideoUrl`).
- The experience field values in the current onboarding ('<6m',
  '6m1y', '1-3y', '3-5y', '5y+') will be extended to support the
  brief's 6 tiers (adding '5-7y' and '7y+' as distinct from '5y+').
- Portfolio scoring brackets that reference "quality" and "variety"
  (22pt, 26pt, 30pt tiers) will be approximated by count only in v1,
  since there is no automated quality assessment. Qualitative
  differentiation (e.g., multi-format, with references) is deferred
  to a future manual review or tagging system.
- The response time field values in onboarding ('<1h', '<4h', '<24h',
  '<48h') will be extended to match the brief's tiers (adding
  '<12h', '<1 week', and a "not set" state).
- Scoring runs client-side during onboarding and profile editing. The
  computed level is persisted to the profile record on save.
- For review-triggered recalculation, the score is recomputed when a
  new review is submitted. The review data (count + average rating)
  is read from the reviews table at scoring time.

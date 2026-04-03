# Research: Editor Scoring System & Levels

## Decision 1: Scoring function architecture

**Decision**: Pure synchronous function `computeScoreDetails(formData, reviewData)`.

**Rationale**: The scoring engine is a deterministic mapping from profile
data to a score. No async operations needed — all data is already in
memory (formData from context, reviewData passed as parameter). Keeping
it pure makes it testable and reusable across onboarding and profile editor.

**Alternatives considered**:
- Supabase database function (server-side): Rejected. Adds complexity,
  requires schema migration, harder to debug. Constitution principle VII
  (simplicity) favors client-side.
- React hook wrapping score computation: Rejected. The function is
  stateless — a hook adds unnecessary indirection.

## Decision 2: Level index storage strategy

**Decision**: Keep `assigned_level` as integer column (0-6 index into
new LEVELS array). Redefine LEVELS from 10 entries to 7.

**Rationale**: No schema migration needed. The column already stores an
integer. Changing the LEVELS array is a code-only change. Old profiles
with indices > 6 will be re-scored on next load/save — the
`computeAutoLevel` function always recalculates.

**Alternatives considered**:
- Store level name as text (e.g., 'Expert'): Rejected. Requires schema
  migration and changes every query. Integer lookup is simpler.
- Add a new column `score_level` alongside `assigned_level`: Rejected.
  Adds confusion. One source of truth is better.

## Decision 3: Score breakdown UI component

**Decision**: Create a shared `ScoreBreakdown.jsx` component used in
both Step 7 and ProfileEditor.

**Rationale**: DRY — the breakdown displays the same data in both
locations. A single component ensures consistency. Constitution
principle VII allows this because it solves a real duplication problem
(two places showing the exact same data).

**Alternatives considered**:
- Inline the breakdown in each component: Rejected. Duplicates 50+
  lines of identical UI logic.
- Use a hook that returns JSX: Anti-pattern in React.

## Decision 4: Experience and response time field extension

**Decision**: Add new option values to Step 3 (experience) and Step 6
(response time). Map legacy values on load.

**Rationale**: Backward-compatible. Existing profiles with old values
are mapped to the closest new value when loaded. No database migration
needed — the column is text type, accepts any string.

**Alternatives considered**:
- Database migration to update all existing values: Rejected. Overkill
  for a v0 with few profiles. Runtime mapping is sufficient.
- Keep old values and map them only in scoring: Rejected. The onboarding
  UI should show the correct options. Mapping on load ensures consistency.

## Decision 5: creditedChannels reference counting

**Decision**: Parse the text field by splitting on commas, newlines, and
semicolons. Count non-empty trimmed entries.

**Rationale**: Simple and covers common input patterns. No schema change
needed — the field remains text type.

**Alternatives considered**:
- Convert to array field (text[]): Rejected. Requires schema migration
  and changes to Step 4 UI. The text field with parsing is sufficient
  for v1.
- Regex-based URL extraction: Over-engineered. Users may enter channel
  names, not URLs.

## Decision 6: Review data integration point

**Decision**: The scoring function accepts `reviewData = { count, avgRating }`
as a parameter with default `{ count: 0, avgRating: 0 }`. No review
system is built in this feature.

**Rationale**: The function signature is future-proofed. When the review
feature is built, it only needs to pass the data to the existing
function. No scoring code changes needed.

**Alternatives considered**:
- Fetch review data inside the scoring function: Rejected. Makes the
  function async and couples it to Supabase. Violates pure function
  principle.
- Ignore reviews entirely (remove parameter): Rejected. The spec
  requires the Avis clients parameter to exist and score 0 when no
  reviews are present.

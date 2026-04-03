# Quickstart: Editor Scoring System & Levels

## Verify the feature works

### 1. Start the dev server

```bash
npm run dev
```

### 2. Test onboarding scoring (US1 — P1)

1. Open the app and click "Tester l'onboarding" (demo onboarding mode).
2. Fill Step 2 (identity): set name, username, avatar, availability.
3. Fill Step 3 (skills): select 3+ skills, 3+ software, set experience to "1-3y".
4. Fill Step 4 (portfolio): add 3 portfolio links, add 2 credited channels
   (comma-separated in the text field).
5. Fill Step 5 (pricing): set hourly rate.
6. Fill Step 6 (presentation): write a bio, set response time to "<24h".
7. Reach Step 7 — verify:
   - No level picker visible (removed).
   - Score breakdown shows 7 parameters with points.
   - Total score and level name are displayed.
   - Level matches the scoring brackets (roughly "Expert" for this input).

### 3. Test score breakdown (US2 — P2)

1. On Step 7, verify each parameter row shows: label, current points,
   max points, and a visual bar.
2. Verify the 7 rows sum to the displayed total.

### 4. Test profile editor recalculation (US3 — P3)

1. Complete onboarding and publish the profile.
2. Go to `/editor` (profile editor page).
3. Verify the score breakdown section is visible.
4. Remove a portfolio link → save → verify score decreases.
5. Add the link back → save → verify score increases.
6. Change response time from "<24h" to "<4h" → save → verify
   reactivity score increases from 3 to 7.

### 5. Test catalog badge (US4 — P4)

1. Log out. Log in as the demo creator account.
2. Go to `/catalog`.
3. Find the editor whose profile you just modified.
4. Verify their card shows the correct level badge matching
   the level from step 4 above.

### 6. Test edge cases

- **Minimal profile**: Create a profile with almost no data.
  Verify level = "Debutant" and score is low (< 15).
- **Level downgrade**: Start with a well-filled profile,
  then remove fields. Verify level drops.
- **Legacy migration**: If an existing profile has `experience = '5y+'`,
  verify it maps to `7y+` on load.

## Key files

| File | Role |
|------|------|
| `src/lib/computeLevel.js` | Scoring engine (pure function) |
| `src/constants/levels.js` | 7 level definitions |
| `src/components/ui/ScoreBreakdown.jsx` | Shared breakdown component |
| `src/components/steps/Step7Level.jsx` | Onboarding level preview |
| `src/components/editor/ProfileEditor.jsx` | Profile editor with breakdown |
| `src/components/ui/EditorCard.jsx` | Catalog card with level badge |

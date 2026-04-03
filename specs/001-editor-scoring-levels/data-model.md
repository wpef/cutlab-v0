# Data Model: Editor Scoring System & Levels

## Entities

### Profile (existing — modified fields)

| Field | Type | Change | Notes |
|-------|------|--------|-------|
| assigned_level | integer | SEMANTICS CHANGE | Was 0-9 (10 levels), now 0-6 (7 levels) |
| experience | text | VALUES EXTENDED | Added: '5-7y', '7y+'. Legacy '5y+' maps to '7y+' |
| response_time | text | VALUES EXTENDED | Added: '<12h', '<1w'. Legacy '<1h' maps to '<4h' |
| credited_channels | text | PARSING CHANGE | Now split on comma/newline/semicolon for counting |

No new columns. No schema migration.

### LEVELS constant (code-only, replaces existing)

| Index | Name | Emoji | Score Range |
|-------|------|-------|-------------|
| 0 | Debutant | (TBD) | 0-15 |
| 1 | Prospect | (TBD) | 16-25 |
| 2 | Confirme | (TBD) | 26-50 |
| 3 | Expert | (TBD) | 51-65 |
| 4 | Star | (TBD) | 66-80 |
| 5 | Elite | (TBD) | 81-90 |
| 6 | Legende | (TBD) | 91-100 |

### ScoreResult (computed, not persisted — returned by computeScoreDetails)

```
{
  total: number (0-100),
  details: {
    portfolio: number (0-26),      // v1 max, 30 in future
    reviews: number (0-20),         // 0 until review system built
    experience: number (0-15),
    skills: number (0-10),
    references: number (0-10),
    completion: number (0-8),
    reactivity: number (0-7)
  },
  levelIndex: number (0-6)
}
```

## Scoring Bracket Tables

### Portfolio (max 26pt in v1)

| Clip count | Points |
|------------|--------|
| 0-1 | 0 |
| 2-3 | 10 |
| 4-5 | 18 |
| 6-7 | 22 |
| 8+ | 26 |

### Avis clients (max 20pt — 0 until review system exists)

| Count | Rating threshold | Points |
|-------|-----------------|--------|
| 0 | — | 0 |
| 1-2 | < 4.0 | 3 |
| 1-2 | >= 4.5 | 5 |
| 3-5 | >= 4.5 | 9 |
| 5-10 | >= 4.5 | 14 |
| 10-20 | >= 4.8 | 17 |
| 20+ | >= 4.9 | 20 |

Fall-through: best qualifying bracket applies for undefined ranges.

### Experience (max 15pt)

| Value | Points |
|-------|--------|
| <6m | 2 |
| 6m1y | 5 |
| 1-3y | 8 |
| 3-5y | 11 |
| 5-7y | 13 |
| 7y+ | 15 |

### Competences & logiciels (max 10pt)

| Combined count (skills + software) | Points |
|-------------------------------------|--------|
| 0-3 | 0 |
| 4-5 | 4 |
| 6-7 | 6 |
| 8-9 | 8 |
| 10+ | 10 |

### References externes (max 10pt)

| Credited channels count | Points |
|--------------------------|--------|
| 0 | 0 |
| 1 | 3 |
| 2-3 | 5 |
| 4-5 | 7 |
| 6-10 | 9 |
| 11+ | 10 |

### Completion du profil (max 8pt)

+1 each for: bio, avatar, availability, pricing (hourlyRate),
response time, external reference (socialLinks), presentation video.
+1 bonus if all 7 are filled. Total: 8pt max.

### Reactivite declaree (max 7pt)

| Value | Points |
|-------|--------|
| (not set) | 0 |
| <1w | 1 |
| <48h | 2 |
| <24h | 3 |
| <12h | 5 |
| <4h | 7 |

## State Transitions

### Level Assignment Flow

```
Profile data changed (onboarding / edit / review)
    ↓
computeScoreDetails(formData, reviewData)
    ↓
Returns { total, details, levelIndex }
    ↓
assignedLevel = levelIndex
    ↓
saveProfile() persists assigned_level to Supabase
    ↓
Catalog reads assigned_level → displays badge
```

### Legacy Value Migration (runtime, on profile load)

```
experience '5y+' → '7y+'
responseTime '<1h' → '<4h'
assignedLevel > 6 → recalculate from formData
```

# Plan d'exécution — Corrections audit `6304e21`

## Résumé
- **Tâches totales :** 18 (0 exclues)
- **Commits prévus :** 5
- **Lanes parallèles :** 4 max simultanément
- **Modèles :** Sonnet pour tout (corrections ciblées, pas d'architecture)

## Niveau 0 — Séquentiel
| Lane | Tâche | Modèle | Gate |
|------|-------|--------|------|
| A | T000: Cleanup fichiers/code mort | Sonnet | Non |

## Niveau 1 — Parallèle (après T000)
| Lane | Tâche | Modèle | Gate |
|------|-------|--------|------|
| A | T001: Migration 006 request_id | Sonnet | Non |
| B | T002: Migration 012 deliverables jsonb | Sonnet | Non |
| C | T003: Migration 011 admin RLS | Sonnet | Non |

→ **Commit 1 :** `fix(db): RLS 006 column name + deliverables jsonb + admin policies`

## Niveau 2 — Parallèle (après niveau 1)
| Lane | Tâche | Modèle | Gate |
|------|-------|--------|------|
| A | T004: useMessages.js request_id | Sonnet | Non |
| B | T005: deliverables rendu JSX | Sonnet | Non |
| C | T006: Catalog goToMessaging | Sonnet | Non |
| D | T007: EditorDetail name hoisting | Sonnet | Non |
| D | T008: Step7Preview pricing | Sonnet | Non |

→ **Commit 2 :** `fix: useMessages column, deliverables render, goToMessaging, EditorDetail, Step7 pricing`

## Niveau 3 — Parallèle (après niveau 2)
| Lane | Tâche | Modèle | Gate |
|------|-------|--------|------|
| A | T009: Admin guard interne | Sonnet | Non |
| B | T010: CSP vercel.json | Sonnet | Non |

→ **Commit 3 :** `fix(security): admin component guard + CSP`

## Niveau 4 — Parallèle (après niveau 3)
| Lane | Tâche | Modèle | Gate |
|------|-------|--------|------|
| A | T011: ChatView offre active | Sonnet | Non |
| A | T012: ProfileEditor saveStatus | Sonnet | Non |
| B | T013: Step1Account authError | Sonnet | Non |
| B | T014: MesProjetsMonteur badge | Sonnet | Non |
| C | T015: profileCompletion Step N | Sonnet | Non |
| C | T016: document.title dynamique | Sonnet | Non |

→ **Commit 4 :** `fix(ux): chat offer, saveStatus, authError, badge, completions, titles`

## Niveau 5 — Séquentiel (après niveau 4)
| Lane | Tâche | Modèle | Gate |
|------|-------|--------|------|
| A | T017: Typos accents (9 fichiers) | Sonnet | Non |

→ **Commit 5 :** `fix(typos): accents and wording`

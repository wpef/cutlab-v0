# Progress — Recette pré-MEP

| ID | Tâche | Réf. | Lane | Status | Notes |
|----|-------|------|------|--------|-------|
| T001 | Fix RLS projet filled pour monteur | B3.4 | A | ✅ | Migration `013_rls_projects_accepted_editor.sql` |
| T002 | Identifiant projet dans liste conversations | B3.1 | B | ✅ | Batch-fetch project titles dans MessagingHub |
| T003 | Retirer bannière pré-rempli | B3.3 | C | ✅ | Banner + useState → useRef |
| T004 | Round events dans timeline chat | CHAT1 | D | ✅ | RoundEventBubble.jsx + timeline merge |
| T005 | Bouton "Clore le projet" créateur | B3.5 | E | ✅ | Visible feedback+closed steps |
| T006 | Vérifier prefill offre monteur | B3.2 | C | ✅ | Vérifié — fonctionne pour les deux rôles, aucun fix nécessaire |
| T007 | Livrables validés dans sidebar | CHAT2 | E | ✅ | Section tracker-validated-section |
| T008 | Edit offer (modifier) | CHAT3 | F | ✅ | Cancel + recreate (pas d'UPDATE in-place) |

## Build

- `npx vite build` : ✓ built in 1.85s
- Pas d'erreurs console

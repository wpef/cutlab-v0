# Plan d'exécution — Recette pré-MEP

**Branche** : `plan-exec/recette-20260429`
**Source** : `plans/PLAN_RECETTE.md`
**Date** : 2026-04-29

## Récapitulatif

- **Tâches totales** : 8 (0 exclues)
- **Lanes parallèles** : 6 (A-F)
- **Niveaux** : 3 (Level 0 → 1 → 2)
- **Modèles** : 1× Opus (T008), 1× Haiku (T003), 6× Sonnet
- **Gates utilisateur** : 1 (T008 — edit offer, touche 3 fichiers)

---

## Ordre d'exécution

### Level 0 (parallèle — 5 lanes indépendantes)

| Lane | Tâche | Réf. plan | Modèle | Gate | Fichiers |
|------|-------|-----------|--------|------|----------|
| **A** | T001: Fix RLS projet filled pour monteur | B3.4 | Sonnet | — | `013_rls_projects_accepted_editor.sql` |
| **B** | T002: Nom du projet au lieu du créateur dans liste conversations | B3.1 | Sonnet | — | `MessagingHub.jsx` |
| **C** | T003: Retirer bannière "pré-rempli" | B3.3 | Haiku | — | `OfferForm.jsx` |
| **D** | T004: Événements rounds dans timeline chat | CHAT1 | Sonnet | — | `ChatView.jsx`, `RoundEventBubble.jsx`, `global.css` |
| **E** | T005: Bouton "Clore le projet" créateur | B3.5 | Sonnet | — | `CollabTracker.jsx` |

### Level 1 (après Level 0 — contraintes de fichier)

| Lane | Tâche | Réf. plan | Modèle | Dépend de | Fichiers |
|------|-------|-----------|--------|-----------|----------|
| **C** | T006: Vérifier/fixer prefill offre pour monteur | B3.2 | Sonnet | T003 (même fichier) | `OfferForm.jsx` |
| **E** | T007: Section "Livrables validés" dans sidebar tracker | CHAT2 | Sonnet | T005 (même fichier) | `CollabTracker.jsx` |

### Level 2 (après Level 1 — touche OfferForm + CollabTracker)

| Lane | Tâche | Réf. plan | Modèle | Gate | Dépend de | Fichiers |
|------|-------|-----------|--------|------|-----------|----------|
| **F** | T008: Edit offer (modifier au lieu d'annuler) | CHAT3 | **Opus** | **Oui** | T006, T007 | `OfferForm.jsx`, `CollabTracker.jsx`, `CollabContext.jsx` |

---

## Graphe de dépendances

```
Level 0:    T001(A)   T002(B)   T003(C)   T004(D)   T005(E)
                                  │                    │
Level 1:                        T006(C)              T007(E)
                                  │                    │
Level 2:                        T008(F) ◄──────────────┘
                                 ⚠️ Gate
```

## Détail des tâches

### T001 — Fix RLS projet filled (B3.4) `Lane A`
- **Fichier** : `supabase/migrations/013_rls_projects_accepted_editor.sql`
- DROP + RECREATE policy `projects_select_published` avec clause supplémentaire :
  `EXISTS (SELECT 1 FROM contact_requests WHERE project_id = projects.id AND editor_id = auth.uid() AND status = 'accepted')`
- Zéro code frontend

### T002 — Identifiant projet dans liste conversations (B3.1) `Lane B`
- **Fichier** : `src/components/pages/MessagingHub.jsx`
- Ligne 115 : pour `userRole === 'editor'`, afficher `request.project_title` (ou le titre du projet lié) au lieu de `creator_name`
- Nécessite d'enrichir les requests avec le titre du projet (join ou fetch séparé)
- Fallback sur `creator_name` si pas de projet

### T003 — Retirer bannière pré-rempli (B3.3) `Lane C`
- **Fichier** : `src/components/pages/OfferForm.jsx`
- Supprimer le bloc lignes 136-140 + l'état `projectLoaded` si plus utilisé

### T004 — Round events dans timeline (CHAT1) `Lane D`
- **Fichiers** : `ChatView.jsx`, nouveau `RoundEventBubble.jsx`, `global.css`
- Étendre le `useMemo` timeline (lignes 62-65) pour inclure les rounds
- Nouveau composant pour les messages système (révision demandée, livrables validés, livrables envoyés)

### T005 — Bouton "Clore le projet" (B3.5) `Lane E`
- **Fichier** : `src/components/messaging/CollabTracker.jsx`
- Rendre le bouton visible dans `feedback` ET `closed` steps, sans pré-requis de review
- Utiliser `closeProject()` existant dans CollabContext
- Afficher état "Projet clôturé" après action

### T006 — Vérifier prefill offre monteur (B3.2) `Lane C`
- **Fichier** : `src/components/pages/OfferForm.jsx`
- Vérifier que le useEffect prefill (lignes 47-75) fonctionne pour les deux rôles
- Fix si nécessaire

### T007 — Livrables validés dans sidebar (CHAT2) `Lane E`
- **Fichier** : `src/components/messaging/CollabTracker.jsx`
- Nouvelle section filtrant `rounds.filter(r => r.status === 'validated')`
- Affichage : ✅ vX — validé le [date] + lien cliquable

### T008 — Edit offer (CHAT3) `Lane F` ⚠️ GATE
- **Fichiers** : `OfferForm.jsx`, `CollabTracker.jsx`, `CollabContext.jsx`
- Mode édition via `?edit=<offer_id>` query param
- UPDATE in-place + notification "Offre modifiée"
- Bouton "Modifier" dans tracker à côté de "Annuler"

---

## Estimation

| Niveau | Tâches | Séquentiel | Parallèle |
|--------|--------|------------|-----------|
| Level 0 | 5 | ~25 min | ~8 min |
| Level 1 | 2 | ~10 min | ~5 min |
| Level 2 | 1 | ~10 min | ~10 min |
| **Total** | **8** | **~45 min** | **~23 min** |

# Plan d'exécution — batch 2 corrections feedback

**Branche d'exécution** : `plan-exec/20260429-1200-batch2`
**Source** : `plan.md`
**Date** : 2026-04-29

## Récapitulatif

- **Tâches totales** : 10 (3 explicitement exclues vers PLAN_PHASE2.md)
- **Lanes parallèles** : 5
- **Modèles** : 1× Opus (T008), 9× Sonnet
- **Gates utilisateur** : aucun (changements reversibles via git revert)

---

## Items exclus (déjà documentés dans plans/PLAN_PHASE2.md)

| ID | Sujet | Raison |
|----|-------|--------|
| X001 | Round events dans timeline du chat (CHAT1) | Améliorations conversation reportées |
| X002 | Liens livrables validés dans sidebar (CHAT2) | Idem |
| X003 | Edit offer (modifier) UI (CHAT3) | T008 fait Cancel only |

---

## Ordre d'exécution

### Level 0 (parallèle — 5 lanes)

| Lane | Tâches | Modèle | Pourquoi cette lane |
|------|--------|--------|---------------------|
| **A** | T001 → T003 | Sonnet | Conflit `global.css` (T001 et T003 modifient le même fichier) |
| **B** | T002 ∥ T004 ∥ T005 | Sonnet | Fichiers indépendants (ApplicationCard, ProjectFilters, ProjectContext) |
| **C** | T007 | Sonnet | OfferForm seul, indépendant |
| **D** | T009 → T006 → T008 | Sonnet → Sonnet → Opus | T006/T008 modifient ChatView.jsx, T008 utilise T009 |
| **E** | T010 | (MCP Supabase, pas de code) | Re-seed BDD via SQL |

Les 5 lanes peuvent démarrer en même temps.

### Level 1 (post-execution)

- Build prod (`npx vite build`) — sanity check
- Dev server smoke test — log console errors

---

## Détail des tâches

### Lane A (séquentiel — global.css partagé)

#### T001 — ProjectForm UX dates (Sonnet)
- `src/components/pages/ProjectForm.jsx` : dates start+deadline sur même ligne, défaut today, durée calculée
- `src/styles/global.css` : icône calendrier visible en dark theme + media query mobile

#### T003 — ProjectDetail loading + hero (Sonnet)
- `src/components/pages/ProjectDetail.jsx` : state notFound, 3 hero items toujours rendus avec "—" si vide
- `src/styles/global.css` : `.project-detail-hero-item { flex: 1 1 0; min-width: 120px; }`

### Lane B (parallèle — fichiers indépendants)

#### T002 — ApplicationCard fix (Sonnet, trivial)
- `src/components/projects/ApplicationCard.jsx` ligne 51 : `goToEditorDetail(application.editor_id)` au lieu de `profile.id`

#### T004 — ProjectFilters thumbnail toggle (Sonnet, trivial)
- `src/components/projects/ProjectFilters.jsx` setFilter : `if (value === undefined || next[key] === value) delete next[key]`

#### T005 — application_count dans fetchMyProjects (Sonnet)
- `src/context/ProjectContext.jsx` : sub-select PostgREST `contact_requests!project_id(id, status)`, enrichir avec `application_count = pending count`

### Lane C (indépendant)

#### T007 — OfferForm prefill (Sonnet)
- `src/components/pages/OfferForm.jsx` : budget_min en fallback de budget_fixed, fix loadRequests si request null

### Lane D (séquentiel — dépendance + ChatView partagé)

#### T009 — cancelOffer + closeProject (Sonnet)
- `src/context/CollabContext.jsx` : `cancelOffer(offerId)`, `closeProject(request, offer)` + exposer dans useCollab

#### T006 — ChatView header projet (Sonnet)
- `src/components/pages/ChatView.jsx` : pour editor avec project_id, header affiche project.title

#### T008 — Tracker offer pending + cancel + end project (Opus)
- `src/components/pages/ChatView.jsx` : passer latest non-cancelled offer (any status) au tracker
- `src/components/messaging/CollabTracker.jsx` : offer_sent step Modify/Cancel pour sender, "Mettre fin au projet" en feedback step

### Lane E (BDD)

#### T010 — Re-seed DB (MCP Supabase)
- UPDATE projects (10 lignes) + offers (3 lignes) avec keys valides : content_format, niches, mission_type, experience_level, deliverables[].type, quality

---

## Validation finale

Voir section "Validation finale" du plan.md pour le golden path complet (login créateur + login monteur + parcours formulaires).

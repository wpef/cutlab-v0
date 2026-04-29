# Plan Recette — corrections fonctionnelles à traiter avant mise en prod

> **Priorité haute** — à traiter à la prochaine session, avant le déploiement public.
>
> Ce fichier rassemble les retours fonctionnels et visuels remontés lors de la **recette manuelle** post-merge production-ready. Pas de réflexion long terme ici (cf. `PLAN_PHASE2.md` pour accessibilité/observabilité, `PLAN_MONETISATION.md` pour business). Uniquement des bugs et UX cassée qui doivent être nets avant que des utilisateurs réels touchent l'app.

## Source

- **CHAT1-CHAT3** : retours sur les conversations remontés en fin de session batch 2 (2026-04-29)
- **B3.1-B3.5** : retours suite au test post-merge du batch 2 (2026-04-29). Les items B3.4 et B3.5 sont des **bugs résiduels du batch 2** (T003 et T008 incomplets) et doivent être traités en priorité.

## Ordre de priorité suggéré

1. **B3.4** — Monteur bloqué sur détail projet pourvu (RLS) — **bloque les workflows**
2. **B3.1** — Identifiant projet pour le monteur partout — cohérence UX
3. **B3.5** — Bouton clore/archiver projet côté créateur — boucle de fin manquante
4. **B3.3** — Retirer bannière "pré-rempli" — propreté visuelle
5. **B3.2** — Préfill form offre côté monteur — feature gap mineur
6. **CHAT1** — Feedback rounds dans timeline du chat — enrichissement UX
7. **CHAT2** — Liens livrables validés en sidebar — enrichissement UX
8. **CHAT3** — Edit offer (modifier au lieu d'annuler seulement) — feature gap

---

## CHAT — Améliorations conversation

### CHAT1 — Échanges de feedback dans le corps de la conversation

Aujourd'hui les retours créateur (commentaires de révision sur un round) n'apparaissent que dans la sidebar `CollabTracker` — pas dans le timeline du chat.

**Comportement attendu** : chaque demande de révision et validation produit une "system message" / "tracker event" dans le timeline du chat, à côté des messages texte et offres :
- "Le créateur a demandé une révision (v2) — \"Les hooks sont trop longs sur les shorts 3, 5, 7\""
- "Les livrables v2 ont été validés par le créateur"
- "Le monteur a partagé les livrables v3 (lien WeTransfer)"

Implémentation suggérée : étendre le timeline `useMemo` dans `ChatView.jsx` pour inclure les `rounds` triés par `created_at`, avec un nouveau `_type: 'round_event'` rendu via un composant `<RoundEventBubble>`.

**Fichiers** : `src/components/pages/ChatView.jsx`, nouveau `src/components/messaging/RoundEventBubble.jsx`

---

### CHAT2 — Liens des livrables validés dans la sidebar

Aujourd'hui la sidebar tracker affiche les rounds dans la liste `tracker-rounds-list` mais quand un round est `validated`, le lien WeTransfer/Drive n'est plus mis en avant — il est noyé dans le composant `DeliverableRoundItem`.

**Comportement attendu** : un bloc dédié dans la sidebar "Livrables validés" liste les rounds validés avec leurs liens cliquables, comme pour les feedbacks :
```
✅ v1 — validé le 12 mai
   → Lien WeTransfer (cliquable)
✅ v2 — validé le 18 mai
   → Lien Drive (cliquable)
```

**Fichier** : `src/components/messaging/CollabTracker.jsx` — ajouter une section après les reviews ou avant, avec filter `rounds.filter(r => r.status === 'validated')`.

---

### CHAT3 — Edit offer (modifier au lieu d'annuler seulement)

Le batch 2 (T08) implémente uniquement l'annulation d'une offre. La modification nécessite :
- Réouverture du formulaire `/offer/new` pré-rempli avec les valeurs de l'offre courante
- Soit créer une nouvelle offre et marquer l'ancienne `superseded`, soit faire un UPDATE in-place
- Notification au receveur "L'offre a été modifiée"

**Fichiers** : `src/components/pages/OfferForm.jsx` (mode édition via `?edit=<offer_id>` query param), `src/components/messaging/CollabTracker.jsx` (réactiver le bouton "✏️ Modifier")

---

## BATCH3 — Retours suite au test post-merge

5 issues remontés après le merge du batch 2. Items B3.4 et B3.5 sont des **bugs résiduels de T003 et T008** — n'ont pas été correctement résolus.

### B3.1 — Identification monteur = nom du projet partout

**Symétrie cassée** : côté créateur, l'identifiant utilisé partout est le nom du monteur (ex. dans les listes de conversations, les bulles, les détails). C'est OK.

Côté monteur, l'identifiant devrait être le **nom du projet**, pas le nom du créateur. Aujourd'hui le batch 2 (T006) a fait évoluer **uniquement le header du chat**, mais les autres surfaces affichent encore le nom du créateur :

- **Liste des conversations** (`MessagingHub.jsx`) : pour le monteur, afficher le titre du projet associé à la candidature plutôt que le nom du créateur
- **Bulles de conversation / messages reçus** : si on attribue un message à son auteur ("Sent by X"), pour le monteur l'attribution doit pointer vers le projet — ou rester muette puisque le contexte est déjà cadré par le projet
- **Détails projet (côté monteur)** : si on doit afficher l'origine, prioriser le projet (déjà OK probablement)
- **Notifications** : `actor_name` côté monteur devrait être enrichi avec le projet ou y substituer le créateur

**Fichiers concernés (à confirmer en code review)** :
- `src/components/pages/MessagingHub.jsx` (item titles for editor role)
- `src/components/pages/ChatView.jsx` (chat bubbles attribution si présente)
- `src/context/ProjectContext.jsx` ou notification pipeline (actor_name selon role)

**Convention proposée** : helper `partnerLabel(request, role, projectTitle)` qui retourne soit `creator_name` (pour le créateur) soit `project.title` (pour le monteur), avec fallback sur l'autre nom si projectless.

---

### B3.2 — Préfill du form offre côté monteur (proposition d'offre)

Aujourd'hui le préfill depuis le projet (T007) fonctionne quand le créateur envoie une offre depuis une candidature acceptée. Quand c'est le **monteur** qui propose une offre depuis le tracker (CollabTracker `candidature_accepted` step → "📋 Proposer une offre"), le formulaire doit être **également pré-rempli** avec les données du projet.

**Statut probable** : la logique de prefill existe dans `OfferForm.jsx` (effect sur `request.project_id`), donc elle devrait déjà s'appliquer aux deux rôles. À vérifier en test :
- Si OK techniquement : la `setOfferFormData({ ...form, sent_by: userRole })` (ligne ~119) doit remonter les bonnes valeurs
- Si KO : isoler la cause (peut-être que pour le monteur, certains champs comme deliverables ou rushes_info ne sont pas pertinents et sont volontairement skippés)

**Fichier** : `src/components/pages/OfferForm.jsx`

---

### B3.3 — Retirer la bannière "✓ Pré-rempli depuis le projet"

Bannière verte affichée dans `OfferForm.jsx` (ligne ~132) : redondante puisque l'utilisateur voit les champs déjà remplis. Retirer.

**Fichier** : `src/components/pages/OfferForm.jsx` — supprimer le bloc `{request.project_id && projectLoaded && (...)}` et l'état `projectLoaded` si plus utilisé ailleurs.

---

### B3.4 — Monteur ne peut pas accéder au détail du projet une fois pourvu (régression T003 incomplète)

T003 a corrigé le différentiel loading vs not-found, mais le bug d'accès reste. Le monteur clique le titre du projet depuis le header du chat → ProjectDetail → reste bloqué.

**Cause probable** : RLS sur `projects` — la policy de SELECT autorise probablement `creator_id = auth.uid()` ou `status = 'published'`. Quand le projet passe en `filled`, le monteur (même celui qui a candidaté et dont la candidature est acceptée) n'a plus le droit de SELECT.

**Investigation** :
1. Lire `supabase/migrations/008_rls_projects.sql` pour la policy
2. Étendre la policy pour autoriser SELECT sur `projects` quand `EXISTS (SELECT 1 FROM contact_requests WHERE project_id = projects.id AND editor_id = auth.uid() AND status = 'accepted')`
3. Migration corrective `013_rls_projects_accepted_editor.sql`

**Fichiers** : nouvelle migration `supabase/migrations/013_*.sql`. Pas de changement code frontend nécessaire.

---

### B3.5 — Bouton "Clore le projet" côté créateur après terminé

Le batch 2 (T008) a ajouté un bouton "🏁 Mettre fin au projet" dans le `feedback` step du tracker, MAIS uniquement quand le créateur a déjà déposé son review. L'utilisateur veut une porte de sortie plus large : pouvoir clore un projet **après qu'il soit terminé**, pas nécessairement contraint au flow review.

**Comportement attendu** :
- Une fois le step `closed` ou `feedback` atteint, exposer un bouton dédié dans le panneau côté créateur
- Action : project status → `archived` (nouveau statut ?), conversation passe en read-only, sidebar affiche "Projet archivé le X"
- Notification au monteur

**Discussion** :
- Faut-il un nouveau statut `archived` distinct de `completed` ? `completed` = workflow terminé (paiement OK). `archived` = clôture intentionnelle qui ferme le chat.
- Ou bien `closed_at` timestamp sur `contact_requests` qui ferme la conversation côté UI ?

**Fichiers** : `src/context/CollabContext.jsx` (la fonction `closeProject` du T009 fait déjà partie du job, à étendre pour fermer la request), `src/components/messaging/CollabTracker.jsx` (bouton plus visible), peut-être migration pour `archived` status.

---

## Notes pour l'exécution

- Ces items sont **indépendants** entre eux — peuvent se paralléliser sur plusieurs lanes (cf. plan-executor skill)
- Seules dépendances : B3.5 dépend de la décision design "nouveau statut `archived` vs `closed_at` timestamp"
- B3.4 est purement BDD (migration RLS), zéro code frontend
- B3.1 est la plus large en surface — touche probablement 3-4 fichiers et un helper partagé

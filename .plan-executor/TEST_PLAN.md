# Cahier de recette — Recette pré-MEP

## Pré-requis

- [ ] Appliquer migration `013_rls_projects_accepted_editor.sql` sur Supabase (T001)
- [ ] Avoir au moins 1 projet avec `status='filled'` et un monteur accepté
- [ ] Avoir au moins 1 conversation avec une offre `pending`
- [ ] Avoir au moins 1 conversation avec des rounds (livrables envoyés/validés)

---

## T001 — RLS projet filled (B3.4)

- [ ] Login monteur demo → aller dans une conversation liée à un projet pourvu
- [ ] Cliquer sur le titre du projet dans le header du chat → ProjectDetail s'affiche (pas de 403/vide)
- [ ] Vérifier que le monteur ne voit PAS les projets non publiés d'autres créateurs

## T002 — Identifiant projet dans conversations (B3.1)

- [ ] Login monteur demo → ouvrir la messagerie (`/messaging`)
- [ ] Les conversations liées à un projet affichent le **titre du projet** (pas le nom du créateur)
- [ ] Les conversations sans projet (contact direct) affichent bien le **nom du créateur** (fallback)
- [ ] Login créateur demo → les conversations affichent le **nom du monteur** (inchangé)

## T003 — Bannière pré-rempli retirée (B3.3)

- [ ] Depuis une candidature acceptée, ouvrir le formulaire d'offre (`/offer/new`)
- [ ] Vérifier que la bannière verte "✓ Pré-rempli depuis le projet" n'apparaît plus
- [ ] Vérifier que les champs sont toujours pré-remplis depuis le projet (titre, description, budget, etc.)

## T004 — Round events dans le chat (CHAT1)

- [ ] Ouvrir une conversation avec des rounds de livrables
- [ ] Vérifier que le timeline affiche des messages système :
  - 📦 "Livrables v1 envoyés" (quand un round est créé)
  - 🔄 "Révision demandée (v1)" + feedback en italique (quand révision demandée)
  - ✅ "Livrables v2 validés" (quand round validé)
- [ ] Les événements sont triés chronologiquement avec les messages et offres
- [ ] Style : centrés, texte muted, distincts des bulles de chat

## T005 — Bouton "Clore le projet" (B3.5)

- [ ] Login créateur → ouvrir un chat au step `feedback` (avant d'avoir soumis un avis)
- [ ] Le bouton "🏁 Mettre fin au projet" est visible (pas conditionné à l'avis)
- [ ] Cliquer → confirmation → projet passe en `completed`
- [ ] Après clic, le texte "✓ Projet clôturé" remplace le bouton
- [ ] Le monteur n'a PAS le bouton (créateur only)

## T006 — Prefill offre monteur (B3.2)

- [ ] Login monteur → ouvrir un chat lié à un projet (candidature acceptée)
- [ ] Cliquer "📋 Proposer une offre" dans le tracker
- [ ] Vérifier que le formulaire est pré-rempli avec les données du projet (titre, budget, deadline, etc.)

## T007 — Livrables validés dans sidebar (CHAT2)

- [ ] Ouvrir une conversation avec au moins 1 round `validated`
- [ ] Le tracker sidebar affiche une section "Livrables validés"
- [ ] Chaque item : ✅ v{X} — validé le {date}
- [ ] Si le round a un lien (delivery_link), il est cliquable et ouvre un nouvel onglet

## T008 — Modifier une offre (CHAT3)

- [ ] Ouvrir un chat avec une offre `pending` (côté envoyeur)
- [ ] Le bouton "✏️ Modifier" est actif (plus grisé)
- [ ] Cliquer → confirmation → l'offre est annulée → redirection vers `/offer/new`
- [ ] Le formulaire est pré-rempli avec les données de l'offre annulée
- [ ] Modifier un champ → envoyer → une nouvelle offre est créée
- [ ] Vérifier que l'ancienne offre est bien `cancelled` dans la BDD

---

## Tests de non-régression

- [ ] Login créateur → le catalog s'affiche normalement
- [ ] Login monteur → `/projects` s'affiche normalement
- [ ] Créer une offre depuis zéro (sans modifier) → fonctionne comme avant
- [ ] Annuler une offre (sans modifier) → fonctionne comme avant
- [ ] `npx vite build` → ✓ pas d'erreurs

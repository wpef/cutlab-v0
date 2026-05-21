# Cahier de recette — 7 retours utilisateurs

Sept retours implémentés sur la branche `feat/production-ready` :

- `e5a01f6` retour #2 — fix OAuth redirect via env var
- `3c8e1d2` retour #5 — fix chat realtime filter
- `3948d2e` retour #6 — feedback gate avant clôture
- `8009056` retour #1 + #4 — refactor OfferForm
- `f7a8474` retour #3 — notification contact + cleanup
- `37f42fb` retour #4 — date défaut édition projet
- `d6adfc9` retour #7 — DEMO flag

Migration `014_projects_is_demo.sql` déjà appliquée sur Supabase CutLab (`nctzwtunoznhcgcosucw`).

---

## ✅ Déjà validés en preview local

Vérifiés pendant l'exécution sur `http://localhost:5173` :

- [x] **[auto]** Build production OK (`npm run build` → 2.15s, pas d'erreur)
- [x] **[auto]** Connexion démo créateur → `/catalog`
- [x] **[auto]** `/project/new` → champ "Date de début souhaitée" pré-rempli avec `2026-05-21` (aujourd'hui)
- [x] **[auto]** Navigation vers une conv acceptée → bouton "📋 Créer une offre" → ouvre `/offer/new`
- [x] **[auto]** OfferForm sections affichées : `Informations générales`, `Livrables`, `Format & Thématiques`, `Budget & Calendrier`, `Informations sur les rushes`. **Pas de section "Préférences techniques"** ✓
- [x] **[auto]** OfferForm — champ "Qualité attendue" présent dans `Format & Thématiques` (après Niches). **Pas de champs Langues / Expérience / Type de mission** ✓
- [x] **[auto]** SQL : `UPDATE projects SET is_demo = true WHERE id = '44444444-4444-4444-4444-000000000001'` exécuté → projet « Montage vidéo mariage (12 min) » marqué DEMO
- [x] **[auto]** Connexion démo monteur → `/projects` → badge "DEMO" lime visible sur la card du projet mariage ✓
- [x] **[auto]** Clic sur la card → `/project/...` → badge DEMO dans le header + section candidature affiche « 🎓 Projet de démonstration — non éligible à candidature », **pas de bouton Candidater** ✓
- [x] **[auto]** Console preview : aucune erreur JS détectée

---

## 🧪 À tester manuellement

Les retours suivants nécessitent des conditions difficiles à reproduire en preview headless (multi-session, état chat avancé, infra prod). À valider manuellement :

### Retour #2 — OAuth Google sur cutlab.app

- [ ] **[manual]** Sur Netlify Production → Site settings → Environment variables : ajouter `VITE_PUBLIC_SITE_URL=https://cutlab.app`, rebuild.
- [ ] **[manual]** Vérifier dans Supabase Dashboard → Authentication → URL Configuration → Redirect URLs que `https://cutlab.app/**` est dans l'allow-list.
- [ ] **[manual]** Aller sur `https://cutlab.app`, cliquer « Se connecter avec Google », passer l'écran OAuth, vérifier la redirection vers `https://cutlab.app/...` (PAS vers un sous-domaine `*.netlify.app`).
- [ ] **[manual]** En dev local (`npm run dev`) : login Google doit toujours marcher (fallback vers `window.location.origin = http://localhost:5173`).

### Retour #3 — Notification de premier contact

- [ ] **[manual]** Ouvrir Chrome avec compte créateur (démo créateur ou un vrai), aller sur `/catalog`, ouvrir le profil d'un monteur, cliquer « Contacter », écrire un message, envoyer.
- [ ] **[manual]** Dans un autre navigateur (ou onglet privé) connecté avec le compte monteur cible : vérifier que la pastille rouge de la cloche 🔔 s'incrémente **sans refresh** (subscription realtime).
- [ ] **[manual]** Ouvrir la cloche → la notification « *<Créateur>* souhaite vous contacter » doit apparaître avec icône ✉️.
- [ ] **[manual]** Cliquer la notification → redirection vers `/messaging/<request_id>` ✓.

### Retour #5 — Messages chat temps réel

- [ ] **[manual]** Deux navigateurs : créateur dans l'un, monteur dans l'autre, sur la même conversation `/messaging/:id`.
- [ ] **[manual]** Envoyer un message depuis un côté → vérifier qu'il apparaît côté receveur **sans refresh** (canal realtime sur `messages` table avec le bon filtre `request_id`).
- [ ] **[manual]** Tester dans les deux sens.

### Retour #6 — Feedback puis Clôturer

- [ ] **[manual]** Mettre une conv en état `feedback` (paiement reçu sans review créateur). Astuce : SQL direct sur `contact_requests` → `payment_received_at` set, et pas de row dans `project_reviews` pour ce request_id avec `type='creator_to_editor'`.
- [ ] **[manual]** Côté créateur dans le chat → CollabTracker doit afficher uniquement le formulaire d'avis avec le texte « Envoyez votre avis pour pouvoir clôturer le projet. » et **pas de bouton « Mettre fin au projet »**.
- [ ] **[manual]** Soumettre l'avis (étoiles + commentaire) → l'étape feedback passe en « ✓ Avis soumis » et le bouton « 🏁 Mettre fin au projet » apparaît alors.
- [ ] **[manual]** Cliquer → confirmer → `projects.status = 'completed'`, étape « Projet clos ».

### Retour #7 — DEMO flag (à étendre)

- [ ] **[manual]** Marquer d'autres projets via SQL : `UPDATE projects SET is_demo = true WHERE id IN (...)` et vérifier la cohérence.
- [ ] **[manual]** À la fin des tests, restaurer l'état initial : `UPDATE projects SET is_demo = false WHERE id = '44444444-4444-4444-4444-000000000001'`.

---

## ⚠️ Notes & risques

- **OAuth :** la modif code est inopérante tant que `VITE_PUBLIC_SITE_URL` n'est pas set côté Netlify. À faire avant le prochain déploiement.
- **Test side-effect :** durant la validation, j'ai accidentellement cliqué « Annuler l'offre » sur la conversation `eeeeeeee-0002-0000-0000-000000000002` (démo créateur). Le `confirm()` natif est auto-accepté en preview headless. Si tu vois l'offre comme `cancelled` dans cette conv démo, c'est ça — pas un bug code.
- **Données demo :** la conversation `44444444-4444-4444-4444-000000000001` (mariage) est laissée en `is_demo=true` pour que tu puisses voir le résultat sans setup. SQL pour annuler : `UPDATE projects SET is_demo = false WHERE id = '44444444-4444-4444-4444-000000000001'`.
- **Notifications de premier contact existantes :** les contacts initiés AVANT ce déploiement n'auront pas généré de notif (le code old code ne créait rien). Seuls les nouveaux contacts notifieront.
- **CollabTracker :** la modification ne touche que la branche `case 'feedback'`. Aucun impact sur les autres étapes du tracker.

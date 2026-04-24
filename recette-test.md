# Cahier de recette — Feedback Baptiste avril 2026

**Périmètre** : 10 commits sur main (47f52f0 → 88c3409) + 3 migrations DB appliquées en prod.
**Prérequis** : `npm run dev` ou déploiement Vercel à jour. Mobile ET desktop. Prévoir ~45 min.

---

## Setup

- [ ] `git pull` si pas à jour, `npm install`, `npm run dev`
- [ ] Ouvrir Chrome + DevTools mobile (375×812 iPhone) ET desktop (1440×900) dans 2 fenêtres
- [ ] Avoir 3 comptes prêts : un "nouveau monteur" (email test), le compte démo créateur, le compte démo monteur
- [ ] Préparer un bookmark `/onboarding/1` pour reset rapide

---

## 1. Cleanup — vidéo de présentation + username

### 1.1 Monteur existant (re-login)
- [ ] Login avec un compte monteur existant → aucun champ "Pseudo/Nom de scène" dans ProfileEditor section Identité
- [ ] Aucun champ "Vidéo de présentation" dans ProfileEditor section Présentation
- [ ] Aucun bouton d'upload vidéo nulle part

### 1.2 Catalogue
- [ ] Aller sur `/catalog` → aucune carte n'affiche `@handle` sous le nom
- [ ] Les cartes de monteurs avec avatar s'affichent bien (pas de zone vidéo vide)
- [ ] Mobile : idem, cards correctes

### 1.3 Détail profil
- [ ] Cliquer sur une card monteur → page `/editor-profile/:id` OK
- [ ] Aucun `@username` affiché
- [ ] Aucune vidéo de présentation

### 1.4 Onboarding Step 2 Identité
- [ ] Lancer un nouvel onboarding → Step 2 (Identité) ne demande PAS de pseudo
- [ ] Les champs restants (prénom, nom, avatar, langues, disponibilité) sont intacts

---

## 2. Réseaux sociaux structurés

### 2.1 Saisie en onboarding
- [ ] Nouveau monteur → arriver à Step 5 (Présentation)
- [ ] Bloc "Réseaux / site perso" affiche 5 champs distincts (Instagram, TikTok, YouTube, Portfolio, LinkedIn) avec icônes
- [ ] Saisir un handle `@baptlab` sur Instagram + une URL `https://baptlab.fr` sur Portfolio
- [ ] Passer à la step suivante → pas de crash
- [ ] Revenir en arrière → les valeurs sont persistées

### 2.2 Édition depuis ProfileEditor
- [ ] Monteur existant → section Présentation → 5 champs affichés avec placeholder correct
- [ ] Modifier Instagram + TikTok, sauver → toast OK
- [ ] Recharger la page → valeurs persistées

### 2.3 Affichage sur page profil détail
- [ ] Aller sur `/editor-profile/:id` d'un monteur ayant rempli ses réseaux
- [ ] Icônes cliquables visibles (petite ligne horizontale)
- [ ] Cliquer une icône → ouvre un nouvel onglet sur la bonne URL (Instagram = `https://instagram.com/baptlab`)

### 2.4 Catalog (doit NE PAS afficher les icônes)
- [ ] Card monteur dans `/catalog` → aucune icône réseau visible (uniquement sur la page détail)

### 2.5 Données legacy
- [ ] Un profil migré depuis un texte libre (ex. `social_links = {portfolio: "https://old.fr"}`) affiche le Portfolio dans le display
- [ ] Un profil avec `{other: "..."}` (fallback legacy) : aucune icône affichée, mais l'éditeur montre 5 champs vides (user doit re-saisir)

---

## 3. Animation "level unlock" (onboarding Step 6)

### 3.1 Révélation complète
- [ ] Nouveau monteur → compléter onboarding jusqu'à Step 6 (Niveau)
- [ ] Phase 1 : barre de progression circulaire 0 → 100% avec messages
- [ ] Phase 2 : overlay sombre brief + badge emoji qui scale/rotate avec glow #d4f000
- [ ] 5 particules lumineuses convergent vers le centre
- [ ] Label "Niveau débloqué" apparaît sous le badge
- [ ] Nom du niveau (ex. "Confirmé") en Syne
- [ ] Compteur de score 0 → N
- [ ] Breakdown + CTA "Demander un profil certifié" en fade-in

### 3.2 prefers-reduced-motion
- [ ] Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`
- [ ] Relancer Step 6 → animation skippée, résultat affiché immédiatement

### 3.3 Toast post-onboarding
- [ ] Publier un profil (niveau X)
- [ ] Compléter le profil davantage (ex. ajouter portfolio links pour atteindre un niveau supérieur)
- [ ] Sauver le profil → toast "Niveau débloqué : [emoji] [nom]" s'affiche
- [ ] Pas de rejeu de l'animation complète

### 3.4 Régression — pas de toast si niveau baisse ou stable
- [ ] Retirer des éléments du profil pour baisser le niveau → pas de toast
- [ ] Resauver sans changement → pas de toast

---

## 4. ProjectProposalCard (messagerie)

### 4.1 Créateur envoie une proposition
- [ ] Compte créateur → contact un monteur → remplir OfferForm avec tous les champs (title, description, livrables, format, deadline, budget, retours)
- [ ] Envoyer la proposition
- [ ] Ouvrir la conversation → card structurée affichée :
  - Badge "Proposition envoyée" (wording pro)
  - Titre de la mission en h3
  - Description
  - Grille 2 colonnes (format, deadline, budget, livrables, retours)

### 4.2 Monteur reçoit la proposition
- [ ] Login monteur → Messagerie → Ouvrir la conversation
- [ ] Card affichée côté monteur avec les mêmes infos
- [ ] Boutons "Accepter" / "Refuser" présents dans la card (pas en dehors)
- [ ] Cliquer Accepter → status passe à "Mission confirmée" (ou équivalent)

### 4.3 Mobile
- [ ] La grille 2 colonnes devient 1 colonne sous 768px
- [ ] La card reste lisible

### 4.4 Champs vides
- [ ] Une offre sans `description` ne génère pas un paragraphe vide
- [ ] `revisions` null → "Non précisé"

---

## 5. Wording professionnel (31 remplacements)

Spot-checks rapides sur les principaux endroits :

- [ ] `/messaging` : "Aucune conversation pour le moment." (pas "pour l'instant")
- [ ] `/messaging` : bouton "Parcourir les monteurs →" (pas "Trouver un monteur")
- [ ] `/messaging/:id` : "Retour à la messagerie" dans le back button
- [ ] OfferForm : titre de page "Présentez votre proposition" (pas "Décris ta mission")
- [ ] OfferForm : label "Titre de la mission" (pas "Titre du projet")
- [ ] OfferForm : label "Délai de livraison" (pas "Deadline")
- [ ] OfferPreview : bouton "Envoyer la proposition →" (pas "Confirmer l'envoi")
- [ ] Toast après publication projet : "Projet publié" (sans `!`)
- [ ] Toast après candidature : "Candidature envoyée" (sans `!`)
- [ ] MesProjetsMonteur : "Les créateurs vous contacteront" (vous pas tu)
- [ ] ChatView : "souhaite entrer en contact" (pas "souhaite te contacter")

---

## 6. Refonte tarifs (le plus gros morceau)

### 6.1 Onboarding — 7 étapes au lieu de 8
- [ ] Nouveau monteur → progression dans l'onboarding
- [ ] Sidebar affiche 7 entrées, pas de "Tarifs"
- [ ] Step headers disent "Étape X sur 7" (pas "sur 8")
- [ ] Parcours : Rôle → Identité → Compétences → Portfolio → **Présentation** → **Niveau** → **Aperçu** → Success
- [ ] Aucune page "Tarifs" dans le flux

### 6.2 Accès à l'éditeur de tarifs
- [ ] Monteur avec niveau défini (ex. Confirmé) → ProfileEditor → section "Tarifs"
- [ ] Header : "Baseline — 💎 Confirmé. Ajuste chaque tarif de ±10% si besoin."
- [ ] 7 lignes affichées : Montage Court / Moyen / Long + Motion Court / Moyen / Long + Miniature
- [ ] Pour chaque ligne : label + toggle 3 positions + prix affiché
- [ ] Cliquer "+10%" sur une ligne → prix mis à jour (130 € → 143 € pour Montage Moyen Confirmé)
- [ ] Cliquer "-10%" → 117 €
- [ ] Cliquer "Baseline" → retour à 130 €
- [ ] Prix baseline affiché en petit sous le prix retenu
- [ ] Sauver → toast OK
- [ ] Recharger → ajustements persistés

### 6.3 Profil sans niveau
- [ ] Monteur fraîchement créé (niveau null) → ProfileEditor section Tarifs
- [ ] Message "Ton niveau n'est pas encore défini — complète ton profil pour débloquer la grille de tarifs."
- [ ] Pas de crash, pas de toggles affichés

### 6.4 Affichage dans le catalogue — fourchette
- [ ] `/catalog` → cards monteurs affichent une fourchette "X – Y €" en bas
- [ ] Pour un Confirmé sans ajustement : "80 – 300 €" (min Montage Court, max Motion Long)
- [ ] Pour un Expert avec +10% sur motion long : "120 – 495 €"
- [ ] Monteur sans niveau : pas de ligne tarif affichée

### 6.5 EditorDetail — grille complète
- [ ] Cliquer sur une card monteur → page `/editor-profile/:id`
- [ ] Section "Tarifs" affiche les 7 lignes avec leurs prix calculés
- [ ] Cohérent avec ce que le monteur a configuré dans son éditeur

### 6.6 Régressions à vérifier
- [ ] Plus aucune mention de `hourly_rate`, `deliveryTime`, "tarif horaire", "€/heure" nulle part
- [ ] Champs `revisions` (2) et `capacity` (2-3) toujours présents dans ProfileEditor ET fonctionnels
- [ ] OfferForm côté créateur : label "Budget total (€)" inchangé (le budget reste dans la proposition)

---

## 7. Régressions globales (sanity checks)

### 7.1 Auth & routing
- [ ] Login / logout fonctionnent
- [ ] Guards de route : créateur bloqué sur `/projects`, monteur bloqué sur `/catalog` (auto-redirect)
- [ ] Page refresh à n'importe quelle URL reste fonctionnelle

### 7.2 Demo modes
- [ ] Landing → "Démo créateur" → login + redirect `/catalog`
- [ ] Landing → "Démo monteur" → login + redirect `/projects`
- [ ] Landing → "Tester l'onboarding" → compte throwaway créé, redirect step 2

### 7.3 Projet (creator)
- [ ] Créateur → "Nouveau projet" → ProjectForm complète OK
- [ ] Publier → toast "Projet publié" (sans `!`)
- [ ] Visible dans MyProjects

### 7.4 Candidatures (editor)
- [ ] Monteur → `/projects` → tab "Projets disponibles" → voir un projet → "Candidater"
- [ ] Toast "Candidature envoyée" (sans `!`)
- [ ] Tab "Mes candidatures" → la candidature apparaît en "En attente"

### 7.5 Pipeline
- [ ] Monteur → `/pipeline` → 4 colonnes (to do / in progress / review / done)
- [ ] Scroll horizontal snap sur mobile

### 7.6 Notifications
- [ ] NotificationBell dans TopNav (desktop) → affiche notifs polling 30s
- [ ] Créer une candidature → le créateur reçoit la notif

---

## 8. Build & déploiement

- [ ] `npm run build` passe sans erreur (warning chunk size > 500 kB attendu — non bloquant)
- [ ] Après push, Vercel (ou autre) déploie la preview
- [ ] Tester au moins une fois sur le domaine de preview (pas juste en local)

---

## 9. À faire manuellement en dehors du test applicatif

- [ ] **Bucket `videos` Supabase** : dashboard → Storage → videos → supprimer les 4 orphelins OU drop le bucket
- [ ] **Advisor RLS** : table `deliverable_submissions` sans RLS (pré-existant) — à traiter séparément ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0013_rls_disabled_in_public))
- [ ] **`git push`** des 10 commits quand tu valides

---

## Critères de sortie

- Aucun blocker trouvé (= tout tick)
- Ou : liste des bugs trouvés avec reproduction pour fix dans une passe dédiée

**Si bugs trouvés** : note-les avec la section + le step du cahier, je peux te faire une passe de correction ciblée.

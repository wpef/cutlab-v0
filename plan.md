# Plan — Traitement feedback Baptiste

**Status:** en attente de validation explicite avant exécution.
**Date:** 2026-04-23
**Périmètre:** 5 sections de feedback, 6–8 commits prévus.

---

## Contexte

Cartographie exhaustive déjà effectuée. Les zones touchées sont :
- Onboarding (Step2, Step5, Step6, Step7, Step8, Sidebar)
- ProfileEditor (section-identity, section-pricing, section-presentation, section-level)
- Catalogue (EditorCard)
- Messagerie (MessagingHub, ChatView, OfferForm, OfferPreview)
- Context (OnboardingContext, MessagingContext)
- DB Supabase (table `profiles`, table `offers`)

Décisions validées par Baptiste :
- **Point 1** : option (c) — supprimer la **vidéo de présentation**. Handle `@username` retiré totalement (formulaire + DB).
- **Point 3** : grille tarifaire officielle fournie via CSV (voir ci-dessous).
- **Questions ouvertes (toutes tranchées)** :
  1. Catalogue tarifs : **fourchette "X – Y €"**
  2. Icônes réseaux : **uniquement page profil** (pas sur EditorCard catalogue)
  3. Relevé de niveau : **toast discret** (animation réservée à la révélation onboarding)
  4. Wording : **validation table avant/après** confirmée
  5. Bucket `videos` : **nettoyage orphelins** inclus
  6. Colonne `presentation_video_url` : **DROP en migration**
  7. `username` : **suppression totale** (colonne, formulaire, références)

---

## Section 1 — Cleanup (quick wins)

### 1.1 Retirer la vidéo de présentation
**Fichiers touchés**
- `src/components/steps/Step6Presentation.jsx` — retirer bloc upload `presentationVideoUrl` (label + input file + preview)
- `src/components/editor/ProfileEditor.jsx` — retirer bloc vidéo dans section-presentation
- `src/components/ui/EditorCard.jsx` — retirer fallback vidéo (media principal → avatar uniquement)
- `src/components/pages/Catalog.jsx` — retirer `presentation_video_url` du SELECT
- `src/context/OnboardingContext.jsx` — retirer `presentationVideoUrl` de `INITIAL_FORM` + du payload `saveProfile`
- `src/lib/computeLevel.js` — vérifier si le score utilise ce champ (sinon, rien à faire)

**DB (migration destructrice)**
- `ALTER TABLE profiles DROP COLUMN presentation_video_url;`
- Bucket Storage `videos` : **script de nettoyage** des objets orphelins (pas référencés par aucun `presentation_video_url` avant drop). Exécution one-shot avant le drop.

### 1.2 Supprimer totalement le handle `username`

**Fichiers touchés**
- `src/components/ui/EditorCard.jsx:86` — supprimer `<div>@{profile.username}</div>`
- `src/components/steps/Step2Identity.jsx` — supprimer label + input "Pseudo/Nom de scène"
- `src/components/editor/ProfileEditor.jsx` — supprimer champ username dans section-identity + toute référence preview
- `src/context/OnboardingContext.jsx` — retirer `username` de `INITIAL_FORM`, `saveProfile` payload, `loadProfile` mapping
- `src/components/pages/Catalog.jsx` — retirer `username` du SELECT
- Grep global pour toute autre référence résiduelle (`profile.username`, `formData.username`, `.username`)

**DB (migration destructrice)**
- `ALTER TABLE profiles DROP COLUMN username;`
- Vérifier au préalable si contrainte UNIQUE existante à drop explicitement.

### Commit proposé
`chore: remove presentation video and username field (DB drop + cleanup)`

---

## Section 2 — Profil enrichi

### 2.1 Années d'expérience
**Constat** : le champ `experience` existe déjà (enum `['<6m', '6m1y', '1-3y', '3-5y', '5-7y', '7y+']`), est affiché dans EditorCard via mapping EXP_LABELS. **Rien à modifier.**

### 2.2 Réseaux sociaux — passage texte libre → champs structurés

**Nouveau schéma** : remplacer `social_links` (text) par `social_links` (jsonb) :
```json
{
  "instagram": "baptlab",
  "tiktok": "baptlab",
  "youtube": "@baptlab",
  "portfolio": "https://baptlab.fr",
  "linkedin": "https://linkedin.com/in/baptlab"
}
```
Chaque clé est optionnelle. Stockage : handle (pas URL complète) pour instagram/tiktok/youtube, URL complète pour portfolio/linkedin.

**Fichiers touchés**
- `supabase-schema.sql` + **migration SQL** : `ALTER COLUMN social_links TYPE jsonb USING ...` (best-effort parsing des strings existantes en tant que `{portfolio: value}` si URL détectée, sinon `{other: value}`)
- `src/components/steps/Step6Presentation.jsx` — remplacer `<input type="url">` simple par 5 inputs séparés (Instagram, TikTok, YouTube, Portfolio, LinkedIn) avec icônes
- `src/components/editor/ProfileEditor.jsx` — même UI dans section-presentation
- `src/context/OnboardingContext.jsx` — `INITIAL_FORM.socialLinks = {}` (vs `''` avant) + mapping save/load
- `src/components/ui/EditorCard.jsx` — **pas d'affichage** des réseaux (Baptiste : uniquement page profil)
- **Aperçu profil (détail monteur)** : icônes cliquables visibles — chemin à identifier (si page détail monteur existe : `/editor-profile/:id` ou preview sticky dans ProfileEditor ; sinon à confirmer où la "page profil" est exposée côté créateur)
- **Nouveau composant** `src/components/ui/SocialLinksInput.jsx` — réutilisable entre Step6 et ProfileEditor
- **Nouveau composant** `src/components/ui/SocialLinksDisplay.jsx` — icônes cliquables (→ URL reconstruite depuis `prefix + handle`)

**Constantes** : `src/constants/options.js` — ajouter
```js
export const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: '@handle', prefix: 'https://instagram.com/' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: '@handle', prefix: 'https://tiktok.com/@' },
  { key: 'youtube', label: 'YouTube', icon: '▶️', placeholder: '@handle', prefix: 'https://youtube.com/' },
  { key: 'portfolio', label: 'Portfolio', icon: '🌐', placeholder: 'https://...', prefix: '' },
  { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/in/...', prefix: '' },
]
```

### Commit proposé
`feat: structured social links (instagram/tiktok/youtube/portfolio/linkedin)`

---

## Section 3 — Refonte tarifs (le plus gros morceau)

### 3.1 Grille tarifaire officielle (extraite du CSV)

| Niveau | Score | Montage brut Court | Moyen | Long | Motion Court | Moyen | Long | Miniature (+) |
|--------|-------|--------------------|-------|------|--------------|-------|------|---------------|
| Débutant | 0–15 | 30 € | 50 € | 80 € | 50 € | 80 € | 120 € | +30 € |
| Prospect | 16–25 | 50 € | 80 € | 130 € | 80 € | 130 € | 200 € | +30 € |
| Confirmé | 26–50 | 80 € | 130 € | 200 € | 130 € | 200 € | 300 € | +30 € |
| Expert | 51–65 | 120 € | 200 € | 300 € | 200 € | 300 € | 450 € | +30 € |
| Star | 66–80 | 180 € | 300 € | 450 € | 300 € | 450 € | 650 € | +30 € |
| Elite | 81–90 | 250 € | 400 € | 600 € | 400 € | 600 € | 900 € | +30 € |
| Légende | 91–100 | 350 € | 550 € | 800 € | 550 € | 800 € | 1200 € | +30 € |

**Formats** : Court (<5 min), Moyen (5–15 min), Long (15 min+).
**Miniature** : additif de +30 € par forfait, identique à tous les niveaux.

### 3.2 Schéma de données

**Nouvelle colonne `pricing` (jsonb)** sur `profiles` :
```json
{
  "baseline_level": 2,
  "adjustments": {
    "montage_court": 0,
    "montage_moyen": 10,
    "montage_long": -10,
    "motion_court": 0,
    "motion_moyen": 0,
    "motion_long": 0,
    "thumbnail": 0
  }
}
```
- `baseline_level` : snapshot du niveau au moment du choix (permet invalidation si relevé ultérieurement)
- `adjustments` : -10, 0 ou +10 par ligne (pas de slider, toggle 3 positions)
- Les **prix finaux sont calculés côté client** via fonction pure `computePricing(level, adjustments)` — **pas** stockés en DB (source de vérité = grille officielle).

**Colonnes supprimées** (via migration SQL) :
- `hourly_rate` — suppression (plus de tarif horaire)
- `delivery_time` — suppression (info contextuelle, sera portée ailleurs ou retirée)

**Constantes** : nouveau fichier `src/constants/pricing.js` avec la grille officielle en JS figée.

### 3.3 Refonte de l'onboarding (passage 8 → 7 étapes)

**Suppression de Step5Pricing** : plus aucun tarif demandé pendant l'onboarding.

**Renumérotation** :
| Avant | Après | Composant |
|-------|-------|-----------|
| Step1Role | Step1Role | (inchangé) |
| Step2Identity | Step2Identity | (inchangé) |
| Step3Skills | Step3Skills | (inchangé) |
| Step4Portfolio | Step4Portfolio | (inchangé) |
| ~~Step5Pricing~~ | ~~supprimé~~ | — |
| Step6Presentation | **Step5Presentation** | renommé |
| Step7Level | **Step6Level** | renommé + modifications section 4 |
| Step8Preview | **Step7Preview** | renommé |

**Fichiers touchés**
- Renommage de 3 fichiers (Step6/7/8 → Step5/6/7)
- `src/components/layout/Sidebar.jsx` (ou équivalent) — progress bar à 7 étapes au lieu de 8
- Tous les `goToStep(N)` dans les steps concernés
- `OnboardingContext` — mapping des routes `/onboarding/:step` doit couvrir `1..7`
- Routes dans `App.jsx` si les étapes sont montées dynamiquement

### 3.4 Nouvel onglet "Tarifs" dans ProfileEditor

**Accessibilité** : uniquement après que le user a atteint Step6Level (nouveau) — c'est-à-dire quand `assigned_level` est défini.

**UI** : section-pricing existante entièrement refaite
- Titre : "Tes tarifs"
- Sous-titre : "Baseline calculée selon ton niveau **[Nom du niveau]**. Tu peux ajuster chaque ligne de ±10%."
- Pour chaque ligne (7 lignes : 3 montage + 3 motion + miniature) :
  - Label (ex. "Montage brut — Court < 5 min")
  - Prix baseline affiché (ex. "130 €")
  - Toggle 3 positions : **-10% (117 €)** | **Baseline (130 €)** | **+10% (143 €)**
  - Prix retenu mis en avant visuellement
- Note explicative en bas : "La grille est mise à jour automatiquement si ton niveau évolue."

**Accès depuis l'onboarding** : après Step6Level (révélation niveau), la Step7Preview reste un preview du profil. Baptiste veut **sortir les tarifs de l'onboarding** → ajout d'un **bouton "Configurer mes tarifs"** sur Step7Preview qui redirige vers `/editor#section-pricing` (ou bien sur le dashboard monteur `/projects` après publication). Le user peut publier son profil sans avoir configuré ses tarifs (fallback = baseline sans ajustement = 0).

### 3.5 Affichage tarifs dans le catalogue
**Fichiers touchés**
- `src/components/ui/EditorCard.jsx` — remplacer `hourly_rate` par **fourchette "X – Y €"** :
  - X = prix le plus bas de la grille du niveau (Montage brut Court, après ajustement)
  - Y = prix le plus haut de la grille du niveau (Motion Long, après ajustement)
  - Exemple niveau "Confirmé" sans ajustement : "80 – 300 €"
  - Si niveau non défini : pas d'affichage tarif (label "Tarifs sur demande" ou rien)
- `src/components/pages/Catalog.jsx` — retirer `hourly_rate` du SELECT, ajouter `pricing` + `assigned_level`

### 3.6 Impact utilisateurs existants
- Profils avec `hourly_rate` saisi : perte de la data (acceptable, pas critique).
- Profils avec `pricing` vide : affichage baseline selon `assigned_level` par défaut (adjustments = 0).
- Profils sans niveau calculé (brouillons) : pas de tarifs visibles (card masquée du catalogue — déjà le cas via filtre `status='published'`).

### Commits proposés
1. `feat(db): pricing column + drop hourly_rate/delivery_time (migration)`
2. `feat: remove pricing from onboarding (8 steps → 7)`
3. `feat: pricing editor with level-based baseline + ±10% adjustments`

---

## Section 4 — Révélation niveau "gaming"

### 4.1 UX cible
Ton pro + sobre, inspiration "achievement unlocked" de jeu mais pas kitsch.

**Séquence** (durée totale ~4s) :
1. **Loading** (inchangé, ~2.5s) — progress bar circulaire + messages
2. **Pré-révélation** (0.3s) — flash subtil, assombrissement du background (`backdrop-filter: brightness(0.6)`)
3. **Apparition du badge** (0.8s) — emoji du niveau qui apparait depuis le centre :
   - scale: 0 → 1.2 → 1 (overshoot)
   - rotation: -180° → 0°
   - glow (box-shadow) #d4f000 qui pulse une fois
4. **Particules** (0.6s, en parallèle) — 5 points lumineux qui partent des bords et convergent vers le badge (framer-motion, pas de lib externe)
5. **Label "Niveau débloqué"** (0.4s) — fade-in + slide-up sous le badge
6. **Nom du niveau** (0.3s) — ex. "Confirmé" typographié (font Syne, large)
7. **Compteur de score** (1s) — 0 → N animé (incrément 30ms), barre de progression animée
8. **Breakdown + CTA** (0.5s) — fade-in séquencé

### 4.2 Implémentation
**Fichiers touchés**
- `src/components/steps/Step7Level.jsx` (renommé en Step6Level si section 3 passe en premier, sinon ordre inverse à gérer) — refonte `ResultPanel`
- Nouveau composant `src/components/ui/LevelUnlockAnimation.jsx` — encapsule badge + particules + timing
- `src/styles/global.css` — keyframes pour glow/pulse si pas faisable en framer-motion

**Pas de son** par défaut (accessibilité, utilisateurs au bureau). Possibilité d'ajouter plus tard un son optionnel avec toggle.

### 4.3 Où la révélation est déclenchée
- **Onboarding (1ère révélation)** : Step6Level (nouveau numéro) — animation complète jouée.
- **Relevé post-onboarding** (profil mis à jour → nouveau score) : **toast discret** via `toast.success("Niveau débloqué : Expert 🚀")`. Pas de rejeu d'animation.
- Logique de détection : comparer `assigned_level` avant/après dans `saveProfile` ou `loadProfile`. Déclencher le toast uniquement si niveau augmente (pas si baisse).

### Commit proposé
`feat: gamified level unlock animation (onboarding reveal)`

---

## Section 5 — Messagerie & propositions de projet

### 5.1 Affichage détails projet dans la conversation

**Constat actuel** :
- `ChatView` affiche uniquement `budget` et `deadline` inline dans les bulles d'offer.
- Tous les autres champs (title, description, deliverables, format, revisions) sont **stockés mais pas affichés**.

**Cible** : card structurée dans ChatView.

**Design proposé** : card "Proposition de mission" sticky en haut de ChatView (ou pinned au-dessus des messages) avec :
- Titre de la mission (H3)
- Description (paragraphe)
- Grille 2 colonnes :
  - Format (ex. "Vlog 5-15 min")
  - Deadline (ex. "30 mai 2026")
  - Budget (ex. "500 €")
  - Livrables (ex. "Vidéo finale + miniature")
  - Retours inclus (ex. "2")
- Badge de statut : "En attente", "Acceptée", "Refusée"
- Boutons d'action (accepter / refuser / contre-proposition) selon rôle et statut

**Fichiers touchés**
- Nouveau composant `src/components/messaging/ProjectProposalCard.jsx`
- `src/components/pages/ChatView.jsx` — import + affichage card (conditionnel si offer liée)
- `src/styles/global.css` — styles card

### 5.2 Wording / passe complète

**Fichiers concernés** (toutes les chaînes user-facing) :
- `MessagingHub.jsx`
- `ChatView.jsx`
- `OfferForm.jsx`
- `OfferPreview.jsx`
- `ProjectDetail.jsx`
- Notifications (`NotificationBell`, toasts)
- Emails Supabase (hors scope)

**Exemples de reformulations proposées** (à valider AVANT application) :

| Actuel | Proposé |
|--------|---------|
| "✓ Accepter" / "✗ Refuser" | "Accepter la demande" / "Décliner" |
| "Confirmer l'envoi →" | "Envoyer la proposition" |
| "Aperçu du document →" | "Prévisualiser la proposition" |
| "Décris ta mission" | "Détails de la mission" |
| "Pour {editor_name}" | "À l'attention de {editor_name}" |
| "Budget total (€)" | "Budget prévu (€)" |
| "Imprimer / PDF" | "Télécharger en PDF" |
| "En attente" (badge) | "Proposition envoyée" |
| "Acceptée" (badge) | "Mission confirmée" |
| "Refusée" (badge) | "Proposition déclinée" |
| "{creator_name} souhaite te contacter." | "{creator_name} souhaite travailler avec toi." |

**Process** : je te soumets la table complète avant/après **avant** d'appliquer (commit séparé).

### Commits proposés
1. `feat(messaging): project proposal card with full details`
2. `refactor(messaging): professional wording pass`

---

## Ordre d'exécution & checkpoints

1. **Commit 1a** : Section 1 UI (retrait vidéo + username des composants) — reversible
2. **Commit 1b** : Section 1 DB (drop `presentation_video_url`, drop `username`, bucket videos cleanup) — **destructif**
3. **Commit 2** : Section 2 (réseaux sociaux structurés + migration text → jsonb) — risque moyen
4. **Commit 3** : Section 4 (niveau gaming + toast relevé) — indépendant, safe
5. **Commit 4** : Section 5.1 (card détails projet) — additif, safe
6. **Commit 5** : Section 5.2 (wording) — **après validation table avant/après**
7. **Commits 6–8** : Section 3 (tarifs) — en dernier car le plus invasif :
   - 6 : migration DB (ajout colonne `pricing` jsonb + drop `hourly_rate` + drop `delivery_time`)
   - 7 : retrait Step5Pricing + renumérotation onboarding 8 → 7 étapes
   - 8 : nouvel éditeur tarifs dans ProfileEditor + affichage fourchette catalogue

**Checkpoints utilisateur obligatoires** :
- **Avant Commit 1b** : confirmer backup Supabase OK
- **Avant Commit 5** : validation table wording avant/après
- **Avant Commit 6** : confirmer backup Supabase OK (2ème migration destructive)

---

## Risques & points d'attention

1. **Migration `social_links` text → jsonb** : parsing des strings existantes imparfait. Fallback `{other: "<texte>"}` pour ne rien perdre.
2. **Drop colonnes `hourly_rate`, `delivery_time`, `username`, `presentation_video_url`** : perte de données irrécupérable. Backup SQL complet recommandé AVANT migration (dump `profiles` en CSV ou `pg_dump`).
3. **Contrainte UNIQUE sur `username`** (si présente) : à drop explicitement avant DROP COLUMN. Vérifier schéma Supabase via `information_schema.table_constraints`.
4. **Nettoyage bucket `videos`** : script one-shot à exécuter AVANT drop de `presentation_video_url` (sinon orphelins impossibles à identifier). Lister tous les objets, croiser avec les URLs dans `profiles`, supprimer les non-référencés.
5. **Renumérotation onboarding** : tous les `goToStep(N)` doivent être mis à jour. Un utilisateur en cours d'onboarding (formData persisté) peut se retrouver redirigé vers un step inexistant. Mitigation : logique de redirect-to-first-incomplete.
6. **Niveau dans le catalogue** : les affichages tarifs supposent `assigned_level` défini. Les profils legacy sans niveau calculé doivent avoir un fallback (recalcul auto au chargement, déjà en place via `loadProfile`).
7. **Tests UI** : pas de suite de tests automatiques. Vérification manuelle recommandée sur :
   - Onboarding complet (7 étapes nouveau)
   - Profil monteur existant (avec legacy data)
   - Catalogue (affichage card, fourchette tarifs)
   - Flux proposition (ChatView + OfferForm + OfferPreview)
   - Page profil détail (icônes réseaux cliquables)

---

## Questions ouvertes / à valider

**Toutes tranchées** (récap en tête de plan). Un seul checkpoint utilisateur reste :
- **Commit 5 (wording)** : table avant/après à valider avant application.

---

## Livrables finaux attendus

- 6 à 8 commits atomiques sur `main` (pas de PR intermédiaire sauf demande)
- Migration SQL dans `supabase-schema.sql` + fichier migration séparé si nécessaire (`supabase/migrations/NNN_*.sql`)
- CLAUDE.md et MEMORY.md mis à jour en fin de chantier
- Rapport final avec :
  - Récap des changements par section
  - Liste des points **à valider côté produit** (tests utilisateurs, copywriting final, etc.)
  - Instructions de migration DB pour l'env prod

---

**Prochaine action attendue** : validation explicite de Baptiste sur ce plan (globalement ou section par section) avant toute modification de code.

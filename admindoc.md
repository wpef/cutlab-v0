# CUTLAB — Guide Administrateur

> Documentation technique à usage interne. Ne pas partager publiquement.
> Dernière mise à jour : 2026-04-29

---

## Table des matières

1. [Accès admin](#1-accès-admin)
2. [Gestion des utilisateurs — `/admin/users`](#2-gestion-des-utilisateurs--adminusers)
3. [Modération et signalements — `/admin/reports`](#3-modération-et-signalements--adminreports)
4. [Base de données Supabase](#4-base-de-données-supabase)
5. [Migrations SQL](#5-migrations-sql)
6. [Comptes démo](#6-comptes-démo)
7. [Variables d'environnement](#7-variables-denvironnement)
8. [Build et déploiement](#8-build-et-déploiement)
9. [Politiques RLS](#9-politiques-rls)
10. [Dépannage courant](#10-dépannage-courant)

---

## 1. Accès admin

### Routes disponibles

| Route | Composant | Description |
|-------|-----------|-------------|
| `/admin/users` | `AdminUsers` | Liste de tous les profils, suspension/réactivation |
| `/admin/reports` | `AdminReports` | Consultation et traitement des signalements |

### Prérequis

L'accès aux pages admin est conditionné par `role = 'admin'` dans la table `profiles`. Le composant vérifie la valeur de `userRole` depuis `OnboardingContext` et redirige vers `/` si ce n'est pas le cas.

Il n'existe pas de route de navigation vers l'admin depuis l'interface utilisateur normale — il faut saisir l'URL directement.

### Accorder le rôle admin à un utilisateur

1. Récupérer l'UUID de l'utilisateur cible depuis le dashboard Supabase (Authentication > Users) ou via une requête SQL.
2. Exécuter la requête suivante dans l'éditeur SQL de Supabase :

```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-id>';
```

Remplacer `<user-id>` par l'UUID réel (format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

3. L'utilisateur devra se déconnecter et se reconnecter pour que le nouveau rôle soit pris en compte (le rôle est chargé depuis la DB à la restauration de session).

### Révoquer le rôle admin

```sql
-- Remettre en rôle editor ou creator selon le cas
UPDATE profiles SET role = 'editor' WHERE id = '<user-id>';
```

---

## 2. Gestion des utilisateurs — `/admin/users`

### Ce que fait cette page

Au chargement, la page interroge la table `profiles` et récupère tous les utilisateurs triés du plus récent au plus ancien. Les colonnes affichées sont : **Nom**, **Rôle**, **Statut**, **Niveau**, **Date d'inscription**, **Action**.

### Données affichées

- **Nom** : `first_name` + `last_name`
- **Rôle** : badge indiquant `editor`, `creator` ou `admin`
- **Statut** : badge coloré (`published`, `suspended`, ou autre valeur — s'affiche telle quelle)
- **Niveau** : `assigned_level` — valeur texte ou `—` si non attribué
- **Inscrit** : `created_at` formaté en date française (jj/mm/aaaa)

Les lignes des comptes suspendus reçoivent la classe CSS `admin-row--suspended` (fond visuellement distinctif).

### Actions disponibles

**Suspendre un compte**

Cliquer sur le bouton "Suspendre" change le statut du profil de sa valeur actuelle à `suspended`. L'interface se met à jour localement sans rechargement.

**Réactiver un compte**

Si le compte est déjà `suspended`, le bouton affiche "Réactiver" et remet le statut à `published`. Le bouton change de style (classe `admin-action-btn--restore`) pour signaler visuellement l'action de restauration.

### Limites actuelles

- Pas de pagination ni de filtre/recherche — tous les profils sont chargés d'un coup. Pour les bases importantes, un filtre côté Supabase sera nécessaire.
- Pas d'accès au détail d'un profil depuis cette page.
- La suspension ne révoque pas la session en cours de l'utilisateur (il restera connecté jusqu'à expiration naturelle du token, sauf invalidation côté Supabase).

### Suspendre une session en cours (via Supabase)

Pour invalider immédiatement la session d'un utilisateur suspendu, aller dans Authentication > Users dans le dashboard Supabase, sélectionner l'utilisateur et cliquer "Revoke all sessions".

---

## 3. Modération et signalements — `/admin/reports`

### Ce que fait cette page

La page charge tous les enregistrements de la table `mod_reports`, triés du plus récent au plus ancien. Elle affiche un état vide ("Aucun signalement en attente.") s'il n'y en a aucun.

### Données affichées

- **Raison** : texte libre saisi par le signaleur
- **Statut** : badge coloré selon la valeur (`pending`, `reviewed`, `resolved`, `dismissed`)
- **Date** : `created_at` formaté en date française
- **Actions** : deux boutons par ligne

### Statuts possibles dans `mod_reports`

| Statut | Signification |
|--------|---------------|
| `pending` | Signalement reçu, non traité |
| `reviewed` | Lu par un admin, en cours d'analyse |
| `resolved` | Signalement traité et clôturé (action prise) |
| `dismissed` | Signalement écarté (non fondé ou hors périmètre) |

### Actions disponibles

**Résoudre** (`resolved`) : cliquer "Résoudre" met le statut à `resolved`. À utiliser lorsqu'une action a été prise (ex. : compte suspendu, message supprimé).

**Ignorer** (`dismissed`) : cliquer "Ignorer" met le statut à `dismissed`. À utiliser pour les signalements non fondés, spam ou hors périmètre.

Les deux boutons sont disponibles quel que soit le statut courant, ce qui permet de corriger une action prise par erreur.

### Accès admin aux signalements (RLS)

Par défaut, un utilisateur connecté ne voit que ses propres signalements (`reporter_id = auth.uid()`). La migration `011_rls_admin.sql` ajoute une politique supplémentaire qui autorise les admins (`role = 'admin'` dans `profiles`) à lire tous les signalements via la politique `admins_view_all_reports`.

### Soumettre un signalement (côté utilisateur)

N'importe quel utilisateur authentifié peut soumettre un signalement en insérant dans `mod_reports` avec `reporter_id = auth.uid()`. La cible peut être un profil (`target_id`) ou un message (`message_id`).

---

## 4. Base de données Supabase

### Tables principales

#### `profiles`
Profil de chaque utilisateur. Créé lors de l'onboarding. Contient toutes les données de présentation d'un monteur ou créateur.

Colonnes clés : `id` (uuid, FK vers `auth.users`), `role` (`editor` / `creator` / `admin`), `status` (`draft` / `published` / `suspended`), `first_name`, `last_name`, `avatar_url`, `bio`, `assigned_level`, `pricing` (jsonb), `social_links` (jsonb), `languages`, `skills`, `formats`, `niches`, `software`.

#### `contact_requests`
Demandes de contact envoyées par un créateur à un monteur. Sert aussi de support aux candidatures sur les projets (via `project_id`). Clé d'entrée dans la messagerie.

Colonnes clés : `id`, `user_id` (créateur), `editor_id` (monteur), `project_id` (optionnel, FK vers `projects`), `status`, `created_at`.

#### `messages`
Messages individuels échangés dans une conversation. Chaque message est rattaché à une `contact_request`.

Colonnes clés : `id`, `request_id` (FK vers `contact_requests`), `sender_id`, `content`, `created_at`.

#### `offers`
Propositions de mission formalisées envoyées dans une conversation. Contient tous les détails de la mission proposée.

Colonnes clés : `id`, `request_id`, `creator_id`, `editor_id`, `title`, `description`, `deliverables` (jsonb), `content_format`, `deadline`, `budget`, `budget_type`, `budget_min`, `budget_max`, `revisions`, `status` (`pending` / `accepted` / `refused`), ainsi que des champs de qualification (`niches`, `preferred_software`, `required_languages`, `experience_level`, etc.).

#### `projects`
Projets publiés par les créateurs pour rechercher un monteur.

Colonnes clés : `id`, `creator_id`, `title`, `description`, `status` (`draft` / `published`), `format`, `niche`, `budget`, `deadline`, `created_at`.

#### `notifications`
Notifications in-app pour les utilisateurs (nouveaux messages, nouvelles candidatures, etc.).

Colonnes clés : `id`, `user_id`, `type`, `payload` (jsonb), `read` (boolean), `created_at`.

#### `mod_reports`
Signalements soumis par les utilisateurs sur des profils ou des messages.

Colonnes clés : `id`, `reporter_id`, `target_id` (profil signalé, optionnel), `message_id` (message signalé, optionnel), `reason`, `status` (`pending` / `reviewed` / `resolved` / `dismissed`), `created_at`.

#### `favorites`
Mise en favori d'un profil monteur par un créateur.

Colonnes clés : `id`, `creator_id`, `editor_id`, `created_at`. Contrainte UNIQUE sur `(creator_id, editor_id)`.

#### `deliverable_rounds`
Rounds de livraison et de feedback dans le cadre d'une collaboration. Rattaché à une `contact_request`.

Colonnes clés : `id`, `request_id`, `round_number`, `submitted_at`, `feedback`, `status`.

#### `project_reviews`
Avis laissés par les créateurs sur les monteurs après une collaboration.

Colonnes clés : `id`, `reviewer_id` (créateur), `editor_id`, `rating`, `comment`, `created_at`.

---

## 5. Migrations SQL

Les migrations se trouvent dans `supabase/migrations/`. Elles doivent être appliquées **dans l'ordre numérique** via l'éditeur SQL du dashboard Supabase (SQL Editor > New query > coller le contenu > Run).

Toutes les données étant des données de démonstration, aucune migration de données n'est nécessaire — un DROP + RECREATE est acceptable si besoin.

| Fichier | Contenu |
|---------|---------|
| `001_social_links_jsonb.sql` | Conversion de `profiles.social_links` de type `text` vers `jsonb` |
| `002_drop_legacy_fields.sql` | Suppression des colonnes `username` et `presentation_video_url` de `profiles` |
| `003_pricing.sql` | Ajout de la colonne `pricing` (jsonb) dans `profiles`, suppression de `hourly_rate` et `delivery_time` |
| `004_offers_project_fields.sql` | Extension de la table `offers` : renommage `format` → `content_format`, ajout de `budget_type`, `budget_min`, `budget_max`, `quality`, `video_count`, `niches`, `preferred_software`, `required_languages`, `experience_level`, etc. |
| `005_rls_notifications.sql` | Activation et configuration des politiques RLS sur la table `notifications` |
| `006_rls_deliverable_rounds.sql` | Activation et configuration des politiques RLS sur `deliverable_rounds` (accès limité aux deux parties de la collaboration) |
| `007_rls_project_reviews.sql` | Politiques RLS sur `project_reviews` : lecture publique, insertion limitée à l'auteur |
| `008_rls_projects.sql` | Politiques RLS sur `projects` : lecture publique pour les projets publiés, écriture réservée au créateur |
| `009_favorites.sql` | Création de la table `favorites` avec politiques RLS (accès limité au créateur propriétaire) |
| `010_mod_reports.sql` | Création de la table `mod_reports` avec politiques RLS de base |
| `011_rls_admin.sql` | Ajout des politiques admin : lecture de tous les profils et tous les signalements pour les utilisateurs `role='admin'` |
| `012_offers_deliverables_jsonb.sql` | Conversion de `offers.deliverables` de type `text` vers `jsonb` |

### Procédure d'application

1. Ouvrir le dashboard Supabase du projet.
2. Aller dans **SQL Editor**.
3. Ouvrir le fichier de migration souhaité depuis le dépôt.
4. Coller le contenu et cliquer **Run**.
5. Vérifier l'absence d'erreurs dans le panneau de résultats.
6. Répéter pour chaque migration dans l'ordre.

---

## 6. Comptes démo

### Stockage des identifiants

Les identifiants des comptes démo ne sont **jamais codés en dur dans le code source**. Ils sont chargés depuis les variables d'environnement à l'exécution dans `src/lib/demoData.js` :

```js
export const DEMO_EMAIL    = import.meta.env.VITE_DEMO_EMAIL    ?? ''
export const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? ''

export const DEMO_CREATOR_EMAIL    = import.meta.env.VITE_DEMO_CREATOR_EMAIL    ?? ''
export const DEMO_CREATOR_PASSWORD = import.meta.env.VITE_DEMO_CREATOR_PASSWORD ?? ''
```

Les comptes démo doivent être créés manuellement dans Supabase (Authentication > Users) avec les identifiants correspondants aux variables d'environnement.

### Modes démo

Trois modes sont disponibles, contrôlés par l'état `demoMode` dans `OnboardingContext` :

| Mode | Déclencheur | Comportement |
|------|-------------|--------------|
| **`'editor'`** | Bouton "Démo monteur" sur la Landing | Connexion avec `DEMO_EMAIL` / `DEMO_PASSWORD`. Redirige vers `/projects`. |
| **`'creator'`** | Bouton "Démo créateur" sur la Landing ou CreatorSignup | Connexion avec `DEMO_CREATOR_EMAIL` / `DEMO_CREATOR_PASSWORD`. Redirige vers `/catalog`. |
| **`'onboarding'`** | Bouton "Tester l'onboarding" sur la Landing ou Step1 | Crée un compte Supabase temporaire avec un email unique. Redirige vers l'étape 2. **Le profil est supprimé à la déconnexion.** |

### Données du formulaire démo

`DEMO_FORM` dans `demoData.js` contient un jeu de données pré-rempli (profil Lucas Martin) utilisé pour pré-remplir les formulaires d'onboarding en mode démo. Il inclut : prénom, nom, langues, compétences, formats, niches, logiciels, bio, liens portfolio, etc.

---

## 7. Variables d'environnement

Toutes les variables sont prefixées `VITE_` pour être accessibles côté client via `import.meta.env`.

### Variables requises

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL du projet Supabase (ex. : `https://xxxxxxxxxxxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Clé publique anonyme Supabase (JWT) |

Ces deux valeurs se trouvent dans le dashboard Supabase sous **Project Settings > API**.

### Variables pour les comptes démo

| Variable | Description |
|----------|-------------|
| `VITE_DEMO_EMAIL` | Email du compte démo monteur |
| `VITE_DEMO_PASSWORD` | Mot de passe du compte démo monteur |
| `VITE_DEMO_CREATOR_EMAIL` | Email du compte démo créateur |
| `VITE_DEMO_CREATOR_PASSWORD` | Mot de passe du compte démo créateur |

### Configuration locale

Créer un fichier `.env.local` à la racine du projet (ce fichier est ignoré par git) :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

VITE_DEMO_EMAIL=demo-editor@cutlab.fr
VITE_DEMO_PASSWORD=motdepasse_monteur
VITE_DEMO_CREATOR_EMAIL=demo-creator@cutlab.fr
VITE_DEMO_CREATOR_PASSWORD=motdepasse_createur
```

### Configuration en production (Vercel)

Les variables d'environnement doivent être renseignées dans le dashboard Vercel :
**Project Settings > Environment Variables**

Ajouter chaque variable avec le scope "Production" (et "Preview" si nécessaire).

---

## 8. Build et déploiement

### Développement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (Vite, port 5173 par défaut)
npm run dev
```

### Build de production

```bash
# Générer les fichiers statiques optimisés dans dist/
npm run build

# Prévisualiser le build localement avant déploiement
npm run preview
```

Le dossier `dist/` contient tous les assets compilés. Ne pas committer ce dossier (il est dans `.gitignore`).

### Déploiement sur Vercel

Le projet est configuré pour Vercel via `vercel.json` à la racine. Deux sections importantes :

**Rewrites (SPA routing)**

```json
"rewrites": [
  { "source": "/((?!api).*)", "destination": "/index.html" }
]
```

Toutes les routes (sauf `/api/*`) renvoient vers `index.html`, ce qui permet à React Router de gérer le routage côté client. Sans cette règle, un rafraîchissement de page sur `/catalog` renverrait une erreur 404.

**Headers de sécurité**

`vercel.json` configure les headers HTTP suivants sur toutes les routes :

| Header | Valeur |
|--------|--------|
| `X-Frame-Options` | `SAMEORIGIN` (protection clickjacking) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Caméra, micro, géolocalisation désactivés |
| `Content-Security-Policy` | Scripts limités à `'self'`, connexions Supabase autorisées via `*.supabase.co` |

### Déploiement continu

Avec l'intégration Vercel+GitHub, chaque push sur `main` déclenche automatiquement un build et un déploiement. Les PR créent des environnements de prévisualisation (Preview Deployments).

---

## 9. Politiques RLS

Row Level Security (RLS) est activé sur toutes les tables. Chaque table a ses propres politiques décrites ci-dessous.

### `profiles`

| Politique | Opération | Règle |
|-----------|-----------|-------|
| (politique par défaut) | SELECT | Chaque utilisateur voit son propre profil (`auth.uid() = id`) |
| `admins_read_all_profiles` | SELECT | Les utilisateurs avec `role='admin'` voient tous les profils |

Les modifications (UPDATE) sur `profiles` sont limitées au propriétaire du profil.

### `contact_requests`

Les deux parties (créateur `user_id` et monteur `editor_id`) peuvent lire et modifier les demandes qui les concernent. Un créateur peut en insérer une nouvelle.

### `messages`

Lecture et insertion limitées aux participants de la `contact_request` associée (via `request_id`).

### `offers`

Lecture et modification limitées au créateur (`creator_id`) et au monteur (`editor_id`) de l'offre.

### `projects`

| Politique | Opération | Règle |
|-----------|-----------|-------|
| `projects_select_published` | SELECT | Lecture publique si `status='published'`, ou si `creator_id = auth.uid()` |
| `projects_insert_owner` | INSERT | Seulement si `creator_id = auth.uid()` |
| `projects_update_owner` | UPDATE | Seulement si `creator_id = auth.uid()` |
| `projects_delete_owner` | DELETE | Seulement si `creator_id = auth.uid()` |

### `notifications`

| Politique | Opération | Règle |
|-----------|-----------|-------|
| `notifications_select_own` | SELECT | `user_id = auth.uid()` |
| `notifications_delete_own` | DELETE | `user_id = auth.uid()` |
| `notifications_insert_service` | INSERT | `user_id = auth.uid()` (rôle service pour les triggers) |

### `mod_reports`

| Politique | Opération | Règle |
|-----------|-----------|-------|
| `mod_reports_insert_auth` | INSERT | N'importe quel utilisateur authentifié, si `reporter_id = auth.uid()` |
| `mod_reports_select_own` | SELECT | L'utilisateur voit uniquement ses propres signalements |
| `admins_view_all_reports` | SELECT | Les admins voient tous les signalements |

### `favorites`

Lecture, insertion et suppression limitées au créateur propriétaire (`creator_id = auth.uid()`).

### `deliverable_rounds`

Accès (lecture, insertion, modification) limité aux deux parties de la collaboration : le créateur (`user_id`) et le monteur (`editor_id`) référencés dans la `contact_request` associée.

### `project_reviews`

| Politique | Opération | Règle |
|-----------|-----------|-------|
| `project_reviews_select_public` | SELECT | Lecture publique (preuve sociale sur les profils) |
| `project_reviews_insert_author` | INSERT | Seulement si `reviewer_id = auth.uid()` |

Les avis ne peuvent pas être modifiés après soumission (aucune politique UPDATE définie).

---

## 10. Dépannage courant

### L'authentification ne fonctionne pas

**Symptôme** : connexion impossible, erreur réseau, boucle de redirection.

**Vérifications** :
1. S'assurer que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont correctement renseignées dans `.env.local` (dev) ou dans les variables d'environnement Vercel (prod).
2. Vérifier que les valeurs sont copiées depuis Project Settings > API dans le dashboard Supabase, sans espace ni retour à la ligne.
3. Redémarrer le serveur Vite (`npm run dev`) après toute modification de `.env.local` — Vite ne recharge pas les variables d'environnement à chaud.
4. Vérifier dans la console navigateur que la requête vers `supabase.co` ne retourne pas 401 ou 403.

---

### Les requêtes RLS bloquent des données attendues

**Symptôme** : des données existent dans la table mais ne s'affichent pas dans l'application, ou des inserts échouent silencieusement.

**Vérifications** :
1. Dans le dashboard Supabase, aller dans **Table Editor** et vérifier la présence des lignes.
2. Aller dans **Authentication > Policies** pour la table concernée et relire les politiques actives.
3. Tester la requête dans l'éditeur SQL en utilisant `SET LOCAL role = anon;` ou `SET LOCAL role = authenticated;` pour simuler le contexte d'un utilisateur.
4. Si une migration RLS a été appliquée partiellement, réappliquer le fichier SQL complet correspondant.
5. S'assurer que RLS est bien activé sur la table (`ALTER TABLE xxx ENABLE ROW LEVEL SECURITY;` — visible dans Table Editor > colonne "RLS").

---

### Les comptes démo ne fonctionnent pas

**Symptôme** : cliquer sur "Démo monteur" ou "Démo créateur" ne connecte pas, ou affiche une erreur.

**Vérifications** :
1. Vérifier que `VITE_DEMO_EMAIL`, `VITE_DEMO_PASSWORD`, `VITE_DEMO_CREATOR_EMAIL`, `VITE_DEMO_CREATOR_PASSWORD` sont bien définies dans les variables d'environnement.
2. S'assurer que les comptes correspondants existent dans Supabase (Authentication > Users) et que leurs mots de passe correspondent exactement aux variables.
3. Vérifier que les comptes ne sont pas suspendus dans la table `profiles` (colonne `status`).
4. Si les comptes ont été supprimés ou recréés dans Supabase Auth, les profils correspondants dans `profiles` doivent aussi exister (même `id` que dans `auth.users`).

---

### Erreur 404 sur des routes après déploiement

**Symptôme** : navigation directe vers `/catalog`, `/projects`, etc. retourne une page 404 sur Vercel.

**Cause** : la règle de rewrite SPA dans `vercel.json` n'est pas appliquée.

**Vérification** : s'assurer que `vercel.json` est bien présent à la racine du dépôt et versionné. Vérifier dans le dashboard Vercel (Deployments > détail du build) que le fichier est bien détecté.

---

### Le rôle admin n'est pas pris en compte après attribution

**Symptôme** : l'utilisateur a `role='admin'` dans la DB mais est redirigé vers `/` depuis les pages admin.

**Cause** : le rôle est chargé depuis la DB à la restauration de session (au rechargement de page), pas en temps réel.

**Solution** : l'utilisateur doit se déconnecter complètement et se reconnecter. La déconnexion efface le localStorage et le sessionStorage, forçant un rechargement propre du profil au login suivant.

---

### Les notifications ne s'affichent pas

**Symptôme** : la cloche dans la TopNav ne signale pas de nouvelles notifications.

**Vérifications** :
1. Vérifier que des lignes existent dans la table `notifications` pour l'utilisateur concerné (`user_id`).
2. S'assurer que les politiques RLS sur `notifications` sont en place (migration `005_rls_notifications.sql`).
3. Le polling s'effectue toutes les 30 secondes — patienter ou rafraîchir la page.

---

### Le mode onboarding laisse des comptes orphelins

**Cause** : si un utilisateur ferme le navigateur pendant l'onboarding démo sans se déconnecter, le profil temporaire n'est pas supprimé (la suppression se fait dans `signOut`).

**Nettoyage manuel** :
```sql
-- Trouver les profils en mode onboarding (emails générés automatiquement)
-- Format habituel : demo-<timestamp>@cutlab-demo.internal (vérifier l'implémentation exacte)
DELETE FROM profiles
WHERE status = 'draft'
  AND created_at < now() - interval '24 hours'
  AND role = 'editor';  -- les comptes onboarding sont créés en tant qu'editor par défaut
```

Adapter la requête selon le format réel des emails générés par le mode onboarding.

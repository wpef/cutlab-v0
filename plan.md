# Plan de corrections — Audit fonctionnel `6304e21`

**Branch:** `claude/bold-wu-523c94`
**Date:** 2026-04-28
**Status:** En attente de retours utilisateur avant exécution.

Audit réalisé sur les 4 parcours (Onboarding, Workflow Créateur, Workflow Monteur, Infrastructure).
Corrections classées par sévérité et groupées par commits atomiques.

---

## Groupe 1 — Migrations DB (prérequis bloquants)

> À exécuter en premier. Toutes les corrections JS du groupe 2 dépendent de ces migrations.

### T1 — Corriger migration 006 : colonne `contact_request_id` → `request_id`

**Fichier :** `supabase/migrations/006_rls_deliverable_rounds.sql`
**Lignes :** 14, 24, 34
**Problème :** Les policies RLS utilisent `deliverable_rounds.contact_request_id` mais la colonne réelle s'appelle `request_id`. Les policies échouent au deploy → toutes les opérations sur `deliverable_rounds` sont bloquées côté RLS.
**Fix :** Remplacer `contact_request_id` par `request_id` dans les 3 occurrences.

### T2 — Ajouter policies RLS admin sur `profiles` et `mod_reports`

**Fichiers :** nouvelles migrations à créer
**Problème :** Les pages admin (`/admin/users`, `/admin/reports`) utilisent le client anon qui respecte les RLS. Aucune policy n'autorise `role='admin'` à lire tous les profils ou tous les signalements → les pages retournent des résultats vides.
**Fix :** Créer `supabase/migrations/011_rls_admin.sql` :
```sql
-- Admins can read all profiles
CREATE POLICY "admins_read_all_profiles" ON profiles
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Admins can read all reports
CREATE POLICY "admins_view_all_reports" ON mod_reports
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
```

**Commit :** `fix(db): correct RLS migration 006 + add admin policies`

---

## Groupe 2 — Bugs critiques JS (fonctionnalités cassées)

### T3 — Corriger colonne dans `useMessages.js`

**Fichier :** `src/hooks/useMessages.js:14`
**Problème :** `.eq('contact_request_id', contactRequestId)` → la colonne s'appelle `request_id`. Les messages ne se chargent jamais, le chat est vide.
**Fix :** `.eq('request_id', contactRequestId)`

### T4 — Corriger rendu de `deliverables` (array → string lisible)

**Fichiers :**
- `src/components/pages/OfferPreview.jsx:113`
- `src/components/messaging/ProjectProposalCard.jsx:57,110`

**Problème :** `deliverables` est un array d'objets `{ type, quantity, duration }` (défini dans `OfferForm.jsx:17`). Rendu direct dans JSX → crash React ou `[object Object]`. La colonne DB `offers.deliverables` est `text` mais le code envoie un array JSON (voir `MessagingContext.jsx:178`).

**Fix :**
1. Sérialiser avant envoi en DB (`MessagingContext`) : `JSON.stringify(offerData.deliverables)`
2. Dans `OfferPreview.jsx:113` et `ProjectProposalCard.jsx` : parser + formatter :
```js
const deliverablesText = Array.isArray(offer.deliverables)
  ? offer.deliverables.map(d => `${d.quantity}× ${d.type}${d.duration ? ` (${d.duration})` : ''}`).join(', ')
  : offer.deliverables
```
Ou changer le type de la colonne `offers.deliverables` en `jsonb` (migration dédiée).

### T5 — Corriger `goToMessaging` non importé dans `Catalog.jsx`

**Fichier :** `src/components/pages/Catalog.jsx:83`
**Problème :** `goToMessaging()` est appelé mais absent de la destructuration du context ligne 12 → `TypeError: goToMessaging is not a function` au clic "Contacter".
**Fix :** Ajouter `goToMessaging` dans la destructuration depuis `useOnboarding()` ou `useMessaging()` selon la source réelle.

### T6 — Corriger `name` utilisé avant déclaration dans `EditorDetail.jsx`

**Fichier :** `src/components/pages/EditorDetail.jsx:92`
**Problème :** `goToCreatorSignup(id, name || 'Monteur')` est appelé ligne 92 mais `name` est défini ligne 114 → `ReferenceError` au clic "Contacter".
**Fix :** Déplacer la définition de `name` avant la ligne 92.

### T7 — Transmettre `pricing` à `EditorCard` dans `Step7Preview`

**Fichier :** `src/components/steps/Step7Preview.jsx:56`
**Problème :** `pricing: formData.pricing` absent du profile objet → la fourchette tarifaire n'apparaît jamais dans l'aperçu de l'étape 7. Aussi : `hourly_rate: formData.hourlyRate` est passé mais ce champ n'existe pas dans `formData`.
**Fix :**
- Supprimer la ligne `hourly_rate: formData.hourlyRate`
- Ajouter `pricing: formData.pricing`

**Commit :** `fix: critical JS bugs — useMessages column, deliverables render, goToMessaging, EditorDetail name, Step7 pricing`

---

## Groupe 3 — Sécurité & infrastructure

### T8 — Protéger les pages admin au niveau composant

**Fichiers :** `src/components/pages/admin/AdminUsers.jsx`, `AdminReports.jsx`
**Problème :** Aucune vérification de rôle interne. Un utilisateur qui accède à `/admin/users` directement contourne le guard de route.
**Fix :** Ajouter au début de chaque composant :
```jsx
const { userRole } = useOnboarding()
if (userRole !== 'admin') return <Navigate to="/" replace />
```

### T9 — Corriger la CSP dans `vercel.json`

**Fichier :** `vercel.json:12`
**Problème :** `script-src 'unsafe-inline' 'unsafe-eval'` neutralise la protection CSP — incompatible avec le "production-ready hardening" du commit.
**Fix :** Retirer `'unsafe-inline'` et `'unsafe-eval'`. Vérifier si Vite en prod les nécessite encore (normalement non après build).

**Commit :** `fix(security): admin route guard + CSP hardening`

---

## Groupe 4 — Bugs UX majeurs

### T10 — `ChatView` : ne pas afficher une offre refusée/pending comme offre active

**Fichier :** `src/components/pages/ChatView.jsx:47`
**Problème :** `.find((o) => o.status === 'accepted') ?? offers[0]` → si aucune offre acceptée, affiche `offers[0]` (pending ou refusée) avec ses boutons d'action.
**Fix :** Supprimer `?? offers[0]`. Si aucune offre acceptée, `offer = null` et rien n'est affiché.

### T11 — `ProfileEditor` : `saveStatus` ne se réinitialise pas

**Fichier :** `src/components/editor/ProfileEditor.jsx:356-371`
**Problème :** Le message "Enregistré" reste affiché en permanence après une sauvegarde.
**Fix :** Ajouter `setTimeout(() => setSaveStatus(null), 3000)` après la mise à jour du statut.

### T12 — `Step1Account` : `authError` persiste entre changements d'onglet

**Fichier :** `src/components/steps/Step1Account.jsx:49`
**Problème :** `errorMsg = localError || authError`. `clearAuthError` n'est jamais appelé lors du switch signup/login → une erreur précédente reste visible pendant une tentative valide.
**Fix :** Appeler `clearAuthError()` dans le handler de changement d'onglet.

### T13 — `MesProjetsMonteur` : badge statut figé à "published"

**Fichier :** `src/components/pages/MesProjetsMonteur.jsx:253`
**Problème :** `<ProjectStatusBadge status="published" />` codé en dur pour toutes les candidatures.
**Fix :** `<ProjectStatusBadge status={a.status} />`

### T14 — `profileCompletion.js` : suggestions avec "(Step N)" en anglais

**Fichier :** `src/lib/profileCompletion.js:9-19`
**Problème :** 8 suggestions contiennent `(Step 2)`, `(Step 3)`, etc. Visible dans Step 7 et ProfileEditor.
**Fix :** Supprimer le suffixe ou traduire en `(étape N)`.

### T15 — `index.html` : `<title>` statique

**Fichier :** `index.html:6`
**Problème :** L'onglet navigateur affiche toujours "CUTLAB — Onboarding Monteur" quelle que soit la page.
**Fix :** Mettre à jour `document.title` par route via `useEffect` dans chaque page principale (catalog, projects, editor, messaging, admin…).

**Commit :** `fix(ux): chatview offer selection, saveStatus reset, authError clear, badge status, completions labels, page titles`

---

## Groupe 5 — Accents et typographie

Corrections atomiques, un seul commit.

| Fichier | Ligne | Actuel | Corrigé |
|---|---|---|---|
| `src/components/layout/TopNav.jsx` | 66 | `Deconnexion` | `Déconnexion` |
| `src/components/editor/ProfileEditor.jsx` | 338 | `'Profil mis a jour !'` | `'Profil mis à jour !'` |
| `src/components/editor/ProfileEditor.jsx` | 798 | `Se deconnecter` | `Se déconnecter` |
| `src/components/editor/ProfileEditor.jsx` | 404 | `Apercu de ma carte` | `Aperçu de ma carte` |
| `src/components/pages/EditorPipeline.jsx` | 58 | `"a l'instant"` | `"à l'instant"` |
| `src/components/pages/EditorPipeline.jsx` | 139 | `Les createurs` | `Les créateurs` |
| `src/components/pages/EditorPipeline.jsx` | 217 | `Acceder a la conversation` | `Accéder à la conversation` |
| `src/components/pages/EditorPipeline.jsx` | 197 | `&euro;` | `€` |
| `src/components/pages/admin/AdminUsers.jsx` | 44 | `admin-badge--${u.status}` | `admin-badge--${u.status ?? 'unknown'}` |

**Commit :** `fix(typos): accents and wording corrections`

---

## Ordre d'exécution recommandé

```
T1 → T2   (migrations DB, prérequis)
T3 → T7   (bugs critiques JS, en parallèle possible)
T8 → T9   (sécurité)
T10 → T15 (bugs UX majeurs, en parallèle possible)
Groupe 5  (typos, dernier)
```

**Total :** 5 commits atomiques.

---

## Points à arbitrer avant exécution

1. **`deliverables` en DB** (T4) : changer la colonne en `jsonb` (migration) ou sérialiser en JSON string côté client ? Migration = plus propre mais destructive.
2. **`<title>` dynamique** (T15) : `document.title` par page suffit ou besoin de react-helmet ?
3. **CookieBanner RGPD** (hors plan) : le consentement actuel ne différencie pas les catégories de cookies. À arbitrer selon l'évolution légale.
4. **Retours utilisateur à ajouter** — ce plan sera complété avant exécution.

# Plan — Corrections feedback test production-ready (batch 2)

## Contexte
Branche `feat/production-ready` — 15 commits depuis main, build OK, dev server OK.
12 bugs remontés en test manuel par l'utilisateur (créateur `filsdeprojet@gmail.com`).
Données de seed fraîches en BDD (10 projets, 8 candidatures, 3 offres) — voir `plans/PLAN_PHASE2.md` pour les items "pour plus tard".

---

## Objectifs (12 bugs)

1. **Filtres monteur cassés** — la liste des projets disponibles ne filtre pas (`/projects` tab Projets disponibles)
2. **ProjectDetail container plus étroit sur vrais projets** — perçu comme "moins large" quand il manque `start_date` (ou autres champs) → hero items qui rétrécissent
3. **My-projects compte candidatures jamais à jour** — `application_count` n'est jamais calculé dans `fetchMyProjects`
4. **"Voir le profil" mène au catalogue** — `goToEditorDetail(profile.id)` reçoit `undefined` car le SELECT join ne retourne pas `profiles.id`
5. **Form création projet — dates** : start/end sur la même ligne, icône calendrier visible, calculer la durée affichée, défaut start_date = aujourd'hui
6. **Seed BDD : livrables invalides** — j'ai utilisé des labels libres au lieu des keys de `DELIVERABLE_TYPES` (et idem pour `content_format`, `niches`, `mission_type`, `experience_level`)
7. **Header chat (monteur)** — affiche le nom du créateur, devrait afficher le titre du projet
8. **Page projet reste en chargement (monteur, projet pourvu)** — boucle de chargement infinie quand l'éditeur clique sur le lien projet depuis le chat d'une mission acceptée
9. **OfferForm — éléments du projet pas pré-chargés** — vérifier le path de chargement, certains champs ne se remplissent pas
10. **OfferForm — projet à fourchette** — quand `budget_type='range'`, le champ budget de l'offre devrait se pré-remplir avec `budget_min` du projet
11. **CollabTracker — offre envoyée n'avance pas le suivi** — si `offer.status='pending'` la tracker reste sur `candidature_accepted`. Doit afficher `offer_sent` avec View/Accept/Refuse pour le receveur et View/Modifier/Annuler pour l'envoyeur. Si offre annulée, le suivi recule
12. **CollabTracker — bouton terminer le projet** — quand suivi terminé (feedback déposé), créateur peut cliquer "Mettre fin au projet" → projet en `completed`/archivé + chat fermé

---

## Hors scope (notés dans plans/PLAN_PHASE2.md)

- **Échanges sur retours dans le corps de la conversation** — actuellement les feedback sont uniquement dans la sidebar, à dupliquer dans le timeline du chat
- **Liens livrables validés dans la sidebar** — comme pour les feedbacks, afficher les liens des rounds validés dans la sidebar
- **Edit offer (modifier)** — pour l'instant on implémente seulement Annuler. Modifier nécessite une UX dédiée (réouverture du form pré-rempli)

---

## Tâches

### T01 — ProjectForm UX dates
**Complexité** : simple
**Fichiers** : `src/components/pages/ProjectForm.jsx`, `src/styles/global.css`

**Quoi** :
- Mettre `start_date` et `deadline` sur la même ligne (flex row, 2 colonnes égales) sur desktop, empilés sur mobile (`@media max-width: 768px`)
- Pré-remplir `start_date` avec la date du jour à l'init du form (uniquement en mode création, pas en édition) — `new Date().toISOString().split('T')[0]`
- Ajouter affichage de la durée calculée sous les deux champs : "X jours" (ou "X semaines" / "X mois" si pertinent), uniquement si les deux dates sont remplies et `deadline > start_date`. Afficher en `font-size: 12px; color: var(--text-muted)` sous les inputs
- Rendre l'icône calendrier visible sur les inputs `type="date"` : ajouter dans global.css `input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.8); cursor: pointer; opacity: 0.7; }` pour que l'icône apparaisse claire sur le thème sombre

**Validation** :
- Ouvrir `/project/new` : start_date pré-rempli avec aujourd'hui, deadline vide
- Choisir une deadline 30 jours plus tard : "30 jours" s'affiche
- Sur desktop, les deux champs sont côte à côte
- L'icône calendrier est visible (cliquable) à droite de chaque date input

---

### T02 — ApplicationCard "Voir le profil"
**Complexité** : trivial
**Fichier** : `src/components/projects/ApplicationCard.jsx`

**Quoi** :
- Ligne 51 : remplacer `goToEditorDetail(profile.id)` par `goToEditorDetail(application.editor_id)`
- `application.editor_id` est garanti présent (FK directe sur contact_requests)
- `profile.id` est `undefined` parce que le SELECT join `profiles!editor_id(first_name, ...)` n'inclut pas `id`

**Validation** :
- En tant que créateur, ouvrir un projet avec candidature, cliquer "Voir le profil →"
- Doit naviguer vers `/editor/<editor_id>` et afficher la page EditorDetail du monteur
- Plus de redirection vers `/catalog`

---

### T03 — ProjectDetail loading vs not-found + hero consistency
**Complexité** : simple
**Fichiers** : `src/components/pages/ProjectDetail.jsx`, `src/styles/global.css`

**Quoi** :
1. **Bug 8 (loading infinite)** : différencier loading et not-found
   - Ajouter un state `notFound`. Si `fetchProjectById` retourne null, set `notFound=true`, set `loading=false`. Le render :
     - `if (loading)` → "Chargement..."
     - `if (notFound || !project)` → "Projet introuvable" + bouton retour
     - sinon render normal
2. **Bug 2 (hero plus étroit)** : la hero `.project-detail-hero` utilise `flex: 1; min-width: 90px` sur ses items. Quand peu d'items, ils sont plus petits. Solution :
   - Modifier `ProjectDetail.jsx` lignes 188-205 pour rendre les 3 hero-items toujours présents (Budget / Date limite / Début souhaité), même si vide → afficher "—"
   - Dans `global.css` ligne 1532 : `.project-detail-hero-item { flex: 1 1 0; min-width: 120px; }`

**Validation** :
- Ouvrir `/project/<id>` avec un id inexistant → message "Projet introuvable" propre, plus de loading infini
- Ouvrir un projet sans `start_date` → 3 hero items affichés avec "—" pour le manquant, taille consistante
- Comparer avec un projet complet : layout identique

---

### T04 — ProjectFilters thumbnail toggle
**Complexité** : trivial
**Fichier** : `src/components/projects/ProjectFilters.jsx`

**Quoi** :
- Ligne 7 : modifier `setFilter` pour gérer `value === undefined` :
  ```js
  function setFilter(key, value) {
    const next = { ...filters }
    if (value === undefined || next[key] === value) delete next[key]
    else next[key] = value
    onFilterChange(next)
    setExpanded(null)
  }
  ```
- Cela corrige le toggle de "Miniature incluse" (ligne 85)

**Validation** :
- Cliquer sur le chip "Miniature incluse" → activé
- Cliquer à nouveau → désactivé, et la liste revient au complet

---

### T05 — MyProjects compte candidatures
**Complexité** : moderate
**Fichier** : `src/context/ProjectContext.jsx` (`fetchMyProjects`)

**Quoi** :
- Modifier `fetchMyProjects` (ligne 56-67) pour calculer `application_count` par projet
- Approche recommandée — sous-select PostgREST :
  ```js
  const { data, error } = await supabase
    .from('projects')
    .select('*, contact_requests!project_id(id, status)')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })
  // Map: ajouter project.application_count = (project.contact_requests || []).filter(r => r.status === 'pending').length
  ```
- Puis enrichir chaque project avant `setMyProjects(data)` :
  ```js
  const enriched = (data ?? []).map(p => ({
    ...p,
    application_count: (p.contact_requests || []).filter(r => r.status === 'pending').length
  }))
  setMyProjects(enriched)
  ```
- ProjectCard utilise déjà `project.application_count` (ligne 51 de ProjectCard.jsx)

**Validation** :
- En tant que `filsdeprojet@gmail.com`, aller sur `/my-projects`
- Le projet "Mon parcours d'entrepreneur en 30 minutes" doit afficher "2 candidatures" (Foulques + Yoyo en pending)
- Les autres projets sans candidature : "0 candidature"

---

### T06 — ChatView header monteur affiche le projet
**Complexité** : simple
**Fichier** : `src/components/pages/ChatView.jsx`

**Quoi** :
- Ajouter un state `projectTitle` chargé depuis `request.project_id` :
  ```js
  const [projectTitle, setProjectTitle] = useState('')
  useEffect(() => {
    if (!request?.project_id) { setProjectTitle(''); return }
    supabase.from('projects').select('title').eq('id', request.project_id).single()
      .then(({ data }) => setProjectTitle(data?.title || ''))
  }, [request?.project_id])
  ```
- Modifier `otherName` (ligne 49-52) ou ajouter une variable `headerLabel` :
  ```js
  const headerLabel = (userRole === 'editor' && request?.project_id)
    ? (projectTitle || request?.creator_name || 'Conversation')
    : (request ? (userRole === 'creator' ? request.editor_name : request.creator_name) : 'Conversation')
  ```
- Utiliser `headerLabel` dans le header au lieu de `otherName`

**Validation** :
- En tant que monteur (`f.demoncade@gmail.com`), ouvrir le chat avec Fils sur le projet "Mon parcours" — le header affiche "Mon parcours d'entrepreneur en 30 minutes"
- En tant que monteur sur un contact direct (sans project_id) — header affiche le nom du créateur (fallback)
- En tant que créateur, header inchangé (nom du monteur)

---

### T07 — OfferForm prefill budget_min + fix init
**Complexité** : simple
**Fichier** : `src/components/pages/OfferForm.jsx`

**Quoi** :
1. Ligne 59 : `budget: data.budget_fixed ? String(data.budget_fixed) : prev.budget`
   → Remplacer par : `budget: data.budget_fixed ? String(data.budget_fixed) : (data.budget_min ? String(data.budget_min) : prev.budget)`
2. Si `request` est undefined au mount, charger les requests (au cas où on arrive directement sur `/offer/new` sans passer par le chat) :
   ```js
   useEffect(() => {
     if (activeRequestId && !request) loadRequests()
   }, [activeRequestId, request])
   ```
   (`loadRequests` exposé par `useMessaging`)

**Validation** :
- Créer une candidature direct (Fils → Foulques sur "Vlog voyage Japon" 700-1100€) puis envoyer une offre depuis le chat
- Le champ budget se pré-remplit avec 700
- Le titre, description, deliverables, etc. se remplissent
- Le bandeau vert "✓ Pré-rempli depuis le projet" apparaît

---

### T08 — CollabTracker : offer pending + cancel + end project
**Complexité** : complex
**Fichiers** : `src/components/messaging/CollabTracker.jsx`, `src/components/pages/ChatView.jsx`

**Quoi** :
1. **ChatView ligne 48** : `const offer = offers.find((o) => o.status === 'accepted') ?? null`
   → Remplacer par : `const offer = offers.filter(o => o.status !== 'cancelled' && o.status !== 'refused').sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0] ?? null` (latest active offer)
2. **CollabTracker step `offer_sent`** (ligne 265-298) :
   - Switch sur `offer?.status` :
     - `pending` + isReceiver : View/Accept/Refuse (déjà OK, garder)
     - `pending` + sender : "✏️ Modifier" (désactivé avec tooltip "À venir") + "✗ Annuler" → `onCancelOffer(offer.id)` (callback prop)
   - Passer `onCancelOffer` en prop depuis ChatView (avec `cancelOffer` du context)
3. **`feedback` step (ligne 478)** : ajouter en bas, après le ReviewForm, un bouton "🏁 Mettre fin au projet" visible uniquement pour le créateur quand son review a été déposée. Au clic appelle `onCloseProject?.()` (prop) → utilise `closeProject(request, offer)` du CollabContext (T09)
4. **Mettre à jour les props passées au tracker** dans ChatView : ajouter `onCancelOffer={cancelOffer}` et `onCloseProject={() => closeProject(request, offer)}`

**Validation** :
- Créer une offre depuis le chat → tracker passe à "Offre envoyée" avec boutons Modifier (disabled)/Annuler côté envoyeur, Accepter/Refuser côté receveur
- Cliquer Annuler → tracker revient à "Candidature acceptée" / "Contact accepté", le créateur peut renvoyer une offre
- Aller jusqu'au feedback → bouton "Mettre fin au projet" apparaît côté créateur après avoir posté son review, clic → tracker passe en "Projet clos"

---

### T09 — CollabContext.cancelOffer + closeProject + MessagingContext expose
**Complexité** : moderate
**Fichiers** : `src/context/CollabContext.jsx`, `src/context/MessagingContext.jsx`

**Quoi** :
1. **`cancelOffer(offerId)`** dans CollabContext (ou MessagingContext, mais CollabContext a déjà la signature des méthodes liées au flow)
   ```js
   const cancelOffer = useCallback(async (offerId) => {
     const { error } = await supabase
       .from('offers')
       .update({ status: 'cancelled' })
       .eq('id', offerId)
     if (error) { console.error('[Collab] cancelOffer:', error.message); return false }
     return true
   }, [])
   ```
   Notification au receveur si possible (avec context offer + request).
   - L'exposer dans le `value` du provider et dans le hook `useCollab`

2. **`closeProject(request, offer)`** dans CollabContext
   ```js
   const closeProject = useCallback(async (request, offer) => {
     if (!request) return false
     const ops = []
     if (request.project_id) {
       ops.push(supabase.from('projects').update({ status: 'completed' }).eq('id', request.project_id))
     }
     // Marker la fin via payment_received_at déjà set, ou ajouter un champ closed_at si nécessaire
     // Pour simplifier on s'appuie sur project.status='completed' + reviews déposées => deriveCollabStep retourne 'closed'
     await Promise.all(ops)
     // Notifications (les deux parties)
     return true
   }, [user])
   ```

3. **deriveCollabStep** : déjà OK car si `payment_received_at` set + creator_review existe → retourne `'closed'`. Le bouton "Mettre fin au projet" en feedback step peut juste re-render le tracker avec un `'closed'` step (le step 'closed' est déjà défini dans allSteps ligne 48). Vérifier que le step `closed` apparaît visuellement comme "actif" quand reached.

4. **MessagingContext** : si on ajoute `cancelOffer` ici à la place de CollabContext (recommandé pour cohérence avec acceptOffer/refuseOffer), exposer dans le hook `useMessaging`.

**Validation** :
- Annuler une offre pending : DB → status='cancelled', le tracker recule au step précédent (candidature_accepted/contact_accepted)
- Cliquer "Mettre fin au projet" en feedback step : DB → projet completed
- Le tracker passe en step `closed` (cercle plein sur "Projet clos")

---

### T10 — Re-seed BDD avec keys valides
**Complexité** : simple (exécution SQL via MCP Supabase, project_id `nctzwtunoznhcgcosucw`)
**Pas de fichier code**, juste des UPDATE SQL via le MCP Supabase

**Quoi** :
Mettre à jour les 10 projets et 3 offres existants en remplaçant les valeurs invalides par les keys valides de `src/constants/options.js`.

| Champ | Keys valides |
|-------|--------------|
| `content_format` | `portrait`, `youtube`, `pub`, `docu`, `corporate`, `clips`, `gaming`, `sport` |
| `niches` | `Gaming`, `Finance`, `Lifestyle`, `Tech`, `Food`, `Sport`, `Mode`, `Éducation`, `Voyage`, `Musique`, `Business`, `Humour`, `Science`, `Politique` |
| `mission_type` | `ponctuelle`, `long-terme` |
| `experience_level` | `<6m`, `6m1y`, `1-3y`, `3-5y`, `5-7y`, `7y+` |
| `quality` | `720p`, `1080p`, `2k`, `4k` |
| `deliverables[].type` | `video`, `thumbnail`, `reels`, `motion_graphics`, `color_grading`, `subtitles`, `sound_design` |

**Mapping (projets)** :
| Project ID | content_format | mission_type | experience_level | deliverables |
|------------|----------------|--------------|------------------|--------------|
| 11111111-1111-1111-1111-000000000001 (Mon parcours) | `youtube` | `ponctuelle` | `1-3y` | `[{type:"video",quantity:1,duration:"25-30 min"},{type:"reels",quantity:2,duration:"60s"}]` |
| 11111111-1111-1111-1111-000000000002 (Lot shorts) | `portrait` | `long-terme` | `3-5y` | `[{type:"reels",quantity:40,duration:"30-60s"}]` |
| 11111111-1111-1111-1111-000000000003 (Brand draft) | `corporate` | `ponctuelle` | `1-3y` | `[]` |
| 11111111-1111-1111-1111-000000000004 (Pastilles) | `portrait` | `long-terme` | `<6m` | `[{type:"video",quantity:25,duration:"45-90s"}]` |
| 22222222-2222-2222-2222-000000000001 (Série tech) | `youtube` | `ponctuelle` | `5-7y` | `[{type:"video",quantity:3,duration:"35-45 min"}]` |
| 22222222-2222-2222-2222-000000000002 (Reels mode) | `portrait` | `ponctuelle` | `3-5y` | `[{type:"reels",quantity:8,duration:"15s"},{type:"reels",quantity:4,duration:"30s"}]` |
| 33333333-3333-3333-3333-000000000001 (Miniatures) | `youtube` | `ponctuelle` | `6m1y` | `[{type:"thumbnail",quantity:10}]` |
| 33333333-3333-3333-3333-000000000002 (TikToks draft) | `portrait` | `ponctuelle` | `<6m` | `[]` |
| 44444444-4444-4444-4444-000000000001 (Mariage) | `docu` | `ponctuelle` | `3-5y` | `[{type:"video",quantity:1,duration:"12 min"},{type:"video",quantity:1,duration:"60s"}]` |
| 55555555-5555-5555-5555-000000000001 (Vlog Japon) | `youtube` | `ponctuelle` | `1-3y` | `[{type:"video",quantity:1,duration:"15 min"}]` |

**Niches** : remplacer `Société` (Pastilles) → `Humour` ; `Evénementiel` (Mariage) → `Lifestyle`.

**Offers** : appliquer les mêmes corrections pour les 3 offres (`bbbbbbbb-0001`, `bbbbbbbb-0002`, `bbbbbbbb-0003`) :
- `content_format`, `niches`, `experience_level`, `mission_type` selon le mapping ci-dessus
- `deliverables` : aligner sur les keys valides

**Validation** :
- En tant que monteur, sur `/projects` cliquer filtre "Format → 🖥️ YouTube long format" → 4 projets affichés (Mon parcours, Série tech, Miniatures, Vlog Japon)
- Ouvrir un projet → les livrables affichent le label avec emoji (🎬 Montage vidéo x1, 📱 Reels / Shorts x2)

---

## Ordre d'exécution

```
Level 0 (parallel — 4 lanes):
  Lane A (Sonnet) : T01 → T03 → T06 → T07
  Lane B (Sonnet) : T02 → T04 → T05
  Lane C (Opus)   : T09 → T08
  Lane D (MCP)    : T10

Level 1 (post-execution sanity):
  Build prod + dev server smoke test
```

Lane C : T09 doit passer avant T08 (T08 utilise les fonctions de T09).
Lanes A, B, D sont indépendantes entre elles.

## Gates utilisateur
- Aucun gate strict — tous les changements sont reversibles via git revert.
- T10 (re-seed) est destructif côté DB mais c'est un UPDATE bornage — données 100% demo, OK.

## Validation finale (golden path)
1. **Build prod** : `npx vite build` doit passer sans erreur
2. **Dev server** : `npm run dev` démarre, page d'accueil charge sans erreur console
3. **Login `filsdeprojet@gmail.com` (créateur)** :
   - `/my-projects` : 4 projets, "Mon parcours" affiche "2 candidatures"
   - Ouvrir "Mon parcours" → 3 hero items consistants, candidatures listées avec bouton "Voir le profil →" qui mène vers EditorDetail
   - Ouvrir chat avec Test Editor → offre pending visible avec boutons Accepter/Refuser
4. **Login `f.demoncade@gmail.com` (monteur Foulques)** :
   - `/projects` tab disponibles : filtre "Format → YouTube" → liste filtrée à 4 projets
   - Ouvrir un projet → bouton "Candidater" fonctionnel, hero items consistants
   - Ouvrir chat avec Fils sur projet "Mon parcours" : header affiche le titre du projet
   - Cliquer le titre dans le header → navigue vers la fiche projet, plus de loading infini
5. **Form `/project/new`** : start_date pré-rempli aujourd'hui, dates côte à côte sur desktop, durée affichée

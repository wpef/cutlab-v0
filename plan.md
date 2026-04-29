# Plan global — CUTLAB

> Décrit l'état actuel du projet, ce qui vient d'être livré, et ce qui reste à faire.
>
> **Date** : 2026-04-29
> **Branche courante** : `feat/production-ready`
> **PR ouverte** : [cutlab-v0#7](https://github.com/wpef/cutlab-v0/pull/7) — `feat/production-ready` → `main`

---

## Où on en est

**Production-ready hardening livré** (~25 commits sur `feat/production-ready` depuis main). Ce qui a été fait :

- **Sécurité** : credentials demo en env vars, headers vercel.json (CSP, X-Frame-Options, Referrer-Policy), admin guards
- **Perf** : `React.lazy` + `Suspense` toutes pages, `manualChunks` (vendor / motion / supabase split)
- **Polices** : self-hosted via `@fontsource/*` (suppression CDN Google Fonts)
- **Realtime** : Supabase Realtime channels remplace polling 30s notifications + 5s messages
- **RGPD** : export-data + delete-account, edge function `delete-account`, cookie consent banner, pages legales
- **Reviews / Favorites / Share** : 5★ EditorCard+EditorDetail, toggle favoris, Web Share API
- **Admin** : AdminUsers (suspend/restore) + AdminReports (resolve/dismiss)
- **ErrorBoundary** : class component wrap App + AppLayout Outlet
- **DB** : 12 migrations (RLS + nouvelles tables : favorites, mod_reports, project_reviews, deliverable_rounds…)
- **Hooks extraits** : `useProfile`, `useMessages`
- **Batch 2 corrections** (10 tâches) : 12 bugs remontés en recette manuelle, fixés (T001-T010), build OK

Le code est en attente de review sur la PR. Une fois mergé sur `main`, le projet est **techniquement prêt** pour un déploiement public.

---

## Ce qui reste à faire — 3 plans en parallèle

### 1. `plans/PLAN_RECETTE.md` — **PRIORITÉ HAUTE, avant mise en prod**

Recette fonctionnelle manuelle effectuée par le porteur projet : 8 issues (CHAT1-CHAT3 + B3.1-B3.5) à traiter avant de mettre l'app en prod publique.

- **Bugs résiduels** du batch 2 : B3.4 (RLS projets — monteur bloqué quand projet pourvu) et B3.5 (bouton archiver projet incomplet)
- **Cohérence UX** : B3.1 (identifiant projet pour le monteur dans toute l'UI, pas seulement le header de chat)
- **Polish forms** : B3.2, B3.3 (préfill + bannière redondante)
- **Enrichissements chat** : CHAT1, CHAT2, CHAT3 (timeline rounds, liens livrables, edit offer)

Chacun de ces items est court (<2h) et peut se paralléliser. **À traiter en une session dédiée à la prochaine ouverture du projet.**

→ Voir [`plans/PLAN_RECETTE.md`](plans/PLAN_RECETTE.md)

---

### 2. `plans/PLAN_PHASE2.md` — long terme technique

Sujets non bloquants pour le MVP mais requis dès qu'il y a du trafic réel ou des obligations légales :

- **AX1** Accessibilité WCAG 2.1 AA (RGAA, EN 301 549)
- **OBS1** Observabilité (Sentry, métriques produit)
- **MAIL1** Emails transactionnels (Resend / Postmark)
- **PWA1** Progressive Web App (offline, install prompt)
- **SEO1** SEO (meta tags, sitemap, OG cards)
- **I18N1** Internationalisation (FR par défaut, EN cible)
- **PUSH1** Web Push notifications

→ Voir [`plans/PLAN_PHASE2.md`](plans/PLAN_PHASE2.md)

---

### 3. `plans/PLAN_MONETISATION.md` — long terme business

Plan de monétisation : pricing, abonnements, marketplace fee, intégration Stripe, certification payante, etc.

À aborder une fois la traction utilisateurs confirmée.

→ Voir [`plans/PLAN_MONETISATION.md`](plans/PLAN_MONETISATION.md)

---

## Ordre d'attaque recommandé

1. **Maintenant** : review de la PR `feat/production-ready` → `main`, puis merge
2. **Prochaine session** : exécuter `PLAN_RECETTE.md` (8 items, 1-2h chacun, parallélisable via `plan-executor`)
3. **Après mise en prod** : mesurer la traction. Si signaux positifs → ouvrir `PLAN_MONETISATION.md` ; si trafic → ouvrir `PLAN_PHASE2.md`

---

## Architecture des plans

```
plan.md                          # Ce fichier — orchestrateur, état projet
plans/
├── PLAN_RECETTE.md              # Priorité haute — recette manuelle à traiter avant prod
├── PLAN_PHASE2.md               # Long terme technique (a11y, obs, emails, PWA, SEO, i18n, push)
└── PLAN_MONETISATION.md         # Long terme business (pricing, Stripe, marketplace)
```

Le batch 2 (qui vient d'être livré) avait son propre `plan.md` détaillé exécuté via le skill `plan-executor` ; ce contenu est conservé dans l'historique git mais n'est plus pertinent ici puisque les tâches sont closes.

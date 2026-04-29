# Plan Monétisation — CUTLAB

> Branche de planification uniquement — aucun code à implémenter ici.  
> À lancer une fois le POC validé et les premiers utilisateurs acquis.

---

## Contexte

CUTLAB est une marketplace B2B2C entre créateurs vidéo (côté demande) et monteurs (côté offre). La monétisation passe par une commission prélevée sur les missions contractualisées entre les deux parties.

**Prérequis avant de démarrer ce plan :**
- Au moins 50 utilisateurs actifs (créateurs + monteurs)
- Au moins 10 missions complétées manuellement (pour valider le flux)
- Validation juridique du statut de la plateforme (intermédiaire de paiement vs mandataire)
- Compte Stripe Connect activé (accès à `platform accounts`)

---

## Architecture de paiement cible

```
Créateur paie → Stripe (escrow)
                    ↓ (après confirmation livraison)
              Commission CUTLAB (application_fee)
                    ↓
              Monteur reçoit (payout)
```

Stripe Connect **Express** pour les monteurs (KYC allégé, IBAN, payout automatique).  
Stripe **Customer** pour les créateurs (CB, SEPA Debit).

---

## Phase M1 — Infrastructure Stripe (Semaines 1–2)

### M1.1 — Tables DB à créer

```sql
CREATE TABLE stripe_customers (
  id          uuid PRIMARY KEY REFERENCES profiles(id),
  customer_id text NOT NULL UNIQUE,    -- Stripe customer ID (cus_xxx)
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE stripe_accounts (
  id          uuid PRIMARY KEY REFERENCES profiles(id),
  account_id  text NOT NULL UNIQUE,    -- Stripe Connect account ID (acct_xxx)
  onboarded   boolean DEFAULT false,   -- KYC complété
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE transactions (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_request_id   uuid REFERENCES contact_requests(id),
  stripe_pi_id         text UNIQUE,    -- PaymentIntent ID (pi_xxx)
  stripe_transfer_id   text,           -- Transfer ID (tr_xxx)
  amount_cents         int NOT NULL,   -- Montant brut en centimes
  fee_cents            int NOT NULL,   -- Commission CUTLAB
  net_cents            int NOT NULL,   -- Montant monteur
  currency             text DEFAULT 'eur',
  status               text DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'transferred', 'refunded', 'disputed')),
  created_at           timestamptz DEFAULT now(),
  transferred_at       timestamptz
);

CREATE TABLE disputes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id),
  stripe_dispute_id text UNIQUE,
  reason         text,
  status         text DEFAULT 'open',
  created_at     timestamptz DEFAULT now()
);
```

### M1.2 — Migrations contact_requests

```sql
-- Remplacer les booléens manuels par une FK transaction
ALTER TABLE contact_requests
  ADD COLUMN transaction_id uuid REFERENCES transactions(id);

-- Conserver payment_sent_at / payment_received_at pour compatibilité pendant la transition
-- Les supprimer après validation complète du flux Stripe
```

### M1.3 — Variables d'environnement à ajouter dans .env.example

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLIC_KEY=pk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
CUTLAB_COMMISSION_RATE=0.12    # 12% — à définir définitivement
```

---

## Phase M2 — Supabase Edge Functions (Semaines 2–3)

### M2.1 — `create-payment-intent`

**Trigger :** Créateur accepte une offre de mission  
**Inputs :** `contact_request_id`, `amount_cents`  
**Actions :**
1. Vérifier que le monteur a un `stripe_accounts.account_id` et `onboarded = true`
2. Vérifier que le créateur a un `stripe_customers.customer_id` (sinon le créer)
3. Créer un `PaymentIntent` avec `application_fee_amount = amount * COMMISSION_RATE`
4. Insérer une ligne dans `transactions` avec `status = 'pending'`
5. Retourner `client_secret` au front

### M2.2 — `handle-stripe-webhook`

**Events à gérer :**

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | `transactions.status = 'captured'`, notification monteur |
| `payment_intent.payment_failed` | `transactions.status = 'failed'`, notification créateur |
| `transfer.created` | `transactions.stripe_transfer_id = tr_xxx`, `transferred_at = now()` |
| `account.updated` | Mettre à jour `stripe_accounts.onboarded` si KYC complété |
| `charge.dispute.created` | Créer entrée `disputes`, notifier admin |

### M2.3 — `create-stripe-account`

**Trigger :** Monteur clique "Activer les paiements" dans ProfileEditor  
**Actions :**
1. Créer un compte Stripe Express via `stripe.accounts.create({ type: 'express', country: 'FR' })`
2. Insérer dans `stripe_accounts`
3. Retourner un `account_link.url` pour le onboarding KYC Stripe

### M2.4 — `transfer-to-editor`

**Trigger :** Créateur confirme la livraison finale (CollabTracker step "Livré")  
**Actions :**
1. Vérifier que `transaction.status = 'captured'`
2. `stripe.transfers.create({ amount: net_cents, destination: account_id })`
3. `transactions.status = 'transferred'`, `transferred_at = now()`

---

## Phase M3 — Intégration UI (Semaines 3–4)

### M3.1 — OfferForm & OfferPreview

- Afficher le montant de la commission transparemment :
  ```
  Budget mission :     500 €
  Commission CUTLAB :   60 € (12%)
  ─────────────────────────
  Monteur reçoit :     440 €
  ```
- Champ budget → validation min 50 €, max 50 000 €

### M3.2 — CollabTracker — étape "Règlement"

Remplacer les toggles booléens manuels par :
- Bouton **"Payer la mission"** → appel `create-payment-intent` → Stripe Payment Element (iframe sécurisée)
- Statut de paiement temps réel via Realtime sur `transactions`
- État visuel : En attente → Payé → Transféré

**Fichiers à modifier :**
- `src/context/CollabContext.jsx` (L188–215)
- `src/components/messaging/CollabTracker.jsx`

### M3.3 — ProfileEditor — section paiements (monteur)

- Bouton "Activer les paiements Stripe" → appelle `create-stripe-account` → redirect KYC
- Badge "Paiements activés ✓" si `onboarded = true`
- Lien "Tableau de bord Stripe" → `stripe.com/connect/express-dashboard`

### M3.4 — Espace paiements créateur

- Page `/payments` (creator only) : liste transactions, statuts, boutons
- Pas besoin d'une page dédiée monteur — le tableau de bord Stripe Express suffit

---

## Phase M4 — Facturation (Semaine 4–5)

### M4.1 — Stripe Invoices (option recommandée)

Utiliser `stripe.invoices` pour générer automatiquement les factures côté Stripe.  
Avantage : conforme légalement, hébergé par Stripe, sans code custom.

### M4.2 — Alternative : PDF via Supabase Function

Si Stripe Invoices ne couvre pas les besoins FR (TVA, mentions légales) :
- Edge Function `generate-invoice` avec `puppeteer-core` + template HTML CUTLAB
- Upload PDF dans Supabase Storage bucket `invoices` (private)
- Signed URL envoyée par email

---

## Phase M5 — Recommendations & Matching (Semaines 5–6)

> Dépend de M1–M4 car le scoring de matching utilise l'historique de missions réelles.

### M5.1 — Algorithme de matching

Exploiter `computeLevel.js` (déjà en place) + données transactionnelles :

```
score_matching(editor, project) =
  overlap(editor.niches, project.niches) * 0.35 +
  overlap(editor.formats, project.format) * 0.30 +
  level_fit(editor.assigned_level, project.budget) * 0.20 +
  availability_score(editor.availability) * 0.10 +
  review_avg(editor) * 0.05
```

### M5.2 — "Monteurs recommandés" dans Catalog

- Section "Recommandés pour vous" au-dessus du catalog général
- Basé sur les niches/formats des projets du créateur connecté
- Query : `SELECT profiles.* FROM profiles JOIN ... ORDER BY score DESC LIMIT 6`

### M5.3 — Filtres avancés Catalog

- Disponibilité (toggle)
- Niveau (slider ou multi-select)
- Fourchette tarifaire (range input)
- Langue (multi-select)
- Format (multi-select existant à améliorer)

---

## Checklist de validation avant lancement

- [ ] Stripe test mode : PaymentIntent créé, webhook reçu, transfer déclenché
- [ ] KYC monteur complet (compte Stripe Express avec IBAN)
- [ ] Paiement SEPA créateur end-to-end
- [ ] Commission prélevée correctement (vérifier dans Stripe dashboard)
- [ ] Dispute créée et enregistrée dans `disputes`
- [ ] Facture générée et envoyée
- [ ] RLS sur `transactions` : créateur voit les siennes, monteur voit les siennes
- [ ] Validation avocat sur les CGU (ajout clause commission + paiement séquestre)

---

## Estimation

| Phase | Durée | Dépendances |
|-------|-------|-------------|
| M1 DB + env | 1–2j | Aucune |
| M2 Edge Functions | 3–4j | M1 |
| M3 UI intégration | 3–4j | M2 |
| M4 Facturation | 1–2j | M2 |
| M5 Matching | 2–3j | M1 + données réelles |
| **Total** | **~12j** | |

**Équipe minimale :** 1 dev back (Stripe + Supabase Functions) + 1 dev front (UI CollabTracker + Payments)

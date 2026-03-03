# CUTLAB — Onboarding Monteur

A French-language onboarding flow for **CUTLAB**, a marketplace connecting video editors (*monteurs*) with content creators. Built with **React + Vite**.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | Component model & state |
| [Vite 5](https://vitejs.dev/) | Dev server & build |
| Google Fonts | Syne (headings) + DM Sans (body) |
| Vanilla CSS | Design system via CSS custom properties |

No CSS framework, no router, no external state library — intentionally minimal for a prototype.

---

## Getting Started

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production build → dist/
npm run preview # preview the production build locally
```

---

## Project Structure

```
cutlab-v0/
├── index.html                     # Vite HTML entry point
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                   # React root — wraps app in OnboardingProvider
    ├── App.jsx                    # Step router + progress bar
    │
    ├── styles/
    │   └── global.css             # Full design system (CSS custom properties, all component classes)
    │
    ├── constants/
    │   ├── steps.js               # STEPS array (id + sidebar label)
    │   └── levels.js              # LEVELS array (emoji, name, description)
    │
    ├── context/
    │   └── OnboardingContext.jsx  # currentStep, assignedLevel, goToStep(), publishProfile()
    │
    ├── components/
    │   ├── layout/
    │   │   └── Sidebar.jsx        # Fixed left column — logo, step nav, footer
    │   │
    │   ├── ui/                    # Reusable primitives
    │   │   ├── Button.jsx         # primary | ghost | skip variants
    │   │   ├── Tag.jsx            # Toggleable pill tag (multi or exclusive)
    │   │   ├── NicheTag.jsx       # Compact niche tag with "tout" master toggle support
    │   │   ├── FormGroup.jsx      # label + field wrapper
    │   │   ├── HintBox.jsx        # Accent-bordered info callout
    │   │   ├── SectionDivider.jsx # Uppercase label + trailing rule
    │   │   ├── AvailabilityButton.jsx  # Coloured-dot pill (radio group)
    │   │   ├── UploadZone.jsx     # Dashed drag-and-drop area
    │   │   ├── StepHeader.jsx     # step-tag + h1 + description
    │   │   └── StepNav.jsx        # Back / Skip / Next navigation bar
    │   │
    │   └── steps/                 # One component per onboarding step
    │       ├── Step1Account.jsx
    │       ├── Step2Identity.jsx
    │       ├── Step3Skills.jsx
    │       ├── Step4Portfolio.jsx
    │       ├── Step5Pricing.jsx
    │       ├── Step6Presentation.jsx
    │       ├── Step7Level.jsx     # Animated level calculation + picker
    │       ├── Step8Preview.jsx   # Profile card preview
    │       └── Step9Success.jsx   # Post-publish success screen
```

---

## The 8-Step Onboarding Flow

| # | Step | Description |
|---|------|-------------|
| 1 | Crée ton compte | Email + password signup, Google / Apple SSO |
| 2 | Qui es-tu ? | Name, pseudo, profile photo, spoken languages, availability |
| 3 | Ton métier | Skills, formats, content niches, experience, software |
| 4 | Ton portfolio | Video clip uploads and external links |
| 5 | Tes tarifs | Pricing table by duration, hourly rate, revision count |
| 6 | Ta présentation | Bio, intro video, collaboration prefs, response time |
| 7 | Ton niveau | Animated level calculation + optional manual override |
| 8 | Aperçu profil | Profile card preview before publishing |
| — | Succès | Confirmation screen after publishing |

---

## Design System

All design tokens live in `src/styles/global.css` as CSS custom properties:

```css
--bg:         #0a0a0a   /* page background */
--surface:    #111111   /* card / sidebar */
--surface2:   #1a1a1a   /* elevated surface */
--border:     #252525
--accent:     #d4f000   /* lime green — CTAs, selections, badges */
--text:       #f0f0f0
--text-muted: #666
--text-dim:   #999
--radius:     12px
--radius-sm:  8px
```

Fonts: **Syne** (headings, logo) · **DM Sans** (body)

---

## Component API Reference

### `<Button>`
```jsx
<Button variant="primary" onClick={fn}>Continuer →</Button>
<Button variant="ghost"   onClick={fn}>← Retour</Button>
<Button variant="skip"    onClick={fn}>Passer pour l'instant</Button>
```

### `<Tag>`
```jsx
// Multi-select
<Tag selected={skills.has('video')} onToggle={() => toggle('video')} icon="🎬">
  Montage vidéo
</Tag>

// Exclusive / radio
<Tag selected={experience === '1-3y'} onToggle={() => setExperience('1-3y')}>
  1 – 3 ans
</Tag>
```

### `<NicheTag>`
```jsx
// Master "all" toggle
<NicheTag isTout selected={allNiches} onToggle={toggleAllNiches}>✦ Toutes niches</NicheTag>

// Individual niche
<NicheTag selected={niches.has('Gaming')} onToggle={() => toggleNiche('Gaming')}>Gaming</NicheTag>
```

### `<FormGroup>`
```jsx
<FormGroup label="Email">
  <input type="email" placeholder="ton@email.com" />
</FormGroup>

<FormGroup label="Photo de profil" optional="optionnel — tu peux l'ajouter plus tard">
  <UploadZone ... />
</FormGroup>
```

### `<StepNav>`
```jsx
// First step — no back button
<StepNav onNext={() => goToStep(2)} />

// Middle step with skip
<StepNav onBack={() => goToStep(3)} onNext={() => goToStep(5)} onSkip={() => goToStep(5)} />

// Custom labels
<StepNav onBack={() => goToStep(7)} backLabel="← Modifier"
         onNext={publishProfile} nextLabel="🚀 Publier mon profil" nextStyle={{ padding: '14px 40px' }} />
```

### `<UploadZone>`
```jsx
<UploadZone icon="🎬" title="Glisse tes clips ici" hint="MP4 · Max 500Mo par clip">
  <Button variant="ghost">Parcourir les fichiers</Button>
</UploadZone>
```

### `<HintBox>`
```jsx
<HintBox>💡 <strong>Astuce :</strong> un seul clip suffit pour publier ton profil.</HintBox>
```

### `useOnboarding()` hook
```js
const { currentStep, goToStep, publishProfile, assignedLevel, setAssignedLevel } = useOnboarding()
```

---

## Level System

Defined in `src/constants/levels.js`. Ten tiers from Débutant to Légende:

| Index | Emoji | Name |
|-------|-------|------|
| 0 | 🌱 | Débutant |
| 1 | ⚡ | Rising |
| 2 | 🔥 | Prodige |
| 3 | 💎 | Confirmé |
| 4 | 🚀 | Expert |
| 5 | 🎯 | Specialist |
| 6 | ⭐ | Star |
| 7 | 👑 | Elite |
| 8 | 🏆 | Signature |
| 9 | 🔮 | Légende |

The level is stored in `OnboardingContext` as `assignedLevel` (index). Step 7 runs a mock animation then displays the result; the user can manually override via the picker. The selected level propagates to the profile card in Step 8.

---

## State Management

Global state is minimal — kept in `OnboardingContext`:

| State | Type | Description |
|-------|------|-------------|
| `currentStep` | `number` | Active step (1–9) |
| `assignedLevel` | `number` | Selected level index (0–9) |
| `goToStep(n)` | `fn` | Navigate to step n, scroll to top |
| `publishProfile()` | `fn` | Go to step 9 (success screen) |

Each step component manages its own local form state via `useState`. This keeps the context lean and the step components self-contained.

---

## Adding a New Step

1. Add an entry to `src/constants/steps.js`
2. Create `src/components/steps/StepN.jsx` using the existing components
3. Register it in the `STEP_COMPONENTS` map in `src/App.jsx`

---

## Status

This is a **UI prototype** — no backend, no form validation, no persistence. All interactive state is in-memory and resets on page reload.

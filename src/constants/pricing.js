// Grille tarifaire officielle CutLab (source: Baptiste 2026-04).
// Chaque niveau a 7 tarifs : 3 formats × 2 catégories (montage brut / motion) + miniature (additif).
// Indexé par levelIndex (0..6) selon src/constants/levels.js.

export const PRICING_ROWS = [
  { key: 'montage_court', label: 'Montage brut — Court (<5 min)',  category: 'montage', format: 'court' },
  { key: 'montage_moyen', label: 'Montage brut — Moyen (5-15 min)', category: 'montage', format: 'moyen' },
  { key: 'montage_long',  label: 'Montage brut — Long (15 min+)',  category: 'montage', format: 'long'  },
  { key: 'motion_court',  label: 'Avec motion — Court (<5 min)',   category: 'motion',  format: 'court' },
  { key: 'motion_moyen',  label: 'Avec motion — Moyen (5-15 min)', category: 'motion',  format: 'moyen' },
  { key: 'motion_long',   label: 'Avec motion — Long (15 min+)',   category: 'motion',  format: 'long'  },
  { key: 'thumbnail',     label: 'Miniature (additif)',            category: 'thumbnail', format: null   },
]

// Prices in € by levelIndex (0..6) then by row key.
export const PRICING_GRID = {
  0: { montage_court:  30, montage_moyen:  50, montage_long:  80, motion_court:  50, motion_moyen:  80, motion_long:  120, thumbnail: 30 }, // Débutant
  1: { montage_court:  50, montage_moyen:  80, montage_long: 130, motion_court:  80, motion_moyen: 130, motion_long:  200, thumbnail: 30 }, // Prospect
  2: { montage_court:  80, montage_moyen: 130, montage_long: 200, motion_court: 130, motion_moyen: 200, motion_long:  300, thumbnail: 30 }, // Confirmé
  3: { montage_court: 120, montage_moyen: 200, montage_long: 300, motion_court: 200, motion_moyen: 300, motion_long:  450, thumbnail: 30 }, // Expert
  4: { montage_court: 180, montage_moyen: 300, montage_long: 450, motion_court: 300, motion_moyen: 450, motion_long:  650, thumbnail: 30 }, // Star
  5: { montage_court: 250, montage_moyen: 400, montage_long: 600, motion_court: 400, motion_moyen: 600, motion_long:  900, thumbnail: 30 }, // Elite
  6: { montage_court: 350, montage_moyen: 550, montage_long: 800, motion_court: 550, motion_moyen: 800, motion_long: 1200, thumbnail: 30 }, // Légende
}

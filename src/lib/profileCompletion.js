/**
 * profileCompletion — calcule le pourcentage de complétion du profil
 * et génère les suggestions d'amélioration.
 *
 * Partagé entre Step8Preview et ProfileEditor.
 */

const COMPLETION_FIELDS = [
  { key: 'firstName',       weight: 1,   suggestion: 'Ajoute ton prénom (Step 2)' },
  { key: 'lastName',        weight: 1,   suggestion: 'Ajoute ton nom (Step 2)' },
  { key: 'username',        weight: 0.5, suggestion: 'Choisis un pseudo visible (Step 2)' },
  { key: 'avatarUrl',       weight: 1.5, suggestion: 'Uploade une photo de profil pour +15% de clics' },
  { key: 'bio',             weight: 1.5, suggestion: 'Rédige une bio courte pour te présenter (Step 6)' },
  { key: 'skills',          weight: 1,   suggestion: 'Sélectionne tes compétences (Step 3)' },
  { key: 'formats',         weight: 0.5, suggestion: 'Ajoute tes formats de prédilection (Step 3)' },
  { key: 'niches',          weight: 0.5, suggestion: 'Indique tes niches de contenu (Step 3)' },
  { key: 'experience',      weight: 1,   suggestion: "Précise ton niveau d'expérience (Step 3)" },
  { key: 'hourlyRate',      weight: 1,   suggestion: 'Ajoute un tarif horaire pour apparaître dans les recherches filtrées (Step 5)' },
  { key: 'portfolioLinks',  weight: 1.5, suggestion: 'Ajoute au moins un lien portfolio ou clip (Step 4)' },
  { key: 'socialLinks',     weight: 0.5, suggestion: 'Ajoute un lien vers tes réseaux pour rassurer les clients (Step 6)' },
]

/**
 * Calcule la complétion d'un profil.
 * @param {object} formData
 * @returns {{ pct: number, missing: string[] }}
 */
export function computeCompletion(formData) {
  let earned = 0
  let total = 0
  const missing = []

  for (const field of COMPLETION_FIELDS) {
    total += field.weight
    const val = formData[field.key]
    const filled = Array.isArray(val)
      ? val.filter(Boolean).length > 0
      : Boolean(val && String(val).trim())
    if (filled) {
      earned += field.weight
    } else {
      missing.push(field.suggestion)
    }
  }

  const pct = total > 0 ? Math.round((earned / total) * 100) : 0
  return { pct, missing }
}

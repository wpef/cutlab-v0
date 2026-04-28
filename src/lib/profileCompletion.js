/**
 * profileCompletion — calcule le pourcentage de complétion du profil
 * et génère les suggestions d'amélioration.
 *
 * Partagé entre Step7Preview et ProfileEditor.
 */

const COMPLETION_FIELDS = [
  { key: 'firstName',       weight: 1,   suggestion: 'Ajoute ton prénom' },
  { key: 'lastName',        weight: 1,   suggestion: 'Ajoute ton nom' },
  { key: 'avatarUrl',       weight: 1.5, suggestion: 'Uploade une photo de profil pour +15% de clics' },
  { key: 'bio',             weight: 1.5, suggestion: 'Rédige une bio courte pour te présenter' },
  { key: 'skills',          weight: 1,   suggestion: 'Sélectionne tes compétences' },
  { key: 'formats',         weight: 0.5, suggestion: 'Ajoute tes formats de prédilection' },
  { key: 'niches',          weight: 0.5, suggestion: 'Indique tes niches de contenu' },
  { key: 'experience',      weight: 1,   suggestion: "Précise ton niveau d'expérience" },
  { key: 'pricing',         weight: 1,   suggestion: 'Configure tes tarifs depuis ton profil pour apparaître dans les recherches filtrées' },
  { key: 'portfolioLinks',  weight: 1.5, suggestion: 'Ajoute au moins un lien portfolio ou clip' },
  { key: 'socialLinks',     weight: 0.5, suggestion: 'Ajoute un lien vers tes réseaux pour rassurer les clients' },
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
    let filled
    if (field.key === 'pricing') {
      // Pricing is "filled" when there's either a baselineLevel locked or any custom price set
      filled = !!(val && typeof val === 'object' && (
        val.baselineLevel != null ||
        (val.prices && Object.values(val.prices).some((v) => typeof v === 'number' && v > 0))
      ))
    } else if (Array.isArray(val)) {
      filled = val.filter(Boolean).length > 0
    } else if (val && typeof val === 'object') {
      // For objects (e.g. socialLinks jsonb): filled if at least one non-empty value
      filled = Object.values(val).some((v) => v && String(v).trim())
    } else {
      filled = Boolean(val && String(val).trim())
    }
    if (filled) {
      earned += field.weight
    } else {
      missing.push(field.suggestion)
    }
  }

  const pct = total > 0 ? Math.round((earned / total) * 100) : 0
  return { pct, missing }
}

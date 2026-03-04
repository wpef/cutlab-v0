import { computeCompletion } from './profileCompletion'

/**
 * computeLevel — calcule le niveau rapide basé sur le profil utilisateur.
 *
 * Retourne l'un des 3 niveaux automatiques :
 *   0 = Débutant
 *   3 = Confirmé (Pro)
 *   4 = Expert
 *
 * Barème (total sur 100 points) :
 *   Expérience              : 0–30 pts
 *   Nombre de skills        : 0–20 pts
 *   Tarif horaire           : 0–20 pts
 *   Volume portfolio (liens): 0–15 pts
 *   Score de complétion     : 0–15 pts
 *
 * Seuils :
 *   < 35 pts  → Débutant  (index 0)
 *   35–64 pts → Pro       (index 3 "Confirmé")
 *   >= 65 pts → Expert    (index 4 "Expert")
 */

export const SCORE_RUBRIC = [
  { label: 'Expérience déclarée', max: 30 },
  { label: 'Compétences sélectionnées', max: 20 },
  { label: 'Tarif horaire', max: 20 },
  { label: 'Volume portfolio (liens)', max: 15 },
  { label: 'Complétion du profil', max: 15 },
]

/** Returns a human-readable explanation for the user's current score on each criterion */
export function getScoreExplanation(formData) {
  const expLabels = { '<6m': '< 6 mois', '6m1y': '6 mois – 1 an', '1-3y': '1–3 ans', '3-5y': '3–5 ans', '5y+': '5 ans+' }
  const skillCount = (formData.skills ?? []).length
  const rate = parseFloat(formData.hourlyRate)
  const linkCount = (formData.portfolioLinks ?? []).filter((l) => l && l.trim()).length

  return [
    expLabels[formData.experience] ?? 'Non renseigné',
    `${skillCount} compétence${skillCount > 1 ? 's' : ''}`,
    !rate || isNaN(rate) || rate <= 0 ? 'Non renseigné' : `${formData.hourlyRate}€/h`,
    `${linkCount} lien${linkCount > 1 ? 's' : ''}`,
    'Champs renseignés',
  ]
}

/** Calcule le score d'expérience (0–30) */
function scoreExperience(experience) {
  const map = { '<6m': 5, '6m1y': 12, '1-3y': 20, '3-5y': 26, '5y+': 30 }
  return map[experience] ?? 0
}

/** Calcule le score de compétences (0–20) */
function scoreSkills(skills) {
  const n = (skills ?? []).length
  if (n >= 4) return 20
  if (n === 3) return 15
  if (n === 2) return 10
  if (n === 1) return 5
  return 0
}

/** Calcule le score de tarif (0–20) */
function scoreTarif(hourlyRate) {
  const rate = parseFloat(hourlyRate)
  if (!rate || isNaN(rate) || rate <= 0) return 0
  if (rate > 60) return 20
  if (rate >= 30) return 14
  return 8
}

/** Calcule le score portfolio (0–15) */
function scorePortfolio(portfolioLinks) {
  const count = (portfolioLinks ?? []).filter((l) => l && l.trim()).length
  if (count >= 3) return 15
  if (count === 2) return 11
  if (count === 1) return 6
  return 0
}

/** Calcule un score de complétion normalisé sur 15 */
export function computeCompletionScore(formData) {
  const { pct } = computeCompletion(formData)
  return Math.round((pct / 100) * 15)
}

/** Retourne le score total (0–100) et les détails par critère */
export function computeScoreDetails(formData) {
  const expScore  = scoreExperience(formData.experience)
  const skillScore = scoreSkills(formData.skills)
  const tarifScore = scoreTarif(formData.hourlyRate)
  const portfolioScore = scorePortfolio(formData.portfolioLinks)
  const completionScore = computeCompletionScore(formData)

  const total = expScore + skillScore + tarifScore + portfolioScore + completionScore

  return {
    total,
    details: [expScore, skillScore, tarifScore, portfolioScore, completionScore],
  }
}

/**
 * Retourne l'index LEVELS correspondant au niveau automatique calculé.
 * Uniquement 3 résultats possibles : 0 (Débutant), 3 (Confirmé/Pro), 4 (Expert)
 */
export function computeAutoLevel(formData) {
  const { total } = computeScoreDetails(formData)
  if (total >= 65) return 4 // Expert
  if (total >= 35) return 3 // Confirmé (Pro)
  return 0                   // Débutant
}

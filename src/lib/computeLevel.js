import { getLevelByScore } from '../constants/levels'

/**
 * 7-parameter scoring engine for editor profiles.
 *
 * Total: 100 points (96 max in v1 — portfolio capped at 26, reviews at 0)
 *
 * Parameters & weights:
 *   Portfolio           : 0–26 pts (30 max in future with quality tagging)
 *   Avis clients        : 0–20 pts (0 until review system built)
 *   Expérience déclarée : 0–15 pts
 *   Compétences + logiciels : 0–10 pts
 *   Références externes : 0–10 pts
 *   Complétion du profil: 0–8 pts
 *   Réactivité déclarée : 0–7 pts
 */

export const SCORE_PARAMS = [
  { key: 'portfolio',   label: 'Portfolio',              maxPoints: 26 },
  { key: 'reviews',     label: 'Avis clients',           maxPoints: 20 },
  { key: 'experience',  label: 'Expérience déclarée',    maxPoints: 15 },
  { key: 'skills',      label: 'Compétences & logiciels', maxPoints: 10 },
  { key: 'references',  label: 'Références externes',    maxPoints: 10 },
  { key: 'completion',  label: 'Complétion du profil',   maxPoints: 8 },
  { key: 'reactivity',  label: 'Réactivité déclarée',    maxPoints: 7 },
]

// --- Individual scoring functions ---

function scorePortfolio(formData) {
  const count = (formData.portfolioLinks ?? []).filter((l) => l && l.trim()).length
  if (count >= 8) return 26
  if (count >= 6) return 22
  if (count >= 4) return 18
  if (count >= 2) return 10
  return 0
}

function scoreReviews(reviewData) {
  const { count, avgRating } = reviewData
  if (count <= 0) return 0
  // Best qualifying bracket (fall-through)
  if (count > 20 && avgRating >= 4.9) return 20
  if (count >= 10 && avgRating >= 4.8) return 17
  if (count >= 5 && avgRating >= 4.5) return 14
  if (count >= 3 && avgRating >= 4.5) return 9
  if (count >= 1 && avgRating >= 4.5) return 5
  if (count >= 1) return 3 // 1+ reviews, rating below 4.5
  return 0
}

function scoreExperience(formData) {
  const map = {
    '<6m': 2, '6m1y': 5, '1-3y': 8,
    '3-5y': 11, '5-7y': 13, '7y+': 15,
  }
  return map[formData.experience] ?? 0
}

function scoreSkills(formData) {
  const skillCount = (formData.skills ?? []).length
  const softwareCount = (formData.software ?? []).length
  const total = skillCount + softwareCount
  if (total >= 10) return 10
  if (total >= 8) return 8
  if (total >= 6) return 6
  if (total >= 4) return 4
  return 0
}

function scoreReferences(formData) {
  const raw = formData.creditedChannels ?? ''
  const refs = raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  const count = refs.length
  if (count >= 11) return 10
  if (count >= 6) return 9
  if (count >= 4) return 7
  if (count >= 2) return 5
  if (count === 1) return 3
  return 0
}

function scoreCompletion(formData) {
  let pts = 0
  if (formData.bio && formData.bio.trim()) pts++
  if (formData.avatarUrl && formData.avatarUrl.trim()) pts++
  if (formData.availability && formData.availability.trim()) pts++
  if (formData.hourlyRate && parseFloat(formData.hourlyRate) > 0) pts++
  if (formData.responseTime && formData.responseTime.trim()) pts++
  const sl = formData.socialLinks
  if (sl && (typeof sl === 'object'
    ? Object.values(sl).some((v) => v && String(v).trim())
    : String(sl).trim())) pts++
  // Bonus: all 6 elements filled
  if (pts === 6) pts = 8
  return pts
}

function scoreReactivity(formData) {
  const map = {
    '<4h': 7, '<12h': 5, '<24h': 3,
    '<48h': 2, '<1w': 1,
  }
  return map[formData.responseTime] ?? 0
}

// --- Main scoring function ---

/**
 * Compute the full score breakdown for an editor profile.
 *
 * @param {object} formData - Profile data from OnboardingContext
 * @param {{ count: number, avgRating: number }} reviewData - Client reviews (defaults to 0)
 * @returns {{ total: number, details: object, levelIndex: number }}
 */
export function computeScoreDetails(formData, reviewData = { count: 0, avgRating: 0 }) {
  const details = {
    portfolio:  scorePortfolio(formData),
    reviews:    scoreReviews(reviewData),
    experience: scoreExperience(formData),
    skills:     scoreSkills(formData),
    references: scoreReferences(formData),
    completion: scoreCompletion(formData),
    reactivity: scoreReactivity(formData),
  }

  const total = Object.values(details).reduce((sum, v) => sum + v, 0)
  const levelIndex = getLevelByScore(total)

  return { total, details, levelIndex }
}

/**
 * Quick helper: returns the LEVELS index for a given formData.
 */
export function computeAutoLevel(formData, reviewData) {
  return computeScoreDetails(formData, reviewData).levelIndex
}

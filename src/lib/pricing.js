import { PRICING_GRID, PRICING_ROWS, ADJUSTMENT_OPTIONS } from '../constants/pricing'

/**
 * Apply a percentage adjustment to a baseline price.
 * @param {number} baseline - Baseline price in €.
 * @param {number} pct - Adjustment percentage (must be in ADJUSTMENT_OPTIONS).
 * @returns {number} Rounded to nearest euro.
 */
export function applyAdjustment(baseline, pct) {
  const safe = ADJUSTMENT_OPTIONS.includes(pct) ? pct : 0
  return Math.round(baseline * (1 + safe / 100))
}

/**
 * Compute the user's actual prices for a given level + adjustments object.
 * @param {number} levelIndex - 0..6 (fallback to 0 if out of range)
 * @param {object} adjustments - { [rowKey]: -10 | 0 | 10 }
 * @returns {object} { [rowKey]: finalPrice }
 */
export function computePricing(levelIndex, adjustments = {}) {
  const idx = (typeof levelIndex === 'number' && levelIndex >= 0 && levelIndex <= 6) ? levelIndex : 0
  const baseline = PRICING_GRID[idx]
  const result = {}
  for (const row of PRICING_ROWS) {
    const adj = adjustments[row.key] ?? 0
    result[row.key] = applyAdjustment(baseline[row.key], adj)
  }
  return result
}

/**
 * Compute the min and max prices from a user's pricing (used for catalog range display).
 * Excludes thumbnail (additif).
 * @param {number} levelIndex
 * @param {object} adjustments
 * @returns {{ min: number, max: number }}
 */
export function computePricingRange(levelIndex, adjustments = {}) {
  const prices = computePricing(levelIndex, adjustments)
  const values = PRICING_ROWS
    .filter((r) => r.key !== 'thumbnail')
    .map((r) => prices[r.key])
  return { min: Math.min(...values), max: Math.max(...values) }
}

/**
 * Default empty pricing object (0 adjustments across the board).
 */
export function emptyPricingAdjustments() {
  return Object.fromEntries(PRICING_ROWS.map((r) => [r.key, 0]))
}

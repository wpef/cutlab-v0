import { PRICING_GRID, PRICING_ROWS } from '../constants/pricing'

/**
 * Get the baseline prices object for a given level (raw grid lookup).
 * @param {number} levelIndex - 0..6 (clamped to valid range)
 * @returns {object} { [rowKey]: baselinePrice }
 */
export function baselinePrices(levelIndex) {
  const idx = (typeof levelIndex === 'number' && levelIndex >= 0 && levelIndex <= 6) ? levelIndex : 0
  return { ...PRICING_GRID[idx] }
}

/**
 * Compute the user's effective prices for a given level + custom overrides.
 * Custom prices (when defined and numeric) override the baseline; otherwise the
 * baseline applies for that row.
 *
 * @param {number} levelIndex - 0..6
 * @param {object} customPrices - { [rowKey]: number } — sparse overrides, may be empty
 * @returns {object} { [rowKey]: finalPrice }
 */
export function computePricing(levelIndex, customPrices = {}) {
  const base = baselinePrices(levelIndex)
  const result = {}
  for (const row of PRICING_ROWS) {
    const override = customPrices?.[row.key]
    const useOverride = typeof override === 'number' && Number.isFinite(override) && override >= 0
    result[row.key] = useOverride ? Math.round(override) : base[row.key]
  }
  return result
}

/**
 * Min/max prices excluding the thumbnail additive — used for catalog range display.
 * @param {number} levelIndex
 * @param {object} customPrices
 * @returns {{ min: number, max: number }}
 */
export function computePricingRange(levelIndex, customPrices = {}) {
  const prices = computePricing(levelIndex, customPrices)
  const values = PRICING_ROWS
    .filter((r) => r.key !== 'thumbnail')
    .map((r) => prices[r.key])
  return { min: Math.min(...values), max: Math.max(...values) }
}

/**
 * Default empty custom-prices object.
 */
export function emptyPrices() {
  return {}
}

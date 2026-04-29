import { PRICING_ROWS } from '../../constants/pricing'
import { LEVELS } from '../../constants/levels'
import { baselinePrices } from '../../lib/pricing'

/**
 * Pricing editor sub-component — used in ProfileEditor (section-pricing) and Step6Level.
 * Free-input model: each row has a numeric input. Empty input = use baseline.
 * Custom prices are stored as absolute values; the baseline is shown alongside
 * for reference (with a delta in € and %).
 *
 * Props:
 *   assignedLevel — null | number (0-6)
 *   pricing       — { baselineLevel, prices }
 *   onUpdate      — (newPricing) => void
 */
export default function PricingEditor({ assignedLevel, pricing, onUpdate }) {
  const customPrices = pricing?.prices ?? {}

  // Level not set — show info block
  if (assignedLevel == null) {
    return (
      <div className="pricing-editor">
        <div className="pricing-locked-hint">
          Ton niveau n'est pas encore défini — complète ton profil pour débloquer la grille de tarifs.
        </div>
      </div>
    )
  }

  const level = LEVELS[assignedLevel]
  const baseline = baselinePrices(assignedLevel)

  function handleChange(key, raw) {
    const next = { ...customPrices }
    if (raw === '' || raw == null) {
      delete next[key]
    } else {
      const num = Number(raw)
      if (!Number.isFinite(num) || num < 0) return
      next[key] = Math.round(num)
    }
    onUpdate({ baselineLevel: assignedLevel, prices: next })
  }

  return (
    <div className="pricing-editor">
      <div className="pricing-subtitle">
        Baseline — {level.emoji} {level.name}. Saisis le prix de ton choix ; la baseline reste affichée pour repère.
      </div>
      <div className="pricing-rows-list">
        {PRICING_ROWS.map((row) => {
          const base = baseline[row.key]
          const custom = customPrices[row.key]
          const hasCustom = typeof custom === 'number' && Number.isFinite(custom) && custom >= 0
          const final = hasCustom ? custom : base
          const delta = final - base
          const deltaPct = base > 0 ? Math.round((delta / base) * 100) : 0
          return (
            <div key={row.key} className="pricing-row">
              <div className="pricing-row__label">{row.label}</div>
              <div className="pricing-row__controls">
                <div className="pricing-input-group">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={5}
                    className="pricing-input"
                    value={hasCustom ? custom : ''}
                    placeholder={String(base)}
                    onChange={(e) => handleChange(row.key, e.target.value)}
                    aria-label={`${row.label} (€)`}
                  />
                  <span className="pricing-input-suffix">€</span>
                </div>
                <div className="pricing-baseline-block">
                  {hasCustom ? (
                    <span className={`pricing-delta pricing-delta--${delta > 0 ? 'up' : delta < 0 ? 'down' : 'equal'}`}>
                      {delta > 0 ? '+' : ''}{deltaPct}%
                    </span>
                  ) : (
                    <span className="pricing-delta pricing-delta--equal">baseline</span>
                  )}
                  <span className="pricing-baseline-label">Réf. {base} €</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="pricing-grid-note">La baseline se met à jour si ton niveau évolue. Laisser vide = utiliser la baseline.</div>
    </div>
  )
}

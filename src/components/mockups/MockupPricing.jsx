import { useState } from 'react'

const ROWS = [
  { key: 'montage_court', label: 'Montage court', sub: '< 5 min', base: 120 },
  { key: 'montage_moyen', label: 'Montage moyen', sub: '5–15 min', base: 200 },
  { key: 'montage_long',  label: 'Montage long',  sub: '15 min+',  base: 300 },
  { key: 'motion_court',  label: 'Motion court',  sub: '< 5 min',  base: 200 },
  { key: 'motion_moyen',  label: 'Motion moyen',  sub: '5–15 min', base: 300 },
  { key: 'motion_long',   label: 'Motion long',   sub: '15 min+',  base: 450 },
  { key: 'thumbnail',     label: 'Miniature',     sub: 'additif',  base: 30  },
]

const ADJUSTMENTS = [-10, 0, 10]

function computePrice(base, adj) {
  return Math.round(base * (1 + adj / 100))
}

export default function MockupPricing() {
  const [adjustments, setAdjustments] = useState({
    montage_court: 0,
    montage_moyen: 10,
    montage_long:  0,
    motion_court:  0,
    motion_moyen:  0,
    motion_long:   0,
    thumbnail:     0,
  })

  function setAdj(key, val) {
    setAdjustments(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="mockup-stage">
      <div className="mockup-pricing">
        <div className="mockup-pricing-header">
          <div className="mockup-pricing-header-label mockup-pricing-col-service">Service</div>
          <div className="mockup-pricing-header-label mockup-pricing-col-toggle">Ajustement</div>
          <div className="mockup-pricing-header-label mockup-pricing-col-price">Prix</div>
        </div>
        {ROWS.map(row => {
          const adj = adjustments[row.key]
          const price = computePrice(row.base, adj)
          return (
            <div key={row.key} className="mockup-pricing-row">
              <div className="mockup-pricing-col-service">
                <div className="mockup-pricing-service-name">{row.label}</div>
                <div className="mockup-pricing-service-sub">{row.sub}</div>
              </div>
              <div className="mockup-pricing-col-toggle">
                <div className="mockup-pricing-toggle">
                  {ADJUSTMENTS.map(a => (
                    <button
                      key={a}
                      className={`mockup-pricing-toggle-btn${adj === a ? ' mockup-pricing-toggle-btn--active' : ''}`}
                      onClick={() => setAdj(row.key, a)}
                    >
                      {a === 0 ? 'Base' : `${a > 0 ? '+' : ''}${a}%`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mockup-pricing-col-price">
                <span className={`mockup-pricing-price${adj !== 0 ? ' mockup-pricing-price--adjusted' : ''}`}>
                  {price} €
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

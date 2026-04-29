import { useState } from 'react'

// Mockup illustrant le vrai système : input libre par ligne, baseline indicative.
const ROWS = [
  { key: 'montage_court', label: 'Montage court', sub: '< 5 min',  base: 120 },
  { key: 'montage_moyen', label: 'Montage moyen', sub: '5–15 min', base: 200 },
  { key: 'montage_long',  label: 'Montage long',  sub: '15 min+',  base: 300 },
  { key: 'motion_court',  label: 'Motion court',  sub: '< 5 min',  base: 200 },
  { key: 'motion_moyen',  label: 'Motion moyen',  sub: '5–15 min', base: 300 },
  { key: 'motion_long',   label: 'Motion long',   sub: '15 min+',  base: 450 },
  { key: 'thumbnail',     label: 'Miniature',     sub: 'additif',  base: 30  },
]

export default function MockupPricing() {
  // Quelques prix custom pré-remplis pour illustrer (le reste = baseline)
  const [prices, setPrices] = useState({
    montage_moyen: '220',
    motion_long: '500',
  })

  function setPrice(key, val) {
    setPrices(prev => ({ ...prev, [key]: val.replace(/[^0-9]/g, '') }))
  }

  return (
    <div className="mockup-stage">
      <div className="mockup-pricing">
        <div className="mockup-pricing-header">
          <div className="mockup-pricing-header-label mockup-pricing-col-service">Service</div>
          <div className="mockup-pricing-header-label mockup-pricing-col-toggle">Votre prix</div>
          <div className="mockup-pricing-header-label mockup-pricing-col-price">Réf.</div>
        </div>
        {ROWS.map(row => {
          const custom = prices[row.key]
          const isCustom = custom !== undefined && custom !== ''
          return (
            <div key={row.key} className="mockup-pricing-row">
              <div className="mockup-pricing-col-service">
                <div className="mockup-pricing-service-name">{row.label}</div>
                <div className="mockup-pricing-service-sub">{row.sub}</div>
              </div>
              <div className="mockup-pricing-col-toggle">
                <div className="mockup-pricing-input-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    className={`mockup-pricing-input${isCustom ? ' mockup-pricing-input--custom' : ''}`}
                    placeholder={`${row.base}`}
                    value={custom ?? ''}
                    onChange={(e) => setPrice(row.key, e.target.value)}
                  />
                  <span className="mockup-pricing-input-suffix">€</span>
                </div>
              </div>
              <div className="mockup-pricing-col-price">
                <span className="mockup-pricing-baseline">{row.base} €</span>
              </div>
            </div>
          )
        })}
        <div className="mockup-pricing-note">
          Laisser vide = utiliser la référence. Vous saisissez le prix de votre choix, sans contrainte.
        </div>
      </div>
    </div>
  )
}

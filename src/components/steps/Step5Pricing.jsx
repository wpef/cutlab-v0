import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import Tag from '../ui/Tag'
import SectionDivider from '../ui/SectionDivider'
import StepNav from '../ui/StepNav'

const REVISION_OPTIONS = ['1', '2', '3', '4', '5']
const CAPACITY_OPTIONS = [
  { key: '1',   label: '1 projet à la fois' },
  { key: '2-3', label: '2–3 projets' },
  { key: '4+',  label: '4 projets et plus' },
]

export default function Step5Pricing() {
  const { goToStep, formData, updateFormData } = useOnboarding()

  const [revisions,    setRevisions]    = useState(formData.revisions)
  const [capacity,     setCapacity]     = useState(formData.capacity)
  const [hourlyRate,   setHourlyRate]   = useState(formData.hourlyRate)
  const [deliveryTime, setDeliveryTime] = useState(formData.deliveryTime)

  function save() {
    updateFormData({ revisions, capacity, hourlyRate, deliveryTime })
  }

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 5 sur 8"
        title="Tes tarifs"
        desc="Donne une fourchette indicative. Tu pourras ajuster pour chaque projet."
      />

      <table className="tarif-table">
        <thead>
          <tr>
            <th />
            <th>Court (&lt; 5 min)</th>
            <th>Moyen (5–15 min)</th>
            <th>Long (15 min+)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tarif-label">Montage brut</td>
            <td><input type="number" placeholder="€" /></td>
            <td><input type="number" placeholder="€" /></td>
            <td><input type="number" placeholder="€" /></td>
          </tr>
          <tr>
            <td className="tarif-label">Avec motion</td>
            <td><input type="number" placeholder="€" /></td>
            <td><input type="number" placeholder="€" /></td>
            <td><input type="number" placeholder="€" /></td>
          </tr>
          <tr>
            <td className="tarif-label">Miniature incluse</td>
            <td><input type="number" placeholder="+€" /></td>
            <td><input type="number" placeholder="+€" /></td>
            <td><input type="number" placeholder="+€" /></td>
          </tr>
        </tbody>
      </table>

      <SectionDivider>Ou tarif horaire</SectionDivider>
      <div className="form-row">
        <FormGroup label="Tarif à l'heure">
          <input type="number" placeholder="€ / heure" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
        </FormGroup>
        <FormGroup label="Délai de livraison habituel">
          <input type="text" placeholder="ex: 48–72h après réception des rushs" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
        </FormGroup>
      </div>

      <FormGroup label="Nombre de retours inclus par défaut">
        <div className="tag-group">
          {REVISION_OPTIONS.map((n) => (
            <Tag key={n} selected={revisions === n} onToggle={() => setRevisions(n)}>
              {n}
            </Tag>
          ))}
        </div>
      </FormGroup>

      <FormGroup label="Capacité de charge simultanée">
        <div className="tag-group">
          {CAPACITY_OPTIONS.map((opt) => (
            <Tag key={opt.key} selected={capacity === opt.key} onToggle={() => setCapacity(opt.key)}>
              {opt.label}
            </Tag>
          ))}
        </div>
      </FormGroup>

      <HintBox>
        📊 Ton indicateur <strong>$$$</strong> sera calculé automatiquement et affiché sur ta carte profil.
      </HintBox>

      <StepNav
        onBack={() => { save(); goToStep(4) }}
        onNext={() => { save(); goToStep(6) }}
        onSkip={() => { save(); goToStep(6) }}
      />
    </div>
  )
}

import { useOnboarding } from '../../context/OnboardingContext'
import { REVISION_OPTIONS, CAPACITY_OPTIONS } from '../../constants/options'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import Tag from '../ui/Tag'
import SectionDivider from '../ui/SectionDivider'
import StepNav from '../ui/StepNav'

export default function Step5Pricing() {
  const { goToStep, formData, updateFormData } = useOnboarding()

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
          <input
            type="number"
            placeholder="€ / heure"
            value={formData.hourlyRate}
            onChange={(e) => updateFormData({ hourlyRate: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="Délai de livraison habituel">
          <input
            type="text"
            placeholder="ex: 48–72h après réception des rushs"
            value={formData.deliveryTime}
            onChange={(e) => updateFormData({ deliveryTime: e.target.value })}
          />
        </FormGroup>
      </div>

      <FormGroup label="Nombre de retours inclus par défaut">
        <div className="tag-group">
          {REVISION_OPTIONS.map((n) => (
            <Tag key={n} selected={formData.revisions === n} onToggle={() => updateFormData({ revisions: n })}>
              {n}
            </Tag>
          ))}
        </div>
      </FormGroup>

      <FormGroup label="Capacité de charge simultanée">
        <div className="tag-group">
          {CAPACITY_OPTIONS.map((opt) => (
            <Tag key={opt.key} selected={formData.capacity === opt.key} onToggle={() => updateFormData({ capacity: opt.key })}>
              {opt.label}
            </Tag>
          ))}
        </div>
      </FormGroup>

      <HintBox>
        📊 Ton indicateur <strong>$$$</strong> sera calculé automatiquement et affiché sur ta carte profil.
      </HintBox>

      <StepNav
        onBack={() => goToStep(4)}
        onNext={() => goToStep(6)}
        onSkip={() => goToStep(6)}
      />
    </div>
  )
}

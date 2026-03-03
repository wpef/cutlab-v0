import { useOnboarding } from '../../context/OnboardingContext'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import StepNav from '../ui/StepNav'

export default function Step1Account() {
  const { goToStep } = useOnboarding()

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 1 sur 8"
        title="Crée ton compte"
        desc="30 secondes et c'est parti. Pas besoin de CB, pas d'engagement."
      />

      <FormGroup label="Email">
        <input type="email" placeholder="ton@email.com" />
      </FormGroup>

      <FormGroup label="Mot de passe">
        <input type="password" placeholder="8 caractères minimum" />
      </FormGroup>

      <HintBox>🔒 Tes données sont sécurisées et ne seront jamais revendues.</HintBox>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          Ou continue avec
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            className="btn btn-ghost"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            G Google
          </button>
          <button
            className="btn btn-ghost"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            🍎 Apple
          </button>
        </div>
      </div>

      <StepNav onNext={() => goToStep(2)} />
    </div>
  )
}

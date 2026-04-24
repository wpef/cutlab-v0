// TODO(commit-7): replace with new pricing UI (baseline level + adjustments)
import { useOnboarding } from '../../context/OnboardingContext'
import StepNav from '../ui/StepNav'

export default function Step5Pricing() {
  const { goToStep } = useOnboarding()

  return (
    <div className="step-screen">
      <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        À venir
      </div>
      <StepNav
        onBack={() => goToStep(4)}
        onNext={() => goToStep(6)}
        onSkip={() => goToStep(6)}
      />
    </div>
  )
}

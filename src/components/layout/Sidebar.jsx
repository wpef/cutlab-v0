import { STEPS } from '../../constants/steps'
import { useOnboarding } from '../../context/OnboardingContext'

/**
 * Sidebar — fixed left column with the logo, step navigation and a footer note.
 * Steps up to maxStepReached are clickable (done or current).
 */
export default function Sidebar() {
  const { currentStep, goToStep, maxStepReached } = useOnboarding()

  return (
    <aside className="sidebar">
      <div className="logo">
        CUT<span>LAB</span>
      </div>

      <nav className="steps-nav">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep
          const isDone = step.id < currentStep
          const isReachable = step.id <= maxStepReached && !isActive

          return (
            <div
              key={step.id}
              className={`step-item${isActive ? ' active' : ''}${isDone ? ' done' : ''}${isReachable && !isDone ? ' reachable' : ''}`}
              title={isReachable ? `Aller à l'étape ${step.id}` : undefined}
              onClick={() => isReachable && goToStep(step.id)}
              style={{ cursor: isReachable ? 'pointer' : undefined }}
            >
              <div className="step-num">
                <span>{step.id}</span>
              </div>
              <div className="step-label">{step.label}</div>
            </div>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        Tu peux sauvegarder et revenir plus tard à tout moment.
      </div>
    </aside>
  )
}

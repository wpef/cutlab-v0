import { STEPS } from '../../constants/steps'
import { useOnboarding } from '../../context/OnboardingContext'

/**
 * Sidebar — fixed left column with the logo, step navigation and a footer note.
 * Steps with id < currentStep are marked "done"; the current step is "active".
 */
export default function Sidebar() {
  const { currentStep, goToStep } = useOnboarding()

  return (
    <aside className="sidebar">
      <div className="logo">
        CUT<span>LAB</span>
      </div>

      <nav className="steps-nav">
        {STEPS.map((step) => {
          const isDone = step.id < currentStep
          const isActive = step.id === currentStep

          return (
            <div
              key={step.id}
              className={`step-item${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
              onClick={() => isDone ?? goToStep(step.id)}
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

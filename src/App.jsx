import { useOnboarding } from './context/OnboardingContext'
import { STEPS } from './constants/steps'
import Sidebar from './components/layout/Sidebar'
import Step1Account from './components/steps/Step1Account'
import Step2Identity from './components/steps/Step2Identity'
import Step3Skills from './components/steps/Step3Skills'
import Step4Portfolio from './components/steps/Step4Portfolio'
import Step5Pricing from './components/steps/Step5Pricing'
import Step6Presentation from './components/steps/Step6Presentation'
import Step7Level from './components/steps/Step7Level'
import Step8Preview from './components/steps/Step8Preview'
import Step9Success from './components/steps/Step9Success'
import ProfileEditor from './components/editor/ProfileEditor'

const STEP_COMPONENTS = {
  1: Step1Account,
  2: Step2Identity,
  3: Step3Skills,
  4: Step4Portfolio,
  5: Step5Pricing,
  6: Step6Presentation,
  7: Step7Level,
  8: Step8Preview,
  9: Step9Success,
}

export default function App() {
  const { currentStep, currentView } = useOnboarding()

  if (currentView === 'editor') return <ProfileEditor />

  const progress = currentStep === 9 ? 100 : Math.round((currentStep / 8) * 100)
  const StepComponent = STEP_COMPONENTS[currentStep]
  const stepInfo = STEPS.find((s) => s.id === currentStep)

  return (
    <>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      {/* Mobile-only top navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-logo">CUT<span>LAB</span></div>
        <div className="mobile-step-pill">
          {currentStep === 9 ? '✓ Publié' : `${currentStep} / 8 — ${stepInfo?.label ?? ''}`}
        </div>
      </nav>
      <div className="app">
        <Sidebar />
        <main className="main">
          {/* key forces remount on step change, replaying the fadeIn animation */}
          <StepComponent key={currentStep} />
        </main>
      </div>
    </>
  )
}

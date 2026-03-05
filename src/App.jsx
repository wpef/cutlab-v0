import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useOnboarding } from './context/OnboardingContext'
import { STEPS } from './constants/steps'
import Sidebar from './components/layout/Sidebar'
import AppLayout from './components/layout/AppLayout'
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
import Landing from './components/pages/Landing'
import Catalog from './components/pages/Catalog'
import CreatorSignup from './components/pages/CreatorSignup'
import MessagingHub from './components/pages/MessagingHub'
import ChatView from './components/pages/ChatView'
import OfferForm from './components/pages/OfferForm'
import OfferPreview from './components/pages/OfferPreview'
import MesProjetsMonteur from './components/pages/MesProjetsMonteur'
import EditorPipeline from './components/pages/EditorPipeline'

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

function OnboardingLayout() {
  const { currentStep, goToStep } = useOnboarding()
  const { step } = useParams()
  const stepNum = Number(step)

  if (stepNum && stepNum !== currentStep && stepNum >= 1 && stepNum <= 9) {
    goToStep(stepNum)
  }

  const displayStep = stepNum >= 1 && stepNum <= 9 ? stepNum : currentStep
  const progress = displayStep === 9 ? 100 : Math.round((displayStep / 8) * 100)
  const StepComponent = STEP_COMPONENTS[displayStep] || Step1Account
  const stepInfo = STEPS.find((s) => s.id === displayStep)

  return (
    <>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <nav className="mobile-nav">
        <div className="mobile-nav-logo">CUT<span>LAB</span></div>
        <div className="mobile-step-pill">
          {displayStep === 9 ? '✓ Publie' : `${displayStep} / 8 — ${stepInfo?.label ?? ''}`}
        </div>
      </nav>
      <div className="app">
        <Sidebar />
        <main className="main">
          <StepComponent key={displayStep} />
        </main>
      </div>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding/:step" element={<OnboardingLayout />} />
      <Route path="/creator-signup" element={<CreatorSignup />} />

      {/* App routes with shared navigation */}
      <Route element={<AppLayout />}>
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/projects" element={<MesProjetsMonteur />} />
        <Route path="/editor" element={<ProfileEditor />} />
        <Route path="/messaging" element={<MessagingHub />} />
        <Route path="/messaging/:id" element={<ChatView />} />
        <Route path="/pipeline" element={<EditorPipeline />} />
        <Route path="/offer/new" element={<OfferForm />} />
        <Route path="/offer/preview" element={<OfferPreview />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

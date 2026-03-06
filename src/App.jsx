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

/** Redirects to landing if not authenticated. Shows nothing while auth is loading. */
function RequireAuth({ children }) {
  const { user, authReady } = useOnboarding()
  if (!authReady) return null // avoid flash redirect before session is checked
  if (!user) return <Navigate to="/" replace />
  return children
}

/** Redirects to role-appropriate home if user lacks the required role */
function RequireRole({ allowed, children }) {
  const { userRole } = useOnboarding()
  if (!allowed.includes(userRole)) return <Navigate to="/" replace />
  return children
}

/** Redirects logged-in users to their home (for public-only pages) */
function PublicOnly({ children }) {
  const { user, authReady, userRole } = useOnboarding()
  if (!authReady) return null
  if (user) {
    return <Navigate to={userRole === 'creator' ? '/catalog' : '/projects'} replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public-only routes — logged-in users get redirected to home */}
      <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
      <Route path="/creator-signup" element={<CreatorSignup />} />

      {/* Onboarding — accessible for auth (signup/login happens on step 1) */}
      <Route path="/onboarding/:step" element={<OnboardingLayout />} />

      {/* Authenticated app routes */}
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        {/* Creator routes: catalog + messaging only */}
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/messaging" element={<MessagingHub />} />
        <Route path="/messaging/:id" element={<ChatView />} />

        {/* Editor-only routes */}
        <Route path="/projects" element={<RequireRole allowed={['editor']}><MesProjetsMonteur /></RequireRole>} />
        <Route path="/editor" element={<RequireRole allowed={['editor']}><ProfileEditor /></RequireRole>} />
        <Route path="/pipeline" element={<RequireRole allowed={['editor']}><EditorPipeline /></RequireRole>} />

        {/* Creator-only routes */}
        <Route path="/offer/new" element={<RequireRole allowed={['creator']}><OfferForm /></RequireRole>} />
        <Route path="/offer/preview" element={<RequireRole allowed={['creator']}><OfferPreview /></RequireRole>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

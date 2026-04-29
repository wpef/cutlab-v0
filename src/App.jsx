import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useOnboarding } from './context/OnboardingContext'
import { STEPS } from './constants/steps'
import Sidebar from './components/layout/Sidebar'
import AppLayout from './components/layout/AppLayout'

// Onboarding steps — kept eager (critical auth path, small footprint)
import Step1Account from './components/steps/Step1Account'
import Step2Identity from './components/steps/Step2Identity'
import Step3Skills from './components/steps/Step3Skills'
import Step4Portfolio from './components/steps/Step4Portfolio'
import Step5Presentation from './components/steps/Step5Presentation'
import Step6Level from './components/steps/Step6Level'
import Step7Preview from './components/steps/Step7Preview'
import Step8Success from './components/steps/Step8Success'

// App pages — lazy loaded by role chunk
const Landing          = lazy(() => import('./components/pages/Landing'))
const LegalPrivacy     = lazy(() => import('./components/pages/LegalPrivacy'))
const LegalTerms       = lazy(() => import('./components/pages/LegalTerms'))
const AdminUsers       = lazy(() => import('./components/pages/admin/AdminUsers'))
const AdminReports     = lazy(() => import('./components/pages/admin/AdminReports'))
const CreatorSignup    = lazy(() => import('./components/pages/CreatorSignup'))
const Catalog          = lazy(() => import('./components/pages/Catalog'))
const EditorDetail     = lazy(() => import('./components/pages/EditorDetail'))
const MessagingHub     = lazy(() => import('./components/pages/MessagingHub'))
const ChatView         = lazy(() => import('./components/pages/ChatView'))
const OfferForm        = lazy(() => import('./components/pages/OfferForm'))
const OfferPreview     = lazy(() => import('./components/pages/OfferPreview'))
const ProjectForm      = lazy(() => import('./components/pages/ProjectForm'))
const ProjectDetail    = lazy(() => import('./components/pages/ProjectDetail'))
const MyProjects       = lazy(() => import('./components/pages/MyProjects'))
const ProfileEditor    = lazy(() => import('./components/editor/ProfileEditor'))
const MesProjetsMonteur = lazy(() => import('./components/pages/MesProjetsMonteur'))
const EditorPipeline   = lazy(() => import('./components/pages/EditorPipeline'))

const STEP_COMPONENTS = {
  1: Step1Account,
  2: Step2Identity,
  3: Step3Skills,
  4: Step4Portfolio,
  5: Step5Presentation,
  6: Step6Level,
  7: Step7Preview,
  8: Step8Success,
}

function OnboardingLayout() {
  const { currentStep, goToStep, user, authReady } = useOnboarding()
  const { step } = useParams()
  const stepNum = Number(step)

  useEffect(() => {
    // Sync currentStep to URL (browser back/forward) — must be in effect, not render body
    if (stepNum >= 1 && stepNum <= 8 && stepNum !== currentStep) goToStep(stepNum)
  }, [stepNum])

  useEffect(() => {
    // If already authenticated and on step 1, skip to step 2
    if (authReady && user && stepNum === 1) goToStep(2)
  }, [authReady, user, stepNum])

  const displayStep = stepNum >= 1 && stepNum <= 8 ? stepNum : currentStep
  const progress = displayStep === 8 ? 100 : Math.round((displayStep / 7) * 100)
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
          {displayStep === 8 ? '✓ Publie' : `${displayStep} / 7 — ${stepInfo?.label ?? ''}`}
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

/**
 * Role-based guard with two modes:
 *   - `allowed`: redirect to landing if userRole is NOT in the allowlist (existing behavior)
 *   - `blocked`: redirect to role-specific home if userRole IS in the blocklist
 *               (used for pages open to guests + some roles, e.g. /catalog: guests + creators only)
 *
 * `blocked` only applies to authenticated users — guests (no userRole) are allowed through.
 */
function RequireRole({ allowed, blocked, children }) {
  const { userRole } = useOnboarding()
  if (blocked && userRole && blocked.includes(userRole)) {
    return <Navigate to={userRole === 'creator' ? '/catalog' : '/projects'} replace />
  }
  if (allowed && !allowed.includes(userRole)) return <Navigate to="/" replace />
  return children
}

/** Redirects logged-in users to their home (for public-only pages) */
function PublicOnly({ children }) {
  const { user, authReady, userRole, demoMode } = useOnboarding()
  if (!authReady) return null
  // Don't redirect during onboarding demo — user is set but we're navigating to /onboarding/2
  if (user && demoMode !== 'onboarding') {
    return <Navigate to={userRole === 'creator' ? '/catalog' : '/projects'} replace />
  }
  return children
}

export default function App() {
  return (
    <Suspense fallback={<div className="page-loading" />}>
    <Routes>
      {/* Public-only routes — logged-in users get redirected to home */}
      <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
      <Route path="/creator-signup" element={<CreatorSignup />} />

      {/* Legal pages — always public */}
      <Route path="/legal/privacy" element={<LegalPrivacy />} />
      <Route path="/legal/terms" element={<LegalTerms />} />

      {/* Onboarding — accessible for auth (signup/login happens on step 1) */}
      <Route path="/onboarding/:step" element={<OnboardingLayout />} />

      {/* Public catalog — guests + creators can browse; editors are redirected to /projects */}
      <Route element={<AppLayout />}>
        <Route path="/catalog" element={<RequireRole blocked={['editor']}><Catalog /></RequireRole>} />
        <Route path="/editor/:id" element={<EditorDetail />} />
      </Route>

      {/* Authenticated app routes */}
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/messaging" element={<MessagingHub />} />
        <Route path="/messaging/:id" element={<ChatView />} />

        {/* Editor-only routes */}
        <Route path="/projects" element={<RequireRole allowed={['editor']}><MesProjetsMonteur /></RequireRole>} />
        <Route path="/editor" element={<RequireRole allowed={['editor']}><ProfileEditor /></RequireRole>} />
        <Route path="/pipeline" element={<RequireRole allowed={['editor']}><EditorPipeline /></RequireRole>} />

        {/* Offer routes — accessible to both roles */}
        <Route path="/offer/new" element={<OfferForm />} />
        <Route path="/offer/preview" element={<OfferPreview />} />
        <Route path="/project/new" element={<RequireRole allowed={['creator']}><ProjectForm /></RequireRole>} />
        <Route path="/my-projects" element={<RequireRole allowed={['creator']}><MyProjects /></RequireRole>} />

        {/* Shared routes (role-aware UI) */}
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Route>

      {/* Admin routes — role='admin' required */}
      <Route element={<RequireAuth><RequireRole allowed={['admin']}><AppLayout /></RequireRole></RequireAuth>}>
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  )
}

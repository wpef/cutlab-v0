/**
 * Landing — Public homepage for non-logged-in users.
 *
 * Two distinct paths:
 * - Créateurs (content creators): search for monteurs via the catalog
 * - Monteurs (video editors): sign up to be found by créateurs
 *
 * Three demo buttons let visitors test the app without creating a real account.
 */
import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_CREATOR_EMAIL, DEMO_CREATOR_PASSWORD } from '../../lib/demoData'

export default function Landing() {
  const {
    goToOnboarding, goToCreatorSignup, goToCatalog,
    loginDemoEditor, loginDemoCreator, startDemoOnboarding,
    authLoading,
  } = useOnboarding()

  const [demoLoading, setDemoLoading] = useState(null) // 'editor' | 'creator' | 'onboarding' | null

  async function handleDemoEditor() {
    setDemoLoading('editor')
    await loginDemoEditor(DEMO_EMAIL, DEMO_PASSWORD)
    setDemoLoading(null)
  }

  async function handleDemoCreator() {
    setDemoLoading('creator')
    await loginDemoCreator(DEMO_CREATOR_EMAIL, DEMO_CREATOR_PASSWORD)
    setDemoLoading(null)
  }

  async function handleDemoOnboarding() {
    setDemoLoading('onboarding')
    await startDemoOnboarding()
    setDemoLoading(null)
  }

  const busy = !!demoLoading || authLoading

  return (
    <div className="landing">

      <header className="landing-header">
        <div className="landing-logo">CUT<span>LAB</span></div>
      </header>

      <div className="landing-hero">

        {/* -- Côté créateur -- */}
        <div className="landing-panel landing-panel--dark">
          <div className="landing-divider" />
          <div className="landing-panel-content">
            <div className="landing-eyebrow">Pour les créateurs</div>
            <h1>Trouvez votre monteur en moins d'un quart d'heure.</h1>
            <p>Des monteurs vérifiés, disponibles, au niveau exact que vous cherchez.</p>
            <button className="landing-btn landing-btn--primary" onClick={goToCatalog}>
              Parcourir les monteurs →
            </button>
          </div>
        </div>

        {/* -- Côté monteur -- */}
        <div className="landing-panel landing-panel--accent">
          <div className="landing-panel-content">
            <div className="landing-eyebrow">Pour les monteurs</div>
            <h1>Trouvez un projet bien payé.</h1>
            <p>Rejoins le catalogue. Les créateurs te contactent directement.</p>
            <button className="landing-btn landing-btn--dark" onClick={goToOnboarding}>
              S'inscrire gratuitement →
            </button>
          </div>
        </div>

      </div>

      {/* -- Demo section -- */}
      <div className="landing-demo-section">
        <div className="landing-demo-label">Tester sans créer de compte</div>
        <div className="landing-demo-buttons">
          <button
            className="btn-demo"
            onClick={handleDemoCreator}
            disabled={busy}
          >
            {demoLoading === 'creator' ? '...' : 'Démo créateur'}
          </button>
          <button
            className="btn-demo"
            onClick={handleDemoEditor}
            disabled={busy}
          >
            {demoLoading === 'editor' ? '...' : 'Démo monteur'}
          </button>
          <button
            className="btn-demo"
            onClick={handleDemoOnboarding}
            disabled={busy}
          >
            {demoLoading === 'onboarding' ? '...' : 'Tester l\'onboarding'}
          </button>
        </div>
      </div>
    </div>
  )
}

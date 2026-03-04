/**
 * Landing — Public homepage for non-logged-in users.
 *
 * Two distinct paths:
 * - Créateurs (content creators): search for monteurs via the catalog
 * - Monteurs (video editors): sign up to be found by créateurs
 *
 * Logged-in users are auto-redirected to their role-appropriate home
 * (see goToHome in OnboardingContext).
 */
import { useEffect } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'

export default function Landing() {
  const { goToOnboarding, goToCatalog, goToHome, user, userRole } = useOnboarding()

  // Auto-redirect logged-in users to their home
  useEffect(() => {
    if (user) goToHome()
  }, [user])

  return (
    <div className="landing">

      <header className="landing-header">
        <div className="landing-logo">CUT<span>LAB</span></div>
      </header>

      <div className="landing-hero">

        {/* ── Côté créateur ── */}
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

        {/* ── Côté monteur ── */}
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
    </div>
  )
}

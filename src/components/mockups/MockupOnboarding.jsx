const STEPS = [
  { num: 1, label: 'Compte', done: true },
  { num: 2, label: 'Identité', done: true },
  { num: 3, label: 'Compétences', done: true },
  { num: 4, label: 'Portfolio', active: true },
  { num: 5, label: 'Présentation' },
  { num: 6, label: 'Niveau' },
  { num: 7, label: 'Aperçu' },
]

const SKILL_CHIPS = ['Reels', 'YouTube', 'Motion', 'TikTok', 'Color', 'Podcast', 'Shorts', 'Drone']
const SELECTED = ['Reels', 'Motion', 'TikTok']

export default function MockupOnboarding() {
  return (
    <div className="mockup-stage">
      <div className="mockup-onboarding">
        {/* Sidebar */}
        <div className="mockup-onboarding-sidebar">
          <div className="mockup-onboarding-logo">CUTLAB</div>
          <div className="mockup-onboarding-progress-bar">
            <div className="mockup-onboarding-progress-fill" style={{ width: '43%' }} />
          </div>
          <div className="mockup-steps-list">
            {STEPS.map(step => (
              <div
                key={step.num}
                className={`mockup-step${step.done ? ' mockup-step--done' : ''}${step.active ? ' mockup-step--active' : ''}`}
              >
                <div className="mockup-step-dot">
                  {step.done ? '✓' : step.num}
                </div>
                <span className="mockup-step-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="mockup-onboarding-content">
          <div className="mockup-onboarding-step-indicator">Étape 4 / 7</div>
          <h3 className="mockup-onboarding-title">Portfolio</h3>
          <p className="mockup-onboarding-subtitle">Ajoutez vos meilleurs clips et chaînes créditées.</p>

          <div className="mockup-onboarding-field">
            <label className="mockup-onboarding-label">Formats maîtrisés</label>
            <div className="mockup-onboarding-chips">
              {SKILL_CHIPS.map(chip => (
                <span
                  key={chip}
                  className={`mockup-skill-chip${SELECTED.includes(chip) ? ' mockup-skill-chip--selected' : ''}`}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="mockup-onboarding-field">
            <label className="mockup-onboarding-label">Lien clip — 1</label>
            <div className="mockup-onboarding-input">
              <span className="mockup-onboarding-input-placeholder">https://youtube.com/...</span>
            </div>
          </div>

          <div className="mockup-onboarding-nav">
            <button className="mockup-onboarding-btn mockup-onboarding-btn--back">Retour</button>
            <button className="mockup-onboarding-btn mockup-onboarding-btn--next">Continuer →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

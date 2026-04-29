export default function MockupProject() {
  const candidates = [
    { initials: 'AL', bg: 'linear-gradient(135deg, #d4f000, #7fbf00)' },
    { initials: 'MK', bg: 'linear-gradient(135deg, #a78bfa, #6d28d9)' },
    { initials: 'JD', bg: 'linear-gradient(135deg, #60a5fa, #1d4ed8)' },
  ]

  return (
    <div className="mockup-stage">
      <div className="mockup-project">
        {/* Project header */}
        <div className="mockup-project-header">
          <div className="mockup-project-badges">
            <span className="mockup-project-badge mockup-project-badge--format">YouTube</span>
            <span className="mockup-project-badge mockup-project-badge--niche">Lifestyle</span>
          </div>
          <h3 className="mockup-project-title">Vlog road trip — Côte d'Azur 2026</h3>
          <p className="mockup-project-desc">
            Cherche monteur pour vlog de voyage 15 min+, avec motion et color grading ciné.
          </p>
        </div>

        {/* Deliverables */}
        <div className="mockup-project-section">
          <div className="mockup-project-section-label">Livrables</div>
          <div className="mockup-project-chips">
            <span className="mockup-skill-chip mockup-skill-chip--accent">Vidéo principale</span>
            <span className="mockup-skill-chip">Miniature</span>
            <span className="mockup-skill-chip">3 Shorts</span>
          </div>
        </div>

        {/* Budget */}
        <div className="mockup-project-section">
          <div className="mockup-project-section-label">Budget</div>
          <div className="mockup-project-budget">
            <div className="mockup-project-budget-bar">
              <div className="mockup-project-budget-fill" style={{ width: '68%' }} />
            </div>
            <span className="mockup-project-budget-value">680 €</span>
          </div>
        </div>

        {/* Deadline + Candidates */}
        <div className="mockup-project-footer">
          <div className="mockup-project-deadline">
            <span className="mockup-project-deadline-icon">📅</span>
            <span>20 mai 2026</span>
          </div>
          <div className="mockup-project-candidates">
            {candidates.map((c, i) => (
              <div
                key={i}
                className="mockup-project-candidate-avatar"
                style={{ background: c.bg, zIndex: candidates.length - i }}
              >
                {c.initials}
              </div>
            ))}
            <span className="mockup-project-candidate-count">3 candidats</span>
          </div>
        </div>
      </div>
    </div>
  )
}

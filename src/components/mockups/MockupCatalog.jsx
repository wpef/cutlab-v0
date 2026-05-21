export default function MockupCatalog() {
  const cards = [
    {
      initials: 'AL',
      gradient: 'linear-gradient(135deg, #d4f000 0%, #7fbf00 100%)',
      name: 'Alex Lebrun',
      level: '🚀 Expert',
      price: '120 – 450 €',
      skills: ['Reels', 'YouTube', 'Motion'],
    },
    {
      initials: 'MK',
      gradient: 'linear-gradient(135deg, #a78bfa 0%, #6d28d9 100%)',
      name: 'Marie Kosta',
      level: '💎 Confirmé',
      price: '80 – 300 €',
      skills: ['Shorts', 'TikTok', 'Color'],
    },
    {
      initials: 'JD',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #1d4ed8 100%)',
      name: 'Jules Dumas',
      level: '⭐ Star',
      price: '180 – 650 €',
      skills: ['Podcast', 'Reels', 'Drone'],
    },
  ]

  return (
    <div className="mockup-stage">
      <div className="mockup-catalog">
        <div className="mockup-card mockup-card--back-left">
          <MockupEditorCard {...cards[0]} />
        </div>
        <div className="mockup-card mockup-card--front">
          <MockupEditorCard {...cards[1]} featured />
        </div>
        <div className="mockup-card mockup-card--back-right">
          <MockupEditorCard {...cards[2]} />
        </div>
      </div>
    </div>
  )
}

function MockupEditorCard({ initials, gradient, name, level, price, skills, featured }) {
  return (
    <div className={`mockup-editor-card${featured ? ' mockup-editor-card--featured' : ''}`}>
      <div className="mockup-card-header">
        <div className="mockup-card-avatar" style={{ background: gradient }}>
          {initials}
        </div>
        <div className="mockup-card-info">
          <div className="mockup-card-name">
            {name}
            <span className="mockup-availability-dot" />
          </div>
          <div className="mockup-card-level">{level}</div>
        </div>
      </div>
      <div className="mockup-card-skills">
        {skills.map(s => (
          <span key={s} className="mockup-skill-chip">{s}</span>
        ))}
      </div>
      <div className="mockup-card-price">{price}</div>
    </div>
  )
}

const LEVELS = [
  { emoji: '🌱', name: 'Débutant',  pct: 12,  dim: true  },
  { emoji: '⚡', name: 'Prospect',  pct: 22,  dim: true  },
  { emoji: '💎', name: 'Confirmé',  pct: 38,  dim: false },
  { emoji: '🚀', name: 'Expert',    pct: 55,  active: true },
  { emoji: '⭐', name: 'Star',      pct: 18,  dim: false },
  { emoji: '👑', name: 'Elite',     pct: 9,   dim: true  },
  { emoji: '🔮', name: 'Légende',   pct: 1,   dim: true  },
]

export default function MockupLevels() {
  return (
    <div className="mockup-stage">
      <div className="mockup-levels">
        {LEVELS.map((lvl, i) => (
          <div
            key={lvl.name}
            className={`mockup-level${lvl.active ? ' mockup-level--active' : ''}${lvl.dim ? ' mockup-level--dim' : ''}`}
            style={{ '--offset': i }}
          >
            <div className="mockup-level-badge">
              <span className="mockup-level-emoji">{lvl.emoji}</span>
            </div>
            <div className="mockup-level-info">
              <div className="mockup-level-name">{lvl.name}</div>
              <div className="mockup-level-pct">{lvl.pct}% des monteurs</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

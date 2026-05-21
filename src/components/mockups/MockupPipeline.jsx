const COLUMNS = [
  {
    id: 'todo',
    title: 'À faire',
    color: '#60a5fa',
    cards: [
      { title: 'Vlog été — Maroc', format: 'YouTube', avatar: 'CL', deadline: '12 mai', avatarBg: '#a78bfa' },
      { title: 'Haul mode printemps', format: 'Reels', avatar: 'SF', deadline: '15 mai', avatarBg: '#34d399' },
    ],
  },
  {
    id: 'inprogress',
    title: 'En cours',
    color: '#d4f000',
    cards: [
      { title: 'Podcast Ep. 12', format: 'Shorts', avatar: 'MK', deadline: '8 mai', avatarBg: '#f97316', active: true },
    ],
  },
  {
    id: 'delivered',
    title: 'Livré',
    color: '#34d399',
    cards: [
      { title: 'Unboxing iPhone 16', format: 'YouTube', avatar: 'TP', deadline: '2 mai', avatarBg: '#60a5fa' },
      { title: 'Tuto skincare', format: 'TikTok', avatar: 'AL', deadline: '30 avr', avatarBg: '#d4f000' },
    ],
  },
]

export default function MockupPipeline() {
  return (
    <div className="mockup-stage">
      <div className="mockup-pipeline">
        {COLUMNS.map(col => (
          <div key={col.id} className="mockup-pipeline-col">
            <div className="mockup-pipeline-col-header">
              <span className="mockup-pipeline-col-dot" style={{ background: col.color }} />
              <span className="mockup-pipeline-col-title">{col.title}</span>
              <span className="mockup-pipeline-col-count">{col.cards.length}</span>
            </div>
            <div className="mockup-pipeline-cards">
              {col.cards.map((card, i) => (
                <div
                  key={i}
                  className={`mockup-pipeline-card${card.active ? ' mockup-pipeline-card--active' : ''}`}
                >
                  <div className="mockup-pipeline-card-title">{card.title}</div>
                  <div className="mockup-pipeline-card-meta">
                    <span className="mockup-pipeline-card-format">{card.format}</span>
                    <div className="mockup-pipeline-card-footer">
                      <div
                        className="mockup-pipeline-mini-avatar"
                        style={{ background: card.avatarBg }}
                      >
                        {card.avatar}
                      </div>
                      <span className="mockup-pipeline-card-deadline">⏱ {card.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

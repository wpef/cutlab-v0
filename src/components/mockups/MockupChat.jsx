export default function MockupChat() {
  return (
    <div className="mockup-stage">
      <div className="mockup-chat">
        {/* Chat header */}
        <div className="mockup-chat-header">
          <div className="mockup-chat-avatar" style={{ background: 'linear-gradient(135deg, #a78bfa, #6d28d9)' }}>
            CL
          </div>
          <div>
            <div className="mockup-chat-name">Clara L.</div>
            <div className="mockup-chat-status">
              <span className="mockup-availability-dot" /> En ligne
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="mockup-chat-messages">
          <div className="mockup-message mockup-message--left">
            <div className="mockup-message-bubble">
              Bonjour, je cherche un monteur pour une série de Reels Instagram. Budget flexible, délai 10 jours.
            </div>
          </div>

          <div className="mockup-message mockup-message--right">
            <div className="mockup-message-bubble mockup-message-bubble--right">
              Bonjour ! Voici ma proposition de mission :
            </div>
          </div>

          {/* Proposal card */}
          <div className="mockup-proposal-card">
            <div className="mockup-proposal-header">
              <span className="mockup-proposal-title">Série Reels — Capsule Mode</span>
              <span className="mockup-proposal-badge mockup-proposal-badge--pending">En attente</span>
            </div>
            <div className="mockup-proposal-row">
              <span className="mockup-proposal-label">Format</span>
              <span className="mockup-proposal-value">Instagram Reels 9:16</span>
            </div>
            <div className="mockup-proposal-row">
              <span className="mockup-proposal-label">Délai de livraison</span>
              <span className="mockup-proposal-value">8 jours</span>
            </div>
            <div className="mockup-proposal-row">
              <span className="mockup-proposal-label">Budget</span>
              <span className="mockup-proposal-value mockup-proposal-price">480 €</span>
            </div>
            <div className="mockup-proposal-deliverables">
              <span className="mockup-skill-chip">3 × Reels 30s</span>
              <span className="mockup-skill-chip">Sous-titres</span>
              <span className="mockup-skill-chip">2 révisions</span>
            </div>
            <div className="mockup-proposal-actions">
              <button className="mockup-proposal-btn mockup-proposal-btn--accept">Accepter</button>
              <button className="mockup-proposal-btn mockup-proposal-btn--decline">Refuser</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

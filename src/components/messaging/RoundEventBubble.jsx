/**
 * RoundEventBubble — system-style timeline entry for deliverable round events.
 * Rendered inline in the chat timeline for: submission, revision, validation.
 */
export default function RoundEventBubble({ event }) {
  const { subtype, round_number, creator_feedback, timestamp } = event

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="round-event-bubble">
      <div className="round-event-line" />
      <div className="round-event-content">
        {subtype === 'submission' && (
          <span className="round-event-label">
            📦 Livrables v{round_number} envoyés
          </span>
        )}
        {subtype === 'revision' && (
          <>
            <span className="round-event-label">
              🔄 Révision demandée (v{round_number})
            </span>
            {creator_feedback && (
              <p className="round-event-feedback">« {creator_feedback} »</p>
            )}
          </>
        )}
        {subtype === 'validation' && (
          <span className="round-event-label">
            ✅ Livrables v{round_number} validés
          </span>
        )}
        <span className="round-event-time">{formatDate(timestamp)}</span>
      </div>
      <div className="round-event-line" />
    </div>
  )
}

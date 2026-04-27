/**
 * DeliverableRoundItem — displays one delivery round in the collab tracker.
 * Shows: version badge, status, external link, editor note, creator feedback.
 */
export default function DeliverableRoundItem({ round, isLatest }) {
  const statusLabel = {
    pending_review:     'En attente de validation',
    revision_requested: 'Retour demandé',
    validated:          'Validé ✓',
  }

  const statusClass = {
    pending_review:     'round-status--pending',
    revision_requested: 'round-status--revision',
    validated:          'round-status--validated',
  }

  function formatDate(iso) {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className={`round-item${isLatest ? ' round-item--latest' : ''}`}>
      <div className="round-item-header">
        <span className="round-badge">v{round.round_number}</span>
        <span className={`round-status ${statusClass[round.status] ?? ''}`}>
          {statusLabel[round.status] ?? round.status}
        </span>
        <span className="round-date">{formatDate(round.created_at)}</span>
      </div>

      {round.delivery_link && (
        <a
          className="round-link"
          href={round.delivery_link}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 Accéder aux livrables
        </a>
      )}

      {round.editor_note && (
        <div className="round-note">
          <span className="round-note-label">Note du monteur :</span>
          <p>{round.editor_note}</p>
        </div>
      )}

      {round.creator_feedback && (
        <div className={`round-feedback round-feedback--${round.status === 'validated' ? 'validated' : 'revision'}`}>
          <span className="round-note-label">
            {round.status === 'validated' ? 'Commentaire :' : 'Retour créateur :'}
          </span>
          <p>{round.creator_feedback}</p>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'

// Map offer status to badge modifier class and label
const STATUS_META = {
  pending:  { cls: 'project-proposal-card__badge--pending',  label: 'En attente' },
  accepted: { cls: 'project-proposal-card__badge--accepted', label: 'Acceptée' },
  refused:  { cls: 'project-proposal-card__badge--refused',  label: 'Refusée' },
}

export default function ProjectProposalCard({ offer, currentUserRole, isMine, onAccept, onRefuse }) {
  const [loading, setLoading] = useState(false)

  const statusMeta = STATUS_META[offer.status] ?? STATUS_META.pending

  async function handleAccept() {
    if (!onAccept) return
    setLoading(true)
    await onAccept()
    setLoading(false)
  }

  async function handleRefuse() {
    if (!onRefuse) return
    setLoading(true)
    await onRefuse()
    setLoading(false)
  }

  // Key-value grid fields — only rendered when the value is non-empty
  const fields = [
    { label: 'Format',          value: offer.format },
    { label: 'Deadline',        value: offer.deadline },
    { label: 'Budget',          value: offer.budget != null ? `${Number(offer.budget).toLocaleString('fr-FR')} €` : null },
    { label: 'Livrables',       value: offer.deliverables },
    { label: 'Retours inclus',  value: offer.revisions != null ? String(offer.revisions) : 'Non précisé' },
  ].filter((f) => f.value)

  const showActions = offer.status === 'pending' && currentUserRole === 'editor' && (onAccept || onRefuse)

  return (
    <div className={`project-proposal-card${isMine ? ' project-proposal-card--mine' : ''}`}>
      {/* Header row: label + status badge */}
      <div className="project-proposal-card__header">
        <span className="project-proposal-card__eyebrow">Proposition de mission</span>
        <span className={`project-proposal-card__badge ${statusMeta.cls}`}>
          {statusMeta.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="project-proposal-card__title">{offer.title}</h3>

      {/* Description */}
      {offer.description && (
        <p className="project-proposal-card__description">{offer.description}</p>
      )}

      {/* Key-value grid */}
      {fields.length > 0 && (
        <div className="project-proposal-card__grid">
          {fields.map(({ label, value }) => (
            <div key={label} className="project-proposal-card__field">
              <span className="project-proposal-card__field-label">{label}</span>
              <span className="project-proposal-card__field-value">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons — only for editor on pending offers */}
      {showActions && (
        <div className="project-proposal-card__actions">
          <button
            className="chat-accept-btn"
            style={{ padding: '8px 16px', fontSize: 13 }}
            onClick={handleAccept}
            disabled={loading}
          >
            ✓ Accepter
          </button>
          <button
            className="chat-refuse-btn"
            style={{ padding: '8px 16px', fontSize: 13 }}
            onClick={handleRefuse}
            disabled={loading}
          >
            ✗ Refuser
          </button>
        </div>
      )}
    </div>
  )
}

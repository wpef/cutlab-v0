import { useState } from 'react'
import { FORMATS, EXPERIENCE_OPTIONS, MISSION_TYPES, QUALITY_OPTIONS, LANGUAGES } from '../../constants/options'

// Map offer status to badge modifier class and label
const STATUS_META = {
  pending:  { cls: 'project-proposal-card__badge--pending',  label: 'En attente' },
  accepted: { cls: 'project-proposal-card__badge--accepted', label: 'Acceptée' },
  refused:  { cls: 'project-proposal-card__badge--refused',  label: 'Refusée' },
}

function formatLabel(value, optionsList) {
  const found = optionsList.find((o) => o.key === value)
  return found ? found.label : value
}

function languageLabel(key) {
  const found = LANGUAGES.find((l) => l.key === key)
  return found ? `${found.flag} ${found.label}` : key
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

  // Resolve content_format with legacy 'format' fallback
  const resolvedFormat = offer.content_format ?? offer.format
  const formatDisplay = resolvedFormat ? formatLabel(resolvedFormat, FORMATS) : null

  // Budget display: range or fixed
  let budgetDisplay = null
  if (offer.budget_type === 'range' && offer.budget_min != null && offer.budget_max != null) {
    budgetDisplay = `${Number(offer.budget_min).toLocaleString('fr-FR')} – ${Number(offer.budget_max).toLocaleString('fr-FR')} €`
  } else if (offer.budget != null) {
    budgetDisplay = `${Number(offer.budget).toLocaleString('fr-FR')} €`
  }

  // Key-value grid fields — only rendered when the value is non-empty
  const fields = [
    { label: 'Format',           value: formatDisplay },
    { label: 'Deadline',         value: offer.deadline },
    { label: 'Budget',           value: budgetDisplay },
    { label: 'Livrables',        value: offer.deliverables },
    { label: 'Retours inclus',   value: offer.revisions != null ? String(offer.revisions) : 'Non précisé' },
    { label: 'Type de mission',  value: offer.mission_type ? formatLabel(offer.mission_type, MISSION_TYPES) : null },
    { label: 'Qualité',          value: offer.quality ? formatLabel(offer.quality, QUALITY_OPTIONS) : null },
    { label: 'Nb vidéos',        value: offer.video_count != null ? `${offer.video_count} vidéo(s)` : null },
    { label: 'Durée',            value: offer.video_duration || null },
    { label: 'Expérience',       value: offer.experience_level ? formatLabel(offer.experience_level, EXPERIENCE_OPTIONS) : null },
  ].filter((f) => f.value)

  // Niches
  const nichesDisplay = Array.isArray(offer.niches) && offer.niches.length > 0 ? offer.niches : null

  // Preferred software
  const softwareDisplay = Array.isArray(offer.preferred_software) && offer.preferred_software.length > 0 ? offer.preferred_software : null

  // Required languages
  const languagesDisplay = Array.isArray(offer.required_languages) && offer.required_languages.length > 0
    ? offer.required_languages.map(languageLabel)
    : null

  // Show accept/refuse to the receiver of the offer:
  //   sent_by='creator' → editor receives it
  //   sent_by='editor'  → creator receives it
  //   legacy (no sent_by) → default to editor receiving
  const isReceiver = offer.sent_by === 'editor'
    ? currentUserRole === 'creator'
    : currentUserRole === 'editor'
  const showActions = offer.status === 'pending' && isReceiver && (onAccept || onRefuse)

  return (
    <div className={`project-proposal-card${isMine ? ' project-proposal-card--mine' : ''}`}>
      {/* Header row: label + status badge */}
      <div className="project-proposal-card__header">
        <span className="project-proposal-card__eyebrow">Offre de mission</span>
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

      {/* Thumbnail flag */}
      {offer.thumbnail_included === true && (
        <div className="project-proposal-card__tag-row">
          <span className="project-proposal-card__tag">Miniature incluse</span>
        </div>
      )}

      {/* Niches */}
      {nichesDisplay && (
        <div className="project-proposal-card__section">
          <span className="project-proposal-card__field-label">Niches</span>
          <div className="project-proposal-card__tag-row">
            {nichesDisplay.map((n) => (
              <span key={n} className="project-proposal-card__tag">{n}</span>
            ))}
          </div>
        </div>
      )}

      {/* Preferred software */}
      {softwareDisplay && (
        <div className="project-proposal-card__section">
          <span className="project-proposal-card__field-label">Logiciels</span>
          <div className="project-proposal-card__tag-row">
            {softwareDisplay.map((s) => (
              <span key={s} className="project-proposal-card__tag">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Required languages */}
      {languagesDisplay && (
        <div className="project-proposal-card__section">
          <span className="project-proposal-card__field-label">Langues</span>
          <div className="project-proposal-card__tag-row">
            {languagesDisplay.map((l) => (
              <span key={l} className="project-proposal-card__tag">{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* Rushes info */}
      {offer.rushes_info && (
        <div className="project-proposal-card__section">
          <span className="project-proposal-card__field-label">Infos rushes</span>
          <p className="project-proposal-card__description" style={{ marginTop: 4 }}>{offer.rushes_info}</p>
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

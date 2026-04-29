import { useState } from 'react'
import { useCollab } from '../../context/CollabContext'
import { useOnboarding } from '../../context/OnboardingContext'
import DeliverableRoundItem from './DeliverableRoundItem'
import ReviewForm from './ReviewForm'

/**
 * CollabTracker — right-panel step tracker (desktop) / drawer content (mobile).
 *
 * Renders the 11-step collaboration timeline and contextual action areas.
 * Props come from ChatView which owns the request, offer, and collab data.
 */
export default function CollabTracker({ request, offer, userRole, onRequestUpdated, onAcceptOffer, onRefuseOffer, onAcceptRequest, onRefuseRequest, onCancelOffer, onCloseProject }) {
  const { goToOfferForm } = useOnboarding()
  const {
    rounds, reviews, collabStep: _unused,
    submitDeliverables, requestRevision, validateDeliverables,
    confirmPaymentSent, confirmPaymentReceived, submitReview,
    deriveCollabStep,
  } = useCollab()

  const collabStep = deriveCollabStep(request, offer, rounds, reviews)

  // Local action state
  const [deliveryLink, setDeliveryLink] = useState('')
  const [deliveryNote, setDeliveryNote] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [expandedStep, setExpandedStep] = useState(null) // manually override expanded step

  const isProjectBased = !!request?.project_id

  // ── Step definitions ─────────────────────────────────────────
  const allSteps = [
    ...(isProjectBased ? [
      { id: 'candidature_sent',     label: 'Candidature envoyée',  icon: '📤' },
      { id: 'candidature_accepted', label: 'Candidature acceptée', icon: '✅' },
    ] : [
      { id: 'contact_pending',  label: 'Contact initié',   icon: '📨' },
      { id: 'contact_accepted', label: 'Contact accepté',  icon: '✅' },
    ]),
    { id: 'offer_sent',     label: 'Offre envoyée',           icon: '📋' },
    { id: 'production',     label: 'Production en cours',      icon: '🎬' },
    { id: 'deliverables',   label: 'Livrables',                icon: '📦' }, // special — handles under_review + revision cycles
    { id: 'payment',        label: 'Livrables acceptés',       icon: '✅' },
    { id: 'payment_confirmation', label: 'Règlement',          icon: '💳' },
    { id: 'feedback',       label: 'Feedbacks',                icon: '⭐' },
    { id: 'closed',         label: 'Projet clos',              icon: '🏁' },
  ]

  // Map collabStep → which step row is "active"
  function getActiveStepId(step) {
    if (!step) return null
    if (step === 'under_review' || step === 'revision') return 'deliverables'
    return step
  }

  const activeStepId = getActiveStepId(collabStep)

  function stepState(stepId) {
    if (!collabStep) return 'future'
    const activeIdx = allSteps.findIndex((s) => s.id === activeStepId)
    const thisIdx   = allSteps.findIndex((s) => s.id === stepId)
    if (thisIdx < activeIdx) return 'done'
    if (thisIdx === activeIdx) return 'active'
    return 'future'
  }

  // ── Date helpers ─────────────────────────────────────────────
  function formatDate(iso) {
    if (!iso) return null
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  function stepCompletedAt(stepId) {
    switch (stepId) {
      case 'candidature_sent':     return formatDate(request?.created_at)
      case 'candidature_accepted': return formatDate(request?.updated_at)
      case 'contact_pending':      return formatDate(request?.created_at)
      case 'contact_accepted':     return formatDate(request?.updated_at)
      case 'offer_sent':           return offer ? formatDate(offer.created_at) : null
      case 'payment':              return rounds.find((r) => r.status === 'validated') ? formatDate(rounds.find((r) => r.status === 'validated').reviewed_at) : null
      case 'payment_confirmation': return request?.payment_received_at ? formatDate(request.payment_received_at) : null
      case 'closed':               return request?.payment_received_at ? formatDate(request.payment_received_at) : null
      default: return null
    }
  }

  // ── Revision counter ─────────────────────────────────────────
  const maxRevisions = offer?.revisions ?? null
  const revisionCountLabel = maxRevisions
    ? `${Math.max(0, rounds.length - 1)} / ${maxRevisions} retour${maxRevisions > 1 ? 's' : ''}`
    : null
  const revisionOverLimit = maxRevisions && rounds.length - 1 > maxRevisions

  // ── Action handlers ──────────────────────────────────────────
  async function handleSubmitDeliverables() {
    setActionLoading(true)
    const result = await submitDeliverables(request.id, deliveryLink.trim(), deliveryNote.trim(), request, offer)
    if (result) { setDeliveryLink(''); setDeliveryNote('') }
    setActionLoading(false)
    onRequestUpdated?.()
  }

  async function handleRequestRevision() {
    const latestRound = rounds.at(-1)
    if (!latestRound) return
    setActionLoading(true)
    await requestRevision(latestRound.id, feedbackText.trim(), request, offer)
    setFeedbackText('')
    setActionLoading(false)
    onRequestUpdated?.()
  }

  async function handleValidate() {
    const latestRound = rounds.at(-1)
    if (!latestRound) return
    setActionLoading(true)
    await validateDeliverables(latestRound.id, feedbackText.trim() || null, request, offer)
    setFeedbackText('')
    setActionLoading(false)
    onRequestUpdated?.()
  }

  async function handlePaymentSent() {
    setActionLoading(true)
    await confirmPaymentSent(request, offer)
    setActionLoading(false)
    onRequestUpdated?.()
  }

  async function handlePaymentReceived() {
    setActionLoading(true)
    await confirmPaymentReceived(request, offer)
    setActionLoading(false)
    onRequestUpdated?.()
  }

  async function handleReview({ rating, comment }) {
    setActionLoading(true)
    const revieweeId = userRole === 'creator' ? request.editor_id : request.creator_id
    await submitReview(request.id, { rating, comment, type: userRole === 'creator' ? 'creator_to_editor' : 'editor_to_creator', revieweeId }, request, offer)
    setActionLoading(false)
    onRequestUpdated?.()
  }

  // ── Step action areas ─────────────────────────────────────────
  function renderActionArea(stepId) {
    if (stepState(stepId) !== 'active') return null

    switch (stepId) {
      case 'candidature_sent': {
        if (userRole === 'creator') {
          return (
            <div className="tracker-action-area">
              <p className="tracker-info-text">
                <strong style={{ color: 'var(--text)' }}>{request?.editor_name}</strong> a candidaté à votre projet.
              </p>
              <div className="tracker-btn-row">
                <button
                  className="btn tracker-action-btn tracker-btn--secondary"
                  onClick={() => onRefuseRequest?.(request.id)}
                  disabled={actionLoading}
                >
                  ✗ Refuser
                </button>
                <button
                  className="btn btn-primary tracker-action-btn"
                  onClick={() => onAcceptRequest?.(request.id)}
                  disabled={actionLoading}
                >
                  ✓ Accepter la candidature
                </button>
              </div>
            </div>
          )
        }
        return (
          <div className="tracker-action-area tracker-action-area--waiting">
            <p className="tracker-waiting-text">⏳ En attente de la réponse du créateur…</p>
          </div>
        )
      }

      case 'candidature_accepted': {
        return (
          <div className="tracker-action-area">
            <p className="tracker-info-text">
              {userRole === 'creator'
                ? "Candidature acceptée. Envoyez une offre de mission pour démarrer la collaboration."
                : "Votre candidature est acceptée. Attendez l'offre du créateur ou proposez la vôtre."}
            </p>
            {userRole === 'creator' && offer?.status !== 'accepted' && (
              <button
                className="btn btn-primary tracker-action-btn"
                onClick={goToOfferForm}
              >
                📋 Créer une offre
              </button>
            )}
            {userRole === 'editor' && offer?.status !== 'accepted' && (
              <button
                className="btn btn-primary tracker-action-btn"
                onClick={goToOfferForm}
              >
                📋 Proposer une offre
              </button>
            )}
          </div>
        )
      }

      case 'contact_pending': {
        if (userRole === 'creator') {
          return (
            <div className="tracker-action-area tracker-action-area--waiting">
              <p className="tracker-waiting-text">⏳ En attente de la réponse du monteur…</p>
            </div>
          )
        }
        // editor: show accept/refuse
        return (
          <div className="tracker-action-area">
            <p className="tracker-info-text">
              <strong style={{ color: 'var(--text)' }}>{request?.creator_name}</strong> souhaite entrer en contact.
            </p>
            <div className="tracker-btn-row">
              <button
                className="btn tracker-action-btn tracker-btn--secondary"
                onClick={() => onRefuseRequest?.(request.id)}
                disabled={actionLoading}
              >
                ✗ Refuser
              </button>
              <button
                className="btn btn-primary tracker-action-btn"
                onClick={() => onAcceptRequest?.(request.id)}
                disabled={actionLoading}
              >
                ✓ Accepter
              </button>
            </div>
          </div>
        )
      }

      case 'contact_accepted': {
        return (
          <div className="tracker-action-area">
            <p className="tracker-info-text">
              {userRole === 'creator'
                ? "Contact accepté. Créez une offre pour formaliser la collaboration."
                : "Contact accepté. Proposez votre offre ou attendez celle du créateur."}
            </p>
            <button
              className="btn btn-primary tracker-action-btn"
              onClick={goToOfferForm}
            >
              📋 {userRole === 'creator' ? 'Créer une offre' : 'Proposer une offre'}
            </button>
          </div>
        )
      }

      case 'offer_sent': {
        const isReceiver = offer?.sent_by === 'editor'
          ? userRole === 'creator'
          : userRole === 'editor'
        return (
          <div className="tracker-action-area">
            <div className="tracker-offer-summary">
              {offer?.title && <strong>{offer.title}</strong>}
              {offer?.budget && <span>💰 {offer.budget} €</span>}
              {offer?.deadline && <span>🗓 {offer.deadline}</span>}
            </div>
            {isReceiver ? (
              <div className="tracker-btn-row">
                <button
                  className="btn tracker-action-btn tracker-btn--secondary"
                  onClick={() => onRefuseOffer?.(offer.id)}
                  disabled={actionLoading}
                >
                  ✗ Refuser
                </button>
                <button
                  className="btn btn-primary tracker-action-btn"
                  onClick={() => onAcceptOffer?.(offer.id)}
                  disabled={actionLoading}
                >
                  ✓ Accepter l'offre
                </button>
              </div>
            ) : (
              <div className="tracker-btn-row">
                <button
                  className="btn tracker-action-btn tracker-btn--secondary"
                  disabled
                  title="Modification d'offre — bientôt disponible"
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                  ✏️ Modifier
                </button>
                <button
                  className="btn tracker-action-btn tracker-btn--secondary"
                  onClick={async () => {
                    if (!confirm("Annuler cette offre ? Le suivi reviendra à l'étape précédente.")) return
                    setActionLoading(true)
                    await onCancelOffer?.(offer.id)
                    setActionLoading(false)
                  }}
                  disabled={actionLoading || !onCancelOffer}
                  style={{ color: '#f87171', borderColor: '#f87171' }}
                >
                  ✗ Annuler l'offre
                </button>
              </div>
            )}
          </div>
        )
      }

      case 'production': {
        if (userRole === 'editor') {
          return (
            <div className="tracker-action-area">
              <p className="tracker-info-text">Mission en cours. Partagez vos livrables dès qu'ils sont prêts.</p>
              <input
                type="url"
                className="tracker-input"
                placeholder="Lien WeTransfer, Drive, Frame.io…"
                value={deliveryLink}
                onChange={(e) => setDeliveryLink(e.target.value)}
              />
              <textarea
                className="tracker-textarea"
                placeholder="Note pour le créateur (optionnel)"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                rows={2}
              />
              <button
                className="btn btn-primary tracker-action-btn"
                onClick={handleSubmitDeliverables}
                disabled={actionLoading || !deliveryLink.trim()}
              >
                {actionLoading ? 'Envoi…' : '📦 Partager les livrables (v1)'}
              </button>
            </div>
          )
        }
        return (
          <div className="tracker-action-area tracker-action-area--waiting">
            <p className="tracker-waiting-text">⏳ En attente des livrables du monteur…</p>
          </div>
        )
      }

      case 'deliverables': {
        const latestRound = rounds.at(-1)

        // EDITOR — no round yet or last was revision_requested → submit form
        if (userRole === 'editor' && (!latestRound || latestRound.status === 'revision_requested')) {
          const versionLabel = `v${rounds.length + 1}`
          return (
            <div className="tracker-action-area">
              {latestRound?.creator_feedback && (
                <div className="tracker-feedback-preview">
                  <span className="tracker-feedback-label">Retour créateur :</span>
                  <p>{latestRound.creator_feedback}</p>
                </div>
              )}
              {revisionOverLimit && (
                <div className="tracker-warning">
                  ⚠️ Hors contrat — {Math.max(0, rounds.length - 1)} retours effectués ({maxRevisions} inclus)
                </div>
              )}
              <input
                className="tracker-input"
                type="url"
                placeholder="Lien WeTransfer, Drive, Frame.io…"
                value={deliveryLink}
                onChange={(e) => setDeliveryLink(e.target.value)}
              />
              <textarea
                className="tracker-textarea"
                placeholder="Note pour le créateur (optionnel)"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                rows={2}
              />
              <button
                className="btn btn-primary tracker-action-btn"
                onClick={handleSubmitDeliverables}
                disabled={actionLoading}
              >
                {actionLoading ? 'Envoi…' : `Livrables disponibles (${versionLabel})`}
              </button>
            </div>
          )
        }

        // EDITOR — round pending review → waiting
        if (userRole === 'editor' && latestRound?.status === 'pending_review') {
          return (
            <div className="tracker-action-area tracker-action-area--waiting">
              <p className="tracker-waiting-text">⏳ En attente de la validation du créateur…</p>
            </div>
          )
        }

        // CREATOR — round pending review → review panel
        if (userRole === 'creator' && latestRound?.status === 'pending_review') {
          return (
            <div className="tracker-action-area">
              {revisionCountLabel && (
                <div className={`tracker-revision-count${revisionOverLimit ? ' tracker-revision-count--over' : ''}`}>
                  {revisionOverLimit ? '⚠️' : '🔁'} {revisionCountLabel}
                </div>
              )}
              <textarea
                className="tracker-textarea"
                placeholder="Commentaire (optionnel pour validation, requis pour retour)"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={2}
              />
              <div className="tracker-btn-row">
                <button
                  className="btn tracker-action-btn tracker-btn--secondary"
                  onClick={handleRequestRevision}
                  disabled={actionLoading || !feedbackText.trim()}
                >
                  {actionLoading ? '…' : '🔁 Demander un retour'}
                </button>
                <button
                  className="btn btn-primary tracker-action-btn"
                  onClick={handleValidate}
                  disabled={actionLoading}
                >
                  {actionLoading ? '…' : '✓ Valider les livrables'}
                </button>
              </div>
            </div>
          )
        }

        // CREATOR — waiting for editor re-upload
        if (userRole === 'creator' && latestRound?.status === 'revision_requested') {
          return (
            <div className="tracker-action-area tracker-action-area--waiting">
              <p className="tracker-waiting-text">⏳ En attente de la nouvelle version…</p>
            </div>
          )
        }

        return null
      }

      case 'payment': {
        if (userRole !== 'creator') return null
        return (
          <div className="tracker-action-area">
            <p className="tracker-info-text">Les livrables ont été validés. Procédez au règlement selon vos modalités convenues.</p>
            <button
              className="btn btn-primary tracker-action-btn"
              onClick={handlePaymentSent}
              disabled={actionLoading}
            >
              {actionLoading ? '…' : '💳 Marquer le paiement envoyé'}
            </button>
          </div>
        )
      }

      case 'payment_confirmation': {
        if (userRole === 'editor' && !request?.payment_received_at) {
          return (
            <div className="tracker-action-area">
              <p className="tracker-info-text">Le créateur a marqué le paiement comme envoyé. Confirmez la réception.</p>
              <button
                className="btn btn-primary tracker-action-btn"
                onClick={handlePaymentReceived}
                disabled={actionLoading}
              >
                {actionLoading ? '…' : '✓ Paiement reçu'}
              </button>
            </div>
          )
        }
        if (userRole === 'creator') {
          return (
            <div className="tracker-action-area tracker-action-area--waiting">
              <p className="tracker-waiting-text">⏳ En attente de la confirmation du monteur…</p>
            </div>
          )
        }
        return null
      }

      case 'feedback': {
        const myReviewType = userRole === 'creator' ? 'creator_to_editor' : 'editor_to_creator'
        const myReview = reviews.find((r) => r.type === myReviewType)
        if (myReview) {
          return (
            <div className="tracker-action-area tracker-action-area--done">
              <p className="tracker-done-text">✓ Avis soumis</p>
              {userRole === 'creator' && onCloseProject && (
                <button
                  className="btn btn-primary tracker-action-btn"
                  style={{ marginTop: 12 }}
                  onClick={async () => {
                    if (!confirm('Mettre fin au projet ? La conversation sera archivée et le projet marqué comme terminé.')) return
                    setActionLoading(true)
                    await onCloseProject()
                    setActionLoading(false)
                  }}
                  disabled={actionLoading}
                >
                  🏁 Mettre fin au projet
                </button>
              )}
            </div>
          )
        }
        const isOptional = userRole === 'editor'
        return (
          <div className="tracker-action-area">
            {userRole === 'creator' && (
              <p className="tracker-info-text">Votre avis est requis pour clôturer le projet.</p>
            )}
            {isOptional && (
              <p className="tracker-info-text tracker-info-text--muted">Facultatif — partagez votre expérience.</p>
            )}
            <ReviewForm
              type={myReviewType}
              onSubmit={handleReview}
              loading={actionLoading}
            />
          </div>
        )
      }

      default:
        return null
    }
  }

  // ── Render ────────────────────────────────────────────────────
  if (!request) return null

  return (
    <div className="collab-tracker">
      <div className="collab-tracker-header">
        <span className="collab-tracker-title">Suivi de la collaboration</span>
        {offer?.title && <span className="collab-tracker-subtitle">{offer.title}</span>}
      </div>

      {/* Mission info line */}
      {(offer?.budget || offer?.mission_start || offer?.deadline) && (
        <div className="collab-tracker-meta">
          {offer.budget && <span>💰 {offer.budget} €</span>}
          {offer.mission_start && <span>📅 Début {new Date(offer.mission_start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>}
          {offer.deadline && <span>🗓 Délai {offer.deadline}</span>}
        </div>
      )}

      {/* Steps timeline */}
      <div className="collab-steps">
        {allSteps.map((step) => {
          const state = stepState(step.id)
          const isActive = state === 'active'
          const isDone = state === 'done'
          const completedAt = stepCompletedAt(step.id)

          // "Livrables" step: always show rounds list when there are rounds
          const showRounds = step.id === 'deliverables' && rounds.length > 0

          return (
            <div
              key={step.id}
              className={`tracker-step tracker-step--${state}`}
            >
              <div
                className="tracker-step-header"
                onClick={() => step.id === 'deliverables' && rounds.length > 0
                  ? setExpandedStep(expandedStep === step.id ? null : step.id)
                  : undefined
                }
              >
                <span className="tracker-step-dot">
                  {isDone ? '✓' : isActive ? '●' : '○'}
                </span>
                <span className="tracker-step-label">{step.icon} {step.label}</span>
                {completedAt && isDone && (
                  <span className="tracker-step-date">{completedAt}</span>
                )}
                {showRounds && (
                  <span className="tracker-step-expand">
                    {expandedStep === step.id ? '▲' : '▼'}
                  </span>
                )}
              </div>

              {/* Rounds list (collapsed by default unless active) */}
              {step.id === 'deliverables' && rounds.length > 0 && (isActive || expandedStep === step.id) && (
                <div className="tracker-rounds-list">
                  {rounds.map((round, idx) => (
                    <DeliverableRoundItem
                      key={round.id}
                      round={round}
                      isLatest={idx === rounds.length - 1}
                    />
                  ))}
                </div>
              )}

              {/* Active step action area */}
              {isActive && renderActionArea(step.id)}
            </div>
          )
        })}
      </div>

      {/* Reviews display (when closed or feedback step) */}
      {(collabStep === 'closed' || collabStep === 'feedback') && reviews.length > 0 && (
        <div className="tracker-reviews-section">
          <div className="tracker-section-title">Avis déposés</div>
          {reviews.map((r) => (
            <div key={r.id} className="tracker-review-item">
              <div className="tracker-review-header">
                <span>{r.type === 'creator_to_editor' ? '👤 Créateur → Monteur' : '🎬 Monteur → Créateur'}</span>
                {r.rating && (
                  <span className="tracker-review-rating">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)} {r.rating}/5
                  </span>
                )}
              </div>
              {r.comment && <p className="tracker-review-comment">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

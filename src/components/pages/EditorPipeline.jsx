import { useEffect, useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { AnimatedList, AnimatedItem } from '../ui/AnimatedList'

const STAGES = [
  { key: 'contact_demande',      label: 'Contact demande',      icon: '📩' },
  { key: 'conversation_en_cours', label: 'Conversation en cours', icon: '💬' },
  { key: 'contrat_soumis',       label: 'Contrat soumis',        icon: '📋' },
  { key: 'contrat_accepte',      label: 'Contrat accepte',       icon: '✅' },
  { key: 'mission_en_cours',     label: 'Mission en cours',      icon: '🎬' },
  { key: 'mission_archivee',     label: 'Mission archivee',      icon: '📦' },
]

function derivePipelineStage(request, offersForRequest) {
  if (request.status === 'refused') return 'mission_archivee'
  if (request.status === 'pending') return 'contact_demande'

  // request.status === 'accepted'
  const latestOffer = offersForRequest[0] // already sorted desc by created_at
  if (!latestOffer || latestOffer.status === 'refused') return 'conversation_en_cours'
  if (latestOffer.status === 'pending') return 'contrat_soumis'

  // offer.status === 'accepted'
  if (latestOffer.validated_by_editor && latestOffer.validated_by_creator) return 'mission_archivee'
  if (latestOffer.mission_start && new Date(latestOffer.mission_start) <= new Date()) return 'mission_en_cours'
  return 'contrat_accepte'
}

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return "a l'instant"
  if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`
  if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)}h`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function EditorPipeline() {
  const { user, goToChat } = useOnboarding()
  const {
    requests, pipelineOffers, messagingLoading,
    loadPipelineData, acceptRequest, refuseRequest,
    setActiveRequestId, acceptOffer,
  } = useMessaging()

  const [localOffers, setLocalOffers] = useState([])

  useEffect(() => {
    loadPipelineData().then(({ allOffers }) => {
      if (allOffers) setLocalOffers(allOffers)
    })
  }, [user])

  useEffect(() => {
    if (pipelineOffers.length > 0) setLocalOffers(pipelineOffers)
  }, [pipelineOffers])

  // Group requests by stage
  const grouped = {}
  STAGES.forEach((s) => { grouped[s.key] = [] })

  requests.forEach((req) => {
    const reqOffers = localOffers
      .filter((o) => o.request_id === req.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    const stage = derivePipelineStage(req, reqOffers)
    const latestOffer = reqOffers[0] || null
    grouped[stage].push({ request: req, offer: latestOffer, stage })
  })

  function handleAccept(requestId) {
    acceptRequest(requestId).then((ok) => {
      if (ok) {
        setActiveRequestId(requestId)
        goToChat(requestId)
      }
    })
  }

  function handleRefuse(requestId) {
    refuseRequest(requestId).then(() => {
      loadPipelineData().then(({ allOffers }) => {
        if (allOffers) setLocalOffers(allOffers)
      })
    })
  }

  function handleAcceptOffer(offerId) {
    acceptOffer(offerId).then(() => {
      loadPipelineData().then(({ allOffers }) => {
        if (allOffers) setLocalOffers(allOffers)
      })
    })
  }

  function openChat(requestId) {
    setActiveRequestId(requestId)
    goToChat(requestId)
  }

  return (
    <div className="pipeline-page">
      {messagingLoading ? (
        <div className="pipeline-empty">Chargement...</div>
      ) : requests.length === 0 ? (
        <div className="pipeline-empty">
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>Aucune demande pour l'instant.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>
            Les createurs te contacteront depuis le catalogue.
          </p>
        </div>
      ) : (
        <div className="pipeline-board">
          {STAGES.map((stage) => (
            <div className="pipeline-column" key={stage.key}>
              <div className="pipeline-column-header">
                <span>{stage.icon}</span>
                <span>{stage.label}</span>
                {grouped[stage.key].length > 0 && (
                  <span className="pipeline-column-count">{grouped[stage.key].length}</span>
                )}
              </div>
              <AnimatedList className="pipeline-column-cards">
                {grouped[stage.key].length === 0 ? (
                  <div className="pipeline-column-empty">Aucune demande</div>
                ) : (
                  grouped[stage.key].map(({ request, offer, stage: s }) => (
                    <AnimatedItem key={request.id}><PipelineCard
                      key={request.id}
                      request={request}
                      offer={offer}
                      stage={s}
                      onAccept={handleAccept}
                      onRefuse={handleRefuse}
                      onAcceptOffer={handleAcceptOffer}
                      onOpenChat={openChat}
                    /></AnimatedItem>
                  ))
                )}
              </AnimatedList>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PipelineCard({ request, offer, stage, onAccept, onRefuse, onAcceptOffer, onOpenChat }) {
  const creatorName = request.creator_name || 'Inconnu'
  const preview = offer?.title || request.initial_message || 'Aucun message'
  const isRefused = request.status === 'refused'

  return (
    <div className="pipeline-card">
      <div className="pipeline-card-top">
        <div className="pipeline-card-avatar">
          {creatorName[0].toUpperCase()}
        </div>
        <div className="pipeline-card-info">
          <div className="pipeline-card-name">{creatorName}</div>
          <div className="pipeline-card-preview">{preview}</div>
        </div>
      </div>

      <div className="pipeline-card-meta">
        {offer?.budget && <span className="pipeline-card-budget">{offer.budget} &euro;</span>}
        {isRefused && <span className="pipeline-card-refused">Contact refuse</span>}
        <span>{formatDate(request.created_at)}</span>
      </div>

      {/* Stage-specific actions */}
      {stage === 'contact_demande' && (
        <div className="pipeline-card-actions">
          <button className="pipeline-btn pipeline-btn--accept" onClick={(e) => { e.stopPropagation(); onAccept(request.id) }}>
            Accepter
          </button>
          <button className="pipeline-btn pipeline-btn--refuse" onClick={(e) => { e.stopPropagation(); onRefuse(request.id) }}>
            Refuser
          </button>
        </div>
      )}

      {stage === 'conversation_en_cours' && (
        <div className="pipeline-card-actions">
          <button className="pipeline-btn pipeline-btn--chat" onClick={(e) => { e.stopPropagation(); onOpenChat(request.id) }}>
            Acceder a la conversation
          </button>
        </div>
      )}

      {stage === 'contrat_soumis' && (
        <div className="pipeline-card-actions">
          <button className="pipeline-btn pipeline-btn--chat" onClick={(e) => { e.stopPropagation(); onOpenChat(request.id) }}>
            Voir le contrat
          </button>
          {offer && (
            <button className="pipeline-btn pipeline-btn--accept" onClick={(e) => { e.stopPropagation(); onAcceptOffer(offer.id) }}>
              Accepter le contrat
            </button>
          )}
        </div>
      )}

      {(stage === 'contrat_accepte' || stage === 'mission_en_cours') && (
        <div className="pipeline-card-actions">
          <button className="pipeline-btn pipeline-btn--chat" onClick={(e) => { e.stopPropagation(); onOpenChat(request.id) }}>
            Communiquer
          </button>
        </div>
      )}
    </div>
  )
}

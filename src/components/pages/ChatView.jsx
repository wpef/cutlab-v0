import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { useCollab } from '../../context/CollabContext'
import { useProjects } from '../../context/ProjectContext'
import ProjectProposalCard from '../messaging/ProjectProposalCard'
import CollabTracker from '../messaging/CollabTracker'
import CollabTrackerDrawer from '../messaging/CollabTrackerDrawer'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatView() {
  const { id: urlId } = useParams()
  const navigate = useNavigate()
  const { goToMessaging, goToEditorDetail, goToProjectDetail, userRole, user } = useOnboarding()
  const {
    activeRequestId, setActiveRequestId, requests,
    messages, fetchMessages,
    sendMessage,
    offers, loadOffers,
    loadRequests,
    acceptRequest, refuseRequest,
    acceptOffer, refuseOffer,
  } = useMessaging()
  const { loadCollabData } = useCollab()
  const { acceptApplication, refuseApplication } = useProjects()

  // Sync URL param → activeRequestId
  useEffect(() => {
    if (urlId && urlId !== activeRequestId) {
      setActiveRequestId(urlId)
    }
  }, [urlId])

  const requestId = urlId || activeRequestId

  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const messagesEndRef = useRef(null)

  const request = requests.find((r) => r.id === requestId)
  const offer = offers.find((o) => o.status === 'accepted') ?? null
  const otherName = request
    ? (userRole === 'creator' ? request.editor_name : request.creator_name)
    : 'Conversation'

  // Unified chronological timeline: messages + offers sorted by created_at
  const timeline = useMemo(() => [
    ...messages.map((m) => ({ ...m, _type: 'message' })),
    ...offers.map((o) => ({ ...o, _type: 'offer' })),
  ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)), [messages, offers])

  // Decide whether to show the collab tracker panel
  // Show whenever request exists (even pending), but tracker renders contextually
  const showTracker = !!request

  // Initial load
  useEffect(() => {
    if (!requestId) return
    loadRequests()
    fetchMessages(requestId)
    loadOffers(requestId)
    loadCollabData(requestId)
  }, [requestId])

  // Realtime: new messages trigger a fetch instead of polling 5s
  useEffect(() => {
    if (!requestId) return
    const channel = supabase
      .channel(`messages:${requestId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `contact_request_id=eq.${requestId}`,
      }, () => fetchMessages(requestId))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [requestId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    await sendMessage(requestId, text)
    await fetchMessages(requestId)
    setSending(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleAccept() {
    setActionLoading(true)
    if (request?.project_id) {
      // Project candidature: full cascade (fills project, refuses others, notifies)
      await acceptApplication(requestId, request.project_id)
      // acceptApplication already navigates to chat, so no extra redirect needed
    } else {
      // Direct contact: simple status update
      await acceptRequest(requestId)
    }
    setActionLoading(false)
  }

  async function handleRefuse() {
    setActionLoading(true)
    if (request?.project_id) {
      await refuseApplication(requestId)
    } else {
      await refuseRequest(requestId)
    }
    goToMessaging()
  }

  function handleTrackerUpdated() {
    loadCollabData(requestId)
    loadOffers(requestId)
    loadRequests()
  }

  if (!requestId || !request) {
    return (
      <div className="chat-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Aucune conversation sélectionnée.</p>
          <button className="catalog-header-btn" style={{ marginTop: 16 }} onClick={goToMessaging}>
            ← Retour à la messagerie
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`chat-with-tracker${showTracker ? '' : ' chat-with-tracker--no-panel'}`}>

      {/* ── Chat column ── */}
      <div className="chat-main">

        {/* Header */}
        <header className="chat-header">
          <button className="chat-back-btn" onClick={goToMessaging}>← Retour</button>
          {userRole === 'creator' && request?.editor_id ? (
            <button
              className="chat-header-name chat-header-name--link"
              onClick={() => goToEditorDetail(request.editor_id)}
              title="Voir le profil du monteur"
            >
              {otherName} <span className="chat-header-link-icon">↗</span>
            </button>
          ) : userRole === 'editor' && request?.project_id ? (
            <button
              className="chat-header-name chat-header-name--link"
              onClick={() => goToProjectDetail(request.project_id)}
              title="Voir la fiche projet"
            >
              {otherName} <span className="chat-header-link-icon">↗</span>
            </button>
          ) : (
            <div className="chat-header-name">{otherName}</div>
          )}
          <span className={`messaging-status messaging-status--${request.status}`}>
            {request.status === 'pending' ? 'En attente' : request.status === 'accepted' ? 'Acceptée' : 'Refusée'}
          </span>
          {/* Mobile: "Suivi" toggle button */}
          {showTracker && (
            <button
              className="chat-tracker-btn"
              onClick={() => setDrawerOpen(true)}
              title="Voir le suivi de la collaboration"
            >
              📋 Suivi
            </button>
          )}
        </header>

        {/* Action bar for pending requests — shown to the RECEIVER only.
            - Project candidature (project_id set): editor applied → creator accepts/refuses
            - Direct contact (no project_id): creator initiated → editor accepts/refuses */}
        {request.status === 'pending' && (() => {
          const isProjectCandidature = !!request.project_id
          return (isProjectCandidature && userRole === 'creator')
              || (!isProjectCandidature && userRole === 'editor')
        })() && (
          <div className="chat-request-actions">
            <div style={{ flex: 1, fontSize: 13, color: 'var(--text-muted)' }}>
              {request.project_id
                ? <><strong style={{ color: 'var(--text)' }}>{request.editor_name}</strong> a candidaté à votre projet.</>
                : <><strong style={{ color: 'var(--text)' }}>{request.creator_name}</strong> souhaite entrer en contact.</>
              }
            </div>
            <button className="chat-accept-btn" onClick={handleAccept} disabled={actionLoading}>
              ✓ Accepter
            </button>
            <button className="chat-refuse-btn" onClick={handleRefuse} disabled={actionLoading}>
              ✗ Refuser
            </button>
          </div>
        )}

        {/* Messages + Offers unified chronological timeline */}
        <div className="chat-messages">
          {/* Initial contact message (pinned at top, before timeline) */}
          {request.initial_message && (
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface)', padding: '3px 10px', borderRadius: 100, border: '1px solid var(--border)' }}>
                Premier message
              </span>
            </div>
          )}
          {request.initial_message && (
            <div className={`chat-bubble ${request.creator_id === user?.id ? 'chat-bubble--mine' : 'chat-bubble--theirs'}`}>
              {request.initial_message}
            </div>
          )}

          {/* Chronological timeline: messages + offer cards interleaved by created_at */}
          {timeline.map((item) =>
            item._type === 'offer' ? (
              <ProjectProposalCard
                key={item.id}
                offer={item}
                currentUserRole={userRole}
                isMine={item.creator_id === user?.id}
                onAccept={() => acceptOffer(item.id)}
                onRefuse={() => refuseOffer(item.id)}
              />
            ) : (
              <div key={item.id} className={`chat-bubble ${item.sender_id === user?.id ? 'chat-bubble--mine' : 'chat-bubble--theirs'}`}>
                {item.content}
                <div className="chat-bubble-time">{formatTime(item.created_at)}</div>
              </div>
            )
          )}

          {messages.length === 0 && offers.length === 0 && !request.initial_message && (
            <div className="chat-empty">Écrivez un message pour démarrer.</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="chat-input-bar">
          <textarea
            className="chat-input"
            placeholder={request.status === 'refused' ? 'Cette demande a été refusée.' : 'Écrivez un message…'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={request.status === 'refused'}
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={sending || !input.trim() || request.status === 'refused'}
          >
            {sending ? '...' : '↑'}
          </button>
        </div>
      </div>

      {/* ── Collab tracker panel (desktop) ── */}
      {showTracker && (
        <div className="collab-tracker-panel">
          <CollabTracker
            request={request}
            offer={offer}
            userRole={userRole}
            onRequestUpdated={handleTrackerUpdated}
            onAcceptOffer={acceptOffer}
            onRefuseOffer={refuseOffer}
            onAcceptRequest={acceptRequest}
            onRefuseRequest={refuseRequest}
          />
        </div>
      )}

      {/* ── Collab tracker drawer (mobile) ── */}
      <CollabTrackerDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        request={request}
        offer={offer}
        userRole={userRole}
        onRequestUpdated={handleTrackerUpdated}
        onAcceptOffer={acceptOffer}
        onRefuseOffer={refuseOffer}
        onAcceptRequest={acceptRequest}
        onRefuseRequest={refuseRequest}
      />
    </div>
  )
}

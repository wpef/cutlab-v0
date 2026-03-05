import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatView() {
  const { id: urlId } = useParams()
  const { goToMessaging, goToOfferForm, userRole, user } = useOnboarding()
  const {
    activeRequestId, setActiveRequestId, requests,
    messages, fetchMessages,
    sendMessage,
    offers, loadOffers,
    acceptRequest, refuseRequest,
    acceptOffer, refuseOffer,
  } = useMessaging()

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
  const messagesEndRef = useRef(null)

  const request = requests.find((r) => r.id === requestId)
  const otherName = request
    ? (userRole === 'creator' ? request.editor_name : request.creator_name)
    : 'Conversation'

  // Initial load + polling every 5s
  useEffect(() => {
    if (!requestId) return
    fetchMessages(requestId)
    loadOffers(requestId)

    const interval = setInterval(() => {
      fetchMessages(requestId)
      loadOffers(requestId)
    }, 5000)

    return () => clearInterval(interval)
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
    await acceptRequest(requestId)
    setActionLoading(false)
  }

  async function handleRefuse() {
    setActionLoading(true)
    await refuseRequest(requestId)
    goToMessaging()
  }

  if (!requestId || !request) {
    return (
      <div className="chat-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Aucune conversation sélectionnée.</p>
          <button className="catalog-header-btn" style={{ marginTop: 16 }} onClick={goToMessaging}>
            ← Messagerie
          </button>
        </div>
      </div>
    )
  }

  // Build combined timeline (messages + offers interspersed by date)
  const offersMap = {}
  offers.forEach((o) => { offersMap[o.id] = o })

  return (
    <div className="chat-page">

      {/* Header */}
      <header className="chat-header">
        <button className="chat-back-btn" onClick={goToMessaging}>← Retour</button>
        <div className="chat-header-name">{otherName}</div>
        <span className={`messaging-status messaging-status--${request.status}`}>
          {request.status === 'pending' ? 'En attente' : request.status === 'accepted' ? 'Acceptée' : 'Refusée'}
        </span>
      </header>

      {/* Editor action bar for pending requests */}
      {request.status === 'pending' && userRole === 'editor' && (
        <div className="chat-request-actions">
          <div style={{ flex: 1, fontSize: 13, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>{request.creator_name}</strong> souhaite te contacter.
          </div>
          <button className="chat-accept-btn" onClick={handleAccept} disabled={actionLoading}>
            ✓ Accepter
          </button>
          <button className="chat-refuse-btn" onClick={handleRefuse} disabled={actionLoading}>
            ✗ Refuser
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="chat-messages">
        {/* Initial contact message */}
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

        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`chat-bubble ${isMine ? 'chat-bubble--mine' : 'chat-bubble--theirs'}`}>
              {msg.content}
              <div className="chat-bubble-time">{formatTime(msg.created_at)}</div>
            </div>
          )
        })}

        {/* Offer cards in chat */}
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            isMine={offer.creator_id === user?.id}
            userRole={userRole}
            onAccept={() => acceptOffer(offer.id)}
            onRefuse={() => refuseOffer(offer.id)}
          />
        ))}

        {messages.length === 0 && offers.length === 0 && !request.initial_message && (
          <div className="chat-empty">Commence la conversation !</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        {userRole === 'creator' && request.status === 'accepted' && (
          <button className="chat-offer-btn" onClick={goToOfferForm} title="Envoyer une offre de projet">
            📋
          </button>
        )}
        <textarea
          className="chat-input"
          placeholder={request.status === 'refused' ? 'Cette demande a été refusée.' : 'Écris un message...'}
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
  )
}

function OfferCard({ offer, isMine, userRole, onAccept, onRefuse }) {
  const [loading, setLoading] = useState(false)

  async function handleAccept() {
    setLoading(true)
    await onAccept()
    setLoading(false)
  }

  async function handleRefuse() {
    setLoading(true)
    await onRefuse()
    setLoading(false)
  }

  const statusColor = offer.status === 'accepted' ? '#d4f000' : offer.status === 'refused' ? '#ff4d4d' : '#ffc800'

  return (
    <div className={`chat-offer-card ${isMine ? 'chat-offer-card--mine' : ''}`}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>📋 Offre de projet</div>
      <div className="chat-offer-title">{offer.title}</div>
      {offer.description && (
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6, lineHeight: 1.5 }}>
          {offer.description}
        </div>
      )}
      {offer.budget != null && (
        <div className="chat-offer-budget">{Number(offer.budget).toLocaleString('fr-FR')} €</div>
      )}
      {offer.deadline && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Deadline : {offer.deadline}</div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <span className="chat-offer-status" style={{ color: statusColor, fontSize: 12, fontWeight: 600 }}>
          {offer.status === 'pending' ? '⏳ En attente' : offer.status === 'accepted' ? '✓ Acceptée' : '✗ Refusée'}
        </span>
        {offer.status === 'pending' && userRole === 'editor' && (
          <div className="chat-offer-actions">
            <button className="chat-accept-btn" style={{ padding: '7px 14px', fontSize: 12 }} onClick={handleAccept} disabled={loading}>
              ✓ Accepter
            </button>
            <button className="chat-refuse-btn" style={{ padding: '7px 14px', fontSize: 12 }} onClick={handleRefuse} disabled={loading}>
              ✗ Refuser
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

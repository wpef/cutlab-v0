import { useEffect } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import EditorNav from '../ui/EditorNav'

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return "à l'instant"
  if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`
  if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)}h`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const STATUS_LABEL = { pending: 'En attente', accepted: 'Acceptée', refused: 'Refusée' }
const STATUS_CLASS = { pending: 'pending', accepted: 'accepted', refused: 'refused' }

export default function MessagingHub() {
  const { goToLanding, goToChat, goToCatalog, goToEditor, userRole, user } = useOnboarding()
  const { requests, messagingLoading, loadRequests, setActiveRequestId } = useMessaging()

  useEffect(() => {
    loadRequests()
  }, [user])

  function openRequest(requestId) {
    setActiveRequestId(requestId)
    goToChat(requestId)
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const activeRequests  = requests.filter((r) => r.status !== 'pending')

  return (
    <div className="messaging-page">

      {userRole === 'editor' ? (
        <EditorNav active="messaging" />
      ) : (
        <header className="messaging-header">
          <div className="messaging-header-logo" onClick={goToLanding}>CUT<span>LAB</span></div>
          <div className="messaging-header-title">Messagerie</div>
          <div className="messaging-header-actions">
            <button className="catalog-header-btn" onClick={goToCatalog}>+ Nouveau contact</button>
          </div>
        </header>
      )}

      <div className="messaging-content">

        {messagingLoading ? (
          <div className="messaging-empty">Chargement...</div>
        ) : requests.length === 0 ? (
          <div className="messaging-empty">
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <p>Aucune conversation pour l'instant.</p>
            {userRole === 'creator' && (
              <button className="catalog-header-btn" style={{ marginTop: 20 }} onClick={goToCatalog}>
                Trouver un monteur →
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Pending requests for editors */}
            {userRole === 'editor' && pendingRequests.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div className="messaging-section-title">
                  Demandes en attente
                  <span className="messaging-badge" style={{ marginLeft: 8 }}>{pendingRequests.length}</span>
                </div>
                <div className="messaging-list">
                  {pendingRequests.map((r) => (
                    <RequestRow key={r.id} request={r} userRole={userRole} userId={user?.id} onOpen={openRequest} />
                  ))}
                </div>
              </div>
            )}

            {/* All conversations */}
            {activeRequests.length > 0 && (
              <div>
                <div className="messaging-section-title">
                  {userRole === 'editor' ? 'Conversations actives' : 'Mes demandes'}
                </div>
                <div className="messaging-list">
                  {activeRequests.map((r) => (
                    <RequestRow key={r.id} request={r} userRole={userRole} userId={user?.id} onOpen={openRequest} />
                  ))}
                </div>
              </div>
            )}

            {/* Creators see all requests in one list */}
            {userRole === 'creator' && pendingRequests.length > 0 && activeRequests.length === 0 && (
              <div>
                <div className="messaging-section-title">Mes demandes</div>
                <div className="messaging-list">
                  {pendingRequests.map((r) => (
                    <RequestRow key={r.id} request={r} userRole={userRole} userId={user?.id} onOpen={openRequest} />
                  ))}
                </div>
              </div>
            )}

            {userRole === 'creator' && pendingRequests.length > 0 && activeRequests.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div className="messaging-section-title">Demandes en attente</div>
                <div className="messaging-list">
                  {pendingRequests.map((r) => (
                    <RequestRow key={r.id} request={r} userRole={userRole} userId={user?.id} onOpen={openRequest} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function RequestRow({ request, userRole, userId, onOpen }) {
  const otherName = userRole === 'creator' ? request.editor_name : request.creator_name
  const preview = request.initial_message || 'Aucun message'

  return (
    <div className="messaging-item" onClick={() => onOpen(request.id)}>
      <div className="messaging-item-avatar">
        {otherName ? otherName[0].toUpperCase() : '?'}
      </div>
      <div className="messaging-item-info">
        <div className="messaging-item-name">{otherName || 'Inconnu'}</div>
        <div className="messaging-item-preview">{preview}</div>
      </div>
      <div className="messaging-item-meta">
        <span className={`messaging-status messaging-status--${STATUS_CLASS[request.status]}`}>
          {STATUS_LABEL[request.status]}
        </span>
        <span>{formatDate(request.created_at)}</span>
      </div>
    </div>
  )
}

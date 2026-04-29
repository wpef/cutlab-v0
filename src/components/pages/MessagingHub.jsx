import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { AnimatedList, AnimatedItem } from '../ui/AnimatedList'

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
  const { goToChat, goToCatalog, userRole, user } = useOnboarding()
  const { requests, messagingLoading, loadRequests, setActiveRequestId } = useMessaging()
  // projectId → title map for editor conversation list
  const [projectTitles, setProjectTitles] = useState({})

  useEffect(() => { document.title = 'CUTLAB — Messages' }, [])

  useEffect(() => {
    loadRequests()
  }, [user])

  // Batch-fetch project titles for requests linked to a project (editor view)
  useEffect(() => {
    if (userRole !== 'editor' || requests.length === 0) return
    const ids = [...new Set(requests.map((r) => r.project_id).filter(Boolean))]
    if (ids.length === 0) return
    supabase.from('projects').select('id, title').in('id', ids)
      .then(({ data }) => {
        if (!data) return
        const map = {}
        data.forEach((p) => { map[p.id] = p.title })
        setProjectTitles(map)
      })
  }, [requests, userRole])

  function openRequest(requestId) {
    setActiveRequestId(requestId)
    goToChat(requestId)
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const activeRequests  = requests.filter((r) => r.status !== 'pending')

  return (
    <div className="messaging-page">

      <div className="messaging-content">

        {messagingLoading ? (
          <div className="messaging-empty">Chargement en cours...</div>
        ) : requests.length === 0 ? (
          <div className="messaging-empty">
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <p>Aucune conversation pour le moment.</p>
            {userRole === 'creator' && (
              <button className="catalog-header-btn" style={{ marginTop: 20 }} onClick={goToCatalog}>
                Parcourir les monteurs →
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
                <AnimatedList className="messaging-list">
                  {pendingRequests.map((r) => (
                    <RequestRow key={r.id} request={r} userRole={userRole} userId={user?.id} projectTitles={projectTitles} onOpen={openRequest} />
                  ))}
                </AnimatedList>
              </div>
            )}

            {/* All conversations */}
            {activeRequests.length > 0 && (
              <div>
                <div className="messaging-section-title">
                  {userRole === 'editor' ? 'Conversations actives' : 'Mes demandes'}
                </div>
                <AnimatedList className="messaging-list">
                  {activeRequests.map((r) => (
                    <RequestRow key={r.id} request={r} userRole={userRole} userId={user?.id} projectTitles={projectTitles} onOpen={openRequest} />
                  ))}
                </AnimatedList>
              </div>
            )}

            {/* Creators see all requests in one list */}
            {userRole === 'creator' && pendingRequests.length > 0 && activeRequests.length === 0 && (
              <div>
                <div className="messaging-section-title">Mes demandes</div>
                <AnimatedList className="messaging-list">
                  {pendingRequests.map((r) => (
                    <RequestRow key={r.id} request={r} userRole={userRole} userId={user?.id} projectTitles={projectTitles} onOpen={openRequest} />
                  ))}
                </AnimatedList>
              </div>
            )}

            {userRole === 'creator' && pendingRequests.length > 0 && activeRequests.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div className="messaging-section-title">Demandes en attente</div>
                <AnimatedList className="messaging-list">
                  {pendingRequests.map((r) => (
                    <RequestRow key={r.id} request={r} userRole={userRole} userId={user?.id} projectTitles={projectTitles} onOpen={openRequest} />
                  ))}
                </AnimatedList>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function RequestRow({ request, userRole, userId, projectTitles, onOpen }) {
  // For editors: show project title when available, fallback to creator_name
  const otherName = userRole === 'creator'
    ? request.editor_name
    : (request.project_id && projectTitles?.[request.project_id]) || request.creator_name
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

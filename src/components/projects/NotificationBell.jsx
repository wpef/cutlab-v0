import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOnboarding } from '../../context/OnboardingContext'
import { useProjects } from '../../context/ProjectContext'

const NOTIF_ICONS = {
  application_received: '📩',
  application_accepted: '✅',
  application_refused: '❌',
  application_withdrawn: '↩️',
  project_filled: '🏁',
  project_cancelled: '🚫',
  project_modified: '📝',
}

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return "à l'instant"
  if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`
  if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)}h`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function notifText(n) {
  switch (n.type) {
    case 'application_received': return <><strong>{n.actor_name}</strong> a candidaté à <strong>{n.project_title}</strong></>
    case 'application_accepted': return <>Votre candidature à <strong>{n.project_title}</strong> a été acceptée</>
    case 'application_refused': return <>Votre candidature à <strong>{n.project_title}</strong> a été refusée</>
    case 'application_withdrawn': return <><strong>{n.actor_name}</strong> a retiré sa candidature de <strong>{n.project_title}</strong></>
    case 'project_filled': return <>Le projet <strong>{n.project_title}</strong> a été pourvu</>
    case 'project_cancelled': return <>Le projet <strong>{n.project_title}</strong> a été annulé</>
    case 'project_modified': return <>Le projet <strong>{n.project_title}</strong> a été modifié</>
    default: return 'Notification'
  }
}

export default function NotificationBell() {
  const { goToProjectDetail, goToChat } = useOnboarding()
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useProjects()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Load notifications on first open
  useEffect(() => {
    if (open) fetchNotifications()
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function handleClick(n) {
    markAsRead(n.id)
    setOpen(false)
    if (n.type === 'application_accepted' && n.request_id) {
      goToChat(n.request_id)
    } else if (n.project_id) {
      goToProjectDetail(n.project_id)
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="notification-bell" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="notification-dropdown-header">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead}>Tout marquer comme lu</button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="notification-empty">Aucune notification</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-item ${!n.read ? 'notification-item--unread' : ''}`}
                  onClick={() => handleClick(n)}
                >
                  <span className="notification-item-icon">{NOTIF_ICONS[n.type] || '🔔'}</span>
                  <div className="notification-item-content">
                    <div className="notification-item-text">{notifText(n)}</div>
                    <div className="notification-item-time">{formatTime(n.created_at)}</div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

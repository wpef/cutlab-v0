import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useOnboarding } from '../../context/OnboardingContext'

const EDITOR_TABS = [
  { path: '/projects',  label: 'Projets',    icon: '📋' },
  { path: '/editor',    label: 'Profil',     icon: '✏️' },
  { path: '/messaging', label: 'Messages',   icon: '💬' },
  { path: '/pipeline',  label: 'Pipeline',   icon: '📊' },
]

const CREATOR_TABS = [
  { path: '/my-projects', label: 'Projets',   icon: '📋' },
  { path: '/catalog',     label: 'Monteurs',  icon: '🔍' },
  { path: '/messaging',   label: 'Messages',  icon: '💬' },
]

export default function BottomNav() {
  const { user, userRole, signOut } = useOnboarding()
  if (!user) return null
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = userRole === 'creator' ? CREATOR_TABS : EDITOR_TABS

  return (
    <nav className="bottom-nav">
      {tabs.map((t) => {
        const isActive = location.pathname === t.path || location.pathname.startsWith(t.path + '/')
        return (
          <button
            key={t.path}
            className={`bottom-nav-tab${isActive ? ' bottom-nav-tab--active' : ''}`}
            onClick={() => navigate(t.path)}
            style={{ position: 'relative' }}
          >
            {isActive && (
              <motion.div
                className="bottom-nav-indicator"
                layoutId="bottom-nav-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="bottom-nav-tab-icon">{t.icon}</span>
            <span className="bottom-nav-tab-label">{t.label}</span>
          </button>
        )
      })}
      {userRole === 'creator' && (
        <>
          <button
            className="bottom-nav-tab bottom-nav-tab--action"
            onClick={() => navigate('/project/new')}
            style={{ position: 'relative' }}
          >
            <span className="bottom-nav-tab-icon">＋</span>
            <span className="bottom-nav-tab-label">Créer</span>
          </button>
          <button className="bottom-nav-tab bottom-nav-tab--logout" onClick={signOut}>
            <span className="bottom-nav-tab-icon">↪</span>
            <span className="bottom-nav-tab-label">Quitter</span>
          </button>
        </>
      )}
    </nav>
  )
}

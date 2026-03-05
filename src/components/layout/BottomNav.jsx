import { useLocation, useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'

const EDITOR_TABS = [
  { path: '/projects',  label: 'Projets',    icon: '📋' },
  { path: '/editor',    label: 'Profil',     icon: '✏️' },
  { path: '/messaging', label: 'Messages',   icon: '💬' },
  { path: '/pipeline',  label: 'Pipeline',   icon: '📊' },
]

const CREATOR_TABS = [
  { path: '/catalog',   label: 'Catalogue',  icon: '🔍' },
  { path: '/messaging', label: 'Messages',   icon: '💬' },
]

export default function BottomNav() {
  const { userRole } = useOnboarding()
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
          >
            <span className="bottom-nav-tab-icon">{t.icon}</span>
            <span className="bottom-nav-tab-label">{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

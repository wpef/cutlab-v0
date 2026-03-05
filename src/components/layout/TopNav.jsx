import { useLocation, useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'

const EDITOR_TABS = [
  { path: '/projects',  label: 'Mes projets', icon: '📋' },
  { path: '/editor',    label: 'Mon profil',  icon: '✏️' },
  { path: '/messaging', label: 'Messagerie',  icon: '💬' },
  { path: '/pipeline',  label: 'Pipeline',    icon: '📊' },
  { path: '/catalog',   label: 'Catalogue',   icon: '🔍' },
]

const CREATOR_TABS = [
  { path: '/catalog',   label: 'Catalogue',   icon: '🔍' },
  { path: '/messaging', label: 'Messagerie',  icon: '💬' },
]

export default function TopNav() {
  const { userRole, signOut, goToHome } = useOnboarding()
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = userRole === 'creator' ? CREATOR_TABS : EDITOR_TABS

  return (
    <header className="top-nav">
      <div className="top-nav-logo" onClick={goToHome}>CUT<span>LAB</span></div>
      <nav className="top-nav-tabs">
        {tabs.map((t) => {
          const isActive = location.pathname === t.path || location.pathname.startsWith(t.path + '/')
          return (
            <button
              key={t.path}
              className={`top-nav-tab${isActive ? ' top-nav-tab--active' : ''}`}
              onClick={() => navigate(t.path)}
            >
              <span className="top-nav-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </nav>
      <button className="top-nav-logout" onClick={signOut}>Deconnexion</button>
    </header>
  )
}

import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  const { user, userRole, signOut, goToHome, goToOnboarding, goToCreatorSignup } = useOnboarding()
  const location = useLocation()
  const navigate = useNavigate()
  const tabs = userRole === 'creator' ? CREATOR_TABS : EDITOR_TABS

  if (!user) {
    return (
      <header className="top-nav">
        <div className="top-nav-logo" onClick={() => navigate('/')}>CUT<span>LAB</span></div>
        <nav className="top-nav-tabs" />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="top-nav-logout" onClick={() => goToCreatorSignup(null)}>Je cherche un monteur</button>
          <button className="top-nav-logout" onClick={goToOnboarding}>Je suis monteur</button>
        </div>
      </header>
    )
  }

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
              style={{ position: 'relative' }}
            >
              <span className="top-nav-tab-icon">{t.icon}</span>
              {t.label}
              {isActive && (
                <motion.div
                  className="top-nav-indicator"
                  layoutId="top-nav-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </nav>
      <button className="top-nav-logout" onClick={signOut}>Deconnexion</button>
    </header>
  )
}

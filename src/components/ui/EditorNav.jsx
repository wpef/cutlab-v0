import { useOnboarding } from '../../context/OnboardingContext'

const TABS = [
  { key: 'editor',    label: 'Mon profil',  icon: '✏️',  go: 'goToEditor' },
  { key: 'messaging', label: 'Messagerie',  icon: '💬', go: 'goToMessaging' },
  { key: 'pipeline',  label: 'Mes projets', icon: '📋', go: 'goToPipeline' },
]

export default function EditorNav({ active }) {
  const ctx = useOnboarding()

  return (
    <header className="editor-nav">
      <div className="editor-nav-logo" onClick={ctx.goToLanding}>CUT<span>LAB</span></div>
      <nav className="editor-nav-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`editor-nav-tab${active === t.key ? ' editor-nav-tab--active' : ''}`}
            onClick={ctx[t.go]}
          >
            <span className="editor-nav-tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  )
}

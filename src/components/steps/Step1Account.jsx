import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import StepNav from '../ui/StepNav'

export default function Step1Account() {
  const {
    goToStep, signUpUser, signInUser, signInWithGoogle, loginAndRedirect,
    clearAuthError, updateFormData, loadProfile, authLoading, authError,
    startDemoOnboarding,
  } = useOnboarding()

  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [demoLoading, setDemoLoading] = useState(false)

  function switchMode(m) {
    setMode(m)
    setLocalError('')
    clearAuthError()
  }

  async function handleDemo() {
    setLocalError('')
    setDemoLoading(true)
    const ok = await startDemoOnboarding()
    if (!ok) setLocalError('Impossible de créer le compte démo. Réessaie.')
    setDemoLoading(false)
  }

  async function handleNext() {
    setLocalError('')
    if (!email) { setLocalError('Saisis ton adresse email.'); return }
    if (password.length < 8) { setLocalError('Le mot de passe doit faire au moins 8 caractères.'); return }

    if (mode === 'login') {
      const ok = await loginAndRedirect(email, password)
      if (!ok) setLocalError('Email ou mot de passe incorrect.')
    } else {
      const ok = await signUpUser(email, password)
      if (ok) goToStep(2)
    }
  }

  const errorMsg = localError || authError

  return (
    <div className="step-screen">

      {/* Auth tabs */}
      <div className="auth-tabs">
        <button
          className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`}
          onClick={() => switchMode('signup')}
        >
          Créer un compte
        </button>
        <button
          className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
          onClick={() => switchMode('login')}
        >
          Se connecter
        </button>
      </div>

      <StepHeader
        tag={mode === 'signup' ? 'Étape 1 sur 8' : 'Connexion'}
        title={mode === 'signup' ? 'Crée ton compte' : 'Connecte-toi'}
        desc={mode === 'signup'
          ? '30 secondes et c\'est parti. Pas besoin de CB, pas d\'engagement.'
          : 'Retrouve ton profil et tes projets.'}
      />

      <FormGroup label="Email">
        <input
          type="email"
          placeholder="ton@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>

      <FormGroup label="Mot de passe">
        <input
          type="password"
          placeholder="8 caractères minimum"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormGroup>

      {errorMsg && (
        <div style={{ fontSize: 13, color: '#ff4d4d', marginBottom: 12, padding: '10px 14px', background: 'rgba(255,77,77,0.07)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,77,77,0.2)' }}>
          {errorMsg}
        </div>
      )}

      <HintBox>🔒 Tes données sont sécurisées et ne seront jamais revendues.</HintBox>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          Ou continue avec
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            className="btn btn-ghost"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={signInWithGoogle}
          >
            G Google
          </button>
          <button
            className="btn btn-ghost"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            🍎 Apple
          </button>
        </div>
      </div>

      <StepNav
        onNext={handleNext}
        nextLabel={
          authLoading
            ? (mode === 'login' ? 'Connexion...' : 'Création...')
            : (mode === 'login' ? 'Se connecter →' : 'Continuer →')
        }
      />

      {/* Demo — always visible */}
      <div className="demo-section">
        <button
          className="btn-demo"
          onClick={handleDemo}
          disabled={demoLoading || authLoading}
        >
          {demoLoading ? '...' : 'Tester l\'onboarding (compte démo)'}
        </button>
      </div>
    </div>
  )
}

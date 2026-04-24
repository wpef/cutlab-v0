import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import StepNav from '../ui/StepNav'

export default function Step1Account() {
  const {
    goToStep, signUpUser, signInUser, signInWithGoogle, signInWithApple, loginAndRedirect,
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
        tag={mode === 'signup' ? 'Étape 1 sur 7' : 'Connexion'}
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
            onClick={() => signInWithGoogle('editor')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09a7.17 7.17 0 0 1 0-4.17V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          {/* TODO: enable when Apple Developer account is set up
          <button
            className="btn btn-ghost"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={() => signInWithApple('editor')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.11 4.45-3.74 4.25z"/></svg>
            Apple
          </button>
          */}
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

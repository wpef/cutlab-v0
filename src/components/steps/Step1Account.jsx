import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_FORM } from '../../lib/demoData'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import StepNav from '../ui/StepNav'

const IS_DEV = import.meta.env.DEV

export default function Step1Account() {
  const { goToStep, signUpUser, signInUser, signInWithGoogle, clearAuthError, updateFormData, authLoading, authError } = useOnboarding()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [demoLoading, setDemoLoading] = useState(false)

  async function handleDemo() {
    setLocalError('')
    setDemoLoading(true)

    // 1) Try to sign in (account already exists from a previous test)
    let ok = await signInUser(DEMO_EMAIL, DEMO_PASSWORD)

    if (!ok) {
      clearAuthError()
      // 2) First time: try to create the account
      ok = await signUpUser(DEMO_EMAIL, DEMO_PASSWORD)

      if (!ok) {
        // Account exists but sign-in failed → email confirmation is ON in Supabase
        clearAuthError()
        setLocalError(
          'Email de confirmation requis. Dans Supabase : Authentication → Email → désactive "Confirm email".'
        )
        setDemoLoading(false)
        return
      }
    }

    updateFormData({ ...DEMO_FORM, email: DEMO_EMAIL })
    goToStep(2)
    setDemoLoading(false)
  }

  async function handleNext() {
    setLocalError('')
    if (!email) { setLocalError('Saisis ton adresse email.'); return }
    if (password.length < 8) { setLocalError('Le mot de passe doit faire au moins 8 caractères.'); return }
    const ok = await signUpUser(email, password)
    if (ok) goToStep(2)
  }

  const errorMsg = localError || authError

  return (
    <div className="step-screen">

      {IS_DEV && (
        <div className="demo-bar">
          <div className="demo-bar-label">DEV</div>
          <div className="demo-bar-info">
            <span>{DEMO_EMAIL}</span>
            <span style={{ color: 'var(--text-muted)' }}>·</span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{DEMO_PASSWORD}</span>
          </div>
          <button className="demo-bar-btn" onClick={handleDemo} disabled={demoLoading || authLoading}>
            {demoLoading ? '...' : '⚡ Connexion démo'}
          </button>
        </div>
      )}

      <StepHeader
        tag="Étape 1 sur 8"
        title="Crée ton compte"
        desc="30 secondes et c'est parti. Pas besoin de CB, pas d'engagement."
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

      <StepNav onNext={handleNext} nextLabel={authLoading ? 'Création...' : 'Continuer →'} />
    </div>
  )
}

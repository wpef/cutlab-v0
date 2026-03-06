import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { DEMO_CREATOR_EMAIL, DEMO_CREATOR_PASSWORD } from '../../lib/demoData'

export default function CreatorSignup() {
  const {
    goToCatalog, goToHome, goToOnboarding, goToMessaging,
    pendingEditor, clearPendingEditor, formData, user,
    signInUser, loginAndRedirect, loginDemoCreator, loadProfile, clearAuthError, authLoading, authError,
  } = useOnboarding()
  const { signUpCreator, signupError, signupLoading, sendContactRequest } = useMessaging()

  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [demoLoading, setDemoLoading] = useState(false)

  // Contact message step (shown after signup when pendingEditor is set)
  const [signedUp, setSignedUp] = useState(false)
  const [contactMsg, setContactMsg] = useState('')
  const [contactLoading, setContactLoading] = useState(false)

  function switchMode(m) {
    setMode(m)
    setLocalError('')
    clearAuthError()
  }

  async function handleSignup() {
    setLocalError('')
    if (!firstName.trim()) { setLocalError('Entre ton prénom.'); return }
    if (!email) { setLocalError('Entre ton adresse email.'); return }
    if (password.length < 8) { setLocalError('Le mot de passe doit faire au moins 8 caractères.'); return }

    const result = await signUpCreator(firstName.trim(), email, password)
    if (result.error) {
      setLocalError(result.error)
      return
    }
    if (pendingEditor) {
      setSignedUp(true)
    } else {
      goToCatalog()
    }
  }

  async function handleLogin() {
    setLocalError('')
    if (!email) { setLocalError('Entre ton adresse email.'); return }
    if (password.length < 8) { setLocalError('Le mot de passe doit faire au moins 8 caractères.'); return }

    if (pendingEditor) {
      // Login then show contact step
      const ok = await signInUser(email, password)
      if (!ok) { setLocalError('Email ou mot de passe incorrect.'); return }
      await loadProfile()
      setSignedUp(true)
    } else {
      const ok = await loginAndRedirect(email, password)
      if (!ok) setLocalError('Email ou mot de passe incorrect.')
    }
  }

  async function handleDemo() {
    setLocalError('')
    setDemoLoading(true)
    // signUpCreator handles sign-in (existing) or sign-up (new) + creates creator profile
    const result = await signUpCreator('Alex', DEMO_CREATOR_EMAIL, DEMO_CREATOR_PASSWORD)
    setDemoLoading(false)
    if (result.error) { setLocalError(result.error); return }
    if (pendingEditor) {
      setSignedUp(true)
    } else {
      goToCatalog()
    }
  }

  async function handleSendContact() {
    if (!contactMsg.trim()) return
    setContactLoading(true)
    const creatorName = formData.firstName || firstName || 'Créateur'
    const ok = await sendContactRequest(
      pendingEditor.id,
      contactMsg.trim(),
      creatorName,
      pendingEditor.name,
    )
    setContactLoading(false)
    if (ok) {
      clearPendingEditor()
      goToMessaging()
    } else {
      setLocalError('Erreur lors de l\'envoi. Réessaie.')
    }
  }

  const errorMsg = localError || signupError || (mode === 'login' ? authError : null)

  // -- Contact step (after signup/login) --
  if (signedUp && pendingEditor) {
    return (
      <div className="creator-signup-page">
        <header className="creator-signup-header">
          <div className="creator-signup-logo">CUT<span>LAB</span></div>
        </header>
        <div className="creator-signup-content">
          <div style={{ marginBottom: 32 }}>
            <div className="step-tag">Compte créé ✓</div>
            <h1>Contacter {pendingEditor.name || 'ce monteur'}</h1>
            <p className="step-desc">Envoie un premier message pour te présenter et décrire ton projet.</p>
          </div>

          <div className="form-group">
            <label>Ton message</label>
            <textarea
              placeholder={`Bonjour, je suis ${formData.firstName || firstName} et je cherche un monteur pour...`}
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              style={{ minHeight: 120 }}
            />
          </div>

          {errorMsg && <div className="step-error">{errorMsg}</div>}

          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px 0', fontSize: 15, marginTop: 8 }}
            onClick={handleSendContact}
            disabled={contactLoading || !contactMsg.trim()}
          >
            {contactLoading ? 'Envoi...' : 'Envoyer la demande →'}
          </button>
          <button
            className="btn-skip"
            style={{ display: 'block', margin: '16px auto 0', textAlign: 'center' }}
            onClick={() => { clearPendingEditor(); goToCatalog() }}
          >
            Passer pour l'instant
          </button>
        </div>
      </div>
    )
  }

  // -- Already logged in --
  if (user) {
    return (
      <div className="creator-signup-page">
        <header className="creator-signup-header">
          <div className="creator-signup-logo">CUT<span>LAB</span></div>
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={goToCatalog}>← Catalogue</button>
        </header>
        <div className="creator-signup-content" style={{ textAlign: 'center', paddingTop: 80 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Tu es déjà connecté</h1>
          <p className="step-desc" style={{ marginBottom: 32 }}>Tu peux retourner au catalogue pour contacter des monteurs.</p>
          <button className="btn btn-primary" style={{ padding: '14px 32px' }} onClick={goToCatalog}>
            Voir les monteurs →
          </button>
          <button
            className="btn btn-ghost"
            style={{ display: 'block', margin: '16px auto 0', fontSize: 13 }}
            onClick={goToHome}
          >
            ← Retour
          </button>
        </div>
      </div>
    )
  }

  // -- Signup/Login form --
  return (
    <div className="creator-signup-page">
      <header className="creator-signup-header">
        <div className="creator-signup-logo" onClick={goToCatalog} style={{ cursor: 'pointer' }}>
          CUT<span>LAB</span>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={goToCatalog}>← Catalogue</button>
      </header>

      <div className="creator-signup-content">

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

        <div className="step-header">
          <div className="step-tag">Pour les créateurs</div>
          <h1>{mode === 'signup' ? 'Crée ton compte gratuit' : 'Connecte-toi'}</h1>
          <p className="step-desc">
            {mode === 'signup'
              ? (pendingEditor
                  ? `Inscris-toi pour contacter ${pendingEditor.name || 'ce monteur'}.`
                  : 'Accède au catalogue et contacte les monteurs directement.')
              : 'Retrouve ton compte et tes conversations.'}
          </p>
        </div>

        {mode === 'signup' && (
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              placeholder="Ton prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="8 caractères minimum"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && <div className="step-error">{errorMsg}</div>}

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px 0', fontSize: 15, marginTop: 8 }}
          onClick={mode === 'login' ? handleLogin : handleSignup}
          disabled={signupLoading || authLoading}
        >
          {(signupLoading || authLoading)
            ? (mode === 'login' ? 'Connexion...' : 'Création...')
            : (mode === 'login' ? 'Se connecter →' : 'Créer mon compte →')}
        </button>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
          Tu es monteur ?{' '}
          <span
            style={{ color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => { clearPendingEditor(); goToOnboarding() }}
          >
            Inscris-toi comme monteur
          </span>
        </p>

        {/* Demo — always visible */}
        <div className="demo-section">
          <button
            className="btn-demo"
            onClick={handleDemo}
            disabled={demoLoading || signupLoading || authLoading}
          >
            {demoLoading ? '...' : 'Rejoindre le compte démo créateur'}
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import EditorCard from '../ui/EditorCard'
import PageTitle from '../layout/PageTitle'

export default function Catalog() {
  const {
    goToLanding, goToOnboarding, goToEditor, goToCreatorSignup, goToMessaging, goToProjects, goToHome, signOut,
    user, userRole,
  } = useOnboarding()
  const { requests, loadRequests, sendContactRequest } = useMessaging()

  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactingId, setContactingId] = useState(null) // editor profile id
  const [contactMsg, setContactMsg] = useState('')
  const [contactSending, setContactSending] = useState(false)
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, first_name, last_name, username, availability, skills, assigned_level, bio, languages, avatar_url, presentation_video_url, experience, formats, hourly_rate')
      .eq('status', 'published')
      .then(({ data }) => {
        setProfiles(data ?? [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (user) loadRequests()
  }, [user])

  const pendingCount = requests.filter(
    (r) => r.status === 'pending' && userRole === 'editor' && r.editor_id === user?.id
  ).length

  function handleContact(profile) {
    const displayName = [profile.first_name, profile.last_name ? profile.last_name[0] + '.' : ''].filter(Boolean).join(' ') || 'Monteur'
    if (!user) {
      // Not logged in → creator signup
      goToCreatorSignup(profile.id, displayName)
      return
    }
    if (userRole === 'editor') {
      // Editors manage their own requests
      goToMessaging()
      return
    }
    // Creator: open inline contact form
    setContactingId(profile.id)
    setContactMsg('')
    setContactError('')
  }

  async function handleSendContact(profile) {
    if (!contactMsg.trim()) return
    setContactSending(true)
    setContactError('')
    const creatorName = user ? (user.email?.split('@')[0] || 'Créateur') : 'Créateur'
    const editorName = [profile.first_name, profile.last_name ? profile.last_name[0] + '.' : ''].filter(Boolean).join(' ') || 'Monteur'
    const ok = await sendContactRequest(profile.id, contactMsg.trim(), creatorName, editorName)
    setContactSending(false)
    if (ok) {
      setContactingId(null)
      goToMessaging()
    } else {
      setContactError('Erreur lors de l\'envoi. Réessaie.')
    }
  }

  return (
    <div className="catalog-page">

      <PageTitle title="Les monteurs">
        {!user && (
          <>
            <button className="catalog-header-btn" onClick={() => goToCreatorSignup(null)}>
              Je cherche un monteur
            </button>
            <button className="catalog-header-btn" onClick={goToOnboarding}>Je suis monteur →</button>
          </>
        )}
      </PageTitle>

      <div className="catalog-content">
        {loading ? (
          <div className="catalog-loading">Chargement...</div>
        ) : profiles.length === 0 ? (
          <div className="catalog-empty">
            <div className="catalog-empty-icon">🎬</div>
            <h3>Aucun monteur pour l'instant</h3>
            <p>Les premiers profils arrivent bientôt.</p>
            <button className="catalog-header-btn" style={{ marginTop: 24 }} onClick={goToOnboarding}>
              Être le premier →
            </button>
          </div>
        ) : (
          <>
            <div className="catalog-meta">{profiles.length} monteur{profiles.length > 1 ? 's' : ''}</div>
            <div className="catalog-grid">
              {profiles.map((p) => (
                <ProfileCard
                  key={p.id}
                  profile={p}
                  onContact={() => handleContact(p)}
                  isContacting={contactingId === p.id}
                  contactMsg={contactMsg}
                  onContactMsgChange={setContactMsg}
                  onSendContact={() => handleSendContact(p)}
                  onCancelContact={() => setContactingId(null)}
                  contactSending={contactSending}
                  contactError={contactError}
                  userRole={userRole}
                />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  )
}

function ProfileCard({
  profile, onContact, isContacting,
  contactMsg, onContactMsgChange, onSendContact, onCancelContact,
  contactSending, contactError, userRole,
}) {
  return (
    <EditorCard profile={profile}>

      {/* Contact button */}
      {!isContacting && (
        <button className="catalog-contact-btn" onClick={onContact}>
          {userRole === 'editor' ? 'Messagerie →' : 'Contacter →'}
        </button>
      )}

      {/* Inline contact form */}
      {isContacting && (
        <div className="catalog-contact-form">
          <textarea
            className="catalog-contact-input"
            placeholder="Bonjour, je cherche un monteur pour..."
            value={contactMsg}
            onChange={(e) => onContactMsgChange(e.target.value)}
            rows={3}
          />
          {contactError && <div className="step-error" style={{ marginTop: 8, fontSize: 12 }}>{contactError}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              className="btn btn-primary"
              style={{ flex: 1, padding: '9px 0', fontSize: 13 }}
              onClick={onSendContact}
              disabled={contactSending || !contactMsg.trim()}
            >
              {contactSending ? '...' : 'Envoyer →'}
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '9px 14px', fontSize: 13 }}
              onClick={onCancelContact}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </EditorCard>
  )
}

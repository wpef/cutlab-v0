import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { useProjects } from '../../context/ProjectContext'
import EditorCard from '../ui/EditorCard'
import ProjectCard from '../projects/ProjectCard'
import ProjectFilters from '../projects/ProjectFilters'
import PageTitle from '../layout/PageTitle'
import { AnimatedList, AnimatedItem } from '../ui/AnimatedList'

export default function Catalog() {
  const {
    goToOnboarding, goToCreatorSignup, goToMessaging, goToProjectDetail,
    user, userRole,
  } = useOnboarding()
  const { requests, loadRequests, sendContactRequest } = useMessaging()
  const { publishedProjects, fetchPublishedProjects, projectLoading } = useProjects()

  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [contactingId, setContactingId] = useState(null)
  const [contactMsg, setContactMsg] = useState('')
  const [contactSending, setContactSending] = useState(false)
  const [contactError, setContactError] = useState('')

  // Tab state for editors: 'editors' | 'projects'
  const isEditor = userRole === 'editor'
  const [activeTab, setActiveTab] = useState(isEditor ? 'projects' : 'editors')
  const [projectFilters, setProjectFilters] = useState({})

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

  // Fetch published projects when tab is active or filters change
  useEffect(() => {
    if (activeTab === 'projects') {
      fetchPublishedProjects(projectFilters)
    }
  }, [activeTab, projectFilters])

  function handleContact(profile) {
    const displayName = [profile.first_name, profile.last_name ? profile.last_name[0] + '.' : ''].filter(Boolean).join(' ') || 'Monteur'
    if (!user) {
      goToCreatorSignup(profile.id, displayName)
      return
    }
    if (userRole === 'editor') {
      goToMessaging()
      return
    }
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

      <PageTitle title={isEditor ? (activeTab === 'projects' ? 'Projets disponibles' : 'Les monteurs') : 'Les monteurs'}>
        {!user && (
          <>
            <button className="catalog-header-btn" onClick={() => goToCreatorSignup(null)}>
              Je cherche un monteur
            </button>
            <button className="catalog-header-btn" onClick={goToOnboarding}>Je suis monteur →</button>
          </>
        )}
      </PageTitle>

      {/* Editor tab switcher */}
      {isEditor && (
        <div className="catalog-tabs">
          <button
            className={`catalog-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
            style={{ position: 'relative' }}
          >
            Projets disponibles
            {activeTab === 'projects' && (
              <motion.div
                className="catalog-tab-indicator"
                layoutId="catalog-tab-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
          <button
            className={`catalog-tab ${activeTab === 'editors' ? 'active' : ''}`}
            onClick={() => setActiveTab('editors')}
            style={{ position: 'relative' }}
          >
            Monteurs
            {activeTab === 'editors' && (
              <motion.div
                className="catalog-tab-indicator"
                layoutId="catalog-tab-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        </div>
      )}

      <div className="catalog-content">
        {/* ─── Projects tab (editors only) ─────────────────────── */}
        {activeTab === 'projects' && isEditor && (
          <>
            <ProjectFilters filters={projectFilters} onFilterChange={setProjectFilters} />
            {projectLoading ? (
              <div className="catalog-loading">Chargement...</div>
            ) : publishedProjects.length === 0 ? (
              <div className="catalog-empty">
                <div className="catalog-empty-icon">📝</div>
                <h3>Aucun projet disponible</h3>
                <p>
                  {Object.keys(projectFilters).length > 0
                    ? 'Aucun projet ne correspond à vos critères. Essayez d\'élargir votre recherche.'
                    : 'Les premiers projets arrivent bientôt.'}
                </p>
              </div>
            ) : (
              <>
                <div className="catalog-meta">{publishedProjects.length} projet{publishedProjects.length > 1 ? 's' : ''}</div>
                <AnimatedList className="catalog-grid">
                  {publishedProjects.map((p) => (
                    <AnimatedItem key={p.id}>
                      <ProjectCard
                        project={p}
                        onClick={() => goToProjectDetail(p.id)}
                      />
                    </AnimatedItem>
                  ))}
                </AnimatedList>
              </>
            )}
          </>
        )}

        {/* ─── Editors tab (default for creators, second for editors) */}
        {(activeTab === 'editors' || !isEditor) && (
          <>
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
                <AnimatedList className="catalog-grid">
                  {profiles.map((p) => (
                    <AnimatedItem key={p.id}>
                      <ProfileCard
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
                    </AnimatedItem>
                  ))}
                </AnimatedList>
              </>
            )}
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

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { LEVELS } from '../../constants/levels'
import { PRICING_ROWS } from '../../constants/pricing'
import { computePricing } from '../../lib/pricing'
import PageTitle from '../layout/PageTitle'
import SocialLinksDisplay from '../ui/SocialLinksDisplay'

const SKILL_LABELS = {
  video: 'Montage', thumb: 'Miniatures', sound: 'Sound',
  motion: 'Motion', voice: 'Voix', subs: 'Sous-titres',
  color: 'Color', reels: 'Reels',
}

const FORMAT_LABELS = {
  portrait: '📱 Portrait / Shorts', youtube: '🖥️ YouTube long format',
  pub: '📺 Publicités & spots', docu: '🎞️ Documentaires',
  corporate: '💼 Corporate / B2B', clips: '🎵 Clips musicaux',
  gaming: '🎮 Gaming', sport: '🏋️ Sport / Fitness',
}

const LANG_NAMES = {
  fr: '🇫🇷 Français', en: '🇬🇧 English', es: '🇪🇸 Español',
  pt: '🇧🇷 Português', de: '🇩🇪 Deutsch', it: '🇮🇹 Italiano',
  zh: '🇨🇳 中文', ja: '🇯🇵 日本語', ar: '🇸🇦 العربية',
  ru: '🇷🇺 Русский', ko: '🇰🇷 한국어',
}

const AVAIL_COLORS = {
  'Disponible':   { text: '#00c850', border: 'rgba(0,200,80,0.3)', label: 'Disponible' },
  'Sur demande':  { text: '#ffc800', border: 'rgba(255,200,0,0.3)', label: 'Sur demande' },
  'Indisponible': { text: '#ff4d4d', border: 'rgba(255,77,77,0.3)', label: 'Indisponible' },
}

const EXP_LABELS = { '<6m': '< 6 mois', '6m1y': '6 mois – 1 an', '1-3y': '1–3 ans d\'exp.', '3-5y': '3–5 ans d\'exp.', '5-7y': '5–7 ans d\'exp.', '7y+': '7 ans+ d\'exp.' }

export default function EditorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, userRole, goToCreatorSignup, goToMessaging } = useOnboarding()
  const { sendContactRequest } = useMessaging()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactMsg, setContactMsg] = useState('')
  const [contactSending, setContactSending] = useState(false)
  const [contactError, setContactError] = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, first_name, last_name, availability, skills, assigned_level, bio, languages, avatar_url, experience, formats, pricing, social_links')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          navigate('/catalog', { replace: true })
          return
        }
        setProfile(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="catalog-loading">Chargement...</div>
  if (!profile) return null

  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
  const rawIdx = profile.assigned_level
  const levelIdx = (typeof rawIdx === 'number' && rawIdx >= 0 && rawIdx < LEVELS.length) ? rawIdx : 0
  const level = LEVELS[levelIdx]
  const avail = AVAIL_COLORS[profile.availability] ?? AVAIL_COLORS['Disponible']
  const expLabel = EXP_LABELS[profile.experience] ?? ''

  function handleContact() {
    if (!user) { goToCreatorSignup(profile.id, name || 'Monteur'); return }
    if (userRole === 'editor') { goToMessaging(); return }
    setContactOpen(true)
    setContactMsg('')
    setContactError('')
  }

  async function handleSendContact() {
    if (!contactMsg.trim()) return
    setContactSending(true)
    setContactError('')
    const creatorName = user ? (user.email?.split('@')[0] || 'Créateur') : 'Créateur'
    const editorName = name || 'Monteur'
    const ok = await sendContactRequest(profile.id, contactMsg.trim(), creatorName, editorName)
    setContactSending(false)
    if (ok) { goToMessaging() }
    else { setContactError("Erreur lors de l'envoi. Réessaie.") }
  }

  return (
    <div className="editor-detail-page">
      <PageTitle title={name || 'Monteur'}>
        <button className="catalog-header-btn" onClick={() => navigate('/catalog')}>
          ← Catalogue
        </button>
      </PageTitle>

      <div className="editor-detail-content">
        {/* Media */}
        <div className="editor-detail-media">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={name} className="editor-detail-img" />
          ) : (
            <div className="editor-detail-placeholder">🎬</div>
          )}
        </div>

        {/* Info */}
        <div className="editor-detail-info">
          {/* Header: availability + level */}
          <div className="editor-detail-header">
            <div className="profile-avail" style={{ borderColor: avail.border, position: 'static' }}>
              <div className="avail-pulse" style={{ background: avail.text }} />
              <span style={{ color: avail.text }}>{avail.label}</span>
            </div>
            {level && (
              <span className="editor-detail-level">
                {level.emoji} {level.name}
              </span>
            )}
          </div>

          {/* Experience */}
          {expLabel && <div className="profile-meta">{expLabel}</div>}

          {/* Bio */}
          {profile.bio && (
            <div className="editor-detail-bio">{profile.bio}</div>
          )}

          {/* Social links */}
          <SocialLinksDisplay socialLinks={profile.social_links} />

          {/* Skills */}
          {(profile.skills ?? []).length > 0 && (
            <div className="editor-detail-section">
              <div className="editor-detail-section-title">Compétences</div>
              <div className="profile-skills-body">
                {profile.skills.map((k) => (
                  <div key={k} className="profile-tag-body">{SKILL_LABELS[k] ?? k}</div>
                ))}
              </div>
            </div>
          )}

          {/* Formats */}
          {(profile.formats ?? []).length > 0 && (
            <div className="editor-detail-section">
              <div className="editor-detail-section-title">Formats</div>
              <div className="profile-platforms">
                {profile.formats.map((key) => (
                  <div key={key} className="platform-badge">{FORMAT_LABELS[key] ?? key}</div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {(profile.languages ?? []).length > 0 && (
            <div className="editor-detail-section">
              <div className="editor-detail-section-title">Langues</div>
              <div className="profile-skills-body">
                {profile.languages.map((key) => (
                  <div key={key} className="profile-tag-body">{LANG_NAMES[key] ?? key}</div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing grid — Option A: full table */}
          {(() => {
            const levelIdx = typeof profile.assigned_level === 'number' && profile.assigned_level >= 0 && profile.assigned_level < LEVELS.length
              ? profile.assigned_level : null
            if (levelIdx == null) return null
            const customPrices = profile.pricing?.prices ?? {}
            const prices = computePricing(levelIdx, customPrices)
            return (
              <div className="editor-detail-section">
                <div className="editor-detail-section-title">Tarifs</div>
                <div className="editor-detail-pricing-grid">
                  {PRICING_ROWS.map((row) => (
                    <div key={row.key} className="editor-detail-pricing-row">
                      <span className="editor-detail-pricing-label">{row.label}</span>
                      <span className="editor-detail-pricing-price">{prices[row.key]} €</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {/* Contact */}
          {!contactOpen ? (
            <button className="btn btn-primary editor-detail-cta" onClick={handleContact}>
              {userRole === 'editor' ? 'Messagerie →' : 'Contacter →'}
            </button>
          ) : (
            <div className="catalog-contact-form" style={{ marginTop: 20 }}>
              <textarea
                className="catalog-contact-input"
                placeholder="Bonjour, je cherche un monteur pour..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                rows={3}
              />
              {contactError && <div className="step-error" style={{ marginTop: 8, fontSize: 12 }}>{contactError}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '9px 0', fontSize: 13 }}
                  onClick={handleSendContact}
                  disabled={contactSending || !contactMsg.trim()}
                >
                  {contactSending ? '...' : 'Envoyer →'}
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ padding: '9px 14px', fontSize: 13 }}
                  onClick={() => setContactOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

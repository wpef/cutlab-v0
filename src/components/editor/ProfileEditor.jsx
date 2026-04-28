import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { computeCompletion } from '../../lib/profileCompletion'
import { computeScoreDetails } from '../../lib/computeLevel'
import { LEVELS } from '../../constants/levels'
import { PRICING_ROWS, PRICING_GRID } from '../../constants/pricing'
import { baselinePrices } from '../../lib/pricing'
import { uploadFile } from '../../lib/uploadFile'
import EditorCard from '../ui/EditorCard'
import ScoreBreakdown from '../ui/ScoreBreakdown'
import FormGroup from '../ui/FormGroup'
import Tag from '../ui/Tag'
import NicheTag from '../ui/NicheTag'
import UploadZone from '../ui/UploadZone'
import AvailabilityButton from '../ui/AvailabilityButton'
import Button from '../ui/Button'
import HintBox from '../ui/HintBox'
import { toast } from '../ui/Toast'
import { AnimatePresence, motion } from 'framer-motion'
import SocialLinksInput from '../ui/SocialLinksInput'

const LANGUAGES = [
  { key: 'fr', flag: '🇫🇷', code: 'FR', label: 'Français' },
  { key: 'en', flag: '🇬🇧', code: 'EN', label: 'Anglais' },
  { key: 'es', flag: '🇪🇸', code: 'ES', label: 'Espagnol' },
  { key: 'pt', flag: '🇧🇷', code: 'PT', label: 'Portugais' },
  { key: 'de', flag: '🇩🇪', code: 'DE', label: 'Allemand' },
  { key: 'it', flag: '🇮🇹', code: 'IT', label: 'Italien' },
  { key: 'zh', flag: '🇨🇳', code: 'ZH', label: 'Chinois' },
  { key: 'ja', flag: '🇯🇵', code: 'JA', label: 'Japonais' },
  { key: 'ar', flag: '🇸🇦', code: 'AR', label: 'Arabe' },
  { key: 'ru', flag: '🇷🇺', code: 'RU', label: 'Russe' },
  { key: 'ko', flag: '🇰🇷', code: 'KO', label: 'Coréen' },
]

const AVAILABILITY_OPTIONS = ['Disponible', 'Sur demande', 'Indisponible']

const SKILLS = [
  { key: 'video',  icon: '🎬', label: 'Montage vidéo' },
  { key: 'thumb',  icon: '🖼️', label: 'Miniatures' },
  { key: 'sound',  icon: '🎵', label: 'Sound design' },
  { key: 'motion', icon: '✨', label: 'Motion design' },
  { key: 'voice',  icon: '🎙️', label: 'Traitement voix' },
  { key: 'subs',   icon: '✏️', label: 'Sous-titrage' },
  { key: 'color',  icon: '🎨', label: 'Color grading' },
  { key: 'reels',  icon: '📱', label: 'Reels / Shorts' },
]

const FORMATS = [
  { key: 'portrait',  label: '📱 Portrait / Shorts' },
  { key: 'youtube',   label: '🖥️ YouTube long format' },
  { key: 'pub',       label: '📺 Publicités & spots' },
  { key: 'docu',      label: '🎞️ Documentaires' },
  { key: 'corporate', label: '💼 Corporate / B2B' },
  { key: 'clips',     label: '🎵 Clips musicaux' },
  { key: 'gaming',    label: '🎮 Gaming' },
  { key: 'sport',     label: '🏋️ Sport / Fitness' },
]

const NICHES = [
  'Gaming', 'Finance', 'Lifestyle', 'Tech', 'Food', 'Sport',
  'Mode', 'Éducation', 'Voyage', 'Musique', 'Business', 'Humour',
  'Science', 'Politique',
]

const EXPERIENCE_OPTIONS = [
  { key: '<6m',  label: 'Moins de 6 mois' },
  { key: '6m1y', label: '6 mois – 1 an' },
  { key: '1-3y', label: '1 – 3 ans' },
  { key: '3-5y', label: '3 – 5 ans' },
  { key: '5-7y', label: '5 – 7 ans' },
  { key: '7y+',  label: '7 ans et plus' },
]

const SOFTWARE = [
  'Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro',
  'CapCut', 'Canva', 'Photoshop', 'Illustrator', 'Audition', 'Figma',
]

const REVISION_OPTIONS = ['1', '2', '3', '4', '5']

const CAPACITY_OPTIONS = [
  { key: '1',   label: '1 projet à la fois' },
  { key: '2-3', label: '2–3 projets' },
  { key: '4+',  label: '4 projets et plus' },
]

const MISSION_TYPES = [
  { key: 'ponctuelle',  label: 'Mission ponctuelle' },
  { key: 'long-terme',  label: 'Partenariat long terme' },
]

const RESPONSE_TIMES = [
  { key: '<4h',  label: 'Moins de 4h' },
  { key: '<12h', label: 'Moins de 12h' },
  { key: '<24h', label: 'Moins de 24h' },
  { key: '<48h', label: 'Moins de 48h' },
  { key: '<1w',  label: "Moins d'1 semaine" },
]


const MAX_BIO = 280

/**
 * Pricing editor sub-component — shown in section-pricing of ProfileEditor.
 * Free-input model: each row has a numeric input. Empty input = use baseline.
 * Custom prices are stored as absolute values; the baseline is shown alongside
 * for reference (with a delta in € and %).
 *
 * Props:
 *   assignedLevel — null | number (0-6)
 *   pricing       — { baselineLevel, prices }
 *   onUpdate      — (newPricing) => void
 */
function PricingEditor({ assignedLevel, pricing, onUpdate }) {
  const customPrices = pricing?.prices ?? {}

  // Level not set — show info block
  if (assignedLevel == null) {
    return (
      <div className="pricing-editor">
        <div className="pricing-locked-hint">
          Ton niveau n'est pas encore défini — complète ton profil pour débloquer la grille de tarifs.
        </div>
      </div>
    )
  }

  const level = LEVELS[assignedLevel]
  const baseline = baselinePrices(assignedLevel)

  function handleChange(key, raw) {
    const next = { ...customPrices }
    if (raw === '' || raw == null) {
      delete next[key]
    } else {
      const num = Number(raw)
      if (!Number.isFinite(num) || num < 0) return
      next[key] = Math.round(num)
    }
    onUpdate({ baselineLevel: assignedLevel, prices: next })
  }

  return (
    <div className="pricing-editor">
      <div className="pricing-subtitle">
        Baseline — {level.emoji} {level.name}. Saisis le prix de ton choix ; la baseline reste affichée pour repère.
      </div>
      <div className="pricing-rows-list">
        {PRICING_ROWS.map((row) => {
          const base = baseline[row.key]
          const custom = customPrices[row.key]
          const hasCustom = typeof custom === 'number' && Number.isFinite(custom) && custom >= 0
          const final = hasCustom ? custom : base
          const delta = final - base
          const deltaPct = base > 0 ? Math.round((delta / base) * 100) : 0
          return (
            <div key={row.key} className="pricing-row">
              <div className="pricing-row__label">{row.label}</div>
              <div className="pricing-row__controls">
                <div className="pricing-input-group">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={5}
                    className="pricing-input"
                    value={hasCustom ? custom : ''}
                    placeholder={String(base)}
                    onChange={(e) => handleChange(row.key, e.target.value)}
                    aria-label={`${row.label} (€)`}
                  />
                  <span className="pricing-input-suffix">€</span>
                </div>
                <div className="pricing-baseline-block">
                  {hasCustom ? (
                    <span className={`pricing-delta pricing-delta--${delta > 0 ? 'up' : delta < 0 ? 'down' : 'equal'}`}>
                      {delta > 0 ? '+' : ''}{deltaPct}%
                    </span>
                  ) : (
                    <span className="pricing-delta pricing-delta--equal">baseline</span>
                  )}
                  <span className="pricing-baseline-label">Réf. {base} €</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="pricing-grid-note">La baseline se met à jour si ton niveau évolue. Laisser vide = utiliser la baseline.</div>
    </div>
  )
}

const NAV_SECTIONS = [
  { id: 'section-identity',     label: 'Identité' },
  { id: 'section-skills',       label: 'Compétences' },
  { id: 'section-portfolio',    label: 'Portfolio' },
  { id: 'section-pricing',      label: 'Tarifs' },
  { id: 'section-presentation', label: 'Présentation' },
  { id: 'section-level',        label: 'Mon niveau' },
]


export default function ProfileEditor() {
  const { formData, updateFormData, saveProfile, loadProfile, saving, user, signOut } = useOnboarding()
  const { requests, loadRequests } = useMessaging()
  const [saveStatus, setSaveStatus] = useState(null)
  const [activeSection, setActiveSection] = useState('section-identity')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarUploadError, setAvatarUploadError] = useState(null)
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)

  async function handleExportData() {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const { data: requests } = await supabase.from('contact_requests').select('*').eq('user_id', user.id)
    const blob = new Blob([JSON.stringify({ profile, contact_requests: requests }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'cutlab-my-data.json'; a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Supprimer définitivement votre compte et toutes vos données ? Cette action est irréversible.')) return
    setDeletingAccount(true)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session?.access_token}` },
    })
    if (res.ok) {
      await signOut()
    } else {
      setDeletingAccount(false)
      alert('Erreur lors de la suppression. Contactez privacy@cutlab.io.')
    }
  }
  const [previewOpen, setPreviewOpen] = useState(false)
  const [clipUploading, setClipUploading] = useState(false)
  const [clipUploadError, setClipUploadError] = useState(null)
  const [clipUploadSuccess, setClipUploadSuccess] = useState(false)
  // Live score: recomputes on every formData change so section-level + pricing
  // editor reflect changes in real time (e.g. swapping experience level).
  const scoreDetails = useMemo(() => computeScoreDetails(formData), [formData])
  // Local state for social links — coerce legacy string to empty object on init
  const [socialLinks, setSocialLinks] = useState(
    () => (formData.socialLinks && typeof formData.socialLinks === 'object') ? formData.socialLinks : {}
  )

  async function handleAvatarUpload(files) {
    if (!files.length || !user) return
    setAvatarUploading(true)
    setAvatarUploadError(null)
    const file = files[0]
    const ext = file.name.split('.').pop()
    const url = await uploadFile('avatars', `${user.id}/avatar.${ext}`, file)
    setAvatarUploading(false)
    if (url) {
      updateFormData({ avatarUrl: url })
      setAvatarUploadSuccess(true)
      setTimeout(() => setAvatarUploadSuccess(false), 3000)
    } else {
      setAvatarUploadError("Erreur lors de l'upload.")
    }
  }

  async function handleClipUpload(files) {
    if (!files.length || !user) return
    setClipUploading(true)
    setClipUploadError(null)
    const uploadedUrls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const url = await uploadFile('portfolio', `${user.id}/${name}`, file)
      if (url) uploadedUrls.push(url)
    }
    setClipUploading(false)
    if (uploadedUrls.length > 0) {
      const existing = formData.portfolioLinks.filter((l) => l.trim())
      updateFormData({ portfolioLinks: [...existing, ...uploadedUrls] })
      setClipUploadSuccess(true)
      setTimeout(() => setClipUploadSuccess(false), 3000)
    } else {
      setClipUploadError("Erreur lors de l'upload.")
    }
  }

  useEffect(() => {
    if (user) {
      loadProfile()
      loadRequests()
    }
    // Dépend de l'id, pas de la référence d'objet : empêche reload
    // (qui wipe les unsaved edits, ex: vidéo) quand Supabase émet un nouvel
    // objet user pour le même id (TOKEN_REFRESHED / SIGNED_IN au focus d'onglet).
  }, [user?.id])

  // Sync local socialLinks when formData updates (e.g. after loadProfile)
  useEffect(() => {
    if (formData.socialLinks && typeof formData.socialLinks === 'object') {
      setSocialLinks(formData.socialLinks)
    }
  }, [formData.socialLinks])

  // Scrollspy: highlight active section in nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' }
    )
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const pendingCount = requests.filter((r) => r.status === 'pending' && r.editor_id === user?.id).length

  function toggleArr(field, key) {
    const arr = formData[field]
    updateFormData({ [field]: arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key] })
  }

  function toggleLang(key) {
    const langs = formData.languages
    updateFormData({ languages: langs.includes(key) ? langs.filter((k) => k !== key) : [...langs, key] })
  }

  function setLink(i, val) {
    const next = [...(formData.portfolioLinks.length > 0 ? formData.portfolioLinks : [''])]
    next[i] = val
    updateFormData({ portfolioLinks: next })
  }

  function addLink() {
    updateFormData({ portfolioLinks: [...(formData.portfolioLinks.length > 0 ? formData.portfolioLinks : ['']), ''] })
  }

  function removeLink(i) {
    if (formData.portfolioLinks.length <= 1) return
    updateFormData({ portfolioLinks: formData.portfolioLinks.filter((_, idx) => idx !== i) })
  }

  async function handleSave() {
    setSaveStatus(null)
    // Flush local socialLinks (filter empties) to context before saving
    const cleanedLinks = Object.fromEntries(
      Object.entries(socialLinks).filter(([, v]) => v && v.trim())
    )
    updateFormData({ socialLinks: cleanedLinks })
    const ok = await saveProfile('published')
    setSaveStatus(ok ? 'saved' : 'error')
    if (ok) {
      toast.success('Profil mis a jour !')
      setTimeout(() => setSaveStatus(null), 3000)
    } else {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Completion
  const { pct: completionPct } = computeCompletion(formData)
  const completionColor = completionPct >= 80 ? '#00c850' : completionPct >= 50 ? 'var(--accent)' : '#ffc800'

  const portfolioLinks = formData.portfolioLinks.length > 0 ? formData.portfolioLinks : ['']

  return (
    <div className="editor-page">

      <div className="editor-header-bar">
        <div style={{ flex: 1 }} />
        {saveStatus === 'saved' && <span className="save-notice">Enregistré</span>}
        {saveStatus === 'error' && <span className="save-notice save-notice--error">Erreur</span>}
        <Button variant="primary" onClick={handleSave} style={{ padding: '10px 22px', fontSize: 13 }}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>

      {/* Mobile-only sticky accordion preview */}
      <div className="editor-mobile-preview">
        <button
          className="editor-preview-toggle"
          onClick={() => setPreviewOpen((v) => !v)}
        >
          <span>{previewOpen ? '▾' : '▸'} Apercu de ma carte</span>
          <span className="editor-preview-completion" style={{ color: completionColor }}>{completionPct}%</span>
        </button>
        <AnimatePresence>
          {previewOpen && (
            <motion.div
              className="editor-preview-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <EditorCard
                profile={{
                  avatar_url: formData.avatarUrl,
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  availability: formData.availability,
                  skills: formData.skills,
                  assigned_level: computeScoreDetails(formData).levelIndex,
                  experience: formData.experience,
                  languages: formData.languages,
                  formats: formData.formats,
                  pricing: formData.pricing,
                }}
                stats={{ received: pendingCount }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="editor-layout">

        {/* -- Left sidebar: mini card + section nav -- */}
        <aside className="editor-sidebar">

          {/* Mini profile card — same component as catalog, name hidden */}
          <EditorCard
            profile={{
              avatar_url: formData.avatarUrl,
              first_name: formData.firstName,
              last_name: formData.lastName,
              availability: formData.availability,
              skills: formData.skills,
              assigned_level: computeScoreDetails(formData).levelIndex,
              experience: formData.experience,
              languages: formData.languages,
              formats: formData.formats,
              pricing: formData.pricing,
            }}
            hideName
            stats={{ received: pendingCount }}
          />

          {/* Completion bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
              <span>Complétion</span>
              <span style={{ color: completionColor, fontWeight: 600 }}>{completionPct}%</span>
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: 100, height: 4, overflow: 'hidden' }}>
              <div style={{ width: `${completionPct}%`, height: '100%', background: completionColor, borderRadius: 100, transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Section navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, paddingLeft: 8 }}>
              Sections
            </div>
            {NAV_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                style={{
                  background: activeSection === sec.id ? 'var(--surface2)' : 'transparent',
                  border: activeSection === sec.id ? '1px solid var(--border)' : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)',
                  color: activeSection === sec.id ? 'var(--text)' : 'var(--text-muted)',
                  fontSize: 13,
                  padding: '8px 10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  fontWeight: activeSection === sec.id ? 500 : 400,
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {activeSection === sec.id && (
                  <span style={{ width: 3, height: 16, background: 'var(--accent)', borderRadius: 2, flexShrink: 0 }} />
                )}
                {sec.label}
              </button>
            ))}
          </nav>

        </aside>

        {/* -- Main editor content -- */}
        <div className="editor-content editor-main">

          {/* -- Section: Identité -- */}
          <section id="section-identity" className="editor-section" style={{ scrollMarginTop: 80 }}>
            <div className="editor-section-title">Identité</div>

            <div className="form-row">
              <FormGroup label="Prénom">
                <input type="text" placeholder="Lucas" value={formData.firstName}
                  onChange={(e) => updateFormData({ firstName: e.target.value })} />
              </FormGroup>
              <FormGroup label="Nom">
                <input type="text" placeholder="Martin" value={formData.lastName}
                  onChange={(e) => updateFormData({ lastName: e.target.value })} />
              </FormGroup>
            </div>

            <FormGroup label="Photo de profil" optional="optionnel">
              {formData.avatarUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={formData.avatarUrl}
                      alt="Photo de profil"
                      style={{
                        width: 96, height: 96, borderRadius: '50%', objectFit: 'cover',
                        border: '2px solid var(--border)', display: 'block',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => updateFormData({ avatarUrl: '' })}
                      style={{
                        position: 'absolute', top: -4, right: -4,
                        width: 22, height: 22, borderRadius: '50%',
                        background: '#ff4d4d', border: 'none', color: '#fff',
                        fontSize: 12, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                      title="Supprimer la photo"
                    >
                      ×
                    </button>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Photo enregistrée. Clique × pour la changer.</div>
                </div>
              ) : (
                <UploadZone icon="📷" title="Clique pour uploader" hint="JPG ou PNG, moins de 5Mo"
                  accept="image/jpeg,image/png,image/webp" maxSizeMB={5} onFilesChange={handleAvatarUpload}
                  uploading={avatarUploading} uploadError={avatarUploadError} uploadSuccess={avatarUploadSuccess}
                  style={{ padding: 24 }} />
              )}
            </FormGroup>

            <FormGroup label="Langues parlées">
              <div className="lang-selector">
                {LANGUAGES.map((lang) => (
                  <div key={lang.key}
                    className={`lang-option${formData.languages.includes(lang.key) ? ' selected' : ''}`}
                    onClick={() => toggleLang(lang.key)} role="checkbox"
                    aria-checked={formData.languages.includes(lang.key)}
                  >
                    <span className="lang-flag" aria-hidden="true">{lang.flag}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{lang.code}</span>
                    {lang.label}
                  </div>
                ))}
              </div>
            </FormGroup>

            <FormGroup label="Disponibilité actuelle">
              <div className="availability-group">
                {AVAILABILITY_OPTIONS.map((option) => (
                  <AvailabilityButton key={option} label={option}
                    selected={formData.availability === option}
                    onSelect={() => updateFormData({ availability: option })} />
                ))}
              </div>
            </FormGroup>
          </section>

          {/* -- Section: Compétences -- */}
          <section id="section-skills" className="editor-section" style={{ scrollMarginTop: 80 }}>
            <div className="editor-section-title">Compétences</div>

            <FormGroup label="Ce que tu sais faire">
              <div className="tag-group">
                {SKILLS.map((s) => (
                  <Tag key={s.key} icon={s.icon} selected={formData.skills.includes(s.key)}
                    onToggle={() => toggleArr('skills', s.key)}>{s.label}</Tag>
                ))}
              </div>
            </FormGroup>

            <FormGroup label="Formats">
              <div className="tag-group">
                {FORMATS.map((f) => (
                  <Tag key={f.key} selected={formData.formats.includes(f.key)}
                    onToggle={() => toggleArr('formats', f.key)}>{f.label}</Tag>
                ))}
              </div>
            </FormGroup>

            <FormGroup label="Niches de contenu">
              <div className="tag-group">
                <NicheTag isTout selected={formData.niches.length === NICHES.length}
                  onToggle={() => updateFormData({ niches: formData.niches.length === NICHES.length ? [] : [...NICHES] })}>
                  Toutes niches
                </NicheTag>
                {NICHES.map((name) => (
                  <NicheTag key={name} selected={formData.niches.includes(name)}
                    onToggle={() => toggleArr('niches', name)}>{name}</NicheTag>
                ))}
              </div>
            </FormGroup>

            <FormGroup label="Expérience">
              <div className="tag-group">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <Tag key={opt.key} selected={formData.experience === opt.key}
                    onToggle={() => updateFormData({ experience: opt.key })}>{opt.label}</Tag>
                ))}
              </div>
            </FormGroup>

            <FormGroup label="Logiciels">
              <div className="tag-group">
                {SOFTWARE.map((sw) => (
                  <Tag key={sw} selected={formData.software.includes(sw)}
                    onToggle={() => toggleArr('software', sw)}>{sw}</Tag>
                ))}
              </div>
            </FormGroup>
          </section>

          {/* -- Section: Portfolio -- */}
          <section id="section-portfolio" className="editor-section" style={{ scrollMarginTop: 80 }}>
            <div className="editor-section-title">Portfolio</div>

            <FormGroup label="Clips vidéo">
              {/* Existing uploaded clips */}
              {formData.portfolioLinks.filter((l) => l.trim()).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  {formData.portfolioLinks.filter((l) => l.trim()).map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: 160, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
                      {url.match(/\.(mp4|mov|webm)/i) ? (
                        <video src={url} style={{ width: '100%', height: 90, objectFit: 'cover' }} muted />
                      ) : (
                        <div style={{ width: '100%', height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--text-muted)', padding: 8, wordBreak: 'break-all' }}>
                          {url.split('/').pop()}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const next = formData.portfolioLinks.filter((_, idx) => idx !== i)
                          updateFormData({ portfolioLinks: next.length ? next : [''] })
                        }}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 20, height: 20, borderRadius: '50%',
                          background: '#ff4d4d', border: 'none', color: '#fff',
                          fontSize: 11, cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                        title="Supprimer ce clip"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <UploadZone icon="🎬" title="Glisse tes clips ici" hint="MP4 · Max 500 Mo par clip"
                accept="video/mp4,video/quicktime,video/webm" multiple maxSizeMB={500}
                onFilesChange={handleClipUpload}
                uploading={clipUploading} uploadError={clipUploadError} uploadSuccess={clipUploadSuccess}
                style={{ marginBottom: 8 }} />
            </FormGroup>

            {/* Portfolio links — multi-champ dynamique */}
            <FormGroup label="Liens externes" optional="optionnel">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {portfolioLinks.map((link, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="text" placeholder="🔗 Lien YouTube, Vimeo, Google Drive..."
                      value={link} onChange={(e) => setLink(i, e.target.value)} style={{ flex: 1 }} />
                    {portfolioLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLink(i)}
                        style={{
                          background: 'transparent', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)',
                          width: 36, height: 36, cursor: 'pointer', fontSize: 16, flexShrink: 0,
                        }}
                        title="Supprimer ce lien"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addLink}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: 'transparent',
                  border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)', fontSize: 13, padding: '8px 14px',
                  cursor: 'pointer', width: '100%', marginTop: 8, fontFamily: 'inherit',
                }}
              >
                + Ajouter un lien
              </button>
            </FormGroup>

            <FormGroup label="Chaînes / comptes crédités" optional="optionnel">
              <input type="text" placeholder="ex: @nomdelachain, youtube.com/c/..."
                value={formData.creditedChannels}
                onChange={(e) => updateFormData({ creditedChannels: e.target.value })} />
            </FormGroup>

            <HintBox>Des clips de 15 à 45 secondes suffisent. Les clients veulent voir ta patte.</HintBox>
          </section>

          {/* -- Section: Tarifs -- */}
          <section id="section-pricing" className="editor-section" style={{ scrollMarginTop: 80 }}>
            <div className="editor-section-title">Tarifs</div>

            <PricingEditor
              assignedLevel={scoreDetails.levelIndex}
              pricing={formData.pricing}
              onUpdate={(newPricing) => updateFormData({ pricing: newPricing })}
            />

            <FormGroup label="Retours inclus par défaut">
              <div className="tag-group">
                {REVISION_OPTIONS.map((n) => (
                  <Tag key={n} selected={formData.revisions === n}
                    onToggle={() => updateFormData({ revisions: n })}>{n}</Tag>
                ))}
              </div>
            </FormGroup>

            <FormGroup label="Capacité de charge simultanée">
              <div className="tag-group">
                {CAPACITY_OPTIONS.map((opt) => (
                  <Tag key={opt.key} selected={formData.capacity === opt.key}
                    onToggle={() => updateFormData({ capacity: opt.key })}>{opt.label}</Tag>
                ))}
              </div>
            </FormGroup>
          </section>

          {/* -- Section: Présentation -- */}
          <section id="section-presentation" className="editor-section" style={{ scrollMarginTop: 80 }}>
            <div className="editor-section-title">Présentation</div>

            <FormGroup label="Bio courte">
              <textarea placeholder="En 2–3 phrases : qui tu es, ta patte, ce qui te différencie."
                maxLength={MAX_BIO} value={formData.bio}
                onChange={(e) => updateFormData({ bio: e.target.value })} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
                {formData.bio.length} / {MAX_BIO} caractères
              </div>
            </FormGroup>

            <FormGroup label="Type de mission recherchée">
              <div className="tag-group">
                {MISSION_TYPES.map((m) => (
                  <Tag key={m.key} selected={formData.missionTypes.includes(m.key)}
                    onToggle={() => {
                      const arr = formData.missionTypes
                      updateFormData({ missionTypes: arr.includes(m.key) ? arr.filter((k) => k !== m.key) : [...arr, m.key] })
                    }}>{m.label}</Tag>
                ))}
              </div>
            </FormGroup>

            <FormGroup label="Délai de réponse habituel">
              <div className="tag-group">
                {RESPONSE_TIMES.map((rt) => (
                  <Tag key={rt.key} selected={formData.responseTime === rt.key}
                    onToggle={() => updateFormData({ responseTime: rt.key })}>{rt.label}</Tag>
                ))}
              </div>
            </FormGroup>

            <FormGroup label="Réseaux / site perso" optional="optionnel">
              <SocialLinksInput value={socialLinks} onChange={setSocialLinks} />
            </FormGroup>
          </section>

          {/* -- Section: Mon niveau -- */}
          <section id="section-level" className="editor-section" style={{ scrollMarginTop: 80 }}>
            <div className="editor-section-title">Mon niveau</div>
            <div className="editor-score-section">
              <div className="editor-score-level">
                <span className="editor-score-level-emoji">{LEVELS[scoreDetails.levelIndex].emoji}</span>
                <span className="editor-score-level-name">{LEVELS[scoreDetails.levelIndex].name}</span>
              </div>
              <div className="editor-score-total">{scoreDetails.total} / 100</div>
              <ScoreBreakdown scoreDetails={scoreDetails} />
            </div>
          </section>

          {/* -- Bottom save -- */}
          <div style={{ marginTop: 32, paddingBottom: 64 }}>
            {saveStatus === 'error' && (
              <div className="step-error" style={{ marginBottom: 16 }}>
                Erreur lors de l'enregistrement. Vérifie ta connexion et réessaie.
              </div>
            )}
            <Button variant="primary" onClick={handleSave} style={{ width: '100%', padding: '16px 0', fontSize: 15 }}>
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
            <button className="editor-logout-mobile" onClick={signOut}>
              Se deconnecter
            </button>
            <div className="editor-account-actions">
              <button className="editor-account-btn" onClick={handleExportData}>
                Exporter mes données (JSON)
              </button>
              <button className="editor-account-btn editor-account-btn--danger" onClick={handleDeleteAccount} disabled={deletingAccount}>
                {deletingAccount ? 'Suppression...' : 'Supprimer mon compte'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

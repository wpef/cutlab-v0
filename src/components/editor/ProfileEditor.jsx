import { useState, useEffect } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { LEVELS } from '../../constants/levels'
import FormGroup from '../ui/FormGroup'
import Tag from '../ui/Tag'
import NicheTag from '../ui/NicheTag'
import UploadZone from '../ui/UploadZone'
import AvailabilityButton from '../ui/AvailabilityButton'
import Button from '../ui/Button'
import HintBox from '../ui/HintBox'

const LANGUAGES = [
  { key: 'fr', flag: '🇫🇷', label: 'Français' },
  { key: 'en', flag: '🇬🇧', label: 'Anglais' },
  { key: 'es', flag: '🇪🇸', label: 'Espagnol' },
  { key: 'pt', flag: '🇧🇷', label: 'Portugais' },
  { key: 'de', flag: '🇩🇪', label: 'Allemand' },
  { key: 'it', flag: '🇮🇹', label: 'Italien' },
  { key: 'zh', flag: '🇨🇳', label: 'Chinois' },
  { key: 'ja', flag: '🇯🇵', label: 'Japonais' },
  { key: 'ar', flag: '🇸🇦', label: 'Arabe' },
  { key: 'ru', flag: '🇷🇺', label: 'Russe' },
  { key: 'ko', flag: '🇰🇷', label: 'Coréen' },
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
  { key: '5y+',  label: '5 ans et plus' },
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
  { key: '<1h',  label: "Moins d'1h" },
  { key: '<4h',  label: 'Moins de 4h' },
  { key: '<24h', label: 'Moins de 24h' },
  { key: '<48h', label: 'Sous 48h' },
]

const AVAIL_COLORS = {
  'Disponible':   { bg: 'rgba(212,240,0,0.12)',   color: '#d4f000', border: 'rgba(212,240,0,0.3)' },
  'Sur demande':  { bg: 'rgba(255,200,0,0.12)',   color: '#ffc800', border: 'rgba(255,200,0,0.3)' },
  'Indisponible': { bg: 'rgba(255,77,77,0.12)',   color: '#ff4d4d', border: 'rgba(255,77,77,0.3)' },
}

const MAX_BIO = 280

export default function ProfileEditor() {
  const { formData, updateFormData, saveProfile, saving, assignedLevel, user, goToMessaging } = useOnboarding()
  const { requests, loadRequests } = useMessaging()
  const [saveStatus, setSaveStatus] = useState(null) // null | 'saved' | 'error'
  const level = LEVELS[assignedLevel]

  useEffect(() => {
    if (user) loadRequests()
  }, [user])

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
    const next = [...formData.portfolioLinks]
    next[i] = val
    updateFormData({ portfolioLinks: next })
  }

  async function handleSave() {
    setSaveStatus(null)
    const ok = await saveProfile('published')
    setSaveStatus(ok ? 'saved' : 'error')
    if (ok) setTimeout(() => setSaveStatus(null), 3000)
  }

  const availColors = AVAIL_COLORS[formData.availability] ?? AVAIL_COLORS['Disponible']
  const displayName = [formData.firstName, formData.lastName].filter(Boolean).join(' ') || 'Ton nom'

  return (
    <div className="editor-page">

      {/* ── Header ── */}
      <header className="editor-header">
        <div className="editor-header-logo">CUT<span>LAB</span></div>
        <div className="editor-header-title">Mon profil</div>
        <div className="editor-header-actions">
          <button className="catalog-header-btn" onClick={goToMessaging} style={{ fontSize: 13 }}>
            Messagerie{pendingCount > 0 ? ` (${pendingCount})` : ''}
          </button>
          {saveStatus === 'saved' && <span className="save-notice">✓ Enregistré</span>}
          {saveStatus === 'error' && <span className="save-notice save-notice--error">Erreur</span>}
          <Button variant="primary" onClick={handleSave} style={{ padding: '10px 22px', fontSize: 13 }}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </header>

      <div className="editor-content">

        {/* ── Profile card summary ── */}
        <div className="editor-profile-card">
          <div className="editor-avatar">🎬</div>
          <div className="editor-profile-info">
            <div className="editor-profile-name">{displayName}</div>
            {formData.username && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>@{formData.username}</div>
            )}
          </div>
          <div className="editor-profile-badges">
            <span className="editor-badge" style={{ background: availColors.bg, color: availColors.color, border: `1px solid ${availColors.border}` }}>
              {formData.availability}
            </span>
            {level && (
              <span className="editor-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-dim)', border: '1px solid var(--border)' }}>
                {level.emoji} {level.name}
              </span>
            )}
          </div>
        </div>

        {/* ── Section: Identité ── */}
        <section className="editor-section">
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

          <FormGroup label="Pseudo / Nom de scène" optional="optionnel">
            <input type="text" placeholder="Le nom affiché sur ton profil public"
              value={formData.username} onChange={(e) => updateFormData({ username: e.target.value })} />
          </FormGroup>

          <FormGroup label="Photo de profil" optional="optionnel">
            <UploadZone icon="📷" title="Clique pour changer ta photo" hint="JPG ou PNG, moins de 5Mo"
              accept="image/jpeg,image/png,image/webp" style={{ padding: 24 }} />
          </FormGroup>

          <FormGroup label="Langues parlées">
            <div className="lang-selector">
              {LANGUAGES.map((lang) => (
                <div key={lang.key}
                  className={`lang-option${formData.languages.includes(lang.key) ? ' selected' : ''}`}
                  onClick={() => toggleLang(lang.key)} role="checkbox"
                  aria-checked={formData.languages.includes(lang.key)}
                >
                  <span className="lang-flag">{lang.flag}</span>{lang.label}
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

        {/* ── Section: Compétences ── */}
        <section className="editor-section">
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
                ✦ Toutes niches
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

        {/* ── Section: Portfolio ── */}
        <section className="editor-section">
          <div className="editor-section-title">Portfolio</div>

          <UploadZone icon="🎬" title="Glisse tes clips ici" hint="MP4 · Max 500 Mo par clip"
            accept="video/mp4,video/quicktime,video/webm" multiple maxSizeMB={500}
            style={{ marginBottom: 24 }} />

          <FormGroup label="Liens externes" optional="optionnel">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="text" placeholder="🔗 Lien YouTube, Vimeo, Google Drive..."
                value={formData.portfolioLinks[0] ?? ''} onChange={(e) => setLink(0, e.target.value)} />
              <input type="text" placeholder="🔗 Ajouter un autre lien"
                value={formData.portfolioLinks[1] ?? ''} onChange={(e) => setLink(1, e.target.value)} />
            </div>
          </FormGroup>

          <FormGroup label="Chaînes / comptes crédités" optional="optionnel">
            <input type="text" placeholder="ex: @nomdelachain, youtube.com/c/..."
              value={formData.creditedChannels}
              onChange={(e) => updateFormData({ creditedChannels: e.target.value })} />
          </FormGroup>

          <HintBox>💡 <strong>Astuce :</strong> des clips de 15 à 45 secondes suffisent. Les clients veulent voir ta patte.</HintBox>
        </section>

        {/* ── Section: Tarifs ── */}
        <section className="editor-section">
          <div className="editor-section-title">Tarifs</div>

          <table className="tarif-table" style={{ marginBottom: 24 }}>
            <thead>
              <tr>
                <th />
                <th>Court (&lt; 5 min)</th>
                <th>Moyen (5–15 min)</th>
                <th>Long (15 min+)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="tarif-label">Montage brut</td>
                <td><input type="number" placeholder="€" /></td>
                <td><input type="number" placeholder="€" /></td>
                <td><input type="number" placeholder="€" /></td>
              </tr>
              <tr>
                <td className="tarif-label">Avec motion</td>
                <td><input type="number" placeholder="€" /></td>
                <td><input type="number" placeholder="€" /></td>
                <td><input type="number" placeholder="€" /></td>
              </tr>
              <tr>
                <td className="tarif-label">Miniature incluse</td>
                <td><input type="number" placeholder="+€" /></td>
                <td><input type="number" placeholder="+€" /></td>
                <td><input type="number" placeholder="+€" /></td>
              </tr>
            </tbody>
          </table>

          <div className="form-row">
            <FormGroup label="Tarif horaire" optional="optionnel">
              <input type="number" placeholder="€ / heure" value={formData.hourlyRate}
                onChange={(e) => updateFormData({ hourlyRate: e.target.value })} />
            </FormGroup>
            <FormGroup label="Délai de livraison habituel" optional="optionnel">
              <input type="text" placeholder="ex: 48–72h après réception des rushs"
                value={formData.deliveryTime}
                onChange={(e) => updateFormData({ deliveryTime: e.target.value })} />
            </FormGroup>
          </div>

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

        {/* ── Section: Présentation ── */}
        <section className="editor-section">
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
                  onToggle={() => toggleArr('missionTypes', m.key)}>{m.label}</Tag>
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
            <input type="text" placeholder="Instagram, TikTok, site web..."
              value={formData.socialLinks}
              onChange={(e) => updateFormData({ socialLinks: e.target.value })} />
          </FormGroup>
        </section>

        {/* ── Bottom save ── */}
        <div style={{ marginTop: 32, paddingBottom: 64 }}>
          {saveStatus === 'error' && (
            <div className="step-error" style={{ marginBottom: 16 }}>
              Erreur lors de l'enregistrement. Vérifie ta connexion et réessaie.
            </div>
          )}
          <Button variant="primary" onClick={handleSave} style={{ width: '100%', padding: '16px 0', fontSize: 15 }}>
            {saving ? 'Enregistrement...' : '✓ Enregistrer les modifications'}
          </Button>
        </div>

      </div>
    </div>
  )
}

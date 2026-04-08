import { LEVELS } from '../../constants/levels'

const SKILL_LABELS = {
  video: 'Montage', thumb: 'Miniatures', sound: 'Sound',
  motion: 'Motion', voice: 'Voix', subs: 'Sous-titres',
  color: 'Color', reels: 'Reels',
}

const FORMAT_EMOJI = {
  portrait: '📱', youtube: '🖥️', pub: '📺', docu: '🎞️',
  corporate: '💼', clips: '🎵', gaming: '🎮', sport: '🏋️',
}

const LANG_FLAGS = {
  fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', pt: '🇧🇷',
  de: '🇩🇪', it: '🇮🇹', zh: '🇨🇳', ja: '🇯🇵',
  ar: '🇸🇦', ru: '🇷🇺', ko: '🇰🇷',
}

const AVAIL_COLORS = {
  'Disponible':   { text: '#00c850', border: 'rgba(0,200,80,0.3)', label: 'Dispo' },
  'Sur demande':  { text: '#ffc800', border: 'rgba(255,200,0,0.3)', label: 'Sur demande' },
  'Indisponible': { text: '#ff4d4d', border: 'rgba(255,77,77,0.3)', label: 'Indispo' },
}

const EXP_LABELS = { '<6m': '< 6 mois', '6m1y': '6 mois – 1 an', '1-3y': '1–3 ans', '3-5y': '3–5 ans', '5-7y': '5–7 ans', '7y+': '7 ans+' }

function getPriceIndicator(hourlyRate) {
  const r = parseFloat(hourlyRate)
  if (!r || isNaN(r)) return '$'
  if (r > 80) return '$$$$'
  if (r > 50) return '$$$'
  if (r > 25) return '$$'
  return '$'
}

/**
 * Shared profile card — same design as Step8Preview.
 *
 * Props:
 *   profile  — { avatar_url, presentation_video_url, first_name, last_name,
 *                username, availability, skills, assigned_level,
 *                experience, languages, formats, hourly_rate }
 *   hideName — hides the full name (ProfileEditor sidebar)
 *   stats    — optional { received, active, done } for project counts
 *   children — extra content at the bottom (contact button/form)
 */
export default function EditorCard({ profile, hideName = false, stats, children }) {
  const rawIdx = profile.assigned_level
  const levelIdx = (typeof rawIdx === 'number' && rawIdx >= 0 && rawIdx < LEVELS.length) ? rawIdx : 0
  const level = LEVELS[levelIdx]
  const skillTags = (profile.skills ?? []).slice(0, 3).map((k) => SKILL_LABELS[k] ?? k)
  const langFlags = (profile.languages ?? []).slice(0, 5)
  const formatBadges = (profile.formats ?? []).slice(0, 3)
  const avail = AVAIL_COLORS[profile.availability] ?? AVAIL_COLORS['Disponible']
  const priceIndicator = getPriceIndicator(profile.hourly_rate)
  const expLabel = EXP_LABELS[profile.experience] ?? ''
  const name = [
    profile.first_name,
    profile.last_name ? profile.last_name[0] + '.' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="profile-preview">
      <div className="profile-thumb">
        {profile.presentation_video_url
          ? <video src={profile.presentation_video_url} autoPlay muted loop playsInline className="catalog-card-media" />
          : profile.avatar_url
          ? <img src={profile.avatar_url} alt={name || 'Monteur'} className="catalog-card-media" />
          : <span style={{ fontSize: 48 }}>🎬</span>
        }
        <div className="profile-avail" style={{ borderColor: avail.border }}>
          <div className="avail-pulse" style={{ background: avail.text }} />
          <span style={{ color: avail.text }}>{avail.label}</span>
        </div>
        {skillTags.length > 0 && (
          <div className="profile-skills">
            {skillTags.map((tag) => (
              <div key={tag} className="profile-tag">{tag}</div>
            ))}
          </div>
        )}
        {level && (
          <div className={`profile-level-badge${levelIdx >= 4 ? ' profile-level-badge--high' : ''}`}>
            {level.emoji} {level.name}
          </div>
        )}
      </div>

      <div className="profile-body">
        {!hideName && (
          <div className="profile-name">{name || 'Monteur'}</div>
        )}
        {profile.username && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: hideName ? 6 : 2 }}>@{profile.username}</div>
        )}
        {expLabel && (
          <div className="profile-meta">{expLabel} d'exp.</div>
        )}
        {langFlags.length > 0 && (
          <div className="profile-langs">
            {langFlags.map((key) => (
              LANG_FLAGS[key]
                ? <span key={key} className="profile-lang" title={key}>{LANG_FLAGS[key]}</span>
                : <span key={key} className="profile-lang" style={{ fontSize: 11, fontWeight: 700 }}>{key.toUpperCase()}</span>
            ))}
          </div>
        )}
        {formatBadges.length > 0 && (
          <div className="profile-platforms">
            {formatBadges.map((key) => (
              <div key={key} className="platform-badge" title={key}>{FORMAT_EMOJI[key] ?? '🎬'}</div>
            ))}
          </div>
        )}
        <div className="profile-footer">
          <div className="profile-price">
            {priceIndicator}
          </div>
          <div className="profile-rating">
            {stats
              ? `${stats.received ?? 0} demande${(stats.received ?? 0) > 1 ? 's' : ''}`
              : 'Nouveau'
            }
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

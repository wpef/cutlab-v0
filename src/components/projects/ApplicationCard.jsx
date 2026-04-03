import { motion } from 'framer-motion'
import { SKILLS, EXPERIENCE_OPTIONS } from '../../constants/options'
import { LEVELS } from '../../constants/levels'

export default function ApplicationCard({ application, onAccept, onRefuse }) {
  const profile = application.profiles || {}
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Monteur'
  const level = LEVELS[profile.assigned_level] || LEVELS[0]
  const isPending = application.status === 'pending'

  const topSkills = (profile.skills || []).slice(0, 4).map((key) => {
    const s = SKILLS.find((sk) => sk.key === key)
    return s ? `${s.icon} ${s.label}` : key
  })

  const expLabel = EXPERIENCE_OPTIONS.find((e) => e.key === profile.experience)?.label || ''

  return (
    <motion.div className="application-card" whileTap={{ scale: 0.99 }}>
      <div className="application-card-header">
        <div className="application-card-avatar">
          {profile.avatar_url
            ? <img src={profile.avatar_url} alt="" />
            : name[0]?.toUpperCase()
          }
        </div>
        <div className="application-card-info">
          <div className="application-card-name">{name}</div>
          <div className="application-card-level">{level.emoji} {level.name}</div>
        </div>
      </div>

      {topSkills.length > 0 && (
        <div className="application-card-skills">
          {topSkills.map((s) => <span key={s} className="application-card-skill">{s}</span>)}
        </div>
      )}

      {profile.bio && <div className="application-card-bio">{profile.bio}</div>}

      <div className="application-card-meta">
        {expLabel && <span>{expLabel}</span>}
        {profile.hourly_rate && <span>{profile.hourly_rate} €/h</span>}
      </div>

      {isPending && (
        <div className="application-card-actions">
          <button className="btn btn-primary" onClick={() => onAccept(application.id)}>
            Accepter
          </button>
          <button className="btn btn-ghost" style={{ color: '#f87171', borderColor: '#f87171' }} onClick={() => onRefuse(application.id)}>
            Refuser
          </button>
        </div>
      )}

      {application.status === 'accepted' && (
        <div style={{ textAlign: 'center', color: '#4ade80', fontSize: 13, fontWeight: 600 }}>Acceptée</div>
      )}
      {application.status === 'refused' && (
        <div style={{ textAlign: 'center', color: '#f87171', fontSize: 13, fontWeight: 600 }}>Refusée</div>
      )}
    </motion.div>
  )
}

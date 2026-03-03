import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { LEVELS } from '../../constants/levels'
import StepHeader from '../ui/StepHeader'
import StepNav from '../ui/StepNav'

const LEGEND_ITEMS = [
  { label: 'Niveau',            desc: 'affiché en bas à gauche de la carte, calculé depuis ton profil' },
  { label: 'Drapeaux',          desc: 'langues parlées, visibles par les clients directement' },
  { label: 'Disponibilité',     desc: 'mise à jour depuis ton dashboard en temps réel' },
  { label: 'Tags compétences',  desc: 'tes 3 premières apparaissent sur la carte' },
  { label: 'Indicateur prix',   desc: 'de $ à $$$$ calculé automatiquement depuis ta grille' },
]

export default function Step8Preview() {
  const { goToStep, publishProfile, assignedLevel, saving } = useOnboarding()
  const level = LEVELS[assignedLevel]
  const [error, setError] = useState('')

  async function handlePublish() {
    setError('')
    const ok = await publishProfile()
    if (!ok) setError('Erreur lors de la publication. Vérifie ta connexion et réessaie.')
  }

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 8 sur 8"
        title="Voici ta carte profil"
        desc="C'est comme ça que les clients te voient dans le catalogue."
      />

      <div className="card-preview-section">
        {/* Profile card */}
        <div className="profile-preview">
          <div className="profile-thumb">
            🎬
            <div className="profile-avail">
              <div className="avail-pulse" />
              Dispo
            </div>
            <div className="profile-skills">
              <div className="profile-tag">Montage</div>
              <div className="profile-tag">Motion</div>
              <div className="profile-tag">Gaming</div>
            </div>
            <div className="profile-level-badge">
              {level.emoji} {level.name}
            </div>
          </div>

          <div className="profile-body">
            <div className="profile-name">Lucas M.</div>
            <div className="profile-meta">2 ans d'expérience</div>
            <div className="profile-langs">
              <span className="profile-lang" title="Français">🇫🇷</span>
              <span className="profile-lang" title="Anglais">🇬🇧</span>
            </div>
            <div className="profile-platforms">
              <div className="platform-badge" title="YouTube">📺</div>
              <div className="platform-badge" title="TikTok">🎵</div>
              <div className="platform-badge" title="Instagram">📷</div>
            </div>
            <div className="profile-footer">
              <div className="profile-price">$$ · À partir de 80€</div>
              <div className="profile-rating">⭐ Nouveau</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div>
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="legend-item">
              <div className="legend-dot" />
              <div className="legend-text">
                <strong>{item.label}</strong> — {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion progress */}
      <div
        style={{
          marginTop: 48,
          padding: 24,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'var(--surface)',
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
          Complète ton profil pour plus de visibilité
        </div>
        <div style={{ background: 'var(--surface2)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
          <div style={{ width: '70%', height: '100%', background: 'var(--accent)', borderRadius: 100 }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>
          70% complet — ajoute une vidéo de présentation pour atteindre 85%
        </div>
      </div>

      {error && <div className="step-error">{error}</div>}
      <StepNav
        onBack={() => goToStep(7)}
        backLabel="← Modifier"
        onNext={handlePublish}
        nextLabel={saving ? 'Publication...' : '🚀 Publier mon profil'}
        nextStyle={{ padding: '14px 40px' }}
      />
    </div>
  )
}

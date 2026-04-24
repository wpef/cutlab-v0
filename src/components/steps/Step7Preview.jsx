import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { computeCompletion } from '../../lib/profileCompletion'
import { computeScoreDetails } from '../../lib/computeLevel'
import EditorCard from '../ui/EditorCard'
import StepHeader from '../ui/StepHeader'
import StepNav from '../ui/StepNav'

const LEGEND_ITEMS = [
  { label: 'Niveau',            desc: 'affiché en bas à gauche de la carte, calculé depuis ton profil' },
  { label: 'Drapeaux',          desc: 'langues parlées, visibles par les clients directement' },
  { label: 'Disponibilité',     desc: 'mise à jour depuis ton dashboard en temps réel' },
  { label: 'Tags compétences',  desc: 'tes 3 premières apparaissent sur la carte' },
  { label: 'Indicateur prix',   desc: 'de $ à $$$$ calculé automatiquement depuis ta grille' },
]


export default function Step7Preview() {
  const { goToStep, publishProfile, saving, formData } = useOnboarding()
  const { levelIndex } = computeScoreDetails(formData)
  const [error, setError] = useState('')

  async function handlePublish() {
    setError('')
    const ok = await publishProfile()
    if (!ok) setError('Erreur lors de la publication. Vérifie ta connexion et réessaie.')
  }

  // Completion
  const { pct: completionPct, missing: suggestions } = computeCompletion(formData)

  // Score bar color
  const scoreColor = completionPct >= 80 ? '#00c850' : completionPct >= 50 ? 'var(--accent)' : '#ffc800'

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 7 sur 7"
        title="Voici ta carte profil"
        desc="C'est comme ça que les clients te voient dans le catalogue."
      />

      <div className="card-preview-section">
        {/* Dynamic profile card — shared component */}
        <EditorCard
          profile={{
            avatar_url: formData.avatarUrl,
            first_name: formData.firstName,
            last_name: formData.lastName,
            availability: formData.availability,
            skills: formData.skills,
            assigned_level: levelIndex,
            experience: formData.experience,
            languages: formData.languages,
            formats: formData.formats,
            hourly_rate: formData.hourlyRate,
          }}
        />

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

      {/* Completion score */}
      <div
        style={{
          marginTop: 48,
          padding: 24,
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'var(--surface)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Complétion du profil
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: scoreColor, fontSize: 18 }}>
            {completionPct}%
          </div>
        </div>
        <div style={{ background: 'var(--surface2)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
          <div style={{
            width: `${completionPct}%`,
            height: '100%',
            background: scoreColor,
            borderRadius: 100,
            transition: 'width 0.5s ease',
          }} />
        </div>

        {/* Suggestions if < 80% */}
        {completionPct < 80 && suggestions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Améliorations suggérées
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {suggestions.slice(0, 4).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-dim)' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>+</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {completionPct >= 80 && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#00c850' }}>
            Excellent ! Ton profil est bien rempli.
          </div>
        )}
      </div>

      {error && <div className="step-error">{error}</div>}
      <StepNav
        onBack={() => goToStep(6)}
        backLabel="Modifier"
        onNext={handlePublish}
        nextLabel={saving ? 'Publication...' : 'Publier mon profil'}
        nextStyle={{ padding: '14px 40px' }}
      />
    </div>
  )
}

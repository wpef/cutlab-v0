import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { uploadFile } from '../../lib/uploadFile'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import Tag from '../ui/Tag'
import VideoRecordField from '../ui/VideoRecordField'
import SectionDivider from '../ui/SectionDivider'
import StepNav from '../ui/StepNav'

const MAX_BIO = 280

const MISSION_TYPES = [
  { key: 'ponctuelle',   label: 'Mission ponctuelle' },
  { key: 'long-terme',   label: 'Partenariat long terme' },
]

const RESPONSE_TIMES = [
  { key: '<4h',  label: 'Moins de 4h' },
  { key: '<12h', label: 'Moins de 12h' },
  { key: '<24h', label: 'Moins de 24h' },
  { key: '<48h', label: 'Moins de 48h' },
  { key: '<1w',  label: "Moins d'1 semaine" },
]

export default function Step6Presentation() {
  const { goToStep, formData, updateFormData, user } = useOnboarding()
  const [error, setError] = useState('')
  const [videoUploading, setVideoUploading] = useState(false)

  function handleNext() {
    if (formData.bio.trim().length < 10) { setError('Écris une bio d\'au moins 10 caractères.'); return }
    if (formData.missionTypes.length === 0) { setError('Sélectionne au moins un type de mission.'); return }
    setError('')
    goToStep(7)
  }

  async function handleVideoFile(file) {
    if (!file || !user) return
    setVideoUploading(true)
    const ext = file.name.split('.').pop()
    const url = await uploadFile('videos', `${user.id}/presentation.${ext}`, file)
    setVideoUploading(false)
    if (url) updateFormData({ presentationVideoUrl: url })
  }

  function toggleMission(key) {
    const arr = formData.missionTypes
    updateFormData({ missionTypes: arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key] })
  }

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 6 sur 8"
        title="Ta présentation"
        desc="En 2–3 phrases : qui tu es, ta patte, ce qui te différencie."
      />

      <FormGroup label="Bio courte">
        <textarea
          placeholder="ex: Monteur YouTube depuis 3 ans, spé gaming et lifestyle. J'aime les transitions fluides et le storytelling percutant. Réponse garantie en moins de 4h."
          maxLength={MAX_BIO}
          value={formData.bio}
          onChange={(e) => updateFormData({ bio: e.target.value })}
        />
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
          {formData.bio.length} / {MAX_BIO} caractères
        </div>
      </FormGroup>

      <FormGroup label="Vidéo de présentation" optional="très recommandé — les clients adorent">
        {formData.presentationVideoUrl ? (
          <div>
            <video
              src={formData.presentationVideoUrl}
              controls
              style={{
                width: '100%',
                maxHeight: 220,
                borderRadius: 'var(--radius-sm)',
                background: '#000',
                border: '1px solid var(--border)',
              }}
            />
            <button
              type="button"
              onClick={() => updateFormData({ presentationVideoUrl: '' })}
              style={{
                marginTop: 6,
                background: 'transparent',
                border: 'none',
                color: '#ff4d4d',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Supprimer la vidéo
            </button>
          </div>
        ) : (
          <>
            {videoUploading && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                Upload en cours...
              </div>
            )}
            <VideoRecordField onFileReady={handleVideoFile} />
          </>
        )}
      </FormGroup>

      <SectionDivider>Préférences de collaboration</SectionDivider>

      <FormGroup label="Type de mission recherchée">
        <div className="tag-group">
          {MISSION_TYPES.map((m) => (
            <Tag key={m.key} selected={formData.missionTypes.includes(m.key)} onToggle={() => toggleMission(m.key)}>
              {m.label}
            </Tag>
          ))}
        </div>
      </FormGroup>

      <FormGroup label="Délai de réponse habituel">
        <div className="tag-group">
          {RESPONSE_TIMES.map((rt) => (
            <Tag key={rt.key} selected={formData.responseTime === rt.key} onToggle={() => updateFormData({ responseTime: rt.key })}>
              {rt.label}
            </Tag>
          ))}
        </div>
      </FormGroup>

      <FormGroup label="Réseaux / site perso" optional="optionnel">
        <input
          type="text"
          placeholder="Instagram, TikTok, site web..."
          value={formData.socialLinks}
          onChange={(e) => updateFormData({ socialLinks: e.target.value })}
        />
      </FormGroup>

      {error && <div className="step-error">{error}</div>}
      <StepNav
        onBack={() => goToStep(5)}
        onNext={handleNext}
        nextLabel="Calculer mon niveau →"
      />
    </div>
  )
}

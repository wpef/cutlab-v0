import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import Tag from '../ui/Tag'
import UploadZone from '../ui/UploadZone'
import SectionDivider from '../ui/SectionDivider'
import StepNav from '../ui/StepNav'

const MAX_BIO = 280

const MISSION_TYPES = [
  { key: 'ponctuelle',   label: 'Mission ponctuelle' },
  { key: 'long-terme',   label: 'Partenariat long terme' },
]

const RESPONSE_TIMES = [
  { key: '<1h',  label: "Moins d'1h" },
  { key: '<4h',  label: 'Moins de 4h' },
  { key: '<24h', label: 'Moins de 24h' },
  { key: '<48h', label: 'Sous 48h' },
]

export default function Step6Presentation() {
  const { goToStep } = useOnboarding()

  const [bio,          setBio]         = useState('')
  const [missionTypes, setMissionTypes] = useState(new Set(['ponctuelle', 'long-terme']))
  const [responseTime, setResponseTime] = useState('<4h')

  function toggleMission(key) {
    setMissionTypes((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
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
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
          {bio.length} / {MAX_BIO} caractères
        </div>
      </FormGroup>

      <FormGroup label="Vidéo de présentation" optional="très recommandé — les clients adorent">
        <UploadZone
          icon="🎥"
          title="Face caméra · 20 à 45 secondes"
          hint="Dis bonjour, montre ta personnalité"
          style={{ padding: 24 }}
        />
      </FormGroup>

      <SectionDivider>Préférences de collaboration</SectionDivider>

      <FormGroup label="Type de mission recherchée">
        <div className="tag-group">
          {MISSION_TYPES.map((m) => (
            <Tag key={m.key} selected={missionTypes.has(m.key)} onToggle={() => toggleMission(m.key)}>
              {m.label}
            </Tag>
          ))}
        </div>
      </FormGroup>

      <FormGroup label="Délai de réponse habituel">
        <div className="tag-group">
          {RESPONSE_TIMES.map((rt) => (
            <Tag key={rt.key} selected={responseTime === rt.key} onToggle={() => setResponseTime(rt.key)}>
              {rt.label}
            </Tag>
          ))}
        </div>
      </FormGroup>

      <FormGroup label="Réseaux / site perso" optional="optionnel">
        <input type="text" placeholder="Instagram, TikTok, site web..." />
      </FormGroup>

      <StepNav
        onBack={() => goToStep(5)}
        onNext={() => goToStep(7)}
        nextLabel="Calculer mon niveau →"
      />
    </div>
  )
}

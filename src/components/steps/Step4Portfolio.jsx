import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import UploadZone from '../ui/UploadZone'
import SectionDivider from '../ui/SectionDivider'
import Button from '../ui/Button'
import StepNav from '../ui/StepNav'

export default function Step4Portfolio() {
  const { goToStep, formData, updateFormData } = useOnboarding()

  const [links, setLinks] = useState(formData.portfolioLinks)
  const [creditedChannels, setCreditedChannels] = useState(formData.creditedChannels)

  function setLink(i, val) {
    setLinks((prev) => {
      const next = [...prev]
      next[i] = val
      return next
    })
  }

  function save() {
    updateFormData({ portfolioLinks: links, creditedChannels })
  }

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 4 sur 8"
        title="Ton portfolio"
        desc="Des clips de 15 à 45 secondes suffisent. Les clients veulent voir ta patte, pas un film."
      />

      <UploadZone
        icon="🎬"
        title="Glisse tes clips ici"
        hint="MP4 · Max 500Mo par clip"
        accept="video/mp4,video/quicktime,video/webm"
        multiple
        style={{ marginBottom: 24 }}
      >
        <Button variant="ghost" style={{ marginTop: 8 }} onClick={(e) => e.stopPropagation()}>Parcourir les fichiers</Button>
      </UploadZone>

      <SectionDivider>Ou ajoute des liens externes</SectionDivider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="🔗 Lien YouTube, Vimeo, Google Drive..."
          value={links[0] ?? ''}
          onChange={(e) => setLink(0, e.target.value)}
        />
        <input
          type="text"
          placeholder="🔗 Ajouter un autre lien"
          value={links[1] ?? ''}
          onChange={(e) => setLink(1, e.target.value)}
        />
      </div>

      <FormGroup label="Chaînes / comptes sur lesquels tu as été crédité" optional="optionnel">
        <input
          type="text"
          placeholder="ex: @nomdelachain, youtube.com/c/..."
          value={creditedChannels}
          onChange={(e) => setCreditedChannels(e.target.value)}
        />
      </FormGroup>

      <HintBox>
        💡 <strong>Astuce :</strong> un seul clip suffit pour publier ton profil. Tu pourras en ajouter d'autres plus tard.
      </HintBox>

      <StepNav
        onBack={() => { save(); goToStep(3) }}
        onNext={() => { save(); goToStep(5) }}
        onSkip={() => { save(); goToStep(5) }}
      />
    </div>
  )
}

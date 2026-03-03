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

  function setLink(i, val) {
    const next = [...formData.portfolioLinks]
    next[i] = val
    updateFormData({ portfolioLinks: next })
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
        hint="MP4 · Max 500 Mo par clip"
        accept="video/mp4,video/quicktime,video/webm"
        multiple
        maxSizeMB={500}
        style={{ marginBottom: 24 }}
      >
        <Button variant="ghost" style={{ marginTop: 8 }} onClick={(e) => e.stopPropagation()}>Parcourir les fichiers</Button>
      </UploadZone>

      <SectionDivider>Ou ajoute des liens externes</SectionDivider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="🔗 Lien YouTube, Vimeo, Google Drive..."
          value={formData.portfolioLinks[0] ?? ''}
          onChange={(e) => setLink(0, e.target.value)}
        />
        <input
          type="text"
          placeholder="🔗 Ajouter un autre lien"
          value={formData.portfolioLinks[1] ?? ''}
          onChange={(e) => setLink(1, e.target.value)}
        />
      </div>

      <FormGroup label="Chaînes / comptes sur lesquels tu as été crédité" optional="optionnel">
        <input
          type="text"
          placeholder="ex: @nomdelachain, youtube.com/c/..."
          value={formData.creditedChannels}
          onChange={(e) => updateFormData({ creditedChannels: e.target.value })}
        />
      </FormGroup>

      <HintBox>
        💡 <strong>Astuce :</strong> un seul clip suffit pour publier ton profil. Tu pourras en ajouter d'autres plus tard.
      </HintBox>

      <StepNav
        onBack={() => goToStep(3)}
        onNext={() => goToStep(5)}
        onSkip={() => goToStep(5)}
      />
    </div>
  )
}

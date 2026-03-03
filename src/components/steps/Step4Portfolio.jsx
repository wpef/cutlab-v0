import { useOnboarding } from '../../context/OnboardingContext'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import UploadZone from '../ui/UploadZone'
import SectionDivider from '../ui/SectionDivider'
import Button from '../ui/Button'
import StepNav from '../ui/StepNav'

export default function Step4Portfolio() {
  const { goToStep } = useOnboarding()

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 4 sur 8"
        title="Ton portfolio"
        desc="Des clips de 15 à 45 secondes suffisent. Les clients veulent voir ta patte, pas un film."
      />

      <UploadZone icon="🎬" title="Glisse tes clips ici" hint="MP4 · Max 500Mo par clip" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }} />
        <Button variant="ghost" style={{ marginTop: 8 }}>Parcourir les fichiers</Button>
      </UploadZone>

      <SectionDivider>Ou ajoute des liens externes</SectionDivider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <input type="text" placeholder="🔗 Lien YouTube, Vimeo, Google Drive..." />
        <input type="text" placeholder="🔗 Ajouter un autre lien" />
      </div>

      <FormGroup label="Chaînes / comptes sur lesquels tu as été crédité" optional="optionnel">
        <input type="text" placeholder="ex: @nomdelachain, youtube.com/c/..." />
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

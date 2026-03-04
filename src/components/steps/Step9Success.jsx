import { useOnboarding } from '../../context/OnboardingContext'
import Button from '../ui/Button'

export default function Step9Success() {
  const { goToEditor, goToProjects } = useOnboarding()

  return (
    <div className="step-screen">
      <div className="success-screen">
        <div className="success-icon">✓</div>
        <h1 style={{ marginBottom: 16 }}>Ton profil est en ligne !</h1>
        <p className="step-desc" style={{ maxWidth: 400, margin: '0 auto 48px' }}>
          Tu es maintenant visible dans le catalogue. Les premières demandes arrivent généralement dans les 48h.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300, margin: '0 auto' }}>
          <Button variant="primary" style={{ width: '100%' }} onClick={goToProjects}>Voir mes projets</Button>
          <Button variant="ghost" style={{ width: '100%' }} onClick={goToEditor}>Modifier mon profil</Button>
        </div>
      </div>
    </div>
  )
}

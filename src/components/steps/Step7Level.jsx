import { useState, useEffect } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { LEVELS } from '../../constants/levels'
import StepHeader from '../ui/StepHeader'
import StepNav from '../ui/StepNav'

const CIRCUMFERENCE = 471 // 2π × 75

const LOADING_MESSAGES = [
  { pct: 0,  text: 'Lecture du profil...' },
  { pct: 20, text: 'Analyse des compétences...' },
  { pct: 40, text: 'Évaluation du portfolio...' },
  { pct: 60, text: "Calcul de l'expérience..." },
  { pct: 80, text: 'Comparaison avec la communauté...' },
  { pct: 95, text: 'Finalisation du niveau...' },
]

export default function Step7Level() {
  const { goToStep, assignedLevel, setAssignedLevel } = useOnboarding()

  const [phase,       setPhase]       = useState('loading') // 'loading' | 'result'
  const [progress,    setProgress]    = useState(0)
  const [loadingText, setLoadingText] = useState('Lecture du profil...')
  const [localLevel,  setLocalLevel]  = useState(assignedLevel)
  const [showPicker,  setShowPicker]  = useState(false)
  const [certifSent,  setCertifSent]  = useState(false)

  // Run the progress animation once on mount
  useEffect(() => {
    let pct = 0
    const interval = setInterval(() => {
      pct++
      setProgress(pct)

      for (let i = LOADING_MESSAGES.length - 1; i >= 0; i--) {
        if (pct >= LOADING_MESSAGES[i].pct) {
          setLoadingText(LOADING_MESSAGES[i].text)
          break
        }
      }

      if (pct >= 100) {
        clearInterval(interval)
        setTimeout(() => setPhase('result'), 500)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [])

  function pickLevel(idx) {
    setLocalLevel(idx)
    setAssignedLevel(idx)
  }

  const level = LEVELS[localLevel]
  const strokeOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 7 sur 8"
        title="Ton niveau"
        desc="On analyse ton profil pour te placer au bon endroit dans la communauté."
      />

      {/* LOADING */}
      {phase === 'loading' && (
        <div className="level-loading">
          <div className="circle-wrap">
            <div className="circle-bg" />
            <div className="circle-progress">
              <svg viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="75"
                  style={{ strokeDashoffset: strokeOffset }}
                />
              </svg>
            </div>
            <div className="circle-inner">
              <div className="circle-pct">{progress}%</div>
              <div className="circle-label">Analyse</div>
            </div>
          </div>
          <div className="loading-text">{loadingText}</div>
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && (
        <div className="level-result">
          <div className="level-badge-big">
            <div className="level-badge-emoji">{level.emoji}</div>
          </div>
          <div className="level-badge-name">{level.name}</div>
          <div className="level-desc">{level.desc}</div>

          <div className="level-actions">
            <button className="level-modify-btn" onClick={() => setShowPicker((v) => !v)}>
              ✏️ Contester ou modifier mon niveau
            </button>

            {showPicker && (
              <div className="level-picker">
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Choisis le niveau qui te correspond :
                </div>
                <div className="level-picker-grid">
                  {LEVELS.map((lvl, idx) => (
                    <div
                      key={lvl.name}
                      className={`level-pick-item${localLevel === idx ? ' selected' : ''}`}
                      onClick={() => pickLevel(idx)}
                    >
                      <span className="level-pick-emoji">{lvl.emoji}</span>
                      {lvl.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!certifSent ? (
              <button className="level-certify-btn" onClick={() => setCertifSent(true)}>
                🛡️ Demander un profil certifié
              </button>
            ) : (
              <div className="certif-banner">
                <span className="certif-icon">✅</span>
                <span>
                  Demande envoyée ! Notre équipe vérifie ton profil dans les 48h.
                  Une fois certifié, un badge apparaît sur ta carte.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <StepNav onBack={() => goToStep(6)} onNext={() => goToStep(8)} nextLabel="Voir mon profil →" />
      )}
    </div>
  )
}

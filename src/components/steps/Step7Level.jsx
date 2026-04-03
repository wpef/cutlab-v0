import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboarding } from '../../context/OnboardingContext'
import { LEVELS } from '../../constants/levels'
import { computeScoreDetails } from '../../lib/computeLevel'
import ScoreBreakdown from '../ui/ScoreBreakdown'
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
  const { goToStep, formData, updateFormData, saveProfile, user } = useOnboarding()

  const [phase,       setPhase]       = useState('loading') // 'loading' | 'result'
  const [progress,    setProgress]    = useState(0)
  const [loadingText, setLoadingText] = useState('Lecture du profil...')
  const [certifSent,  setCertifSent]  = useState(formData.certificationStatus === 'pending')

  // Compute score from formData (read-only, no picker)
  const scoreDetails = computeScoreDetails(formData)
  const { total: scoreTotal, levelIndex } = scoreDetails
  const level = LEVELS[levelIndex]

  // Animated score bar width — starts at 0, animates to scoreTotal after reveal
  const [animatedScore, setAnimatedScore] = useState(0)
  const [showBreakdown, setShowBreakdown] = useState(false)

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
        setTimeout(() => {
          setPhase('result')
          // Trigger score bar animation after a short delay
          setTimeout(() => setAnimatedScore(scoreTotal), 50)
        }, 500)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [])

  async function handleRequestCertif() {
    updateFormData({ certificationStatus: 'pending' })
    setCertifSent(true)
    if (user) {
      // Persist immediately to DB
      await saveProfile()
    }
  }

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
        <div className="step7-level-result">
          {/* Level badge */}
          <div className="step7-level-badge">
            <div className="level-badge-big">
              <div className="level-badge-emoji">{level.emoji}</div>
            </div>
            <div className="level-badge-name">{level.name}</div>
          </div>

          {/* Score bar */}
          <div className="step7-score-bar">
            <div className="step7-score-text">
              <span className="step7-score-label">Score calculé</span>
              <span className="step7-score-value">{scoreTotal} / 100</span>
            </div>
            <div className="step7-score-track">
              <div
                className="step7-score-fill"
                style={{ width: `${animatedScore}%` }}
              />
            </div>
          </div>

          {/* Score breakdown toggle */}
          <button
            className="score-breakdown-toggle"
            onClick={() => setShowBreakdown((v) => !v)}
          >
            {showBreakdown ? 'Masquer le détail' : 'Voir le détail du score'}
          </button>

          <AnimatePresence initial={false}>
            {showBreakdown && (
              <motion.div
                key="breakdown"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <ScoreBreakdown scoreDetails={scoreDetails} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Level description */}
          <div className="level-desc">{level.desc}</div>

          {/* Actions */}
          <div className="level-actions">
            {!certifSent ? (
              <button className="level-certify-btn" onClick={handleRequestCertif}>
                Demander un profil certifié
              </button>
            ) : (
              <div className="certif-banner">
                <span className="certif-icon">✓</span>
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

import { useState, useEffect, useRef } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { LEVELS } from '../../constants/levels'
import { computeAutoLevel, computeScoreDetails, SCORE_RUBRIC, getScoreExplanation } from '../../lib/computeLevel'
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
  const { goToStep, assignedLevel, setAssignedLevel, formData, updateFormData, saveProfile, user } = useOnboarding()

  const [phase,       setPhase]       = useState('loading') // 'loading' | 'result'
  const [progress,    setProgress]    = useState(0)
  const [loadingText, setLoadingText] = useState('Lecture du profil...')
  const [localLevel,  setLocalLevel]  = useState(assignedLevel)
  const [showPicker,  setShowPicker]  = useState(false)
  const [showRubric,  setShowRubric]  = useState(false)
  const [certifSent,  setCertifSent]  = useState(formData.certificationStatus === 'pending')
  const autoLevelRef = useRef(null)

  // Compute automatic level once on mount
  useEffect(() => {
    const computed = computeAutoLevel(formData)
    autoLevelRef.current = computed
  }, [])

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
          // Apply the auto-computed level
          const computed = autoLevelRef.current ?? computeAutoLevel(formData)
          setLocalLevel(computed)
          setAssignedLevel(computed)
          setPhase('result')
        }, 500)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [])

  function pickLevel(idx) {
    setLocalLevel(idx)
    setAssignedLevel(idx)
  }

  async function handleRequestCertif() {
    updateFormData({ certificationStatus: 'pending' })
    setCertifSent(true)
    if (user) {
      // Persist immediately to DB
      await saveProfile()
    }
  }

  const level = LEVELS[localLevel]
  const strokeOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  // Score details for rubric display
  const { total: scoreTotal, details: scoreDetails } = computeScoreDetails(formData)
  const scoreExplanations = getScoreExplanation(formData)
  const autoLevel = computeAutoLevel(formData)

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

          {/* Score summary */}
          <div style={{
            width: '100%',
            maxWidth: 380,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 18px',
            fontSize: 13,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}>Score calculé</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'var(--accent)', fontSize: 20 }}>
                {scoreTotal} / 100
              </span>
            </div>
            <div style={{ background: 'var(--surface2)', borderRadius: 100, height: 5, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: `${scoreTotal}%`, height: '100%', background: 'var(--accent)', borderRadius: 100, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
              <span>Débutant (&lt; 35)</span>
              <span>Pro (35–64)</span>
              <span>Expert (65+)</span>
            </div>

            {/* Rubric toggle */}
            <button
              onClick={() => setShowRubric((v) => !v)}
              style={{
                display: 'block',
                width: '100%',
                marginTop: 12,
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                fontSize: 12,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                padding: 0,
              }}
            >
              {showRubric ? '▲ Masquer le barème' : '▼ Voir le détail du barème'}
            </button>

            {showRubric && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {SCORE_RUBRIC.map((criterion, i) => (
                  <div key={criterion.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{criterion.label}</span>
                      <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}>
                        {scoreDetails[i]} / {criterion.max}
                      </span>
                    </div>
                    <div style={{ background: 'var(--border)', borderRadius: 100, height: 3 }}>
                      <div style={{
                        width: `${(scoreDetails[i] / criterion.max) * 100}%`,
                        height: '100%',
                        background: 'var(--accent)',
                        borderRadius: 100,
                        opacity: 0.7,
                      }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{scoreExplanations[i]} = {scoreDetails[i]} pts</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="level-actions">
            <button className="level-modify-btn" onClick={() => setShowPicker((v) => !v)}>
              Contester ou modifier mon niveau
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
                      className={`level-pick-item${localLevel === idx ? ' selected' : ''}${idx === autoLevel ? ' auto-level' : ''}`}
                      onClick={() => pickLevel(idx)}
                    >
                      <span className="level-pick-emoji">{lvl.emoji}</span>
                      <span>
                        {lvl.name}
                        {idx === autoLevel && (
                          <span style={{ fontSize: 10, color: 'var(--accent)', marginLeft: 4, fontWeight: 600 }}>AUTO</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

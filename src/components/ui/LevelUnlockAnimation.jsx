import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { LEVELS } from '../../constants/levels'

// Five particle starting positions (random edge offsets are seeded for determinism)
const PARTICLES = [
  { id: 0, startX: -120, startY: -80 },
  { id: 1, startX:  130, startY: -60 },
  { id: 2, startX: -100, startY:  90 },
  { id: 3, startX:  110, startY:  70 },
  { id: 4, startX:    0, startY: -130 },
]

/**
 * Gamified "achievement unlocked" sequence for the level reveal in Step 7.
 *
 * Props:
 *   levelIndex  - LEVELS array index (0-6)
 *   score       - numeric score (0-100)
 *   onComplete  - called after the counter phase so the parent can fade in the breakdown/CTA
 */
export default function LevelUnlockAnimation({ levelIndex, score, onComplete }) {
  const prefersReduced = useReducedMotion()
  const level = LEVELS[levelIndex]

  // Animation sub-phases driven by timeouts
  // 'overlay' → 'badge' → 'label' → 'name' → 'counter' → 'done'
  const [subPhase, setSubPhase] = useState('overlay')

  // Score counter (counts 0 → score over ~1s during 'counter' phase)
  const [displayScore, setDisplayScore] = useState(0)
  const counterRef = useRef(null)

  // Score bar animated width (mirrors displayScore)
  const barWidth = score > 0 ? (displayScore / 100) * 100 : 0

  useEffect(() => {
    if (prefersReduced) {
      // Skip animation — show final state immediately
      setDisplayScore(score)
      setSubPhase('done')
      onComplete?.()
      return
    }

    // Phase timeline (ms from mount):
    // 0       overlay fades in   (0.3s)
    // 300     badge appears      (0.8s spring)
    // 1100    label fades in     (0.4s)
    // 1500    name fades in      (0.3s)
    // 1800    counter starts     (1s)
    // 2800    done — call onComplete

    const t1 = setTimeout(() => setSubPhase('badge'),   300)
    const t2 = setTimeout(() => setSubPhase('label'),  1100)
    const t3 = setTimeout(() => setSubPhase('name'),   1500)
    const t4 = setTimeout(() => {
      setSubPhase('counter')
      // Counting interval: step every 16ms, ~1s total
      const steps = 60
      const stepValue = score / steps
      let current = 0
      counterRef.current = setInterval(() => {
        current += stepValue
        if (current >= score) {
          setDisplayScore(score)
          clearInterval(counterRef.current)
        } else {
          setDisplayScore(Math.round(current))
        }
      }, 1000 / steps)
    }, 1800)
    const t5 = setTimeout(() => {
      setSubPhase('done')
      onComplete?.()
    }, 2850)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      if (counterRef.current) clearInterval(counterRef.current)
    }
  }, [score, prefersReduced, onComplete])

  const show = (phase) => {
    const order = ['overlay', 'badge', 'label', 'name', 'counter', 'done']
    return order.indexOf(subPhase) >= order.indexOf(phase)
  }

  if (prefersReduced) {
    // Reduced-motion: render final state instantly with no animation
    return (
      <div className="lua-container" aria-live="polite">
        <div className="lua-badge">
          <div className="lua-emoji" role="img" aria-label={`Niveau ${level.name}`}>{level.emoji}</div>
        </div>
        <div className="lua-unlocked-label">Niveau débloqué</div>
        <div className="lua-level-name">{level.name}</div>
        <div className="lua-score-wrap">
          <div className="lua-score-row">
            <span className="lua-score-label">Score calculé</span>
            <span className="lua-score-value">{score} / 100</span>
          </div>
          <div className="lua-bar-track">
            <div className="lua-bar-fill" style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lua-container" aria-live="polite">
      {/* Dark overlay — pre-reveal atmosphere */}
      <AnimatePresence>
        {show('overlay') && (
          <motion.div
            className="lua-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Badge + particles */}
      <div className="lua-badge-wrap">
        {/* Particles — spawn parallel to badge, converge to center */}
        <AnimatePresence>
          {show('badge') && PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="lua-particle"
              initial={{ x: p.startX, y: p.startY, opacity: 0.9, scale: 1 }}
              animate={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.6, ease: 'easeIn', delay: p.id * 0.04 }}
            />
          ))}
        </AnimatePresence>

        {/* Badge circle with glow pulse */}
        <AnimatePresence>
          {show('badge') && (
            <motion.div
              className="lua-badge"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.2, 1], rotate: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1], // spring-like cubic
                times: [0, 0.65, 1],
              }}
            >
              <motion.div
                className="lua-badge-glow"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              />
              <div className="lua-emoji" role="img" aria-label={`Niveau ${level.name}`}>
                {level.emoji}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* "Niveau débloqué" label */}
      <AnimatePresence>
        {show('label') && (
          <motion.div
            className="lua-unlocked-label"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            Niveau débloqué
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level name */}
      <AnimatePresence>
        {show('name') && (
          <motion.div
            className="lua-level-name"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {level.name}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score counter + bar */}
      <AnimatePresence>
        {show('counter') && (
          <motion.div
            className="lua-score-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="lua-score-row">
              <span className="lua-score-label">Score calculé</span>
              <span className="lua-score-value">{displayScore} / 100</span>
            </div>
            <div className="lua-bar-track">
              <div
                className="lua-bar-fill"
                style={{ width: `${barWidth}%`, transition: 'width 0.08s linear' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { motion } from 'framer-motion'
import { SCORE_PARAMS } from '../../lib/computeLevel'

/**
 * Reusable score breakdown component.
 * Shows 7 rows (one per scoring parameter) with label, points, and animated bar.
 *
 * @param {{ scoreDetails: { total: number, details: object, levelIndex: number } }} props
 */
export default function ScoreBreakdown({ scoreDetails }) {
  const { total, details } = scoreDetails

  return (
    <div className="score-breakdown">
      {SCORE_PARAMS.map((param, i) => {
        const points = details[param.key] ?? 0
        const pct = param.maxPoints > 0 ? (points / param.maxPoints) * 100 : 0

        return (
          <div className="score-breakdown-row" key={param.key}>
            <div className="score-breakdown-row-top">
              <span className="score-breakdown-label">{param.label}</span>
              <span className="score-breakdown-points">
                {points} / {param.maxPoints}
              </span>
            </div>
            <div className="score-breakdown-bar-track">
              <motion.div
                className="score-breakdown-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: 'easeOut' }}
              />
            </div>
          </div>
        )
      })}

      <div className="score-breakdown-total">
        Total : {total} / 100
      </div>
    </div>
  )
}

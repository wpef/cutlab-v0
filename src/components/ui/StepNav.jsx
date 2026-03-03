import Button from './Button'

/**
 * StepNav — bottom navigation bar shared by all steps.
 *
 * @param {Function} [onBack]    renders ← Retour ghost button when provided
 * @param {string}   [backLabel]
 * @param {Function} [onNext]    renders primary CTA button when provided
 * @param {string}   [nextLabel]
 * @param {Function} [onSkip]    renders skip link when provided
 * @param {string}   [skipLabel]
 * @param {React.CSSProperties} [nextStyle]  extra style for the primary button
 */
export default function StepNav({
  onBack,
  backLabel = '← Retour',
  onNext,
  nextLabel = 'Continuer →',
  onSkip,
  skipLabel = 'Passer pour l\'instant',
  nextStyle,
}) {
  return (
    <div className="step-nav">
      {onBack ? (
        <Button variant="ghost" onClick={onBack}>{backLabel}</Button>
      ) : (
        <div />
      )}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {onSkip && (
          <Button variant="skip" onClick={onSkip}>{skipLabel}</Button>
        )}
        {onNext && (
          <Button variant="primary" onClick={onNext} style={nextStyle}>{nextLabel}</Button>
        )}
      </div>
    </div>
  )
}

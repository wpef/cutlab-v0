/**
 * StepHeader — displays the step label, title and description.
 *
 * @param {string} tag    e.g. "Étape 1 sur 8"
 * @param {string} title  main h1 heading
 * @param {string} desc   subtitle / description
 */
export default function StepHeader({ tag, title, desc }) {
  return (
    <div className="step-header">
      <div className="step-tag">{tag}</div>
      <h1>{title}</h1>
      <p className="step-desc">{desc}</p>
    </div>
  )
}

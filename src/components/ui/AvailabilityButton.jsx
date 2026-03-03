/**
 * AvailabilityButton — pill with a coloured dot indicator.
 *
 * @param {string} label
 * @param {boolean} selected
 * @param {Function} onSelect
 */
export default function AvailabilityButton({ label, selected, onSelect }) {
  return (
    <div
      className={`avail-btn${selected ? ' selected' : ''}`}
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
    >
      <div className="avail-dot" />
      {label}
    </div>
  )
}

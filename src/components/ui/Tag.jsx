/**
 * Tag — toggleable pill tag.
 *
 * @param {boolean} selected
 * @param {Function} onToggle
 * @param {React.ReactNode} [icon]   emoji or string rendered before the label
 * @param {React.ReactNode} children  label text
 */
export default function Tag({ selected, onToggle, icon, children }) {
  return (
    <div
      className={`tag${selected ? ' selected' : ''}`}
      onClick={onToggle}
      role="checkbox"
      aria-checked={selected}
    >
      {icon && <span className="tag-icon">{icon}</span>}
      {children}
    </div>
  )
}

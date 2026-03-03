/**
 * NicheTag — compact tag variant used for content niches.
 * Supports an "all" (tout) mode that renders with a heavier style when selected.
 *
 * @param {boolean} selected
 * @param {boolean} [isTout]   marks this as the master "all" toggle
 * @param {Function} onToggle
 * @param {React.ReactNode} children
 */
export default function NicheTag({ selected, isTout = false, onToggle, children }) {
  const cls = [
    'niche-tag',
    isTout ? 'tout' : '',
    selected ? 'selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} onClick={onToggle} role="checkbox" aria-checked={selected}>
      {children}
    </div>
  )
}

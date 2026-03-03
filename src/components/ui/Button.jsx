/**
 * Button — reusable button with three visual variants.
 *
 * @param {'primary'|'ghost'|'skip'} variant
 * @param {React.ReactNode} children
 * @param {Function} onClick
 * @param {React.CSSProperties} [style]
 */
export default function Button({ variant = 'primary', children, onClick, style, type = 'button' }) {
  const classMap = {
    primary: 'btn btn-primary',
    ghost: 'btn btn-ghost',
    skip: 'btn-skip',
  }

  return (
    <button className={classMap[variant] ?? 'btn btn-primary'} onClick={onClick} style={style} type={type}>
      {children}
    </button>
  )
}

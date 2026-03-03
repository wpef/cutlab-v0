/**
 * HintBox — accent-bordered info callout.
 *
 * @param {React.ReactNode} children  supports <strong> for highlighted text
 * @param {React.CSSProperties} [style]
 */
export default function HintBox({ children, style }) {
  return (
    <div className="hint-box" style={style}>
      {children}
    </div>
  )
}

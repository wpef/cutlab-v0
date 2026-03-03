/**
 * FormGroup — label + field wrapper.
 *
 * @param {string} label
 * @param {string} [optional]  text shown after the label in a muted style
 * @param {React.ReactNode} children
 * @param {React.CSSProperties} [style]
 */
export default function FormGroup({ label, optional, children, style }) {
  return (
    <div className="form-group" style={style}>
      <label>
        {label}
        {optional && <span className="optional"> ({optional})</span>}
      </label>
      {children}
    </div>
  )
}

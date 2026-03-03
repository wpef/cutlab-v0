/**
 * UploadZone — dashed drag-and-drop upload area.
 *
 * @param {string} icon       emoji displayed prominently
 * @param {string} title      primary label
 * @param {string} hint       secondary muted text
 * @param {React.ReactNode} [children]   extra content (e.g. a button)
 * @param {React.CSSProperties} [style]
 */
export default function UploadZone({ icon, title, hint, children, style }) {
  return (
    <div className="upload-zone" style={style}>
      <div className="upload-icon">{icon}</div>
      <div className="upload-title">{title}</div>
      <div className="upload-hint">{hint}</div>
      {children}
    </div>
  )
}

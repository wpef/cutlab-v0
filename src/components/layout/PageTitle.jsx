export default function PageTitle({ title, children }) {
  if (!title && !children) return null
  return (
    <div className="page-title-bar">
      {title && <h2 className="page-title-text">{title}</h2>}
      {children && <div className="page-title-actions">{children}</div>}
    </div>
  )
}

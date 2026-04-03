const STATUS_CONFIG = {
  draft:     { label: 'Brouillon', className: 'project-status-badge--draft' },
  published: { label: 'Publié',    className: 'project-status-badge--published' },
  filled:    { label: 'Pourvu',    className: 'project-status-badge--filled' },
  completed: { label: 'Terminé',   className: 'project-status-badge--completed' },
  cancelled: { label: 'Annulé',    className: 'project-status-badge--cancelled' },
}

export default function ProjectStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft
  return (
    <span className={`project-status-badge ${config.className}`}>
      {config.label}
    </span>
  )
}

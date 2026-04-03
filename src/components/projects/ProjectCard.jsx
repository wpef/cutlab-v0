import { motion } from 'framer-motion'
import { FORMATS, DELIVERABLE_TYPES } from '../../constants/options'
import ProjectStatusBadge from './ProjectStatusBadge'

function formatBudget(project) {
  if (project.budget_type === 'range') {
    return `${project.budget_min} – ${project.budget_max} €`
  }
  return project.budget_fixed ? `${project.budget_fixed} €` : '—'
}

function formatDeadline(deadline) {
  if (!deadline) return ''
  return new Date(deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ProjectCard({ project, onClick, showAppCount = false }) {
  const formatLabel = FORMATS.find((f) => f.key === project.content_format)?.label || ''

  return (
    <motion.div
      className="project-card"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="project-card-header">
        <div className="project-card-title">{project.title}</div>
        <ProjectStatusBadge status={project.status} />
      </div>

      {formatLabel && <div className="project-card-format">{formatLabel}</div>}

      <div className="project-card-meta">
        <span>💰 {formatBudget(project)}</span>
        {project.deadline && <span>📅 {formatDeadline(project.deadline)}</span>}
        {project.deliverables?.length > 0 && (
          <span>📦 {project.deliverables.length} livrable{project.deliverables.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {(showAppCount || project.profiles) && (
        <div className="project-card-bottom">
          {project.profiles && (
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {project.profiles.first_name} {project.profiles.last_name?.[0]}.
            </span>
          )}
          {showAppCount && (
            <span className="project-card-apps">
              {project.application_count ?? 0} candidature{(project.application_count ?? 0) !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

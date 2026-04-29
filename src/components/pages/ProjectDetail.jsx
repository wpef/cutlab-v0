import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import { useProjects } from '../../context/ProjectContext'
import { FORMATS, DELIVERABLE_TYPES, LANGUAGES, EXPERIENCE_OPTIONS, MISSION_TYPES, QUALITY_OPTIONS, SOFTWARE } from '../../constants/options'
import PageTitle from '../layout/PageTitle'
import ProjectStatusBadge from '../projects/ProjectStatusBadge'
import ApplicationList from '../projects/ApplicationList'
import { toast } from '../ui/Toast'

function formatBudget(p) {
  if (p.budget_type === 'range') return `${p.budget_min} – ${p.budget_max} €`
  return p.budget_fixed ? `${p.budget_fixed} €` : '—'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function labelFor(options, key) {
  if (!key) return '—'
  const found = options.find((o) => (o.key || o) === key)
  return found?.label || found || key
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, userRole, formData, goToProjectForm, goToMyProjects, goToChat } = useOnboarding()
  const {
    currentProject, fetchProjectById,
    checkExistingApplication, submitApplication, withdrawApplication,
    fetchProjectApplications, applications, acceptApplication, refuseApplication,
    publishProject, cancelProject, completeProject, updatePublishedProject,
  } = useProjects()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [existingApp, setExistingApp] = useState(null) // { id, status } or null
  const [appLoading, setAppLoading] = useState(false)

  const project = currentProject

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchProjectById(id).then((p) => {
      setLoading(false)
      if (!p) setNotFound(true)
    })
  }, [id])

  // Check if editor already applied
  useEffect(() => {
    if (!project || !user || userRole !== 'editor') return
    checkExistingApplication(project.id).then(setExistingApp)
  }, [project, user, userRole])

  // Load applications if creator
  useEffect(() => {
    if (!project || !user) return
    if (project.creator_id === user.id) {
      fetchProjectApplications(project.id)
    }
  }, [project, user])

  if (loading) {
    return <div className="project-detail" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Chargement…</div>
  }
  if (notFound || !project) {
    return (
      <div className="project-detail" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif' }}>Projet introuvable</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 24 }}>Ce projet n'existe pas ou n'est plus accessible.</p>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Retour</button>
      </div>
    )
  }

  const isCreator = user && project.creator_id === user.id
  const isEditor = userRole === 'editor'
  const creatorProfile = project.profiles || {}
  const creatorName = [creatorProfile.first_name, creatorProfile.last_name].filter(Boolean).join(' ') || 'Créateur'

  // ─── Candidature actions (editor) ──────────────────────────
  async function handleApply() {
    if (formData.certificationStatus !== 'certified' && !formData.bio) {
      // Profile not published — simplified check
    }
    setAppLoading(true)
    const req = await submitApplication(project)
    setAppLoading(false)
    if (req) {
      toast.success('Candidature envoyée')
      setExistingApp({ id: req.id, status: 'pending' })
    } else {
      toast.error("Erreur lors de l'envoi de la candidature")
    }
  }

  async function handleWithdraw() {
    if (!confirm('Retirer votre candidature ?')) return
    setAppLoading(true)
    const ok = await withdrawApplication(existingApp.id, project)
    setAppLoading(false)
    if (ok) {
      toast.success('Candidature retirée')
      setExistingApp(null)
    } else {
      toast.error('Erreur lors du retrait')
    }
  }

  // ─── Creator actions ───────────────────────────────────────
  async function handlePublish() {
    if (new Date(project.deadline) <= new Date()) {
      toast.error('La date limite doit être à venir')
      return
    }
    const ok = await publishProject(project.id)
    if (ok) toast.success('Projet publié')
  }

  async function handleCancel() {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce projet ? Les monteurs ayant candidaté seront notifiés.')) return
    const ok = await cancelProject(project.id)
    if (ok) toast.success('Projet annulé')
  }

  async function handleComplete() {
    const ok = await completeProject(project.id)
    if (ok) toast.success('Projet marqué comme terminé')
  }

  async function handleAcceptApp(requestId) {
    if (!confirm('Accepter cette candidature ? Le projet sera marqué comme pourvu.')) return
    await acceptApplication(requestId, project.id)
  }

  async function handleRefuseApp(requestId) {
    if (!confirm('Refuser cette candidature ?')) return
    const ok = await refuseApplication(requestId)
    if (ok) toast.success('Candidature refusée')
  }

  // Can editor apply?
  const deadlinePassed = project.deadline && new Date(project.deadline) < new Date()
  const canApply = isEditor && !existingApp && project.status === 'published' && !deadlinePassed

  return (
    <div className="project-detail">
      <button className="btn btn-ghost" style={{ marginBottom: 12, padding: '6px 0' }} onClick={() => navigate(-1)}>
        ← Retour
      </button>

      {/* Header */}
      <div className="project-detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <ProjectStatusBadge status={project.status} />
        </div>
        <h1 className="project-detail-title">{project.title}</h1>
        {!isCreator && (
          <div className="project-detail-creator">
            <div className="project-detail-creator-avatar">
              {creatorProfile.avatar_url
                ? <img src={creatorProfile.avatar_url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : creatorName[0]?.toUpperCase()
              }
            </div>
            <div className="project-detail-creator-name">{creatorName}</div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="project-detail-section">
        <div className="project-detail-section-title">Description</div>
        <div className="project-detail-description">{project.description}</div>
      </div>

      {/* Deliverables */}
      {project.deliverables?.length > 0 && (
        <div className="project-detail-section">
          <div className="project-detail-section-title">Livrables</div>
          <div className="project-detail-deliverables">
            {project.deliverables.map((d, i) => {
              const dt = DELIVERABLE_TYPES.find((t) => t.key === d.type)
              return (
                <div key={i} className="project-detail-deliverable">
                  <span className="project-detail-deliverable-qty">×{d.quantity}</span>
                  <span>{dt?.label || d.type}</span>
                  {d.duration && <span style={{ color: 'var(--text-muted)' }}>· {d.duration}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Budget + dates hero */}
      <div className="project-detail-hero">
        <div className="project-detail-hero-item">
          <div className="project-detail-hero-label">Budget</div>
          <div className="project-detail-hero-value">{formatBudget(project)}</div>
        </div>
        <div className="project-detail-hero-item">
          <div className="project-detail-hero-label">Date limite</div>
          <div className="project-detail-hero-value">{project.deadline ? formatDate(project.deadline) : '—'}</div>
        </div>
        <div className="project-detail-hero-item">
          <div className="project-detail-hero-label">Début souhaité</div>
          <div className="project-detail-hero-value">{project.start_date ? formatDate(project.start_date) : '—'}</div>
        </div>
      </div>

      {/* Key info grid */}
      <div className="project-detail-section">
        <div className="project-detail-section-title">Détails</div>
        <div className="project-detail-grid">
          {project.content_format && (
            <div className="project-detail-field">
              <div className="project-detail-field-label">Format</div>
              <div className="project-detail-field-value">{labelFor(FORMATS, project.content_format)}</div>
            </div>
          )}
          {project.quality && (
            <div className="project-detail-field">
              <div className="project-detail-field-label">Qualité</div>
              <div className="project-detail-field-value">{labelFor(QUALITY_OPTIONS, project.quality)}</div>
            </div>
          )}
          {project.mission_type && (
            <div className="project-detail-field">
              <div className="project-detail-field-label">Type de mission</div>
              <div className="project-detail-field-value">{labelFor(MISSION_TYPES, project.mission_type)}</div>
            </div>
          )}
          {project.experience_level && (
            <div className="project-detail-field">
              <div className="project-detail-field-label">Expérience</div>
              <div className="project-detail-field-value">{labelFor(EXPERIENCE_OPTIONS, project.experience_level)}</div>
            </div>
          )}
          {project.revision_count != null && (
            <div className="project-detail-field">
              <div className="project-detail-field-label">Révisions</div>
              <div className="project-detail-field-value">{project.revision_count}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tags: niches, software, languages */}
      {project.niches?.length > 0 && (
        <div className="project-detail-section">
          <div className="project-detail-section-title">Niches</div>
          <div className="project-detail-tags">
            {project.niches.map((n) => <span key={n} className="project-detail-tag">{n}</span>)}
          </div>
        </div>
      )}
      {project.required_languages?.length > 0 && (
        <div className="project-detail-section">
          <div className="project-detail-section-title">Langues</div>
          <div className="project-detail-tags">
            {project.required_languages.map((l) => {
              const lang = LANGUAGES.find((la) => la.key === l)
              return <span key={l} className="project-detail-tag">{lang?.flag} {lang?.label || l}</span>
            })}
          </div>
        </div>
      )}
      {project.rushes_info && (
        <div className="project-detail-section">
          <div className="project-detail-section-title">Rushes</div>
          <div className="project-detail-description">{project.rushes_info}</div>
        </div>
      )}

      {/* ── Editor: Candidature section ──────────────────────── */}
      {isEditor && (
        <div className="candidature-section">
          {!existingApp && canApply && (
            <>
              <button className="candidature-button" onClick={handleApply} disabled={appLoading}>
                {appLoading ? '...' : 'Candidater'}
              </button>
              {deadlinePassed && (
                <div className="candidature-disabled-hint">La date limite de candidature est passée</div>
              )}
            </>
          )}
          {!existingApp && !canApply && project.status === 'published' && deadlinePassed && (
            <>
              <button className="candidature-button" disabled>Candidater</button>
              <div className="candidature-disabled-hint">La date limite de candidature est passée</div>
            </>
          )}
          {!existingApp && project.status !== 'published' && (
            <div className="candidature-status">
              <span className="candidature-status-label">Ce projet n'accepte plus de candidatures</span>
            </div>
          )}
          {existingApp && (
            <>
              <div className="candidature-status">
                <span className="candidature-status-label">Votre candidature</span>
                <span className={`candidature-status-value candidature-status-value--${existingApp.status}`}>
                  {existingApp.status === 'pending' && 'En attente'}
                  {existingApp.status === 'accepted' && 'Acceptée'}
                  {existingApp.status === 'refused' && 'Refusée'}
                </span>
              </div>
              {existingApp.status === 'pending' && (
                <button className="candidature-withdraw" onClick={handleWithdraw} disabled={appLoading}>
                  {appLoading ? '...' : 'Retirer ma candidature'}
                </button>
              )}
              {existingApp.status === 'accepted' && (
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => goToChat(existingApp.id)}>
                  Voir la conversation →
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Creator: Actions ─────────────────────────────────── */}
      {isCreator && (
        <div className="project-detail-actions">
          {project.status === 'draft' && (
            <>
              <button className="btn btn-ghost" onClick={() => goToProjectForm(project.id)}>Modifier</button>
              <button className="btn btn-primary" onClick={handlePublish}>Publier</button>
            </>
          )}
          {project.status === 'published' && (
            <>
              <button className="btn btn-ghost" onClick={() => goToProjectForm(project.id)}>Modifier</button>
              <button className="btn btn-ghost" style={{ color: '#f87171', borderColor: '#f87171' }} onClick={handleCancel}>Annuler le projet</button>
            </>
          )}
          {project.status === 'filled' && (
            <>
              <button className="btn btn-primary" onClick={handleComplete}>Marquer comme terminé</button>
              <button className="btn btn-ghost" style={{ color: '#f87171', borderColor: '#f87171' }} onClick={handleCancel}>Annuler</button>
            </>
          )}
        </div>
      )}

      {/* ── Creator: Applications list ───────────────────────── */}
      {isCreator && (project.status === 'published' || project.status === 'filled') && (
        <div style={{ marginTop: 24 }}>
          <ApplicationList
            applications={applications}
            onAccept={handleAcceptApp}
            onRefuse={handleRefuseApp}
          />
        </div>
      )}
    </div>
  )
}

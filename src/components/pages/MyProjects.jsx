import { useEffect } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { useProjects } from '../../context/ProjectContext'
import PageTitle from '../layout/PageTitle'
import ProjectCard from '../projects/ProjectCard'
import { AnimatedList, AnimatedItem } from '../ui/AnimatedList'

export default function MyProjects() {
  const { goToProjectForm, goToProjectDetail } = useOnboarding()
  const { myProjects, fetchMyProjects, projectLoading } = useProjects()

  useEffect(() => { fetchMyProjects() }, [])

  const published = myProjects.filter((p) => p.status === 'published')
  const drafts = myProjects.filter((p) => p.status === 'draft')
  const filled = myProjects.filter((p) => p.status === 'filled')
  const rest = myProjects.filter((p) => p.status === 'completed' || p.status === 'cancelled')

  const sections = [
    { title: 'Publiés', items: published },
    { title: 'Brouillons', items: drafts },
    { title: 'Pourvus', items: filled },
    { title: 'Terminés / Annulés', items: rest },
  ].filter((s) => s.items.length > 0)

  return (
    <div className="my-projects-page">
      <PageTitle title="Mes Projets">
        <button className="catalog-header-btn" onClick={() => goToProjectForm()}>
          + Nouveau projet
        </button>
      </PageTitle>

      {projectLoading ? (
        <div className="my-projects-empty">Chargement en cours...</div>
      ) : myProjects.length === 0 ? (
        <div className="my-projects-empty">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
          <h3>Aucun projet pour le moment</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
            Créez votre premier projet pour rencontrer un monteur.
          </p>
          <button className="catalog-header-btn" style={{ marginTop: 24 }} onClick={() => goToProjectForm()}>
            Créer un projet →
          </button>
        </div>
      ) : (
        sections.map((section) => (
          <div key={section.title} className="my-projects-section">
            <div className="my-projects-section-title">{section.title}</div>
            <AnimatedList className="my-projects-list">
              {section.items.map((project) => (
                <AnimatedItem key={project.id}>
                  <ProjectCard
                    project={project}
                    onClick={() => goToProjectDetail(project.id)}
                    showAppCount
                  />
                </AnimatedItem>
              ))}
            </AnimatedList>
          </div>
        ))
      )}
    </div>
  )
}

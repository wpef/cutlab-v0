/**
 * MesProjetsMonteur — Home page for Monteurs (editors).
 *
 * Displays all projects/offers received from Créateurs, grouped by status.
 * Also shows the editor's project candidatures (applications).
 */
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { useProjects } from '../../context/ProjectContext'
import ProjectStatusBadge from '../projects/ProjectStatusBadge'
import { AnimatedList, AnimatedItem } from '../ui/AnimatedList'

const STATUS_LABEL = { pending: 'En attente', accepted: 'En cours', refused: 'Refusée' }
const STATUS_CLASS = { pending: 'pending', accepted: 'accepted', refused: 'refused' }

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return "à l'instant"
  if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`
  if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)}h`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatBudget(project) {
  if (!project) return ''
  if (project.budget_type === 'range') return `${project.budget_min}–${project.budget_max} €`
  return project.budget_fixed ? `${project.budget_fixed} €` : ''
}

export default function MesProjetsMonteur() {
  const { goToChat, goToEditor, goToProjectDetail, user } = useOnboarding()
  const { requests, loadRequests, setActiveRequestId } = useMessaging()
  const { myApplications, fetchMyApplications } = useProjects()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    loadRequests()
    loadOffers()
    fetchMyApplications()
  }, [user])

  async function loadOffers() {
    if (!user) return
    const { data } = await supabase
      .from('offers')
      .select('*')
      .eq('editor_id', user.id)
      .order('created_at', { ascending: false })
    setOffers(data ?? [])
    setLoading(false)
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending' && r.editor_id === user?.id)
  const activeOffers = offers.filter((o) => o.status === 'accepted')
  const pendingOffers = offers.filter((o) => o.status === 'pending')
  const pastOffers = offers.filter((o) => o.status === 'refused')

  // Group candidatures by status
  const pendingApps = myApplications.filter((a) => a.status === 'pending')
  const acceptedApps = myApplications.filter((a) => a.status === 'accepted')
  const refusedApps = myApplications.filter((a) => a.status === 'refused')

  function openRequest(requestId) {
    setActiveRequestId(requestId)
    goToChat(requestId)
  }

  const hasContent = activeOffers.length > 0 || pendingOffers.length > 0 || pendingRequests.length > 0 || pastOffers.length > 0 || myApplications.length > 0

  return (
    <div className="projects-page">

      <div className="projects-content">

        {loading ? (
          <div className="projects-empty">Chargement...</div>
        ) : !hasContent ? (
          <div className="projects-empty">
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <h3>Aucun projet pour l'instant</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
              Les créateurs te contacteront directement via le catalogue, ou consulte les projets disponibles.
            </p>
            <button className="catalog-header-btn" style={{ marginTop: 24 }} onClick={goToEditor}>
              Compléter mon profil →
            </button>
          </div>
        ) : (
          <>
            {/* Demandes en attente */}
            {pendingRequests.length > 0 && (
              <section className="projects-section">
                <div className="projects-section-title">
                  Demandes en attente
                  <span className="projects-badge">{pendingRequests.length}</span>
                </div>
                <AnimatedList className="projects-list">
                  {pendingRequests.map((r) => (
                    <AnimatedItem key={r.id} className="projects-card projects-card--pending" onClick={() => openRequest(r.id)}>
                      <div className="projects-card-avatar">{r.creator_name?.[0]?.toUpperCase() || '?'}</div>
                      <div className="projects-card-info">
                        <div className="projects-card-name">{r.creator_name || 'Créateur'}</div>
                        <div className="projects-card-preview">{r.initial_message || 'Nouvelle demande'}</div>
                      </div>
                      <div className="projects-card-meta">
                        <span className="projects-status projects-status--pending">En attente</span>
                        <span>{formatDate(r.created_at)}</span>
                      </div>
                    </AnimatedItem>
                  ))}
                </AnimatedList>
              </section>
            )}

            {/* Projets en cours */}
            {activeOffers.length > 0 && (
              <section className="projects-section">
                <div className="projects-section-title">Projets en cours</div>
                <div className="projects-list">
                  {activeOffers.map((o) => (
                    <OfferRow key={o.id} offer={o} onOpen={() => {
                      setActiveRequestId(o.request_id)
                      goToChat(o.request_id)
                    }} />
                  ))}
                </div>
              </section>
            )}

            {/* Offres en attente */}
            {pendingOffers.length > 0 && (
              <section className="projects-section">
                <div className="projects-section-title">Offres en attente de réponse</div>
                <div className="projects-list">
                  {pendingOffers.map((o) => (
                    <OfferRow key={o.id} offer={o} onOpen={() => {
                      setActiveRequestId(o.request_id)
                      goToChat(o.request_id)
                    }} />
                  ))}
                </div>
              </section>
            )}

            {/* Historique offres */}
            {pastOffers.length > 0 && (
              <section className="projects-section">
                <div className="projects-section-title" style={{ color: 'var(--text-muted)' }}>Historique</div>
                <div className="projects-list">
                  {pastOffers.map((o) => (
                    <OfferRow key={o.id} offer={o} onOpen={() => {
                      setActiveRequestId(o.request_id)
                      goToChat(o.request_id)
                    }} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Mes candidatures (project applications) ────── */}
            {myApplications.length > 0 && (
              <div className="my-applications">
                <div className="my-applications-title">Mes candidatures</div>

                {pendingApps.length > 0 && (
                  <div className="application-status-group">
                    <div style={{ fontSize: 12, color: '#fbbf24', marginBottom: 6 }}>En attente ({pendingApps.length})</div>
                    <AnimatedList style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {pendingApps.map((a) => (
                        <AnimatedItem key={a.id}>
                          <div className="application-item" onClick={() => goToProjectDetail(a.project_id)}>
                            <div className="application-item-info">
                              <div className="application-item-title">{a.projects?.title || 'Projet'}</div>
                              <div className="application-item-meta">
                                {a.projects?.profiles?.first_name || 'Créateur'}
                                {a.projects && ` · ${formatBudget(a.projects)}`}
                              </div>
                            </div>
                            <ProjectStatusBadge status="published" />
                          </div>
                        </AnimatedItem>
                      ))}
                    </AnimatedList>
                  </div>
                )}

                {acceptedApps.length > 0 && (
                  <div className="application-status-group">
                    <div style={{ fontSize: 12, color: '#4ade80', marginBottom: 6 }}>Acceptées ({acceptedApps.length})</div>
                    <AnimatedList style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {acceptedApps.map((a) => (
                        <AnimatedItem key={a.id}>
                          <div className="application-item" onClick={() => openRequest(a.id)}>
                            <div className="application-item-info">
                              <div className="application-item-title">{a.projects?.title || 'Projet'}</div>
                              <div className="application-item-meta">
                                Voir la conversation →
                              </div>
                            </div>
                            <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 600 }}>Acceptée</span>
                          </div>
                        </AnimatedItem>
                      ))}
                    </AnimatedList>
                  </div>
                )}

                {refusedApps.length > 0 && (
                  <div className="application-status-group" style={{ opacity: 0.6 }}>
                    <div style={{ fontSize: 12, color: '#f87171', marginBottom: 6 }}>Refusées ({refusedApps.length})</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {refusedApps.map((a) => (
                        <div key={a.id} className="application-item">
                          <div className="application-item-info">
                            <div className="application-item-title">{a.projects?.title || 'Projet'}</div>
                            <div className="application-item-meta">{formatDate(a.created_at)}</div>
                          </div>
                          <span style={{ color: '#f87171', fontSize: 12, fontWeight: 600 }}>Refusée</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

function OfferRow({ offer, onOpen }) {
  return (
    <div className="projects-card" onClick={onOpen}>
      <div className="projects-card-avatar">{offer.creator_name?.[0]?.toUpperCase() || '?'}</div>
      <div className="projects-card-info">
        <div className="projects-card-name">{offer.title || 'Projet sans titre'}</div>
        <div className="projects-card-preview">
          {offer.creator_name || 'Créateur'}
          {offer.budget ? ` · ${offer.budget} €` : ''}
          {offer.deadline ? ` · ${new Date(offer.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}` : ''}
        </div>
      </div>
      <div className="projects-card-meta">
        <span className={`projects-status projects-status--${STATUS_CLASS[offer.status]}`}>
          {STATUS_LABEL[offer.status]}
        </span>
        <span>{formatDate(offer.created_at)}</span>
      </div>
    </div>
  )
}

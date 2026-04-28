import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { toast } from '../../ui/Toast'
import PageTitle from '../../layout/PageTitle'
import { useOnboarding } from '../../../context/OnboardingContext'

export default function AdminReports() {
  const { userRole } = useOnboarding()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  if (userRole !== 'admin') return <Navigate to="/" replace />

  useEffect(() => {
    supabase
      .from('mod_reports')
      .select('id, reason, status, created_at, reporter_id, target_id')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setReports(data ?? []); setLoading(false) })
  }, [])

  async function updateStatus(id, status) {
    const { error } = await supabase.from('mod_reports').update({ status }).eq('id', id)
    if (error) { toast.error('Erreur'); return }
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status } : r))
    toast.success('Signalement mis à jour')
  }

  return (
    <div className="admin-page">
      <PageTitle title="Admin — Signalements" />
      {loading ? (
        <div className="catalog-loading">Chargement...</div>
      ) : reports.length === 0 ? (
        <div className="empty-state">Aucun signalement en attente.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Raison</th><th>Statut</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.reason}</td>
                  <td><span className={`admin-badge admin-badge--${r.status}`}>{r.status}</span></td>
                  <td>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-action-btn" onClick={() => updateStatus(r.id, 'resolved')}>Résoudre</button>
                    <button className="admin-action-btn" onClick={() => updateStatus(r.id, 'dismissed')}>Ignorer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

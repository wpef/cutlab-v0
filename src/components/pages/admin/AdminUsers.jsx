import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { toast } from '../../ui/Toast'
import PageTitle from '../../layout/PageTitle'
import { useOnboarding } from '../../../context/OnboardingContext'

export default function AdminUsers() {
  const { userRole } = useOnboarding()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { document.title = 'CUTLAB — Admin · Utilisateurs' }, [])

  if (userRole !== 'admin') return <Navigate to="/" replace />

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, first_name, last_name, role, status, assigned_level, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data ?? []); setLoading(false) })
  }, [])

  async function handleSuspend(userId, currentStatus) {
    const next = currentStatus === 'suspended' ? 'published' : 'suspended'
    const { error } = await supabase.from('profiles').update({ status: next }).eq('id', userId)
    if (error) { toast.error('Erreur'); return }
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: next } : u))
    toast.success(next === 'suspended' ? 'Compte suspendu' : 'Compte réactivé')
  }

  return (
    <div className="admin-page">
      <PageTitle title="Admin — Utilisateurs" />
      {loading ? (
        <div className="catalog-loading">Chargement...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th><th>Rôle</th><th>Statut</th><th>Niveau</th><th>Inscrit</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={u.status === 'suspended' ? 'admin-row--suspended' : ''}>
                  <td>{u.first_name} {u.last_name}</td>
                  <td><span className="admin-badge">{u.role}</span></td>
                  <td><span className={`admin-badge admin-badge--${u.status}`}>{u.status}</span></td>
                  <td>{u.assigned_level ?? '—'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <button
                      className={`admin-action-btn${u.status === 'suspended' ? ' admin-action-btn--restore' : ''}`}
                      onClick={() => handleSuspend(u.id, u.status)}
                    >
                      {u.status === 'suspended' ? 'Réactiver' : 'Suspendre'}
                    </button>
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

import ApplicationCard from './ApplicationCard'
import { AnimatedList, AnimatedItem } from '../ui/AnimatedList'

export default function ApplicationList({ applications, onAccept, onRefuse }) {
  if (!applications) return null

  const pending = applications.filter((a) => a.status === 'pending')
  const accepted = applications.filter((a) => a.status === 'accepted')
  const refused = applications.filter((a) => a.status === 'refused')

  const total = applications.length

  return (
    <div>
      <div className="application-list-header">
        {total} candidature{total !== 1 ? 's' : ''}
      </div>

      {total === 0 && (
        <div className="application-list-empty">
          Aucune candidature pour ce projet.
        </div>
      )}

      {pending.length > 0 && (
        <AnimatedList className="application-list" style={{ marginBottom: 16 }}>
          {pending.map((a) => (
            <AnimatedItem key={a.id}>
              <ApplicationCard application={a} onAccept={onAccept} onRefuse={onRefuse} />
            </AnimatedItem>
          ))}
        </AnimatedList>
      )}

      {accepted.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, marginTop: 16, textTransform: 'uppercase' }}>Acceptée{accepted.length > 1 ? 's' : ''}</div>
          <div className="application-list">
            {accepted.map((a) => (
              <ApplicationCard key={a.id} application={a} onAccept={onAccept} onRefuse={onRefuse} />
            ))}
          </div>
        </>
      )}

      {refused.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, marginTop: 16, textTransform: 'uppercase' }}>Refusée{refused.length > 1 ? 's' : ''}</div>
          <div className="application-list" style={{ opacity: 0.6 }}>
            {refused.map((a) => (
              <ApplicationCard key={a.id} application={a} onAccept={onAccept} onRefuse={onRefuse} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

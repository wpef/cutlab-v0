import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import FormGroup from '../ui/FormGroup'

const FORMATS = [
  'Portrait / Shorts', 'YouTube long format', 'Publicités & spots',
  'Documentaires', 'Corporate / B2B', 'Clips musicaux', 'Gaming', 'Sport / Fitness',
]

export default function OfferForm() {
  const { goToChat, goToOfferPreview } = useOnboarding()
  const { activeRequestId, requests, setOfferFormData } = useMessaging()

  const request = requests.find((r) => r.id === activeRequestId)

  const [form, setForm] = useState({
    title: '',
    description: '',
    deliverables: '',
    format: '',
    deadline: '',
    budget: '',
    revisions: '2',
  })
  const [error, setError] = useState('')

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handlePreview() {
    setError('')
    if (!form.title.trim()) { setError('Le titre du projet est requis.'); return }
    if (!form.budget) { setError('Indique le budget pour ce projet.'); return }
    setOfferFormData({ ...form, requestId: activeRequestId })
    goToOfferPreview()
  }

  return (
    <div className="offer-form-page">

      <header className="offer-form-header">
        <button className="chat-back-btn" onClick={goToChat}>← Retour au chat</button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16 }}>
          CUT<span style={{ color: 'var(--accent)' }}>LAB</span>
        </div>
        <div style={{ width: 80 }} />
      </header>

      <div className="offer-form-content">

        <div className="step-header">
          <div className="step-tag">Offre de projet</div>
          <h1>Décris ta mission</h1>
          {request && (
            <p className="step-desc">Pour {request.editor_name || 'le monteur'}</p>
          )}
        </div>

        <FormGroup label="Titre du projet">
          <input
            type="text"
            placeholder="ex: Montage YouTube — Chaîne Tech"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Description" optional="optionnel">
          <textarea
            placeholder="Décris le projet : type de contenu, ton univers, tes attentes..."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            style={{ minHeight: 100 }}
          />
        </FormGroup>

        <FormGroup label="Livrables attendus" optional="optionnel">
          <textarea
            placeholder="ex: 4 vidéos / mois, intro animée, sous-titres, miniatures..."
            value={form.deliverables}
            onChange={(e) => set('deliverables', e.target.value)}
            style={{ minHeight: 80 }}
          />
        </FormGroup>

        <FormGroup label="Format" optional="optionnel">
          <select value={form.format} onChange={(e) => set('format', e.target.value)}>
            <option value="">— Sélectionner un format —</option>
            {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </FormGroup>

        <div className="form-row">
          <FormGroup label="Deadline" optional="optionnel">
            <input
              type="text"
              placeholder="ex: 15 mars 2026 ou sous 2 semaines"
              value={form.deadline}
              onChange={(e) => set('deadline', e.target.value)}
            />
          </FormGroup>
          <FormGroup label="Budget total (€)">
            <input
              type="number"
              placeholder="ex: 500"
              value={form.budget}
              onChange={(e) => set('budget', e.target.value)}
            />
          </FormGroup>
        </div>

        <FormGroup label="Retours inclus">
          <div className="tag-group">
            {['1', '2', '3', '4', '5'].map((n) => (
              <div
                key={n}
                className={`tag${form.revisions === n ? ' selected' : ''}`}
                onClick={() => set('revisions', n)}
              >
                {n}
              </div>
            ))}
          </div>
        </FormGroup>

        {error && <div className="step-error">{error}</div>}

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn btn-primary" style={{ width: '100%', padding: '14px 0', fontSize: 15 }} onClick={handlePreview}>
            Aperçu du document →
          </button>
        </div>
      </div>
    </div>
  )
}

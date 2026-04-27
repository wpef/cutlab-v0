import { useState, useEffect } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'
import { supabase } from '../../lib/supabase'
import PageTitle from '../layout/PageTitle'
import {
  FORMATS,
  NICHES,
  SOFTWARE,
  LANGUAGES,
  EXPERIENCE_OPTIONS,
  MISSION_TYPES,
  QUALITY_OPTIONS,
  DELIVERABLE_TYPES,
} from '../../constants/options'

const EMPTY_DELIVERABLE = { type: '', quantity: 1, duration: '' }

export default function OfferForm() {
  const { goToOfferPreview, goToMessaging, userRole } = useOnboarding()
  const { activeRequestId, requests, setOfferFormData } = useMessaging()

  const request = requests.find((r) => r.id === activeRequestId)

  const [form, setForm] = useState({
    title: '',
    description: '',
    deliverables: [{ ...EMPTY_DELIVERABLE }],
    content_format: '',
    deadline: '',
    budget: '',
    budget_type: 'fixed',
    budget_min: '',
    budget_max: '',
    revisions: 2,
    mission_start: '',
    quality: '',
    video_count: '',
    video_duration: '',
    thumbnail_included: false,
    niches: [],
    preferred_software: [],
    required_languages: [],
    experience_level: '',
    mission_type: '',
    rushes_info: '',
  })
  const [errors, setErrors] = useState({})
  const [projectLoaded, setProjectLoaded] = useState(false)

  useEffect(() => {
    if (!request?.project_id || projectLoaded) return
    supabase
      .from('projects')
      .select('*')
      .eq('id', request.project_id)
      .single()
      .then(({ data }) => {
        if (!data) return
        setProjectLoaded(true)
        setForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          content_format: data.content_format || prev.content_format,
          deadline: data.deadline || prev.deadline,
          budget_type: data.budget_type ?? prev.budget_type,
          budget: data.budget_fixed ? String(data.budget_fixed) : prev.budget,
          budget_min: data.budget_min != null ? String(data.budget_min) : prev.budget_min,
          budget_max: data.budget_max != null ? String(data.budget_max) : prev.budget_max,
          revisions: data.revision_count ?? prev.revisions,
          mission_start: data.start_date || prev.mission_start,
          quality: data.quality ?? prev.quality,
          video_count: data.video_count != null ? String(data.video_count) : prev.video_count,
          video_duration: data.video_duration ?? prev.video_duration,
          thumbnail_included: data.thumbnail_included ?? prev.thumbnail_included,
          niches: data.niches || prev.niches,
          preferred_software: data.preferred_software || prev.preferred_software,
          required_languages: data.required_languages || prev.required_languages,
          experience_level: data.experience_level ?? prev.experience_level,
          deliverables: data.deliverables?.length ? data.deliverables : prev.deliverables,
          mission_type: data.mission_type ?? prev.mission_type,
          rushes_info: data.rushes_info ?? prev.rushes_info,
        }))
      })
  }, [request?.project_id, projectLoaded])

  if (!activeRequestId || !request) {
    return (
      <div className="offer-form-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Aucune demande sélectionnée.</p>
          <button className="catalog-header-btn" style={{ marginTop: 16 }} onClick={() => goToMessaging()}>
            ← Retour à la messagerie
          </button>
        </div>
      </div>
    )
  }

  function update(patch) { setForm((prev) => ({ ...prev, ...patch })) }

  function toggleInArray(arr, val) {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
  }

  function updateDeliverable(idx, patch) {
    const updated = [...form.deliverables]
    updated[idx] = { ...updated[idx], ...patch }
    update({ deliverables: updated })
  }
  function addDeliverable() {
    update({ deliverables: [...form.deliverables, { ...EMPTY_DELIVERABLE }] })
  }
  function removeDeliverable(idx) {
    if (form.deliverables.length <= 1) return
    update({ deliverables: form.deliverables.filter((_, i) => i !== idx) })
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Veuillez indiquer le titre de la mission.'
    if (form.budget_type === 'fixed' && !form.budget) errs.budget = 'Précisez le budget proposé.'
    if (form.budget_type === 'range' && (!form.budget_min || !form.budget_max)) errs.budget = 'Précisez la fourchette de budget.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handlePreview() {
    if (!validate()) return
    setOfferFormData({
      ...form,
      requestId: activeRequestId,
      sent_by: userRole,
    })
    goToOfferPreview()
  }

  const otherPartyName = userRole === 'creator'
    ? (request.editor_name || 'le monteur')
    : (request.creator_name || 'le créateur')

  return (
    <div className="offer-form-page">
      <PageTitle title="Offre de mission" />

      {request.project_id && projectLoaded && (
        <div style={{ padding: '8px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--accent)' }}>
          ✓ Pré-rempli depuis le projet
        </div>
      )}

      {/* Section 1 — Informations générales */}
      <div className="project-form-section">
        <div className="project-form-section-title">Informations générales</div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Pour {otherPartyName}</p>

        <div className="form-group">
          <label className="form-label">Titre de la mission *</label>
          <input
            className="form-input"
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="ex: Montage YouTube — Chaîne Tech"
          />
          {errors.title && <div className="step-error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Description <span className="optional">(optionnel)</span></label>
          <textarea
            className="form-input"
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Décrivez le projet : type de contenu, univers, attentes..."
            rows={4}
          />
        </div>

      </div>

      {/* Section — Livrables */}
      <div className="project-form-section">
        <div className="project-form-section-title">Livrables</div>
        {form.deliverables.map((d, idx) => (
          <div key={idx} className="deliverable-row">
            <select
              className="form-input"
              value={d.type}
              onChange={(e) => updateDeliverable(idx, { type: e.target.value })}
            >
              <option value="">Type de livrable</option>
              {DELIVERABLE_TYPES.map((dt) => (
                <option key={dt.key} value={dt.key}>{dt.label}</option>
              ))}
            </select>
            <input
              className="form-input"
              type="number"
              min={1}
              value={d.quantity}
              onChange={(e) => updateDeliverable(idx, { quantity: Number(e.target.value) || 1 })}
              style={{ maxWidth: 70 }}
              placeholder="Qté"
            />
            <input
              className="form-input"
              value={d.duration || ''}
              onChange={(e) => updateDeliverable(idx, { duration: e.target.value })}
              placeholder="Durée (opt.)"
              style={{ maxWidth: 120 }}
            />
            {form.deliverables.length > 1 && (
              <button className="deliverable-remove-btn" onClick={() => removeDeliverable(idx)} type="button">✕</button>
            )}
          </div>
        ))}
        <button className="deliverable-add-btn" onClick={addDeliverable} type="button">+ Ajouter un livrable</button>
        {errors.deliverables && <div className="step-error" style={{ marginTop: 8 }}>{errors.deliverables}</div>}
      </div>

      <div className="project-form-section">
        <div className="project-form-section-title">Format & Thématiques</div>

        <div className="form-group">
          <label className="form-label">Format de contenu</label>
          <div className="chip-group">
            {FORMATS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`chip ${form.content_format === f.key ? 'active' : ''}`}
                onClick={() => update({ content_format: form.content_format === f.key ? '' : f.key })}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Niches / Thématiques</label>
          <div className="chip-group">
            {NICHES.map((n) => (
              <button
                key={n}
                type="button"
                className={`chip ${form.niches.includes(n) ? 'active' : ''}`}
                onClick={() => update({ niches: toggleInArray(form.niches, n) })}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2 — Budget & Calendrier */}
      <div className="project-form-section">
        <div className="project-form-section-title">Budget & Calendrier</div>

        <div className="form-group">
          <label className="form-label">Type de budget *</label>
          <div className="budget-toggle">
            <button
              type="button"
              className={form.budget_type === 'fixed' ? 'active' : ''}
              onClick={() => update({ budget_type: 'fixed' })}
            >
              Montant fixe
            </button>
            <button
              type="button"
              className={form.budget_type === 'range' ? 'active' : ''}
              onClick={() => update({ budget_type: 'range' })}
            >
              Fourchette
            </button>
          </div>
          {form.budget_type === 'fixed' ? (
            <input
              className="form-input"
              type="number"
              min={1}
              value={form.budget}
              onChange={(e) => update({ budget: e.target.value })}
              placeholder="Budget en EUR"
            />
          ) : (
            <div className="budget-fields">
              <input
                className="form-input"
                type="number"
                min={1}
                value={form.budget_min}
                onChange={(e) => update({ budget_min: e.target.value })}
                placeholder="Min EUR"
              />
              <input
                className="form-input"
                type="number"
                min={1}
                value={form.budget_max}
                onChange={(e) => update({ budget_max: e.target.value })}
                placeholder="Max EUR"
              />
            </div>
          )}
          {errors.budget && <div className="step-error">{errors.budget}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Date de début souhaitée <span className="optional">(optionnel)</span></label>
          <input
            className="form-input"
            type="date"
            value={form.mission_start}
            onChange={(e) => update({ mission_start: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Délai de livraison <span className="optional">(optionnel)</span></label>
          <input
            className="form-input"
            type="date"
            value={form.deadline}
            onChange={(e) => update({ deadline: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nombre de retours inclus</label>
          <input
            className="form-input"
            type="number"
            min={0}
            max={10}
            value={form.revisions}
            onChange={(e) => update({ revisions: Number(e.target.value) || 0 })}
            style={{ maxWidth: 100 }}
          />
        </div>
      </div>

      {/* Section 3 — Préférences techniques */}
      <div className="project-form-section">
        <div className="project-form-section-title">Préférences techniques</div>

        <div className="form-group">
          <label className="form-label">Qualité attendue</label>
          <div className="chip-group">
            {QUALITY_OPTIONS.map((q) => (
              <button
                key={q.key}
                type="button"
                className={`chip ${form.quality === q.key ? 'active' : ''}`}
                onClick={() => update({ quality: form.quality === q.key ? '' : q.key })}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Logiciels préférés</label>
          <div className="chip-group">
            {SOFTWARE.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip ${form.preferred_software.includes(s) ? 'active' : ''}`}
                onClick={() => update({ preferred_software: toggleInArray(form.preferred_software, s) })}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Langues requises</label>
          <div className="chip-group">
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                type="button"
                className={`chip ${form.required_languages.includes(l.key) ? 'active' : ''}`}
                onClick={() => update({ required_languages: toggleInArray(form.required_languages, l.key) })}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Niveau d'expérience souhaité</label>
          <div className="chip-group">
            {EXPERIENCE_OPTIONS.map((e) => (
              <button
                key={e.key}
                type="button"
                className={`chip ${form.experience_level === e.key ? 'active' : ''}`}
                onClick={() => update({ experience_level: form.experience_level === e.key ? '' : e.key })}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Type de mission</label>
          <div className="chip-group">
            {MISSION_TYPES.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`chip ${form.mission_type === m.key ? 'active' : ''}`}
                onClick={() => update({ mission_type: form.mission_type === m.key ? '' : m.key })}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4 — Détails supplémentaires */}
      <div className="project-form-section">
        <div className="project-form-section-title">Détails supplémentaires</div>

        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={form.thumbnail_included}
              onChange={(e) => update({ thumbnail_included: e.target.checked })}
            />
            Miniature incluse dans la prestation
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Nombre de vidéos attendues</label>
          <input
            className="form-input"
            type="number"
            min={1}
            value={form.video_count}
            onChange={(e) => update({ video_count: e.target.value })}
            placeholder="Ex: 4"
            style={{ maxWidth: 100 }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Durée estimée par vidéo</label>
          <input
            className="form-input"
            value={form.video_duration}
            onChange={(e) => update({ video_duration: e.target.value })}
            placeholder="Ex: 10-15 minutes"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Informations sur les rushes</label>
          <textarea
            className="form-input"
            value={form.rushes_info}
            onChange={(e) => update({ rushes_info: e.target.value })}
            placeholder="Format des fichiers, volume estimé, méthode de transfert..."
            rows={3}
          />
        </div>
      </div>

      <div className="project-form-actions">
        <button className="btn btn-ghost" onClick={() => goToMessaging()}>
          Annuler
        </button>
        <button className="btn btn-primary" onClick={handlePreview}>
          Aperçu de l'offre →
        </button>
      </div>
    </div>
  )
}

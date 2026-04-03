import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useOnboarding } from '../../context/OnboardingContext'
import { useProjects } from '../../context/ProjectContext'
import { FORMATS, NICHES, SOFTWARE, LANGUAGES, EXPERIENCE_OPTIONS, MISSION_TYPES, DELIVERABLE_TYPES, QUALITY_OPTIONS } from '../../constants/options'
import PageTitle from '../layout/PageTitle'
import { toast } from '../ui/Toast'

const EMPTY_DELIVERABLE = { type: '', quantity: 1, duration: '' }

export default function ProjectForm() {
  const { goToMyProjects, goToProjectDetail } = useOnboarding()
  const { createProject, updateProject, fetchProjectById } = useProjects()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    title: '',
    description: '',
    content_format: '',
    niches: [],
    deliverables: [{ ...EMPTY_DELIVERABLE }],
    budget_type: 'fixed',
    budget_fixed: '',
    budget_min: '',
    budget_max: '',
    start_date: '',
    deadline: '',
    quality: '',
    thumbnail_included: false,
    video_count: '',
    video_duration: '',
    revision_count: 2,
    preferred_software: [],
    required_languages: [],
    experience_level: '',
    mission_type: '',
    rushes_info: '',
  })
  const [isEdit, setIsEdit] = useState(false)
  const [isPublished, setIsPublished] = useState(false)

  // Load existing project for edit mode
  useEffect(() => {
    if (!editId) return
    fetchProjectById(editId).then((p) => {
      if (!p) return
      setIsEdit(true)
      setIsPublished(p.status === 'published')
      setForm({
        title: p.title || '',
        description: p.description || '',
        content_format: p.content_format || '',
        niches: p.niches || [],
        deliverables: p.deliverables?.length ? p.deliverables : [{ ...EMPTY_DELIVERABLE }],
        budget_type: p.budget_type || 'fixed',
        budget_fixed: p.budget_fixed != null ? String(p.budget_fixed) : '',
        budget_min: p.budget_min != null ? String(p.budget_min) : '',
        budget_max: p.budget_max != null ? String(p.budget_max) : '',
        start_date: p.start_date || '',
        deadline: p.deadline || '',
        quality: p.quality || '',
        thumbnail_included: p.thumbnail_included || false,
        video_count: p.video_count != null ? String(p.video_count) : '',
        video_duration: p.video_duration || '',
        revision_count: p.revision_count ?? 2,
        preferred_software: p.preferred_software || [],
        required_languages: p.required_languages || [],
        experience_level: p.experience_level || '',
        mission_type: p.mission_type || '',
        rushes_info: p.rushes_info || '',
      })
    })
  }, [editId])

  function update(patch) { setForm((prev) => ({ ...prev, ...patch })) }

  function toggleInArray(arr, val) {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
  }

  // Deliverable management
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

  // Validation
  function validate(forPublish = false) {
    const errs = {}
    if (!form.title.trim() || form.title.length < 3) errs.title = 'Le titre doit contenir au moins 3 caractères'
    if (form.title.length > 120) errs.title = 'Le titre ne peut pas dépasser 120 caractères'
    if (!form.description.trim() || form.description.length < 10) errs.description = 'La description doit contenir au moins 10 caractères'
    if (form.description.length > 2000) errs.description = 'La description ne peut pas dépasser 2000 caractères'

    const validDeliverables = form.deliverables.filter((d) => d.type)
    if (validDeliverables.length === 0) errs.deliverables = 'Ajoutez au moins un livrable'

    if (form.budget_type === 'fixed') {
      if (!form.budget_fixed || Number(form.budget_fixed) <= 0) errs.budget = 'Indiquez un budget valide'
    } else {
      if (!form.budget_min || !form.budget_max) errs.budget = 'Indiquez une fourchette de budget'
      else if (Number(form.budget_min) >= Number(form.budget_max)) errs.budget = 'Le minimum doit être inférieur au maximum'
    }

    if (!form.deadline) errs.deadline = 'Indiquez une date limite de livraison'
    else if (forPublish && new Date(form.deadline) <= new Date()) errs.deadline = 'La date limite doit être dans le futur'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Build data object for Supabase
  function buildData(status) {
    return {
      title: form.title.trim(),
      description: form.description.trim(),
      content_format: form.content_format || null,
      niches: form.niches,
      deliverables: form.deliverables.filter((d) => d.type),
      budget_type: form.budget_type,
      budget_fixed: form.budget_type === 'fixed' ? Number(form.budget_fixed) || null : null,
      budget_min: form.budget_type === 'range' ? Number(form.budget_min) || null : null,
      budget_max: form.budget_type === 'range' ? Number(form.budget_max) || null : null,
      start_date: form.start_date || null,
      deadline: form.deadline,
      quality: form.quality || null,
      thumbnail_included: form.thumbnail_included,
      video_count: form.video_count ? Number(form.video_count) : null,
      video_duration: form.video_duration || null,
      revision_count: form.revision_count,
      preferred_software: form.preferred_software,
      required_languages: form.required_languages,
      experience_level: form.experience_level || null,
      mission_type: form.mission_type || null,
      rushes_info: form.rushes_info || null,
      status,
    }
  }

  async function handleSaveDraft() {
    if (!validate(false)) return
    setSaving(true)
    const data = buildData('draft')
    const result = isEdit
      ? await updateProject(editId, data)
      : await createProject(data)
    setSaving(false)
    if (result) {
      toast.success('Brouillon enregistré')
      if (!isEdit) goToProjectDetail(result.id)
    } else {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  async function handlePublish() {
    if (!validate(true)) return
    setSaving(true)
    const data = buildData('published')
    const result = isEdit
      ? await updateProject(editId, data)
      : await createProject(data)
    setSaving(false)
    if (result) {
      toast.success('Projet publié !')
      goToMyProjects()
    } else {
      toast.error('Erreur lors de la publication')
    }
  }

  const locked = isPublished // structural fields locked when editing published project

  return (
    <div className="project-form">
      <PageTitle title={isEdit ? 'Modifier le projet' : 'Nouveau projet'} />

      {/* Section 1: General info */}
      <div className="project-form-section">
        <div className="project-form-section-title">Informations générales</div>

        <div className={`form-group ${locked ? 'project-form-field-locked' : ''}`}>
          <label className="form-label">Titre du projet *</label>
          <input
            className="form-input"
            value={form.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Ex: Montage vidéo YouTube gaming"
            maxLength={120}
          />
          {errors.title && <div className="step-error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            className="form-input"
            value={form.description}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Décrivez votre projet en détail..."
            rows={4}
            maxLength={2000}
          />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{form.description.length}/2000</div>
          {errors.description && <div className="step-error">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Format de contenu</label>
          <div className="chip-group">
            {FORMATS.map((f) => (
              <button
                key={f.key}
                className={`chip ${form.content_format === f.key ? 'active' : ''}`}
                onClick={() => update({ content_format: form.content_format === f.key ? '' : f.key })}
                type="button"
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
                className={`chip ${form.niches.includes(n) ? 'active' : ''}`}
                onClick={() => update({ niches: toggleInArray(form.niches, n) })}
                type="button"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Deliverables */}
      <div className="project-form-section">
        <div className="project-form-section-title">Livrables *</div>
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

      {/* Section 3: Budget & Calendar */}
      <div className="project-form-section">
        <div className="project-form-section-title">Budget & Calendrier</div>

        <div className={`form-group ${locked ? 'project-form-field-locked' : ''}`}>
          <label className="form-label">Type de budget *</label>
          <div className="budget-toggle">
            <button
              className={form.budget_type === 'fixed' ? 'active' : ''}
              onClick={() => update({ budget_type: 'fixed' })}
              type="button"
            >
              Montant fixe
            </button>
            <button
              className={form.budget_type === 'range' ? 'active' : ''}
              onClick={() => update({ budget_type: 'range' })}
              type="button"
            >
              Fourchette
            </button>
          </div>
          {form.budget_type === 'fixed' ? (
            <input
              className="form-input"
              type="number"
              min={1}
              value={form.budget_fixed}
              onChange={(e) => update({ budget_fixed: e.target.value })}
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
          <label className="form-label">Date de début souhaitée</label>
          <input
            className="form-input"
            type="date"
            value={form.start_date}
            onChange={(e) => update({ start_date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date limite de livraison *</label>
          <input
            className="form-input"
            type="date"
            value={form.deadline}
            onChange={(e) => update({ deadline: e.target.value })}
          />
          {errors.deadline && <div className="step-error">{errors.deadline}</div>}
        </div>
      </div>

      {/* Section 4: Technical preferences */}
      <div className="project-form-section">
        <div className="project-form-section-title">Préférences techniques</div>

        <div className="form-group">
          <label className="form-label">Qualité attendue</label>
          <div className="chip-group">
            {QUALITY_OPTIONS.map((q) => (
              <button
                key={q.key}
                className={`chip ${form.quality === q.key ? 'active' : ''}`}
                onClick={() => update({ quality: form.quality === q.key ? '' : q.key })}
                type="button"
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
                className={`chip ${form.preferred_software.includes(s) ? 'active' : ''}`}
                onClick={() => update({ preferred_software: toggleInArray(form.preferred_software, s) })}
                type="button"
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
                className={`chip ${form.required_languages.includes(l.key) ? 'active' : ''}`}
                onClick={() => update({ required_languages: toggleInArray(form.required_languages, l.key) })}
                type="button"
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
                className={`chip ${form.experience_level === e.key ? 'active' : ''}`}
                onClick={() => update({ experience_level: form.experience_level === e.key ? '' : e.key })}
                type="button"
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
                className={`chip ${form.mission_type === m.key ? 'active' : ''}`}
                onClick={() => update({ mission_type: form.mission_type === m.key ? '' : m.key })}
                type="button"
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nombre de révisions incluses</label>
          <input
            className="form-input"
            type="number"
            min={0}
            max={10}
            value={form.revision_count}
            onChange={(e) => update({ revision_count: Number(e.target.value) || 0 })}
            style={{ maxWidth: 100 }}
          />
        </div>
      </div>

      {/* Section 5: Additional details */}
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

      {/* Actions */}
      <div className="project-form-actions">
        <button className="btn btn-ghost" onClick={handleSaveDraft} disabled={saving}>
          {saving ? '...' : 'Enregistrer le brouillon'}
        </button>
        <button className="btn btn-primary" onClick={handlePublish} disabled={saving}>
          {saving ? '...' : 'Publier'}
        </button>
      </div>
    </div>
  )
}

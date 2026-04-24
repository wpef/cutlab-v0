import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { uploadFile } from '../../lib/uploadFile'
import { LANGUAGES, AVAILABILITY_OPTIONS } from '../../constants/options'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import UploadZone from '../ui/UploadZone'
import AvailabilityButton from '../ui/AvailabilityButton'
import StepNav from '../ui/StepNav'

export default function Step2Identity() {
  const { goToStep, formData, updateFormData, user } = useOnboarding()
  const [error, setError] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarUploadError, setAvatarUploadError] = useState(null)
  const [avatarUploadSuccess, setAvatarUploadSuccess] = useState(false)

  async function handleAvatarFiles(files) {
    if (!files.length || !user) return
    setAvatarUploading(true)
    setAvatarUploadError(null)
    setAvatarUploadSuccess(false)
    const file = files[0]
    const ext = file.name.split('.').pop()
    const url = await uploadFile('avatars', `${user.id}/avatar.${ext}`, file)
    setAvatarUploading(false)
    if (url) {
      updateFormData({ avatarUrl: url })
      setAvatarUploadSuccess(true)
      setTimeout(() => setAvatarUploadSuccess(false), 3000)
    } else {
      setAvatarUploadError('Erreur lors de l\'upload. Réessaie.')
    }
  }

  function handleNext() {
    if (!formData.firstName.trim()) { setError('Ton prénom est requis.'); return }
    if (!formData.lastName.trim()) { setError('Ton nom est requis.'); return }
    setError('')
    goToStep(3)
  }

  function toggleLang(key) {
    const langs = formData.languages
    updateFormData({
      languages: langs.includes(key) ? langs.filter((k) => k !== key) : [...langs, key],
    })
  }

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 2 sur 7"
        title="Qui es-tu ?"
        desc="Ces infos seront visibles sur ton profil public."
      />

      <div className="form-row">
        <FormGroup label="Prénom">
          <input
            type="text"
            placeholder="Lucas"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
          />
        </FormGroup>
        <FormGroup label="Nom">
          <input
            type="text"
            placeholder="Martin"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
          />
        </FormGroup>
      </div>

      <FormGroup label="Photo de profil" optional="optionnel — tu peux l'ajouter plus tard">
        {formData.avatarUrl && !avatarUploading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={formData.avatarUrl} alt="Photo" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} />
              <button type="button" onClick={() => updateFormData({ avatarUrl: '' })}
                style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: '50%', background: '#ff4d4d', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Supprimer">×</button>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Photo enregistrée. Clique × pour la changer.</div>
          </div>
        ) : (
          <UploadZone
            icon="📷"
            title="Clique pour uploader"
            hint="JPG ou PNG, moins de 5Mo"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMB={5}
            onFilesChange={handleAvatarFiles}
            uploading={avatarUploading}
            uploadError={avatarUploadError}
            uploadSuccess={avatarUploadSuccess}
            style={{ padding: 24 }}
          />
        )}
      </FormGroup>

      <FormGroup label="Langues parlées">
        <div className="lang-selector">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.key}
              className={`lang-option${formData.languages.includes(lang.key) ? ' selected' : ''}`}
              onClick={() => toggleLang(lang.key)}
              role="checkbox"
              aria-checked={formData.languages.includes(lang.key)}
            >
              <span className="lang-flag" title={lang.label} aria-hidden="true">{lang.flag}</span>
              <span className="lang-code" style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{lang.code}</span>
              {lang.label}
            </div>
          ))}
        </div>
        <HintBox style={{ marginTop: 10, fontSize: 12 }}>
          Les drapeaux sélectionnés apparaissent en petit sur ta carte profil pour les clients.
        </HintBox>
      </FormGroup>

      <FormGroup label="Disponibilité actuelle">
        <div className="availability-group">
          {AVAILABILITY_OPTIONS.map((option) => (
            <AvailabilityButton
              key={option}
              label={option}
              selected={formData.availability === option}
              onSelect={() => updateFormData({ availability: option })}
            />
          ))}
        </div>
      </FormGroup>

      {error && <div className="step-error">{error}</div>}
      <StepNav onBack={() => goToStep(1)} onNext={handleNext} />
    </div>
  )
}

import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import UploadZone from '../ui/UploadZone'
import AvailabilityButton from '../ui/AvailabilityButton'
import StepNav from '../ui/StepNav'

const LANGUAGES = [
  { key: 'fr', flag: '🇫🇷', label: 'Français' },
  { key: 'en', flag: '🇬🇧', label: 'Anglais' },
  { key: 'es', flag: '🇪🇸', label: 'Espagnol' },
  { key: 'pt', flag: '🇧🇷', label: 'Portugais' },
  { key: 'de', flag: '🇩🇪', label: 'Allemand' },
  { key: 'it', flag: '🇮🇹', label: 'Italien' },
  { key: 'zh', flag: '🇨🇳', label: 'Chinois' },
  { key: 'ja', flag: '🇯🇵', label: 'Japonais' },
  { key: 'ar', flag: '🇸🇦', label: 'Arabe' },
  { key: 'ru', flag: '🇷🇺', label: 'Russe' },
  { key: 'ko', flag: '🇰🇷', label: 'Coréen' },
]

const AVAILABILITY_OPTIONS = ['Disponible', 'Sur demande', 'Indisponible']

export default function Step2Identity() {
  const { goToStep, formData, updateFormData } = useOnboarding()
  const [error, setError] = useState('')

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
        tag="Étape 2 sur 8"
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

      <FormGroup label="Pseudo / Nom de scène" optional="optionnel">
        <input
          type="text"
          placeholder="Le nom affiché sur ton profil public"
          value={formData.username}
          onChange={(e) => updateFormData({ username: e.target.value })}
        />
      </FormGroup>

      <FormGroup label="Photo de profil" optional="optionnel — tu peux l'ajouter plus tard">
        <UploadZone
          icon="📷"
          title="Clique pour uploader"
          hint="JPG ou PNG, moins de 5Mo"
          accept="image/jpeg,image/png,image/webp"
          style={{ padding: 24 }}
        />
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
              <span className="lang-flag">{lang.flag}</span>
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

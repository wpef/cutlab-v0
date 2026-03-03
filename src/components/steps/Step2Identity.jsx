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
  const { goToStep } = useOnboarding()

  const [selectedLangs, setSelectedLangs] = useState(new Set(['fr']))
  const [availability, setAvailability] = useState('Disponible')

  function toggleLang(key) {
    setSelectedLangs((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
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
          <input type="text" placeholder="Lucas" />
        </FormGroup>
        <FormGroup label="Nom">
          <input type="text" placeholder="Martin" />
        </FormGroup>
      </div>

      <FormGroup label="Pseudo / Nom de scène" optional="optionnel">
        <input type="text" placeholder="Le nom affiché sur ton profil public" />
      </FormGroup>

      <FormGroup label="Photo de profil" optional="optionnel — tu peux l'ajouter plus tard">
        <UploadZone icon="📷" title="Clique pour uploader" hint="JPG ou PNG, moins de 5Mo" style={{ padding: 24 }} />
      </FormGroup>

      <FormGroup label="Langues parlées">
        <div className="lang-selector">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.key}
              className={`lang-option${selectedLangs.has(lang.key) ? ' selected' : ''}`}
              onClick={() => toggleLang(lang.key)}
              role="checkbox"
              aria-checked={selectedLangs.has(lang.key)}
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
              selected={availability === option}
              onSelect={() => setAvailability(option)}
            />
          ))}
        </div>
      </FormGroup>

      <StepNav onBack={() => goToStep(1)} onNext={() => goToStep(3)} />
    </div>
  )
}

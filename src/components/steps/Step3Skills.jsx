import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { SKILLS, FORMATS, NICHES, EXPERIENCE_OPTIONS, SOFTWARE } from '../../constants/options'
import StepHeader from '../ui/StepHeader'
import Tag from '../ui/Tag'
import NicheTag from '../ui/NicheTag'
import SectionDivider from '../ui/SectionDivider'
import StepNav from '../ui/StepNav'

export default function Step3Skills() {
  const { goToStep, formData, updateFormData } = useOnboarding()
  const [error, setError] = useState('')

  function handleNext() {
    if (formData.skills.length === 0) { setError('Sélectionne au moins une compétence.'); return }
    if (formData.formats.length === 0) { setError('Sélectionne au moins un format.'); return }
    if (formData.niches.length === 0) { setError('Sélectionne au moins une niche de contenu.'); return }
    setError('')
    goToStep(4)
  }

  function toggleArr(field, key) {
    const arr = formData[field]
    updateFormData({ [field]: arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key] })
  }

  function toggleAllNiches() {
    updateFormData({ niches: formData.niches.length === NICHES.length ? [] : [...NICHES] })
  }

  const allNiches = formData.niches.length === NICHES.length

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 3 sur 7"
        title="Ton métier"
        desc="Sélectionne tout ce que tu sais faire."
      />

      <SectionDivider>Compétences</SectionDivider>
      <div className="tag-group">
        {SKILLS.map((s) => (
          <Tag key={s.key} icon={s.icon} selected={formData.skills.includes(s.key)} onToggle={() => toggleArr('skills', s.key)}>
            {s.label}
          </Tag>
        ))}
      </div>

      <SectionDivider>Formats</SectionDivider>
      <div className="tag-group">
        {FORMATS.map((f) => (
          <Tag key={f.key} selected={formData.formats.includes(f.key)} onToggle={() => toggleArr('formats', f.key)}>
            {f.label}
          </Tag>
        ))}
      </div>

      <SectionDivider>Niches de contenu</SectionDivider>
      <div className="tag-group">
        <NicheTag isTout selected={allNiches} onToggle={toggleAllNiches}>
          ✦ Toutes niches
        </NicheTag>
        {NICHES.map((name) => (
          <NicheTag key={name} selected={formData.niches.includes(name)} onToggle={() => toggleArr('niches', name)}>
            {name}
          </NicheTag>
        ))}
      </div>

      <SectionDivider>Expérience</SectionDivider>
      <div className="tag-group">
        {EXPERIENCE_OPTIONS.map((opt) => (
          <Tag key={opt.key} selected={formData.experience === opt.key} onToggle={() => updateFormData({ experience: opt.key })}>
            {opt.label}
          </Tag>
        ))}
      </div>

      <SectionDivider>Logiciels</SectionDivider>
      <div className="tag-group">
        {SOFTWARE.map((sw) => (
          <Tag key={sw} selected={formData.software.includes(sw)} onToggle={() => toggleArr('software', sw)}>
            {sw}
          </Tag>
        ))}
      </div>

      {error && <div className="step-error">{error}</div>}
      <StepNav onBack={() => goToStep(2)} onNext={handleNext} />
    </div>
  )
}

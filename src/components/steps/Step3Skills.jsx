import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import StepHeader from '../ui/StepHeader'
import Tag from '../ui/Tag'
import NicheTag from '../ui/NicheTag'
import SectionDivider from '../ui/SectionDivider'
import StepNav from '../ui/StepNav'

const SKILLS = [
  { key: 'video',   icon: '🎬', label: 'Montage vidéo' },
  { key: 'thumb',   icon: '🖼️', label: 'Miniatures' },
  { key: 'sound',   icon: '🎵', label: 'Sound design' },
  { key: 'motion',  icon: '✨', label: 'Motion design' },
  { key: 'voice',   icon: '🎙️', label: 'Traitement voix' },
  { key: 'subs',    icon: '✏️', label: 'Sous-titrage' },
  { key: 'color',   icon: '🎨', label: 'Color grading' },
  { key: 'reels',   icon: '📱', label: 'Reels / Shorts' },
]

const FORMATS = [
  { key: 'portrait',  label: '📱 Portrait / Shorts' },
  { key: 'youtube',   label: '🖥️ YouTube long format' },
  { key: 'pub',       label: '📺 Publicités & spots' },
  { key: 'docu',      label: '🎞️ Documentaires' },
  { key: 'corporate', label: '💼 Corporate / B2B' },
  { key: 'clips',     label: '🎵 Clips musicaux' },
  { key: 'gaming',    label: '🎮 Gaming' },
  { key: 'sport',     label: '🏋️ Sport / Fitness' },
]

const NICHES = [
  'Gaming', 'Finance', 'Lifestyle', 'Tech', 'Food', 'Sport',
  'Mode', 'Éducation', 'Voyage', 'Musique', 'Business', 'Humour',
  'Science', 'Politique',
]

const EXPERIENCE_OPTIONS = [
  { key: '<6m',  label: 'Moins de 6 mois' },
  { key: '6m1y', label: '6 mois – 1 an' },
  { key: '1-3y', label: '1 – 3 ans' },
  { key: '3-5y', label: '3 – 5 ans' },
  { key: '5-7y', label: '5 – 7 ans' },
  { key: '7y+',  label: '7 ans et plus' },
]

const SOFTWARE = [
  'Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro',
  'CapCut', 'Canva', 'Photoshop', 'Illustrator', 'Audition', 'Figma',
]

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
        tag="Étape 3 sur 8"
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

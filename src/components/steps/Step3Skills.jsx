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
  { key: '5y+',  label: '5 ans et plus' },
]

const SOFTWARE = [
  'Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro',
  'CapCut', 'Canva', 'Photoshop', 'Illustrator', 'Audition', 'Figma',
]

export default function Step3Skills() {
  const { goToStep } = useOnboarding()

  const [skills,    setSkills]    = useState(new Set(['video']))
  const [formats,   setFormats]   = useState(new Set(['youtube']))
  const [niches,    setNiches]    = useState(new Set(['Gaming']))
  const [allNiches, setAllNiches] = useState(false)
  const [experience, setExperience] = useState('1-3y')
  const [software,  setSoftware]  = useState(new Set(['Premiere Pro', 'DaVinci Resolve']))

  function toggle(setter, key) {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function setExclusive(key) {
    setExperience(key)
  }

  function toggleNiche(name) {
    setNiches((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      setAllNiches(next.size === NICHES.length)
      return next
    })
  }

  function toggleAllNiches() {
    if (allNiches) {
      setAllNiches(false)
      setNiches(new Set())
    } else {
      setAllNiches(true)
      setNiches(new Set(NICHES))
    }
  }

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
          <Tag key={s.key} icon={s.icon} selected={skills.has(s.key)} onToggle={() => toggle(setSkills, s.key)}>
            {s.label}
          </Tag>
        ))}
      </div>

      <SectionDivider>Formats</SectionDivider>
      <div className="tag-group">
        {FORMATS.map((f) => (
          <Tag key={f.key} selected={formats.has(f.key)} onToggle={() => toggle(setFormats, f.key)}>
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
          <NicheTag key={name} selected={niches.has(name)} onToggle={() => toggleNiche(name)}>
            {name}
          </NicheTag>
        ))}
      </div>

      <SectionDivider>Expérience</SectionDivider>
      <div className="tag-group">
        {EXPERIENCE_OPTIONS.map((opt) => (
          <Tag key={opt.key} selected={experience === opt.key} onToggle={() => setExclusive(opt.key)}>
            {opt.label}
          </Tag>
        ))}
      </div>

      <SectionDivider>Logiciels</SectionDivider>
      <div className="tag-group">
        {SOFTWARE.map((sw) => (
          <Tag key={sw} selected={software.has(sw)} onToggle={() => toggle(setSoftware, sw)}>
            {sw}
          </Tag>
        ))}
      </div>

      <StepNav onBack={() => goToStep(2)} onNext={() => goToStep(4)} />
    </div>
  )
}

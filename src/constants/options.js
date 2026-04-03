// Shared field options — single source of truth for onboarding, project forms, and filters

export const LANGUAGES = [
  { key: 'fr', flag: '🇫🇷', code: 'FR', label: 'Français' },
  { key: 'en', flag: '🇬🇧', code: 'EN', label: 'Anglais' },
  { key: 'es', flag: '🇪🇸', code: 'ES', label: 'Espagnol' },
  { key: 'pt', flag: '🇧🇷', code: 'PT', label: 'Portugais' },
  { key: 'de', flag: '🇩🇪', code: 'DE', label: 'Allemand' },
  { key: 'it', flag: '🇮🇹', code: 'IT', label: 'Italien' },
  { key: 'zh', flag: '🇨🇳', code: 'ZH', label: 'Chinois' },
  { key: 'ja', flag: '🇯🇵', code: 'JA', label: 'Japonais' },
  { key: 'ar', flag: '🇸🇦', code: 'AR', label: 'Arabe' },
  { key: 'ru', flag: '🇷🇺', code: 'RU', label: 'Russe' },
  { key: 'ko', flag: '🇰🇷', code: 'KO', label: 'Coréen' },
]

export const AVAILABILITY_OPTIONS = ['Disponible', 'Sur demande', 'Indisponible']

export const SKILLS = [
  { key: 'video',   icon: '🎬', label: 'Montage vidéo' },
  { key: 'thumb',   icon: '🖼️', label: 'Miniatures' },
  { key: 'sound',   icon: '🎵', label: 'Sound design' },
  { key: 'motion',  icon: '✨', label: 'Motion design' },
  { key: 'voice',   icon: '🎙️', label: 'Traitement voix' },
  { key: 'subs',    icon: '✏️', label: 'Sous-titrage' },
  { key: 'color',   icon: '🎨', label: 'Color grading' },
  { key: 'reels',   icon: '📱', label: 'Reels / Shorts' },
]

export const FORMATS = [
  { key: 'portrait',  label: '📱 Portrait / Shorts' },
  { key: 'youtube',   label: '🖥️ YouTube long format' },
  { key: 'pub',       label: '📺 Publicités & spots' },
  { key: 'docu',      label: '🎞️ Documentaires' },
  { key: 'corporate', label: '💼 Corporate / B2B' },
  { key: 'clips',     label: '🎵 Clips musicaux' },
  { key: 'gaming',    label: '🎮 Gaming' },
  { key: 'sport',     label: '🏋️ Sport / Fitness' },
]

export const NICHES = [
  'Gaming', 'Finance', 'Lifestyle', 'Tech', 'Food', 'Sport',
  'Mode', 'Éducation', 'Voyage', 'Musique', 'Business', 'Humour',
  'Science', 'Politique',
]

export const EXPERIENCE_OPTIONS = [
  { key: '<6m',  label: 'Moins de 6 mois' },
  { key: '6m1y', label: '6 mois – 1 an' },
  { key: '1-3y', label: '1 – 3 ans' },
  { key: '3-5y', label: '3 – 5 ans' },
  { key: '5-7y', label: '5 – 7 ans' },
  { key: '7y+',  label: '7 ans et plus' },
]

export const SOFTWARE = [
  'Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro',
  'CapCut', 'Canva', 'Photoshop', 'Illustrator', 'Audition', 'Figma',
]

export const REVISION_OPTIONS = ['1', '2', '3', '4', '5']

export const CAPACITY_OPTIONS = [
  { key: '1',   label: '1 projet à la fois' },
  { key: '2-3', label: '2–3 projets' },
  { key: '4+',  label: '4 projets et plus' },
]

export const MISSION_TYPES = [
  { key: 'ponctuelle',   label: 'Mission ponctuelle' },
  { key: 'long-terme',   label: 'Partenariat long terme' },
]

export const RESPONSE_TIMES = [
  { key: '<4h',  label: 'Moins de 4h' },
  { key: '<12h', label: 'Moins de 12h' },
  { key: '<24h', label: 'Moins de 24h' },
  { key: '<48h', label: 'Moins de 48h' },
  { key: '<1w',  label: "Moins d'1 semaine" },
]

// Deliverable types for project forms
export const DELIVERABLE_TYPES = [
  { key: 'video',           label: '🎬 Montage vidéo' },
  { key: 'thumbnail',       label: '🖼️ Miniature' },
  { key: 'reels',           label: '📱 Reels / Shorts' },
  { key: 'motion_graphics', label: '✨ Motion design' },
  { key: 'color_grading',   label: '🎨 Color grading' },
  { key: 'subtitles',       label: '✏️ Sous-titrage' },
  { key: 'sound_design',    label: '🎵 Sound design' },
]

// Quality/resolution options for projects
export const QUALITY_OPTIONS = [
  { key: '720p',  label: '720p (HD)' },
  { key: '1080p', label: '1080p (Full HD)' },
  { key: '2k',    label: '2K' },
  { key: '4k',    label: '4K (Ultra HD)' },
]

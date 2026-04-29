import { emptyPrices } from './pricing'

// Demo accounts — credentials loaded from env vars (never hardcode in source)
export const DEMO_EMAIL    = import.meta.env.VITE_DEMO_EMAIL    ?? ''
export const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? ''

export const DEMO_CREATOR_EMAIL    = import.meta.env.VITE_DEMO_CREATOR_EMAIL    ?? ''
export const DEMO_CREATOR_PASSWORD = import.meta.env.VITE_DEMO_CREATOR_PASSWORD ?? ''

export const DEMO_FORM = {
  firstName:        'Lucas',
  lastName:         'Martin',
  avatarUrl:        '',
  languages:        ['fr', 'en'],
  availability:     'Disponible',
  skills:           ['video', 'motion', 'color', 'reels'],
  formats:          ['youtube', 'gaming', 'portrait'],
  niches:           ['Gaming', 'Tech', 'Lifestyle'],
  experience:       '3-5y',
  software:         ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
  portfolioLinks:   ['https://youtu.be/demo', ''],
  creditedChannels: '@PewDiePie, @MrBeast',
  revisions:        '3',
  capacity:         '2-3',
  pricing:          { baselineLevel: 2, prices: emptyPrices() },
  bio:              'Monteur YouTube depuis 4 ans, spé gaming et tech. J\'aime les transitions fluides et le storytelling percutant. Réponse garantie sous 4h.',
  missionTypes:     ['ponctuelle', 'long-terme'],
  responseTime:     '<4h',
  socialLinks:      { instagram: 'lucasedits' },
}

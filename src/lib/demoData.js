import { emptyPrices } from './pricing'

// Demo accounts
export const DEMO_EMAIL    = 'demo@cutlab.io'
export const DEMO_PASSWORD = 'cutlab-demo-2024!'

export const DEMO_CREATOR_EMAIL    = 'demo-creator@cutlab.io'
export const DEMO_CREATOR_PASSWORD = 'cutlab-creator-2024!'

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

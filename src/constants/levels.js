export const LEVELS = [
  {
    emoji: '🌱',
    name: 'Débutant',
    desc: "Tu débarques dans l'univers du montage. Les clients qui cherchent des tarifs accessibles et un regard neuf vont te trouver ici.",
    minScore: 0,
    maxScore: 15,
  },
  {
    emoji: '⚡',
    name: 'Prospect',
    desc: "Tu commences à avoir des réalisations solides. Ton profil est prometteur et tu montes vite.",
    minScore: 16,
    maxScore: 25,
  },
  {
    emoji: '💎',
    name: 'Confirmé',
    desc: "Tu es régulier, fiable, et tu as prouvé ta valeur sur des projets variés. Un excellent rapport qualité/prix.",
    minScore: 26,
    maxScore: 50,
  },
  {
    emoji: '🚀',
    name: 'Expert',
    desc: "Multi-formats, réactif, expérimenté. Tu maîtrises ton métier de bout en bout.",
    minScore: 51,
    maxScore: 65,
  },
  {
    emoji: '⭐',
    name: 'Star',
    desc: "Tes références clients sont solides et tes notes parlent d'elles-mêmes. Tu fais partie des meilleurs de la plateforme.",
    minScore: 66,
    maxScore: 80,
  },
  {
    emoji: '👑',
    name: 'Elite',
    desc: "Top profils de CUTLAB. Tu livres constamment une qualité exceptionnelle et tes clients reviennent toujours.",
    minScore: 81,
    maxScore: 90,
  },
  {
    emoji: '🔮',
    name: 'Légende',
    desc: "Ultra rare. Réservé aux profils qui ont marqué CUTLAB et le secteur. Une reconnaissance qui ne s'achète pas.",
    minScore: 91,
    maxScore: 100,
  },
]

/**
 * Returns the LEVELS index (0-6) for a given score (0-100).
 */
export function getLevelByScore(score) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) return i
  }
  return 0
}

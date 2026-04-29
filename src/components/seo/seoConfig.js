/**
 * SEO config for documentation and persona pages.
 * Each entry: { title, description, path, jsonLd }
 *
 * Title best practice: 50-60 chars
 * Description best practice: 150-160 chars
 */

const SITE_URL = 'https://cutlab.io'

const orgPublisher = {
  '@type': 'Organization',
  name: 'CUTLAB',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
}

const article = (path, title, description) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  url: `${SITE_URL}${path}`,
  publisher: orgPublisher,
  inLanguage: 'fr-FR',
})

const webpage = (path, title, description) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: `${SITE_URL}${path}`,
  publisher: orgPublisher,
  inLanguage: 'fr-FR',
})

export const SEO_CONFIG = {
  guideMonteur: {
    title: 'Guide du monteur — Inscription, profil, tarifs',
    description: "Guide complet pour monteurs vidéo : créer votre profil CUTLAB, définir vos tarifs, recevoir des demandes de créateurs. Inscription gratuite, 0% commission.",
    path: '/guide/monteur',
    jsonLd: article('/guide/monteur', 'Guide du monteur CUTLAB', "Guide complet pour les monteurs vidéo souhaitant rejoindre CUTLAB."),
  },
  guideCreateur: {
    title: 'Guide du créateur — Trouver son monteur vidéo',
    description: "Guide complet pour créateurs : parcourir le catalogue, contacter un monteur, gérer ses projets sur CUTLAB. Trouvez votre monteur en moins de 15 minutes.",
    path: '/guide/createur',
    jsonLd: article('/guide/createur', 'Guide du créateur CUTLAB', "Guide complet pour les créateurs de contenu cherchant un monteur vidéo."),
  },
  // Créateurs
  youtubeurGaming: {
    title: 'Monteur vidéo Gaming pour YouTubeur — CUTLAB',
    description: "Tu postes 3 vidéos par semaine ? Trouve un monteur Gaming spécialisé pour scaler ton contenu YouTube. Tarifs transparents, 0% commission, en moins de 15 min.",
    path: '/pour/youtubeur-gaming',
    jsonLd: webpage('/pour/youtubeur-gaming', 'Monteur Gaming pour YouTubeur', "Page dédiée aux YouTubeurs Gaming cherchant un monteur vidéo spécialisé."),
  },
  influenceurLifestyle: {
    title: 'Monteur Reels & TikTok pour Influenceur Lifestyle',
    description: "Influenceur lifestyle ? Trouve un monteur qui comprend ton univers visuel. Spécialistes Reels, TikTok, YouTube. Tarifs transparents, 0% commission.",
    path: '/pour/influenceur-lifestyle',
    jsonLd: webpage('/pour/influenceur-lifestyle', 'Monteur Reels Lifestyle', "Page dédiée aux influenceurs lifestyle cherchant un monteur."),
  },
  coachEntrepreneur: {
    title: 'Monteur vidéo pour Coach & Entrepreneur — CUTLAB',
    description: "Coach, formateur, entrepreneur ? Externalisez votre montage vidéo sans agence. Monteurs expérimentés Corporate/B2B, tarifs transparents, sans commission.",
    path: '/pour/coach-entrepreneur',
    jsonLd: webpage('/pour/coach-entrepreneur', 'Monteur pour Coach Entrepreneur', "Page dédiée aux coachs et entrepreneurs cherchant un monteur vidéo professionnel."),
  },
  podcasteur: {
    title: 'Monteur Podcast Vidéo — Clips YouTube, Reels, TikTok',
    description: "Ton podcast existe en audio ? Multiplie ta portée avec un monteur podcast vidéo. Clips YouTube, Reels, snippets TikTok depuis un seul enregistrement.",
    path: '/pour/podcasteur',
    jsonLd: webpage('/pour/podcasteur', 'Monteur Podcast Vidéo', "Page dédiée aux podcasteurs cherchant un monteur vidéo multi-format."),
  },
  formateurEnLigne: {
    title: 'Monteur vidéo pour Formation en Ligne & Cours',
    description: "Cours en ligne, masterclass, webinaires ? Trouvez un monteur spécialisé en pédagogie. Sans agence, tarifs transparents, jusqu'à 5K€ économisés par module.",
    path: '/pour/formateur-en-ligne',
    jsonLd: webpage('/pour/formateur-en-ligne', 'Monteur Formation en Ligne', "Page dédiée aux formateurs et infopreneurs cherchant un monteur."),
  },
  agencePme: {
    title: 'Monteur vidéo à la demande pour Agence & PME',
    description: "PME, ETI, agences : externalisez votre montage vidéo sans contrat. Monteurs vérifiés à la demande pour LinkedIn, Reels, vidéos corporate. -70% vs agence.",
    path: '/pour/agence-pme',
    jsonLd: webpage('/pour/agence-pme', 'Monteur à la demande PME', "Page dédiée aux agences et PME cherchant un studio vidéo à la demande."),
  },
  streamerTwitch: {
    title: 'Monteur Twitch Highlights & Shorts — CUTLAB',
    description: "Streamer Twitch ? Transforme tes VODs en highlights YouTube et shorts viraux. Monteurs Gaming spécialisés, pipeline pour le volume hebdomadaire.",
    path: '/pour/streamer-twitch',
    jsonLd: webpage('/pour/streamer-twitch', 'Monteur Twitch Streamer', "Page dédiée aux streamers Twitch cherchant un monteur highlights."),
  },
  musicienIndependant: {
    title: 'Monteur Clip Musical pour Musicien Indépendant',
    description: "Lyric video, clip musical, live session, visualizer ? Trouve un monteur qui aime la musique. Sans label, sans intermédiaire, tarifs par projet.",
    path: '/pour/musicien-independant',
    jsonLd: webpage('/pour/musicien-independant', 'Monteur Clip Musical', "Page dédiée aux musiciens indépendants cherchant un monteur."),
  },
  // Monteurs
  freelanceYoutube: {
    title: 'Monteur Freelance YouTube — Catalogue dédié, 0% commission',
    description: "Marre de Fiverr et Malt ? CUTLAB est un catalogue 100% montage vidéo. Profil complet, 0% commission, créateurs qui te trouvent. Inscription gratuite.",
    path: '/pour/freelance-youtube',
    jsonLd: webpage('/pour/freelance-youtube', 'Monteur Freelance YouTube', "Page dédiée aux monteurs freelance cherchant un catalogue dédié."),
  },
  motionDesigner: {
    title: 'Motion Designer — Plateforme dédiée, tarifs valorisés',
    description: "Tu fais du motion design ? Sors de la confusion avec le montage basique. Tarifs motion dédiés, niveaux qui valorisent ton expertise. 0% commission.",
    path: '/pour/motion-designer',
    jsonLd: webpage('/pour/motion-designer', 'Motion Designer Freelance', "Page dédiée aux motion designers freelance."),
  },
  etudiantAudiovisuel: {
    title: 'Premier portfolio monteur ? Trouve tes premiers clients',
    description: "Étudiant en audiovisuel ou jeune diplômé ? Inscription gratuite, profil guidé en 7 étapes, niveaux progressifs, tarifs de référence. Lance ta carrière.",
    path: '/pour/etudiant-audiovisuel',
    jsonLd: webpage('/pour/etudiant-audiovisuel', 'Étudiant Audiovisuel', "Page dédiée aux étudiants en audiovisuel."),
  },
  monteurReconverti: {
    title: 'Reconversion monteur vidéo — Premiers clients sans réseau',
    description: "Reconversion vers le montage vidéo ? CUTLAB te donne une vitrine pro sans avoir 5 ans d'XP. Onboarding guidé, tarifs de référence, 0% commission.",
    path: '/pour/monteur-reconverti',
    jsonLd: webpage('/pour/monteur-reconverti', 'Reconversion Monteur Vidéo', "Page dédiée aux monteurs en reconversion professionnelle."),
  },
  specialisteShorts: {
    title: 'Monteur Shorts, Reels & TikTok — Format vertical valorisé',
    description: "Spécialiste du format vertical ? Filtre dédié Shorts/Reels/TikTok. Tes hooks de 3 secondes méritent leur propre tarif. Inscription gratuite.",
    path: '/pour/specialiste-shorts',
    jsonLd: webpage('/pour/specialiste-shorts', 'Monteur Shorts TikTok', "Page dédiée aux monteurs spécialisés en formats verticaux courts."),
  },
  monteurAgence: {
    title: '10 ans d\'agence ? Passez en freelance avec CUTLAB',
    description: "Monteur expérimenté en agence ? Quitte l'agence sans repartir de zéro. Niveau élevé d'entrée, tarifs alignés, choisis tes projets. 0% commission.",
    path: '/pour/monteur-agence',
    jsonLd: webpage('/pour/monteur-agence', 'Monteur Agence vers Freelance', "Page dédiée aux monteurs en agence souhaitant passer en freelance."),
  },
  soundDesigner: {
    title: 'Sound Designer — Plateforme dédiée audio, tarifs son',
    description: "Sound designer ? Tes skills audio méritent une plateforme. Sound design comme compétence à part, tarifs son dédiés, projets qui valorisent ton oreille.",
    path: '/pour/sound-designer',
    jsonLd: webpage('/pour/sound-designer', 'Sound Designer Freelance', "Page dédiée aux sound designers freelance."),
  },
  colorist: {
    title: 'Colorist Freelance — Étalonnage cinéma, clips, doc',
    description: "Colorist ? Color grading comme compétence à part entière. Filtres formats clips/doc/cinéma, niveaux qui valorisent ton œil. Inscription gratuite.",
    path: '/pour/colorist',
    jsonLd: webpage('/pour/colorist', 'Colorist Étalonneur Freelance', "Page dédiée aux colorists freelance cherchant des projets."),
  },
}

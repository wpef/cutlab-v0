import { Link } from 'react-router-dom'
import SEO from '../seo/SEO'
import { SEO_CONFIG } from '../seo/seoConfig'

export default function DocumentationCreateur() {
  return (
    <div className="doc-page">
      <SEO {...SEO_CONFIG.guideCreateur} type="article" />
      <div className="doc-content">
        <Link to="/" className="doc-back">← Retour</Link>
        <div className="logo" style={{ marginBottom: '24px' }}>CUT<span>LAB</span></div>
        <h1>Guide du créateur</h1>
        <p className="doc-subtitle">Trouvez le monteur idéal pour votre contenu.</p>

        {/* Quick nav */}
        <nav className="doc-nav">
          <a href="#intro">Introduction</a>
          <a href="#catalogue">Parcourir le catalogue</a>
          <a href="#contact">Contacter un monteur</a>
          <a href="#projet">Créer un projet</a>
          <a href="#messagerie">Messagerie</a>
          <a href="#projets">Gérer mes projets</a>
          <a href="#tarifs">Comprendre les tarifs</a>
        </nav>

        {/* Introduction */}
        <div className="doc-section" id="intro">
          <h2>Introduction</h2>
          <p>
            CUTLAB est une plateforme dédiée aux créateurs de contenu qui souhaitent travailler avec des monteurs vidéo
            professionnels et vérifiés. Que vous produisiez des vidéos YouTube, des reels Instagram ou des contenus
            TikTok, CUTLAB vous permet de trouver le monteur qui correspond exactement à votre style, votre format
            et votre budget.
          </p>
          <p>
            Le principe est simple : parcourez les profils de monteurs, comparez leurs compétences et leurs tarifs,
            puis contactez directement celui qui vous correspond. Aucun intermédiaire —
            la relation est directe entre vous et le monteur.
          </p>
          <div className="doc-feature-grid">
            <div className="doc-feature-card">
              <strong>Profils vérifiés</strong>
              <p>Chaque monteur est évalué et assigné à un niveau selon ses compétences réelles.</p>
            </div>
            <div className="doc-feature-card">
              <strong>Catalogue complet</strong>
              <p>Filtrez par format, niche, logiciel, disponibilité ou fourchette de tarifs.</p>
            </div>
            <div className="doc-feature-card">
              <strong>Contact direct</strong>
              <p>Échangez en messagerie privée et recevez des propositions structurées.</p>
            </div>
            <div className="doc-feature-card">
              <strong>Contact direct</strong>
              <p>Vous échangez directement avec le monteur, sans intermédiaire qui filtre les conversations.</p>
            </div>
          </div>
        </div>

        {/* Parcourir le catalogue */}
        <div className="doc-section" id="catalogue">
          <h2>Parcourir le catalogue</h2>
          <p>
            Le catalogue est le point de départ de votre recherche. Il liste tous les monteurs disponibles sur
            la plateforme et vous permet d'identifier rapidement les profils correspondant à vos besoins.
          </p>
          <p>
            Chaque carte monteur affiche en un coup d'œil les informations essentielles :
          </p>
          <ul>
            <li><strong>Nom et photo</strong> — l'identité du monteur.</li>
            <li><strong>Disponibilité</strong> — un badge coloré indique s'il est disponible, bientôt disponible ou actuellement occupé.</li>
            <li><strong>Compétences principales</strong> — les tags de ses formats maîtrisés (YouTube, Reels, TikTok, etc.) et des niches couvertes.</li>
            <li><strong>Niveau</strong> — son niveau attribué par CUTLAB sur 7 paliers (Débutant, Prospect, Confirmé, Expert, Star, Elite, Légende).</li>
            <li><strong>Fourchette de tarifs</strong> — le min et le max de la grille tarifaire personnelle du monteur.</li>
            <li><strong>Note</strong> — l'évaluation moyenne laissée par les créateurs ayant déjà collaboré avec lui.</li>
          </ul>
          <p>
            Cliquez sur une carte pour accéder au profil complet du monteur. Vous y trouverez sa biographie,
            ses liens vers les réseaux sociaux et ses chaînes créditées, son portfolio de clips, ainsi que
            la grille tarifaire complète détaillant ses prix pour chaque type de prestation (montage court,
            montage long, motion design, miniature, etc.).
          </p>
        </div>

        {/* Contacter un monteur */}
        <div className="doc-section" id="contact">
          <h2>Contacter un monteur</h2>
          <p>
            Lorsque vous avez identifié un monteur qui vous intéresse, le contacter est simple et direct.
            Voici les étapes du processus :
          </p>
          <div className="doc-step">
            <div className="doc-step-num">1</div>
            <div className="doc-step-content">
              <strong>Parcourez le catalogue</strong>
              <p>Trouvez le profil d'un monteur dont les compétences et les tarifs correspondent à votre projet.</p>
            </div>
          </div>
          <div className="doc-step">
            <div className="doc-step-num">2</div>
            <div className="doc-step-content">
              <strong>Envoyez un premier message</strong>
              <p>
                Cliquez sur le bouton "Contacter" depuis la carte ou le profil du monteur. Un formulaire
                apparaît directement sur la page. Rédigez un message court décrivant votre projet :
                type de contenu, format, fréquence souhaitée ou toute information utile. Votre message
                est transmis instantanément et le monteur reçoit une notification.
              </p>
            </div>
          </div>
          <div className="doc-step">
            <div className="doc-step-num">3</div>
            <div className="doc-step-content">
              <strong>Discutez et finalisez</strong>
              <p>
                Une conversation privée s'ouvre dans la messagerie. Échangez librement pour préciser
                vos attentes, négocier le budget et les délais, puis recevez une proposition formelle
                de la part du monteur.
              </p>
            </div>
          </div>
        </div>

        {/* Créer un projet */}
        <div className="doc-section" id="projet">
          <h2>Créer un projet</h2>
          <p>
            En plus de contacter un monteur directement, vous pouvez publier un projet sur la plateforme.
            Les monteurs qui correspondent à vos critères peuvent alors candidater d'eux-mêmes, ce qui
            vous permet de recevoir plusieurs propositions et de choisir le meilleur profil.
          </p>
          <p>
            Pour créer un projet, utilisez le bouton "Créer" dans la navigation mobile ou accédez à
            la page "Nouveau projet" depuis le menu. Renseignez les informations suivantes :
          </p>
          <ul>
            <li><strong>Titre</strong> — un intitulé clair et descriptif pour votre projet.</li>
            <li><strong>Description</strong> — détaillez votre vision, le contexte et vos attentes.</li>
            <li><strong>Format</strong> — YouTube longform, Reels, TikTok, Shorts, etc.</li>
            <li><strong>Niche</strong> — gaming, lifestyle, tech, voyage, sport, et bien d'autres.</li>
            <li><strong>Logiciels nécessaires</strong> — Premiere Pro, DaVinci Resolve, After Effects, etc.</li>
            <li><strong>Livrables attendus</strong> — vidéo principale, miniature, reels découpés, etc.</li>
            <li><strong>Qualité et résolution</strong> — 1080p, 4K, ou autre spécification technique.</li>
            <li><strong>Budget</strong> — votre enveloppe pour ce projet.</li>
            <li><strong>Délai de livraison</strong> — la date à laquelle vous souhaitez recevoir le rendu final.</li>
          </ul>
          <p>
            Une fois publié, votre projet apparaît dans l'onglet "Mes projets" où vous pouvez suivre
            les candidatures reçues et gérer leur statut.
          </p>
        </div>

        {/* Messagerie */}
        <div className="doc-section" id="messagerie">
          <h2>Messagerie</h2>
          <p>
            Dès qu'un premier contact est établi — que ce soit vous qui contactez un monteur ou un monteur
            qui candidate à votre projet — une conversation privée s'ouvre dans la messagerie. C'est là que
            se déroule l'essentiel de la collaboration.
          </p>
          <p>
            Dans la messagerie, vous pouvez échanger librement avec le monteur : préciser les détails du
            projet, partager des références visuelles, discuter du rythme de travail ou ajuster le budget.
            La conversation est conservée dans votre historique pour que vous puissiez vous y référer
            à tout moment.
          </p>
          <p>
            Lorsque le monteur est prêt à soumettre une proposition formelle, il envoie une <strong>offre de mission</strong> structurée directement dans la conversation. Cette carte détaillée récapitule :
          </p>
          <ul>
            <li>Le titre et la description de la mission</li>
            <li>Les livrables inclus dans la prestation</li>
            <li>Le format et les spécifications techniques</li>
            <li>Le délai de livraison proposé</li>
            <li>Le budget convenu</li>
            <li>Le nombre de révisions incluses</li>
            <li>Le statut de l'offre (en attente, acceptée, refusée)</li>
          </ul>
          <p>
            Vous pouvez <strong>accepter</strong> ou <strong>refuser</strong> cette proposition directement
            depuis la conversation. En cas de refus, vous pouvez continuer à discuter pour affiner les
            conditions avant qu'une nouvelle offre soit soumise.
          </p>
        </div>

        {/* Gérer mes projets */}
        <div className="doc-section" id="projets">
          <h2>Gérer mes projets</h2>
          <p>
            L'onglet "Mes projets" centralise tous les projets que vous avez publiés sur la plateforme.
            C'est votre tableau de bord pour suivre l'avancement de vos recherches de monteurs et gérer
            les candidatures reçues.
          </p>
          <p>
            Pour chaque projet, vous pouvez :
          </p>
          <ul>
            <li>
              <strong>Consulter les candidatures</strong> — voir la liste des monteurs qui ont postulé
              à votre projet avec leur profil et leur message de présentation.
            </li>
            <li>
              <strong>Accepter ou refuser</strong> — sélectionner le monteur qui vous convient le mieux
              et décliner les autres candidatures de manière courtoise.
            </li>
            <li>
              <strong>Suivre le statut</strong> — votre projet passe par différentes étapes :
              ouvert aux candidatures, en cours, terminé ou archivé.
            </li>
          </ul>
          <p>
            Lorsqu'un monteur candidate à votre projet, vous recevez une notification dans l'application.
            Les notifications apparaissent dans la cloche en haut de l'écran (version desktop) ou via
            une pastille sur l'onglet correspondant (version mobile).
          </p>
        </div>

        {/* Comprendre les tarifs */}
        <div className="doc-section" id="tarifs">
          <h2>Comprendre les tarifs</h2>
          <p>
            Les tarifs affichés sur les cartes du catalogue correspondent à la <strong>fourchette de prix</strong> du
            monteur : le minimum et le maximum de sa grille tarifaire personnelle. Cette fourchette vous donne un
            aperçu rapide du coût d'une collaboration, sans vous engager sur un montant précis.
          </p>
          <p>
            La grille tarifaire complète d'un monteur comporte sept lignes :
          </p>
          <ul>
            <li>Montage court (moins de 10 min)</li>
            <li>Montage moyen (10 à 30 min)</li>
            <li>Montage long (plus de 30 min)</li>
            <li>Motion design court</li>
            <li>Motion design moyen</li>
            <li>Motion design long</li>
            <li>Miniature</li>
          </ul>
          <p>
            Une <strong>grille de référence (baseline)</strong> est calculée à partir du niveau du monteur — elle sert
            de point de départ. Le monteur reste libre de fixer ses propres prix, ligne par ligne. La grille détaillée
            est consultable sur le profil complet de chaque monteur.
          </p>
          <p>
            Le budget final d'un projet est toujours convenu directement entre vous et le monteur via
            la messagerie. <strong>CUTLAB facilite la mise en relation et la gestion de projet.</strong> Les
            transactions se font directement entre vous et le monteur.
          </p>
        </div>

        {/* CTA */}
        <div className="doc-cta">
          <h2>Prêt à trouver votre monteur ?</h2>
          <p>Parcourez les profils de monteurs vérifiés et trouvez celui qui correspond à vos besoins.</p>
          <Link to="/catalog" className="doc-cta-btn">Parcourir les monteurs →</Link>
        </div>
      </div>
    </div>
  )
}

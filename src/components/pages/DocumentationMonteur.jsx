import { Link } from 'react-router-dom'
import SEO from '../seo/SEO'
import { SEO_CONFIG } from '../seo/seoConfig'

export default function DocumentationMonteur() {
  return (
    <div className="doc-page">
      <SEO {...SEO_CONFIG.guideMonteur} type="article" />
      <div className="doc-content">
        <Link to="/" className="doc-back">← Retour</Link>
        <div className="logo" style={{ marginBottom: '24px' }}>CUT<span>LAB</span></div>
        <h1>Guide du monteur</h1>
        <p className="doc-subtitle">
          Tout ce qu'il faut savoir pour créer votre profil, définir vos tarifs et recevoir des demandes de créateurs sur CUTLAB.
        </p>

        {/* Quick nav */}
        <nav className="doc-nav">
          <a href="#intro">Introduction</a>
          <a href="#inscription">S'inscrire</a>
          <a href="#profil">Mon profil</a>
          <a href="#niveaux">Niveaux</a>
          <a href="#tarifs">Tarifs</a>
          <a href="#demandes">Recevoir des demandes</a>
          <a href="#messagerie">Messagerie</a>
          <a href="#pipeline">Pipeline</a>
          <a href="#projets">Mes projets</a>
        </nav>

        {/* Introduction */}
        <section className="doc-section" id="intro">
          <h2>Introduction</h2>
          <p>
            CUTLAB vous connecte directement avec des créateurs de contenu à la recherche de monteurs vidéo professionnels.
            Pas d'intermédiaire, contact direct. Vous créez votre profil, les créateurs vous trouvent.
          </p>
          <p>
            La plateforme est conçue pour valoriser votre expertise : un système de niveaux automatique met en avant votre
            expérience, et une grille tarifaire transparente vous permet de communiquer vos prix clairement aux créateurs
            qui visitent votre profil.
          </p>
          <p>
            Une fois inscrit, vous apparaissez dans le catalogue public — accessible à tous les créateurs, qu'ils soient
            connectés ou non. Votre visibilité est immédiate dès la publication de votre profil.
          </p>
        </section>

        {/* S'inscrire */}
        <section className="doc-section" id="inscription">
          <h2>S'inscrire</h2>
          <p>
            L'inscription se fait en 7 étapes guidées. Chaque étape enrichit votre profil et contribue au calcul de votre
            niveau. Prenez le temps de renseigner chaque section avec soin : un profil complet attire davantage de créateurs.
          </p>

          <div className="doc-step">
            <div className="doc-step-num">1</div>
            <div className="doc-step-content">
              <strong>Créer un compte</strong>
              <p>
                Saisissez votre adresse email et choisissez un mot de passe. Vous pouvez également vous connecter via
                un compte Google ou GitHub. Cette étape crée votre compte Supabase sécurisé et déclenche l'onboarding.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-num">2</div>
            <div className="doc-step-content">
              <strong>Identité</strong>
              <p>
                Renseignez votre prénom, nom et uploadez un avatar. Indiquez les langues dans lesquelles vous travaillez
                et votre disponibilité actuelle (disponible, bientôt disponible, indisponible). Ces informations sont
                affichées sur votre carte dans le catalogue.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-num">3</div>
            <div className="doc-step-content">
              <strong>Compétences</strong>
              <p>
                Sélectionnez vos compétences techniques (montage, motion design, étalonnage…), les formats maîtrisés
                (Reels, YouTube longue durée, shorts, podcasts…), les niches dans lesquelles vous êtes à l'aise
                (gaming, lifestyle, tech, finance…), votre niveau d'expérience global et les logiciels que vous utilisez
                (Premiere, DaVinci, After Effects…).
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-num">4</div>
            <div className="doc-step-content">
              <strong>Portfolio</strong>
              <p>
                Ajoutez des liens vers vos meilleurs clips et les chaînes pour lesquelles vous avez travaillé. Un
                portfolio solide est l'un des critères les plus importants pour convaincre un créateur de vous contacter.
                Privilégiez des exemples variés qui illustrent votre style et votre polyvalence.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-num">5</div>
            <div className="doc-step-content">
              <strong>Présentation</strong>
              <p>
                Rédigez une biographie qui décrit votre parcours, votre approche et ce qui vous rend unique. Précisez
                les types de missions que vous acceptez, votre délai de réponse habituel et ajoutez vos liens sociaux
                (Instagram, TikTok, YouTube, portfolio personnel, LinkedIn). Ces informations sont visibles sur votre
                page profil détaillée.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-num">6</div>
            <div className="doc-step-content">
              <strong>Révélation du niveau</strong>
              <p>
                CUTLAB calcule automatiquement votre niveau (de 1 à 7) en fonction de la complétude de votre profil et
                de vos années d'expérience. Votre niveau est révélé lors d'une animation dédiée. Il détermine votre
                grille tarifaire de base et peut évoluer à mesure que vous enrichissez votre profil.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-num">7</div>
            <div className="doc-step-content">
              <strong>Aperçu et publication</strong>
              <p>
                Prévisualisez votre profil tel qu'il apparaîtra dans le catalogue. Vérifiez que toutes les informations
                sont correctes, puis publiez. Votre profil devient immédiatement visible pour les créateurs. Vous pouvez
                modifier toutes vos informations à tout moment depuis la section Mon profil.
              </p>
            </div>
          </div>
        </section>

        {/* Mon profil */}
        <section className="doc-section" id="profil">
          <h2>Mon profil</h2>
          <p>
            Une fois votre profil publié, accédez à la section <strong>Mon profil</strong> depuis la barre de navigation.
            Toutes les informations renseignées lors de l'onboarding sont modifiables à tout moment.
          </p>
          <p>
            La section <strong>Tarifs</strong> vous permet de configurer votre grille tarifaire après la révélation de
            votre niveau. Pour chaque ligne, le tarif de référence (baseline) calculé à partir de votre niveau s'affiche
            comme repère, mais vous saisissez le prix de votre choix dans un champ libre — laisser vide signifie utiliser
            la baseline. Vous gardez la main complète sur vos prix.
          </p>
          <p>
            La section <strong>Liens sociaux</strong> centralise vos présences en ligne : Instagram, TikTok, YouTube,
            portfolio personnel et LinkedIn. Ces icônes s'affichent sur votre page profil détaillée et permettent aux
            créateurs d'en savoir plus sur votre univers avant de vous contacter.
          </p>
          <p>
            Pour mettre à jour votre <strong>avatar</strong>, uploadez une nouvelle photo directement depuis la section
            Identité. Le format recommandé est carré, 400 × 400 px minimum, au format JPG ou PNG.
          </p>
          <p>
            Votre <strong>disponibilité</strong> est particulièrement importante : pensez à la maintenir à jour. Les
            créateurs filtrent souvent le catalogue en fonction de la disponibilité des monteurs. Indiquez "Disponible"
            uniquement lorsque vous pouvez réellement prendre de nouvelles missions.
          </p>
        </section>

        {/* Système de niveaux */}
        <section className="doc-section" id="niveaux">
          <h2>Système de niveaux</h2>
          <p>
            CUTLAB utilise un système de 7 niveaux pour situer votre expertise et calibrer votre grille tarifaire.
            Le niveau est calculé automatiquement — vous n'avez pas à le choisir vous-même.
          </p>

          <div className="doc-feature-grid">
            <div className="doc-feature-card">
              <h3>Comment est calculé le niveau</h3>
              <p>
                Le niveau est déterminé à partir de plusieurs critères : vos années d'expérience déclarées, la richesse
                de votre portfolio, la diversité de vos compétences et formats maîtrisés, et la complétude globale de
                votre profil. Plus votre profil est détaillé et vos références solides, plus votre niveau sera élevé.
                Le calcul se fait côté serveur lors de la publication de votre profil.
              </p>
            </div>

            <div className="doc-feature-card">
              <h3>Comment le faire monter</h3>
              <p>
                Enrichissez régulièrement votre profil : ajoutez de nouveaux clips à votre portfolio, complétez les
                sections encore vides, mettez à jour vos logiciels et formats maîtrisés. Chaque fois que vous publiez
                une mise à jour, le niveau est recalculé. Si le nouveau calcul dépasse votre niveau actuel, un message
                vous en informe et votre grille tarifaire est mise à jour automatiquement.
              </p>
            </div>
          </div>
        </section>

        {/* Tarifs */}
        <section className="doc-section" id="tarifs">
          <h2>Tarifs</h2>
          <p>
            La grille tarifaire CUTLAB comporte <strong>7 lignes</strong> couvrant l'ensemble des prestations standard
            de montage et de motion design :
          </p>
          <ul>
            <li>Montage court (Reels, Shorts, TikTok)</li>
            <li>Montage moyen (10–20 min)</li>
            <li>Montage long (20 min et plus)</li>
            <li>Motion design court</li>
            <li>Motion design moyen</li>
            <li>Motion design long</li>
            <li>Miniature</li>
          </ul>
          <p>
            Chaque ligne affiche un <strong>tarif de référence (baseline)</strong> calculé à partir de votre niveau —
            il sert de repère, pas d'imposition. Pour chaque ligne, vous saisissez le prix de votre choix dans un
            champ libre. Si vous laissez le champ vide, c'est la baseline qui s'applique. Vous avez ainsi la main
            complète sur votre tarification, ligne par ligne, sans contrainte de pourcentage.
          </p>
          <p>
            La baseline se met à jour automatiquement si votre niveau évolue. Vos prix personnalisés, eux, restent
            tels que vous les avez saisis tant que vous ne les modifiez pas.
          </p>
          <p>
            La fourchette affichée aux créateurs dans le catalogue (exemple : "80 – 120 €") est calculée dynamiquement
            à partir du minimum et du maximum de votre grille (vos prix personnalisés ou la baseline pour les lignes
            laissées vides). Les prix exacts par ligne sont visibles sur votre page profil détaillée. Les tarifs
            servent de point de départ à la négociation lors de chaque proposition de mission.
          </p>
        </section>

        {/* Recevoir des demandes */}
        <section className="doc-section" id="demandes">
          <h2>Recevoir des demandes</h2>
          <p>
            Les créateurs parcourent le catalogue pour trouver le monteur qui correspond à leur projet. Votre carte
            affiche vos informations essentielles : disponibilité, compétences, formats maîtrisés et fourchette de prix.
            Les créateurs peuvent filtrer le catalogue par disponibilité, format ou niche.
          </p>
          <p>
            Lorsqu'un créateur souhaite vous contacter, il vous envoie une <strong>demande de contact</strong>. Vous
            recevez immédiatement une notification indiquée par un badge dans la barre de navigation. Chaque demande
            ouvre une conversation dédiée dans la messagerie.
          </p>
          <p>
            Répondez rapidement aux demandes : votre délai de réponse est visible sur votre profil et influence la
            perception que les créateurs ont de votre réactivité. Un délai de réponse court est un signal positif fort
            dans un marché compétitif.
          </p>
        </section>

        {/* Messagerie */}
        <section className="doc-section" id="messagerie">
          <h2>Messagerie</h2>
          <p>
            La messagerie CUTLAB est intégrée à la plateforme et ne nécessite aucun outil externe. Chaque conversation
            correspond à un échange avec un créateur spécifique. Vous y retrouvez l'historique complet de vos échanges.
          </p>
          <p>
            Les créateurs peuvent vous envoyer des <strong>propositions de mission</strong> structurées directement dans
            la conversation. Ces propositions détaillent : l'intitulé de la mission, la description, les livrables
            attendus, le format, le délai de livraison, le budget proposé, le nombre de révisions incluses et le statut
            de la proposition.
          </p>
          <p>
            Vous pouvez <strong>accepter</strong> ou <strong>refuser</strong> chaque proposition depuis la messagerie.
            En cas d'acceptation, la mission est automatiquement ajoutée à votre pipeline. En cas de refus, la
            conversation reste ouverte pour continuer la négociation ou discuter d'autres conditions.
          </p>
          <p>
            L'onglet Messagerie liste l'ensemble de vos conversations actives avec un aperçu du dernier message et
            un indicateur de messages non lus.
          </p>
        </section>

        {/* Pipeline */}
        <section className="doc-section" id="pipeline">
          <h2>Pipeline</h2>
          <p>
            Le pipeline est un <strong>tableau kanban visuel</strong> qui vous permet de suivre l'avancement de vos
            missions en cours. Chaque colonne représente une étape du workflow (ex. : À démarrer, En cours, En révision,
            Livré).
          </p>
          <p>
            Déplacez vos projets d'une colonne à l'autre au fur et à mesure de leur avancement. Sur mobile, naviguez
            entre les colonnes par glissement horizontal. Sur desktop, la vue d'ensemble de toutes les colonnes est
            disponible en un coup d'œil.
          </p>
          <p>
            Le pipeline vous aide à ne jamais perdre de vue l'état de vos engagements en cours et à gérer votre charge
            de travail sereinement. Il est accessible depuis l'onglet <strong>Pipeline</strong> dans la barre de navigation.
          </p>
        </section>

        {/* Mes projets */}
        <section className="doc-section" id="projets">
          <h2>Mes projets</h2>
          <p>
            La section <strong>Mes projets</strong> centralise tous vos projets actifs. Vous y retrouvez les missions
            en cours, vos candidatures à des offres publiées par des créateurs, et l'accès aux détails de chaque projet.
          </p>
          <p>
            La <strong>page de détail d'un projet</strong> affiche toutes les informations transmises par le créateur :
            titre, description, format, niches ciblées, budget estimé, délai de livraison souhaité et statut. Vous
            pouvez y suivre les échanges liés à ce projet et consulter l'historique des propositions associées.
          </p>
          <p>
            Les <strong>candidatures</strong> correspondent aux projets pour lesquels vous avez postulé suite à une
            offre publiée par un créateur. Leur statut est mis à jour en temps réel (En attente, Acceptée, Refusée).
            En cas d'acceptation, le projet bascule automatiquement dans votre pipeline.
          </p>
        </section>

        {/* CTA */}
        <div className="doc-cta">
          <h2>Prêt à rejoindre le catalogue ?</h2>
          <p>Créez votre profil en quelques minutes et commencez à recevoir des demandes de créateurs.</p>
          <Link to="/onboarding/1" className="doc-cta-btn">Créer mon profil →</Link>
        </div>
      </div>
    </div>
  )
}

# Feature Specification: Projet Créateur — Publication & Mise en Relation Monteurs

**Feature Branch**: `002-short-name-creator`  
**Created**: 2026-04-03  
**Status**: Draft  
**Input**: User description: "En tant que créateur, je veux pouvoir créer un projet avec des paramètres détaillés (dates, livrables, prix, qualité, miniature, etc.) pour permettre une recherche affinée côté monteurs, qui pourront ensuite soumettre leur candidature."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Création de projet par le créateur (Priority: P1)

En tant que créateur connecté, je veux créer un projet en renseignant un formulaire détaillé avec tous les paramètres nécessaires (titre, description, type de contenu, livrables, budget, dates, qualité attendue, etc.), puis le publier pour qu'il soit visible par les monteurs.

**Why this priority**: Sans projet publié, aucune autre fonctionnalité (recherche, candidature, gestion) n'a de raison d'exister. C'est le point d'entrée de tout le flux.

**Independent Test**: Peut être testé en créant un projet complet via le formulaire et en vérifiant que toutes les données sont correctement enregistrées et que le projet apparaît avec le statut "publié".

**Acceptance Scenarios**:

1. **Given** un créateur connecté, **When** il accède à la page de création de projet, **Then** il voit un formulaire structuré avec tous les champs disponibles (titre, description, format, niche, livrables, budget, dates, qualité, miniature, logiciels, langues, niveau d'expérience, type de mission, nombre de révisions).
2. **Given** un créateur remplit les champs obligatoires (titre, description, au moins un livrable, budget, deadline), **When** il valide le formulaire, **Then** le projet est enregistré avec le statut "brouillon".
3. **Given** un projet en brouillon, **When** le créateur clique sur "Publier", **Then** le projet passe au statut "publié" et devient visible dans la liste des projets côté monteurs.
4. **Given** un créateur remplit le formulaire, **When** il omet un champ obligatoire, **Then** un message d'erreur clair indique quel champ est manquant sans perdre les données déjà saisies.
5. **Given** un créateur en cours de saisie, **When** il quitte la page sans publier, **Then** les données sont sauvegardées en brouillon et récupérables ultérieurement.

---

### User Story 2 - Recherche et consultation de projets par les monteurs (Priority: P2)

En tant que monteur connecté, je veux parcourir la liste des projets publiés par les créateurs, les filtrer selon mes compétences et préférences (format, niche, budget, deadline, logiciels, etc.), et consulter le détail d'un projet avant de candidater.

**Why this priority**: Les monteurs doivent pouvoir trouver les projets qui correspondent à leur profil. C'est le deuxième maillon essentiel de la chaîne : sans consultation, pas de candidature.

**Independent Test**: Peut être testé en affichant une liste de projets publiés, en appliquant différents filtres et en vérifiant que les résultats correspondent aux critères sélectionnés.

**Acceptance Scenarios**:

1. **Given** un monteur connecté, **When** il accède à la page de projets disponibles, **Then** il voit la liste des projets publiés triés par date de publication (plus récents en premier).
2. **Given** une liste de projets affichée, **When** le monteur applique un filtre (ex : format = "YouTube long format", budget > 500 EUR), **Then** seuls les projets correspondants sont affichés.
3. **Given** une liste de projets, **When** le monteur sélectionne un projet, **Then** il accède à une page de détail affichant tous les paramètres du projet et un bouton "Candidater".
4. **Given** des filtres actifs, **When** le monteur retire un filtre, **Then** la liste se met à jour immédiatement pour inclure les projets précédemment masqués.
5. **Given** aucun projet ne correspond aux filtres, **When** la liste est vide, **Then** un message explicite invite le monteur à élargir ses critères de recherche.

---

### User Story 3 - Candidature d'un monteur à un projet (Priority: P3)

En tant que monteur, je veux candidater à un projet qui m'intéresse, ce qui envoie une demande de mise en relation au créateur. Le créateur peut accepter ou refuser cette demande, exactement comme le processus existant de contact créateur → monteur via le catalogue.

**Why this priority**: La candidature est le pont entre la découverte du projet et la collaboration. Elle utilise le même mécanisme de mise en relation que le flux créateur → monteur déjà en place, mais initié par le monteur.

**Independent Test**: Peut être testé en envoyant une demande de mise en relation depuis un projet publié et en vérifiant que le créateur reçoit la demande et peut l'accepter ou la refuser.

**Acceptance Scenarios**:

1. **Given** un monteur consulte le détail d'un projet, **When** il clique sur "Candidater", **Then** une demande de mise en relation est envoyée au créateur du projet et le monteur voit une confirmation que sa demande a été envoyée.
2. **Given** un monteur a déjà candidaté à un projet, **When** il revient sur la page du projet, **Then** il voit le statut de sa demande ("en attente", "acceptée", "refusée") au lieu du bouton "Candidater".
3. **Given** un monteur a une demande en attente, **When** il souhaite la retirer, **Then** il peut annuler sa demande et le créateur en est informé.
4. **Given** un projet dont la deadline de candidature est passée ou qui est marqué comme "pourvu", **When** un monteur consulte ce projet, **Then** le bouton "Candidater" est désactivé avec une indication claire de la raison.

---

### User Story 4 - Gestion des demandes de mise en relation par le créateur (Priority: P4)

En tant que créateur, je veux consulter les demandes de mise en relation reçues pour chacun de mes projets et accepter ou refuser chaque demande.

**Why this priority**: Le créateur doit pouvoir évaluer et accepter les monteurs intéressés. Cette fonctionnalité boucle le cycle de mise en relation.

**Independent Test**: Peut être testé en consultant les demandes reçues pour un projet, en acceptant ou refusant une demande, et en vérifiant que la conversation s'ouvre ou que le monteur est notifié du refus.

**Acceptance Scenarios**:

1. **Given** un créateur connecté avec un projet publié ayant reçu des demandes de mise en relation, **When** il consulte son projet, **Then** il voit le nombre de demandes et peut accéder à la liste.
2. **Given** la liste des demandes d'un projet, **When** le créateur sélectionne une demande, **Then** il voit un aperçu du profil du monteur (compétences, niveau, note, expérience) et peut accéder à la conversation correspondante.
3. **Given** une demande affichée, **When** le créateur clique sur "Accepter", **Then** la demande passe au statut "acceptée", le monteur est notifié, et une conversation est ouverte entre les deux parties.
4. **Given** une demande affichée, **When** le créateur clique sur "Refuser", **Then** la demande passe au statut "refusée" et le monteur est notifié.
5. **Given** un créateur accepte une demande, **When** il le confirme, **Then** le projet passe au statut "pourvu" et les autres monteurs ayant candidaté sont notifiés que le projet n'est plus disponible.

---

### User Story 5 - Gestion du cycle de vie du projet par le créateur (Priority: P5)

En tant que créateur, je veux pouvoir gérer mes projets : modifier un projet en brouillon, fermer les candidatures, marquer un projet comme terminé ou l'annuler.

**Why this priority**: La gestion du cycle de vie assure que les projets restent à jour et que les monteurs ne candidatent pas à des projets obsolètes.

**Independent Test**: Peut être testé en faisant passer un projet à travers les différents statuts (brouillon, publié, pourvu, terminé, annulé) et en vérifiant que les transitions sont correctes.

**Acceptance Scenarios**:

1. **Given** un projet en brouillon, **When** le créateur l'édite, **Then** il peut modifier tous les champs et sauvegarder les changements.
2. **Given** un projet publié sans demande acceptée, **When** le créateur choisit de l'annuler, **Then** le projet passe au statut "annulé", disparaît de la liste publique, et les monteurs ayant candidaté sont notifiés.
3. **Given** un projet "pourvu" (demande acceptée), **When** la mission est terminée, **Then** le créateur peut marquer le projet comme "terminé".
4. **Given** un projet publié, **When** le créateur veut modifier un paramètre, **Then** il peut modifier les champs non structurels (description, deadline) mais les candidats existants sont notifiés du changement.

---

### User Story 6 - Suivi des candidatures du monteur par projet (Priority: P6)

En tant que monteur, je veux voir l'ensemble de mes candidatures en cours et passées, organisées par projet, avec leur statut, pour suivre mes démarches.

**Why this priority**: Le suivi des candidatures est essentiel pour l'expérience monteur et évite les candidatures en double ou les oublis. L'organisation par projet (et non par créateur) est importante car un créateur peut avoir plusieurs projets en parallèle.

**Independent Test**: Peut être testé en vérifiant qu'un monteur voit ses candidatures classées par projet avec le statut de chaque demande.

**Acceptance Scenarios**:

1. **Given** un monteur avec plusieurs candidatures, **When** il accède à son tableau de bord, **Then** il voit la liste de ses candidatures organisées par projet et regroupées par statut (en attente, acceptée, refusée, retirée).
2. **Given** une candidature acceptée, **When** le monteur clique dessus, **Then** il est redirigé vers la conversation avec le créateur.
3. **Given** le statut d'une candidature change, **When** le monteur consulte son tableau de bord, **Then** le nouveau statut est reflété immédiatement.

---

### Edge Cases

- Que se passe-t-il si un créateur supprime son compte alors qu'un projet est publié avec des demandes en attente ? Les monteurs concernés doivent être notifiés et les demandes annulées.
- Que se passe-t-il si un monteur candidat supprime son compte ? Sa demande est retirée et le créateur en est informé.
- Que se passe-t-il si un créateur tente de publier un projet avec une deadline passée ? Le système refuse la publication avec un message d'erreur.
- Que se passe-t-il si deux créateurs publient des projets identiques ? Chaque projet est traité indépendamment, aucune détection de doublon n'est nécessaire.
- Que se passe-t-il si un monteur tente de candidater alors que son profil n'est pas encore publié ? Le système l'invite à compléter et publier son profil avant de candidater.
- Que se passe-t-il si le créateur accepte une demande puis souhaite revenir en arrière ? L'acceptation est définitive ; le créateur doit gérer la situation via la messagerie.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT permettre aux créateurs de créer un projet avec les champs obligatoires suivants : titre, description, au moins un type de livrable, budget (montant fixe ou fourchette), et date limite de livraison.
- **FR-002**: Le système DOIT proposer les champs optionnels suivants lors de la création de projet : date de début souhaitée, niche/thématique, format de contenu, résolution/qualité attendue, inclusion de miniature (oui/non), nombre de vidéos attendues, durée estimée par vidéo, nombre de révisions incluses, logiciels préférés, langues requises, niveau d'expérience souhaité, type de mission (ponctuelle/récurrente/long-terme), informations sur les rushes fournis.
- **FR-003**: Le système DOIT permettre aux créateurs de sauvegarder un projet en brouillon et de le modifier avant publication.
- **FR-004**: Le système DOIT permettre aux créateurs de publier un projet qui devient alors visible par tous les monteurs.
- **FR-005**: Le système DOIT afficher la liste des projets publiés aux monteurs connectés, triés par date de publication décroissante.
- **FR-006**: Le système DOIT permettre aux monteurs de filtrer les projets par : format de contenu, niche/thématique, fourchette de budget, deadline, logiciels requis, type de mission, et inclusion de miniature.
- **FR-007**: Le système DOIT permettre aux monteurs de consulter le détail complet d'un projet publié.
- **FR-008**: Le système DOIT permettre aux monteurs d'envoyer une demande de mise en relation (candidature) au créateur d'un projet, sans formulaire supplémentaire — un simple clic sur "Candidater" suffit.
- **FR-009**: Le système DOIT empêcher un monteur de candidater deux fois au même projet.
- **FR-010**: Le système DOIT permettre aux monteurs de retirer une demande en attente.
- **FR-011**: Le système DOIT permettre aux créateurs de consulter les demandes reçues avec un aperçu du profil de chaque monteur candidat.
- **FR-012**: Le système DOIT permettre aux créateurs d'accepter ou de refuser une demande de mise en relation.
- **FR-013**: Lorsqu'une demande est acceptée, le système DOIT automatiquement ouvrir une conversation entre le créateur et le monteur.
- **FR-014**: Lorsqu'une demande est acceptée, le système DOIT passer le projet au statut "pourvu" et notifier les autres candidats en attente.
- **FR-015**: Le système DOIT notifier le monteur lors de tout changement de statut de sa demande (acceptée, refusée, projet annulé).
- **FR-016**: Le système DOIT permettre aux monteurs de voir l'historique de leurs candidatures organisé par projet et regroupé par statut.
- **FR-017**: Le système DOIT gérer le cycle de vie du projet avec les statuts : brouillon, publié, pourvu, terminé, annulé.
- **FR-018**: Le système DOIT empêcher les candidatures sur un projet qui n'est pas au statut "publié".
- **FR-019**: Le système DOIT empêcher la publication d'un projet dont la date limite est déjà passée.
- **FR-020**: Le système DOIT permettre au créateur de modifier un projet publié (champs non structurels) et notifier les candidats existants des changements.

### Key Entities

- **Projet**: Annonce de mission créée par un créateur. Attributs clés : titre, description, format de contenu, niche, liste de livrables (types et quantités), budget (fixe ou fourchette min/max), date de début, date limite, qualité attendue, miniature incluse, nombre de révisions, logiciels préférés, langues requises, niveau d'expérience souhaité, type de mission, informations sur les rushes, statut (brouillon/publié/pourvu/terminé/annulé). Appartient à un créateur.
- **Demande de mise en relation (Candidature)**: Demande envoyée par un monteur au créateur d'un projet pour initier une conversation. Statut (en attente/acceptée/refusée/retirée), date de soumission. Relie un monteur à un projet. Pas d'attributs supplémentaires — c'est le même mécanisme que la demande de contact créateur → monteur via le catalogue, mais initiée en sens inverse.
- **Notification**: Information envoyée à un utilisateur suite à un événement (nouvelle demande, changement de statut, modification de projet). Attributs clés : destinataire, type d'événement, référence au projet/demande, lu/non lu, date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un créateur peut créer et publier un projet complet en moins de 5 minutes.
- **SC-002**: Un monteur peut trouver un projet correspondant à ses critères en moins de 30 secondes grâce aux filtres.
- **SC-003**: 90% des monteurs réussissent à envoyer une candidature dès leur première tentative (un seul clic).
- **SC-004**: Le délai entre l'acceptation d'une demande et l'ouverture de la conversation est inférieur à 2 secondes (ressenti instantané).
- **SC-005**: 100% des changements de statut de demande génèrent une notification au monteur concerné.
- **SC-006**: Les créateurs consultent en moyenne 80% des demandes reçues avant de prendre une décision.
- **SC-007**: Le taux de projets publiés ayant reçu au moins une candidature atteint 70% dans le premier mois d'utilisation.

## Assumptions

- Les utilisateurs sont déjà authentifiés et ont un rôle assigné (créateur ou monteur) via le système d'auth existant.
- Le système de messagerie existant sera réutilisé pour les conversations post-acceptation.
- La plateforme ne gère pas les paiements : le budget affiché est indicatif et les transactions se font hors plateforme.
- Un projet ne peut être attribué qu'à un seul monteur (pas de projets multi-monteurs en v1).
- Les notifications sont in-app uniquement (pas d'email/push en v1).
- Le profil du monteur doit être au statut "publié" pour pouvoir candidater.
- Les formats de contenu, niches, logiciels et langues disponibles sont les mêmes que ceux déjà définis dans le système d'onboarding des monteurs, garantissant la cohérence des filtres.
- La candidature (monteur → créateur via projet) utilise le même mécanisme de mise en relation que le contact existant (créateur → monteur via catalogue). Deux chemins d'initiation pour une même fonctionnalité : 1) Créateur : Catalogue > Demande de Contact > Message. 2) Monteur : Projets > Candidater > Acceptation par le créateur > Conversation.

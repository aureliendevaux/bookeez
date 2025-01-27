# Challenge

## Prérequis

- Fork ce repository et le rendre public pour que je puisse y accéder
- Se baser sur la branche `develop`

## 1. Tests fonctionnels

Une nouvelle feature a été implémentée par votre collègue. Vous devez maintenant écrire les tests fonctionnels pour cette feature.
Le controller en question est situé dans le fichier `apps/api/app/controllers/publishers_controller.ts`.

La feature a été implémentée dans la méthode en respectant le contrat suivant :
- Tous les utilisateurs connectés peuvent voir la liste des maisons d'édition
- Seuls les utilisateurs ayant le rôle `ROLE_ADMIN` peuvent créer une maison d'édition et y associer un utilisateur 
	existant qui obtiendra alors le rôle `ROLE_PUBLISHER`
- Seuls les utilisateurs ayant le rôle `ROLE_ADMIN` et les utilisateurs ayant le rôle `ROLE_PUBLISHER` et étant 
	associés à cette maison d'édition peuvent modifier une maison d'édition
- Seuls les utilisateurs ayant le rôle `ROLE_ADMIN` et les utilisateurs ayant le rôle `ROLE_PUBLISHER` et étant 
	associés à cette maison d'édition peuvent supprimer une maison d'édition

Vous êtes encouragé à grandement vous inspirer des autres tests fonctionnels déjà écrits dans le projet.
Votre fichier de tests doit être situé dans  `apps/api/tests/functional/publishers.spec.ts`.

Implémentez le nombre de tests que vous jugerez nécessaire pour valider la feature.

Vous pouvez lancer les tests fonctionnels avec la commande suivante :
```bash
just ace test # Pour lancer toutes les suites de tests
just ace test --files functional/publishers.spec.ts # Pour lancer uniquement les tests de ce fichier
```

## 2. Développement de feature

Une nouvelle feature a été demandée par le client. Vous devez maintenant implémenter cette feature.

Vous devrez notamment créer/modifier plusieurs fichiers pour implémenter cette feature :
- `apps/api/app/controllers/book_types_controller.ts`
- `apps/api/app/repositories/book_type_repository.ts`
- `apps/api/app/validators/book_type.ts`
- `apps/api/types/db.ts`
- `apps/api/start/routes.ts`

Vous devrez également générer une nouvelle migration pour cette table avec la commande suivante :
```bash
just ace make:migration book_types
```

La feature demandée est la suivante :
- Tous les utilisateurs connectés peuvent voir la liste des types de livres
- Seuls les utilisateurs ayant le rôle `ROLE_ADMIN` peuvent créer un type de livre
- Seuls les utilisateurs ayant le rôle `ROLE_ADMIN` peuvent modifier un type de livre
- Seuls les utilisateurs ayant le rôle `ROLE_ADMIN` peuvent supprimer un type de livre

Le type de livre doit contenir les champs suivants :
- `id` (unique)
- `uid` (unique)
- `name` (unique)
- `createdAt`
- `updatedAt`
- `createdById`
- `updatedById`

Vous êtes encouragé à grandement vous inspirer des autres features déjà implémentées dans le projet, principalement 
celle concernant les genres de livres.

Les tests sont déjà écrits pour cette feature et vous pouvez les lancer avec la commande suivante :
```bash
just ace test --files functional/book_types.spec.ts
```
Gardez en tête que ces tests ne passeront pas tant que vous n'aurez pas implémenté la feature demandée, et que 
certains imports devront être modifiés pour pointer vers les bons fichiers une fois que vous les aurez créés.

## 3. Docker

Votre équipe vous fait confiance pour la création d'un nouveau projet en interne, conteneurisé avec Docker, en mode  
API sous AdonisJS 6.

Vous devez donc créer un fichier `compose.yml` et le ou les `Dockerfile` correspondant(s) pour ce projet.

Voici les contraintes à respecter :
- Node.js sous la dernière version LTS
  - Utilisation de `yarn` pour la gestion des dépendances
  - Installation globale de `npm-check-updates` pour la mise à jour interactive des dépendances
- PostgreSQL sous la dernière version stable
  - Configuration en français

Le `compose.yml` devra contenir les services suivants :
- `node` avec le port `3333` exposé via les labels caddy
- `db` avec le port `85432` exposé et bind sur le port `5432` du container
- `db_test`
- `mailer` qui utilise l'image `axllent/mailpit` et expose le port 8025 via les labels caddy

Le nom de domaine local utilisé pour le projet sera `awesome-project.aaa`.

Pour faciliter le quotidien de vos collègues, vous préparerez également un `justfile` pour lancer les commandes 
courantes.

Vous m'enverrez les `compose.yml`, `justfile` et `Dockerfile` sur votre channel privé sur le discord entraidev.

## Deadline

Lundi 27 janvier à 08h00

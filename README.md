# BOOKEEZ

## Fonctionnalités

### Gestion des livres
- [ ] En tant qu'utilisateur, je veux chercher un livre par son titre, son auteur ou son ISBN
- [ ] En tant que maison d'édition, je veux modifier les informations d'un livre de ma maison d'édition
- [ ] En tant que maison d'édition, je veux supprimer un livre de ma maison d'édition
- [ ] En tant que maison d'édition, je veux ajouter un livre

### Gestion des listes de lecture
- [ ] En tant qu'utilisateur connecté, je veux créer une liste de lecture
- [ ] En tant qu'utilisateur connecté, je veux modifier le nom d'une liste de lecture
- [ ] En tant qu'utilisateur connecté, je veux ajouter un livre à une liste de lecture
- [ ] En tant qu'utilisateur connecté, je veux supprimer un livre d'une liste de lecture
- [ ] En tant qu'utilisateur connecté, je veux supprimer une liste de lecture
- [ ] En tant qu'utilisateur connecté, je veux partager une liste de lecture

### Gestion des commentaires
- [ ] En tant qu'utilisateur connecté, je veux ajouter un commentaire à un livre
- [ ] En tant qu'utilisateur connecté, je veux modifier un commentaire que j'ai publié
- [ ] En tant qu'utilisateur connecté, je veux supprimer un commentaire que j'ai publié

### Gestion des maisons d'édition
- [ ] En tant que GOD, je veux créer une maison d'édition et associer un utilisateur PUBLISHER
- [ ] En tant qu'éditeur, je veux modifier ma maison d'édition
- [ ] En tant qu'éditeur, je veux supprimer ma maison d'édition
- [ ] En tant qu'éditeur, je veux associer un livre à ma maison d'édition
- [ ] En tant qu'éditeur, je veux associer un utilisateur à ma maison d'édition

### Gestion des genres
- [ ] Créer un genre
- [ ] Modifier un genre
- [ ] Supprimer un genre
- [ ] Associer un livre à un genre

### Gestion des types
- [ ] Créer un type
- [ ] Modifier un type
- [ ] Supprimer un type
- [ ] Associer un livre à un type

### Gestion des auteurs
- [ ] Créer un auteur
- [ ] Modifier un auteur
- [ ] Supprimer un auteur
- [ ] Associer un livre à un auteur

### Gestion des bibliothèques
- [ ] Créer une bibliothèque
- [ ] Modifier une bibliothèque
- [ ] Gérer les administrateurs d'une bibliothèque
- [ ] Ajouter un livre au stock
- [ ] Enlever un livre du stock
- [ ] Emprunter un livre
- [ ] Retourner un livre

### Gestion des utilisateurs
- [X] En tant qu'utilisateur non-connecté, je veux créer un compte
- [X] Se connecter
- [X] Se déconnecter
- [X] Savoir si l'on est connecté
- [ ] Modifier son compte
- [ ] Supprimer son compte
- [ ] Mot de passe oublié
- [ ] S'abonner à un genre

### Gestion des rôles
- [ ] ROLE_USER
- [ ] ROLE_GOD
- [ ] ROLE_LIBRARIAN
- [ ] ROLE_PUBLISHER

## Technologies utilisées

### Third-party

- OpenLibrary API
- Sentry

### Infra

- Docker
- Redis
- GitHub Actions

### Backend

- AdonisJS avec Kysely
- Vine pour la validation
- Japa pour les tests
- Transmit pour gérer les Server Sent Events (SSE)
- PostgreSQL

### Frontend

- React.js w/ TS
- UnoCSS
- TanStack Query
- TanStack Router
- TanStack Form
- TanStack Table
- TSRest
- Vitest & @testing-library/react pour les tests

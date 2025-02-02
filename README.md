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
- [X] En tant qu'utilisateur connecté, je veux lister les maisons d'édition
- [X] En tant qu'admin, je veux créer une maison d'édition et associer un utilisateur 
- [X] En tant qu'éditeur, je veux modifier ma maison d'édition
- [X] En tant qu'éditeur, je veux supprimer ma maison d'édition
- [ ] En tant qu'éditeur, je veux associer un livre à ma maison d'édition
- [ ] En tant qu'éditeur, je veux associer un utilisateur à ma maison d'édition

### Gestion des genres
- [X] Créer un genre
- [X] Modifier un genre
- [X] Supprimer un genre
- [ ] Associer un livre à un genre

### Gestion des types
- [X] Créer un type
- [X] Modifier un type
- [X] Supprimer un type
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
- [X] Supprimer son compte
- [X] Mot de passe oublié
- [ ] S'abonner à un genre

### Gestion des rôles
- [ ] ROLE_USER
- [ ] ROLE_ADMIN
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
- TailwindCSS v4
- TanStack Query
- TanStack Router
- TanStack Form
- TanStack Table
- TSRest
- Vitest & @testing-library/react pour les tests

- Composants
  - Stylisés
    - MUI
    - Mantine
    - NextUI
    - AntDesign
    - Carbon
    - Chakra
    - DaisyUI
    - shadcn/ui
    - bootstrap
  - Headless
    - react-aria-components
    - ArkUi
    - ariakit
    - headless UI
    - radix

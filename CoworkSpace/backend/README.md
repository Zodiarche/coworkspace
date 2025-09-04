# Coworkspace Backend

Backend Node.js/TypeScript pour la gestion de membres d’un espace de coworking : authentification JWT, profils membres, filtrage/pagination et opérations d’administration. Architecture en couches (Domain / Application / Infrastructure / Presentation) avec MongoDB comme base de données.

## Sommaire

* [Stack & Architecture](#stack--architecture)
* [Fonctionnalités](#fonctionnalités)
* [Arborescence](#arborescence)
* [Prérequis](#prérequis)
* [Configuration (.env)](#configuration-env)
* [Installation & Lancement](#installation--lancement)
* [Exécution avec Docker](#exécution-avec-docker)
* [Scripts NPM](#scripts-npm)
* [API (aperçu)](#api-aperçu)
* [Qualité & Tests](#qualité--tests)
* [Décisions de conception](#décisions-de-conception)

---

## Stack & Architecture

* **Runtime** : Node.js 20 (Alpine en prod)
* **Langage** : TypeScript (ES2020, `noImplicitAny`)
* **Framework web** : Express
* **Validation** : Zod
* **Auth** : JSON Web Tokens (JWT) stocké en cookie `httpOnly` (`token`)
* **Hash** : bcryptjs
* **Base de données** : MongoDB
* **Tests** : Jest + ts-jest
* **Conteneurisation** : Docker (multi-stage), `Dockerfile.dev` pour le développement

**Architecture hexagonale / Domain Driven Design légère** (`src/`) :

* `domain/` : entités, interfaces (ports), services métier, value-objects
* `application/` : cas d’usage (Login, CreateMember…), DTOs + mappers
* `infrastructure/` : implémentations des ports (MongoDB, JWT, bcrypt), config BD
* `presentation/` : contrôleurs HTTP, middlewares, routes Express
* `server.ts` : composition des dépendances et démarrage HTTP

## Fonctionnalités

* Authentification par email/mot de passe avec JWT
* Gestion des membres : création, liste paginée/filtrée, mise à jour, suppression
* Rôles : attribution du rôle *manager* par un admin
* Profil utilisateur : mise à jour du profil courant
* Sécurité : cookies `httpOnly`, CORS configurable, bcrypt
* Endpoint santé `GET /health`

## Arborescence

```
backend/
├─ Dockerfile
├─ Dockerfile.dev
├─ jest.config.js
├─ package.json
├─ tsconfig.json
└─ src/
   ├─ application/ (DTOs, mappers, use-cases)
   ├─ domain/ (entities, interfaces, services, value-objects)
   ├─ infrastructure/ (auth, db, repositories)
   ├─ presentation/ (controllers, middlewares, routes)
   └─ server.ts
```

## Prérequis

* **Node.js ≥ 20**
* **MongoDB** (local ou hébergé)

## Exécution avec Docker

Production :

```bash
docker-compose -f up --build
```

Développement :

```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Scripts NPM

* `npm run dev` : dev avec ts-node-dev
* `npm run build` : compile TypeScript
* `npm start` : démarre la version buildée
* `npm test` : tests avec Jest
* `npm run lint` : placeholder

## API (aperçu)

### Santé

* `GET /health`

### Auth

* `POST /auth/login` → cookie `token` httpOnly + infos utilisateur
* `GET /auth/me` → infos utilisateur courant

### Membres

* `GET /members` → liste filtrée/paginée
* `GET /members/random` → membre aléatoire ≠ utilisateur
* `PUT /me` → mise à jour du profil courant

### Administration (rôle admin/manager requis)

* `POST /admin/members` → créer un membre
* `PUT /admin/members/:id` → mettre à jour un membre
* `DELETE /admin/members/:id` → supprimer un membre
* `POST /admin/members/:id/assign-manager` → attribuer rôle manager

## Qualité & Tests

* Tests unitaires avec Jest (`npm test`)
* TypeScript strict (`strictNullChecks`, etc.)

## Décisions de conception

* Interfaces (ports) pour découpler stockage et logique
* JWT en cookie httpOnly pour sécuriser côté client
* Validation déclarative via Zod
* Docker multi-stage pour image légère

---

### Roadmap

* Documentation OpenAPI (Swagger)
* Tests d’intégration avec Mongo éphémère
* ESLint + Prettier
* `.env.example` versionné
* docker-compose (API + Mongo)

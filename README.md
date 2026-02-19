# Projet NAIL - API Backend

Ce dépôt contient le code source de la partie backend pour notre projet du cours **NAIL**. 

## 1. Description de l'Architecture

Le projet consiste en une API RESTful développée à l'aide du framework **NestJS**. Nous avons utilisé l'ORM **Prisma** pour géree les interactions avec la base de données sont gérées par l'ORM **Prisma**. Afin de garantir l'isolation de l'environnement d'exécution et de faciliter le déploiement, l'application est entièrement conteneurisée à l'aide de **Docker**. Nous avons opté pour une base de données Mysql elle aussi conteneurisée.

### Technologies principales
* **Langage** : TypeScript
* **Framework** : NestJS
* **ORM** : Prisma
* **Base de données**: Mysql
* **Déploiement** : Docker, Docker Compose
* **Qualité du code** : ESLint, Prettier

## 2. Structure du Code Source

L'arborescence du projet respecte les standards du framework NestJS :

* `src/` : Code source principal (contrôleurs, services, modules d'injection de dépendances).
* `prisma/` : Définition des schémas de la base de données (`schema.prisma`) et historique des migrations.
* `test/` : Fichiers liés aux tests unitaires et/ou d'intégration (fichiers `.spec.ts` et e2e).
* `Dockerfile` / `docker-compose.yml` : Configuration des conteneurs pour l'application et les services annexes (base de données).
* `docker-entrypoint.sh` : Script d'amorçage gérant l'initialisation du conteneur au démarrage.

## 3. Prérequis Système

Pour compiler et exécuter ce projet en local, il est nécessaire de disposer des outils suivants :
* [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
* Gestionnaire de paquets npm
* [Docker](https://www.docker.com/) et le plugin Docker Compose

## 4. Procédures d'Installation et d'Exécution

### 4.1. Exécution via Docker

Cette méthode est privilégiée car elle instancie automatiquement la base de données et le serveur applicatif avec les bonnes configurations.

1. Cloner le dépôt :
```bash
git clone https://github.com/reda-benmakdad/projetdevops_back.git
cd projetdevops_back
cp .env.example .env
```
2. Renseigner le fichier .env avec les valeurs correctes demandées.

3. Construire et démarrer les conteneurs :
```bash
docker compose up --build
```

### 4.2. Exécution locale (Environnement de Développement)

Pour un environnement de développement avec hot-reload :

il faut avoir une base de données mysql lancée et :

1. Installer les dépendances du projet :
```bash
npm install
```

2. Paramétrer les variables d'environnement :
```bash
cp .env.example .env

# Et renseigner le fichier .env avec les valeurs correctes demandées.
```

3. Générer le client Prisma et synchroniser la base de données :
```bash
npx prisma generate
npx prisma migrate dev
```

4. Lancer le serveur en mode développement :
```bash
npm run start:dev
```
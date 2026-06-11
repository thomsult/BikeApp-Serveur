# 🚴 BikeApp - Serveur

Backend officiel de **BikeApp**, une application dédiée aux cyclistes permettant la gestion des utilisateurs, des parcours et des notifications mobiles.

## 🌐 Accès aux applications

### Production

- Application Web : https://app.bikeapp.dpdns.org/
- API Serveur : https://bikeapp.dpdns.org/

## ✨ Fonctionnalités

- API REST Laravel 12
- Authentification des utilisateurs
- Gestion des profils
- Intégration Firebase
- Notifications Push via Firebase Cloud Messaging (FCM)
- Gestion des files d'attente Laravel
- Gestion des cookies et consentement utilisateur
- Architecture prête pour le déploiement Docker

## 🛠️ Stack technique

### Backend

- PHP 8.2+
- Laravel 12
- Firebase Admin SDK
- Firebase Cloud Messaging (FCM)

### Outils de développement

- Docker & Docker Compose
- Composer
- Laravel Sail
- PHPUnit
- Laravel Pint

## 📋 Prérequis

Pour le développement local :

- Docker
- Docker Compose
- Git

Aucune installation locale de PHP ou MySQL n'est nécessaire si vous utilisez Docker.

## 🚀 Installation

### Cloner le projet

```bash
git clone https://github.com/thomsult/BikeApp-Serveur.git

cd BikeApp-Serveur
```

### Configuration

Créer le fichier d'environnement :

```bash
cp .env.example .env
```

Configurer ensuite les variables nécessaires :

```env
APP_NAME=BikeApp

DB_CONNECTION=mysql

FIREBASE_CREDENTIALS=/var/www/html/storage/firebase/firebase.json
```

### Lancer l'environnement Docker

```bash
docker compose up -d --build
```

### Installer les dépendances

```bash
docker compose exec app composer install
```

### Générer la clé Laravel

```bash
docker compose exec app php artisan key:generate
```

### Exécuter les migrations

```bash
docker compose exec app php artisan migrate
```

## 💻 Développement

Pour démarrer l'ensemble des services Laravel :

```bash
composer run dev
```

Cette commande démarre :

- Le serveur Laravel
- Les workers de queue
- Le suivi des logs
- Vite pour les assets

## 🔥 Firebase

BikeApp utilise Firebase pour :

- L'authentification avancée
- Les notifications Push
- Les services cloud associés

Ajouter le fichier de credentials Firebase et configurer la variable :

```env
FIREBASE_CREDENTIALS=/path/to/firebase-credentials.json
```

⚠️ Ne jamais versionner les fichiers de credentials.

## 🧪 Tests

Exécuter les tests :

```bash
composer run test
```

Ou :

```bash
php artisan test
```

## 🎨 Qualité du code

Formatage automatique :

```bash
./vendor/bin/pint
```

## 📂 Structure du projet

```text
app/
├── Http/
├── Models/
├── Notifications/
├── Providers/
├── Services/

database/
├── factories/
├── migrations/
└── seeders/

routes/
├── api.php
└── web.php
```

## 🔒 Sécurité

Les fichiers suivants ne doivent jamais être publiés :

```text
.env
firebase.json
firebase-credentials.json
```

## 👥 Équipe

Projet développé dans le cadre de BikeApp.

### Développeur principal

- Thomas Sultan

## 📄 Licence

Ce projet est distribué à des fins éducatives et de développement pour l'écosystème BikeApp.

# 🚴 BikeApp - Application PWA

Frontend officiel de **BikeApp**, une Progressive Web App (PWA) dédiée aux cyclistes.

L'application permet aux utilisateurs de consulter leurs informations, suivre leurs activités et interagir avec les services proposés par BikeApp via une interface moderne, rapide et responsive.

## 🌐 Accès à l'application

### Production

- Application : https://app.bikeapp.dpdns.org/
- API : https://bikeapp.dpdns.org/

## ✨ Fonctionnalités

- Authentification utilisateur
- Connexion avec Google (OAuth2)
- Interface responsive mobile et desktop
- Cartographie interactive avec Mapbox
- Gestion des données en temps réel
- Installation comme application mobile (PWA)
- Gestion optimisée du cache et du mode hors ligne
- Navigation typée et sécurisée

## 🛠️ Stack technique

### Frontend

- React
- TypeScript
- Vite
- Vite PWA

### UI & Design

- Tailwind CSS
- ShadCN UI
- Lucide Icons

### État & Données

- Zustand
- TanStack Query
- TanStack Form
- TanStack Router

### Validation

- Zod

### Services externes

- Mapbox
- Google OAuth2

## ⚙️ Configuration

Créer un fichier `.env` à la racine du projet :

```env
VITE_API_URL=https://bikeapp.dpdns.org
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

⚠️ Ne jamais versionner les clés d'API ou les secrets dans le dépôt Git.

## 💻 Développement

Lancer le serveur de développement :

Assurez-vous d'etre a la racine du projet (BikeApp-Serveur).

```bash
docker compose -f docker-compose.dev.yml up --build
```

L'application sera accessible sur :

```text
http://localhost:5173
```

## 📦 Build de production

Générer le build :

```bash
npm run build
```

Prévisualiser le build :

```bash
npm run preview
```

## 📱 Progressive Web App

BikeApp est une Progressive Web App (PWA).

Fonctionnalités disponibles :

- Installation sur Android
- Installation sur iOS
- Fonctionnement proche d'une application native
- Mise en cache des ressources
- Optimisation des performances

## 🗺️ Cartographie

L'application utilise Mapbox pour :

- l'affichage des cartes
- la visualisation des parcours
- l'interaction géographique

Une clé API Mapbox valide est nécessaire pour le fonctionnement complet de l'application.

## 🔐 Authentification

Les utilisateurs peuvent se connecter grâce à :

- Authentification classique
- Google OAuth2

Les informations d'authentification sont sécurisées et validées côté serveur.

## 📂 Structure du projet

```text
src/
├── components/
├── pages/
├── routes/
├── hooks/
├── stores/
├── services/
├── lib/
├── types/
└── assets/
```

## 🎨 Qualité du code

Type checking :

```bash
npm run type-check
```

Lint :

```bash
npm run lint
```

## 👨‍💻 Auteur

Développé par **Thomas Sultan**

GitHub : https://github.com/thomsult

## 📄 Licence

Ce projet est distribué sous licence MIT.

# NutriTrack

Application mobile React Native (Expo) pour suivre ses repas et son apport nutritionnel quotidien.

## Fonctionnalités

- Authentification utilisateur avec Clerk (inscription, connexion, vérification email)
- Ajout de repas par type (petit-déjeuner, déjeuner, dîner, snack)
- Recherche d'aliments par texte via Open Food Facts
- Scan de code-barres avec la caméra (`expo-camera`)
- Suivi des calories journalières avec objectif personnalisable
- Détail nutritionnel d'un repas (calories, protéines, glucides, lipides)
- Suppression de repas
- Persistance locale avec `AsyncStorage`

## Stack technique

- Expo SDK 54
- React Native 0.81
- React 19
- Expo Router
- Clerk Expo
- AsyncStorage
- TypeScript

## Prérequis

- Node.js (LTS recommandé)
- npm
- Expo Go (Android/iOS) ou émulateur/simulateur
- Un compte Clerk + une clé publishable

## Installation

```bash
npm install
```

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Lancer le projet

```bash
npm run start
```

Puis :

- `a` pour Android
- `i` pour iOS
- `w` pour Web

Ou via scripts dédiés :

```bash
npm run android
npm run ios
npm run web
```

## Structure du projet

```text
app/
  (auth)/            # écrans d'authentification
  (main)/            # zone privée (tabs)
    (home)/          # liste + détail des repas
    (add)/           # ajout repas + scanner
    profile.tsx      # profil + déconnexion
components/          # composants UI
context/             # état global (repas en cours)
data/                # accès données (food, meals, settings)
services/            # utilitaires (stockage)
assets/              # icônes et splash
```

## Données et persistance

- Les repas et l'objectif calorique sont stockés localement via `AsyncStorage`.
- Les aliments sont récupérés depuis l'API Open Food Facts.

## Scripts disponibles

- `npm run start` : démarre Expo
- `npm run android` : ouvre sur Android
- `npm run ios` : ouvre sur iOS
- `npm run web` : ouvre la version Web

## Notes

- Le projet utilise `expo-router/entry` comme point d'entrée.
- La clé Clerk est requise au démarrage (sinon l'app lève une erreur).

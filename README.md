# HeritageGourmet

## À propos du projet

HeritageGourmet est une application web moderne dédiée à la préservation et au partage des recettes familiales. Elle permet aux familles de numériser, organiser et transmettre leur patrimoine culinaire tout en facilitant la planification des repas au quotidien.

## Fonctionnalités principales

- **Bibliothèque de recettes** : Stockage et organisation de recettes familiales
- **Gestion familiale** : Création de profils familiaux et partage de recettes
- **Planification des repas** : Calendrier interactif pour la planification hebdomadaire
- **Interface responsive** : Expérience utilisateur optimisée sur tous les appareils

## Technologies utilisées

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Base de données et authentification)

## Installation et démarrage

### Prérequis

- Node.js & npm - [Installation avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Étapes d'installation

```sh
# 1. Cloner le dépôt
git clone <URL_DU_DEPOT>

# 2. Accéder au répertoire du projet
cd HeritageGourmet

# 3. Installer les dépendances
npm install

# 4. Démarrer le serveur de développement
npm run dev
```

## Structure du projet

```
src/
  ├── components/     # Composants React réutilisables
  ├── contexts/       # Contextes React (auth, etc.)
  ├── hooks/          # Hooks personnalisés
  ├── pages/          # Pages de l'application
  ├── integrations/   # Intégrations externes (Supabase)
  └── lib/            # Utilitaires et configurations
```

## Contribution

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/NouvelleFeature`)
3. Committez vos changements (`git commit -m 'Ajout de NouvelleFeature'`)
4. Push vers la branche (`git push origin feature/NouvelleFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

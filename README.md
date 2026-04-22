# Application Meteo

Application web realisee avec React et Vite pour consulter la meteo actuelle d'une ville et les previsions des 5 prochains jours.

## Objectif du brief

Le but du projet est de creer une interface simple, responsive et dynamique permettant a l'utilisateur de rechercher une ville et d'afficher des informations meteo en temps reel.

## Fonctionnalites

- Recherche meteo par nom de ville.
- Affichage automatique de la meteo de Casablanca au chargement.
- Affichage des conditions actuelles :
  - temperature ;
  - temperature ressentie ;
  - humidite ;
  - vitesse du vent ;
  - description de la meteo.
- Previsions meteo sur 5 jours.
- Gestion des erreurs :
  - ville introuvable ;
  - service meteo indisponible ;
  - champ de recherche vide.
- Interface responsive adaptee aux ecrans desktop, tablette et mobile.

## Technologies utilisees

- React
- Vite
- JavaScript
- CSS
- API Open-Meteo

## API utilisees

Le projet utilise les services gratuits de Open-Meteo :

- Geocoding API : recherche des coordonnees d'une ville.
- Forecast API : recuperation de la meteo actuelle et des previsions.

Aucune cle API n'est necessaire.

## Installation

1. Cloner le projet ou ouvrir le dossier du projet.

2. Installer les dependances :

```bash
npm install
```

3. Lancer le serveur de developpement :

```bash
npm run dev
```

4. Ouvrir l'adresse affichee dans le terminal, par exemple :

```bash
http://localhost:5173
```

## Scripts disponibles

```bash
npm run dev
```

Lance l'application en mode developpement.

```bash
npm run build
```

Genere la version de production.

```bash
npm run preview
```

Permet de previsualiser la version de production.

```bash
npm run lint
```

Verifie le code avec ESLint.

## Structure du projet

```text
meteo/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Utilisation

1. Saisir le nom d'une ville dans le champ de recherche.
2. Cliquer sur le bouton `Rechercher`.
3. Consulter la meteo actuelle et les previsions affichees.

Exemples de recherche :

- Casablanca
- Paris
- Tokyo
- Marrakech

## Auteur

Projet realise dans le cadre d'un brief de developpement web.

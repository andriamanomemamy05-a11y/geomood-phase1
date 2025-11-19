# Installer dépendances de test
    # dépendances runtime
    npm install express dotenv node-fetch@2

    # dev deps (tests)
    npm install -D jest

    Ajoutez les scripts dans package.json (ou modifiez) :

    "scripts": {
        "start": "node src/index.js",
        "test": "jest --runInBand"
    }

1) But de la phase 1

Produire une version fonctionnelle minimale :

endpoint pour soumettre un mood (texte, note 1-5, optional image URL, coords ou adresse)

récupération automatique (ou simulée) de la localisation (reverse geocode) et de la météo (OpenWeatherMap)

stockage local dans data/moods.json

calcul simple de MoodScore (règles + lexique minimal)

tests unitaires pour la logique métier

CI qui lance les tests

2) Stack choisie

Node.js 18+

Express

node-fetch (ou native fetch)

Jest pour tests

dotenv pour variables d'environnement

(optionnel) sqlite via better-sqlite3 si vous préférez DB légère

3) Arborescence proposée
geomood-phase1/
├─ .github/
│ └─ workflows/ci.yml
├─ src/
│ ├─ index.js # serveur Express
│ ├─ controllers/
│ │ └─ moodController.js
│ ├─ services/
│ │ ├─ weatherService.js
│ │ ├─ geocodeService.js
│ │ └─ moodAnalyzer.js
│ ├─ storage/
│ │ └─ jsonStore.js
│ └─ utils/
│ └─ moodScore.js
├─ tests/
│ └─ moodScore.test.js
├─ data/
│ └─ moods.json
├─ .env.example
├─ package.json
└─ README.md

4) Variables d'environnement (.env.example)
PORT=3000
OPENWEATHER_API_KEY=your_openweather_key
GOOGLE_GEOCODE_API_KEY=your_google_key
USE_MOCKS=true # true pour éviter appels externes durant la démo

5.Premier commit - remot à un dépôt distant 
# ajouter tous les fichiers
git add .

# commit initial
git commit -m "chore: init project skeleton Phase1 - Node/Express + tests + CI"

# pousser sur GitHub (optionnel)
# 1) créez le repo distant sur GitHub (ex: geomood-phase1)
# 2) liez et poussez :
git remote add origin git@github.com:VOTRE_USER/geomood-phase1.git
git branch -M main
git push -u origin main

6) Lancer le serveur & tester localement
npm start

npm test
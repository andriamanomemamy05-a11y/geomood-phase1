#Initailisation du projet GeoMood-map

## Arboresence proposée pour la phase 1
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

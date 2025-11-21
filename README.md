#Initailisation du projet GeoMood-map

## Arboresence proposée pour la phase 1
geomood-phase1/
├─ .github/
│ └─ workflows/ci.yml
├─ src/
│ ├─ index.js # serveur Express et les routes (POST - GET)
│ ├─ controllers/ → contient moodController.js qui va gérer les routes Express.
│ │ └─ moodController.js
│ ├─ services/  → contient tous les services pour API et calculs. ✅
│ │ ├─ weatherService.js
│ │ ├─ geocodeService.js
│ │ └─ moodAnalyzer.js
│ ├─ storage/ → pour sauvegarder localement les moods (JSON)
│ │ └─ jsonStore.js
│ └─ utils/ → fonctions utilitaires, comme le calcul du MoodScore. ✅
│ └─ moodScore.js
├─ tests/
│ └─ moodScore.test.js
├─ data/
│ └─ moods.json
├─ .env.example
├─ package.json
└─ README.md

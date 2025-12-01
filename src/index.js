require('dotenv').config();
const express = require('express');
const { addMood, getMoods } = require('./controllers/moodController');
const geocodeService = require('./services/geocodeService');
const fs = require('fs');
const path = require('path');


const app = express();
// Autoriser les payloads plus gros (ici jusqu'à 10MB)
app.use(express.json({ limit: '10mb' }));


// Logger simple
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// Servir les fichiers statiques du dossier /public
app.use(express.static(path.join(process.cwd(), 'public')));

// Endpoint de recherche d'adresse pour l'autocomplete
app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  try {
    const result = await geocodeService.forwardGeocode(q);
    // Retourne un tableau pour que le front fonctionne avec Leaflet
    res.json([result]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// API Moods
app.post('/api/moods', addMood);
app.get('/api/moods', getMoods);


// Endpoint pour recevoir et enregistrer la photo
app.post('/api/selfie', express.json({ limit: '5mb' }), (req, res) => {
  try {
    const { image } = req.body; // dataURL base64
    if (!image) return res.status(400).json({ error: 'No image provided' });

    // Crée le dossier selfies si nécessaire
    const selfiesDir = path.join(process.cwd(), 'data', 'selfies');
    if (!fs.existsSync(selfiesDir)) fs.mkdirSync(selfiesDir, { recursive: true });

    // Extraire la partie base64
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const fileName = `selfie_${Date.now()}.png`;
    const filePath = path.join(selfiesDir, fileName);

    fs.writeFileSync(filePath, base64Data, 'base64');
    res.json({ success: true, path: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save image' });
  }
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(500).json({ error: 'Internal Server Error' });
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

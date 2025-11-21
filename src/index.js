// src/index.js
require('dotenv').config();
const express = require('express');
const { addMood, getMoods } = require('./controllers/moodController');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

app.get('/', (req, res) => res.send('API up'));
app.post('/api/moods', addMood);
app.get('/api/moods', getMoods);

app.use((req, res) => res.status(404).json({ error: 'Not Found', path: req.originalUrl }));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// require('dotenv').config(); // Pour les clés API si nécessaire
// const weatherService = require('./services/weatherService');
// const geocodeService = require('./services/geocodeService');

// async function main() {
//   const lat = 48.8566;
//   const lon = 2.3522;

//   console.log('--- Test GeocodeService ---');
//   const place = await geocodeService.reverseGeocode(lat, lon);
//   console.log(place);

//   console.log('--- Test WeatherService ---');
//   const weather = await weatherService.getWeather(lat, lon);
//   console.log(weather);
// }

// main();

const fs = require('fs');
const path = require('path');
const weatherService = require('../services/weatherService');
const geocodeService = require('../services/geocodeService');

// chemin vers data/moods.json (plus robuste : process.cwd() = racine du projet)
const moodsFile = path.join(process.cwd(), 'data', 'moods.json');

/**
 * computeMoodScore
 * Calcule un score simple à partir de la note et des infos météo.
 */
function computeMoodScore(rating, weatherData) {
  if (rating === undefined || rating === null) rating = 0;
  let weatherScore = 0;
  const weatherDesc = (weatherData && (weatherData.weather || weatherData.description || '')).toString().toLowerCase();
  if (weatherDesc.includes('rain')) weatherScore = -1;
  else if (weatherDesc.includes('sun') || weatherDesc.includes('clear')) weatherScore = 1;
  return rating + weatherScore;
}

/**
 * addMood
 * Accepts a POST body with:
 *  - text (string), rating (number)
 *  - either lat+lon (numbers) OR address (string)
 */
async function addMood(req, res) {
  try {
    const { text, rating, lat, lon, address } = req.body;

    // Validation simple et claire :
    if (!text) return res.status(400).json({ error: 'text is required' });
    if (rating === undefined || rating === null) return res.status(400).json({ error: 'rating is required' });

    // Vérifier qu'on a soit lat+lon soit address
    const hasCoords = (lat !== undefined && lon !== undefined && lat !== null && lon !== null);
    const hasAddress = (typeof address === 'string' && address.trim().length > 0);

    if (!hasCoords && !hasAddress) {
      return res.status(400).json({ error: 'Provide either lat+lon or address' });
    }

    // === Géocodage ===
    let place = null;
    let usedLat = lat;
    let usedLon = lon;

    if (hasCoords) {
      // On a des coordonnées → reverse geocode
      place = await geocodeService.reverseGeocode(usedLat, usedLon);
    } else {
      // On a une adresse → forward geocode pour obtenir lat/lon
      const f = await geocodeService.forwardGeocode(address);
      // Nominatim renvoie des lat/lon en string → convertir en number
      usedLat = f.lat ? parseFloat(f.lat) : 0;
      usedLon = f.lon ? parseFloat(f.lon) : 0;
      place = f;
    }

    // === Météo ===
    // Si on a des coords (soit fournies, soit obtenues par forwardGeocode)
    let weather = { source: 'mock', data: {} };
    if (usedLat && usedLon) {
      weather = await weatherService.getWeather(usedLat, usedLon); // { source, data }
    } else {
      // fallback : on laisse weather empty
      weather = { source: 'none', data: {} };
    }
    const weatherData = weather && weather.data ? weather.data : {};

    // === Calcul du MoodScore ===
    const moodScore = computeMoodScore(rating, weatherData);

    // === Construction de l'objet mood ===
    const mood = {
      id: Date.now(),
      text,
      rating,
      lat: usedLat,
      lon: usedLon,
      place,
      weather: weatherData,
      weatherSource: weather && weather.source,
      moodScore,
      createdAt: new Date().toISOString()
    };

    // === Persistance dans data/moods.json ===
    let moods = [];
    if (fs.existsSync(moodsFile)) {
      const raw = fs.readFileSync(moodsFile, 'utf8');
      moods = JSON.parse(raw || '[]');
    } else {
      const dir = path.dirname(moodsFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    moods.push(mood);
    fs.writeFileSync(moodsFile, JSON.stringify(moods, null, 2), 'utf8');

    // === Retour ===
    return res.status(201).json(mood);
  } catch (err) {
    console.error('addMood error:', err && (err.stack || err));
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

/**
 * getMoods : retourne tous les moods sauvegardés
 */
function getMoods(req, res) {
  try {
    let moods = [];
    if (fs.existsSync(moodsFile)) {
      const raw = fs.readFileSync(moodsFile, 'utf8');
      moods = JSON.parse(raw || '[]');
    }
    res.json(moods);
  } catch (err) {
    console.error('getMoods error:', err && (err.stack || err));
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

module.exports = { addMood, getMoods };

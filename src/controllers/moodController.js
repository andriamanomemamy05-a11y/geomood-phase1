const weatherService = require('../services/weatherService');
const geocodeService = require('../services/geocodeService');
const moodAnalyzer = require('../services/moodAnalyzer');
const store = require('../storage/jsonStore');


async function createMood(req, res) {
try {
const { text, rating, imageUrl, lat, lon, address } = req.body;
if (!rating && rating !== 0) return res.status(400).json({ error: 'rating required' });


// 1. localisation
let place = null;
if (lat && lon) {
place = await geocodeService.reverseGeocode(lat, lon);
} else if (address) {
place = await geocodeService.forwardGeocode(address);
} else {
place = { name: 'unknown', type: 'unknown', lat: null, lon: null };
}


// 2. météo
let weather = { source: 'mock', data: {} };
if (place.lat && place.lon) {
weather = await weatherService.getWeather(place.lat, place.lon);
}


// 3. analyse
const analysis = await moodAnalyzer.analyze({ text, rating, imageUrl, weather: weather.data });


// 4. stockage
const entry = {
id: Date.now().toString(),
timestamp: new Date().toISOString(),
text,
rating,
imageUrl,
place,
weather: weather.data,
analysis,
};


store.save(entry);
res.status(201).json(entry);
} catch (err) {
console.error(err);
res.status(500).json({ error: 'internal error' });
}
}


function listMoods(req, res) {
const all = store.loadAll();
res.json(all);
}


module.exports = { createMood, listMoods };
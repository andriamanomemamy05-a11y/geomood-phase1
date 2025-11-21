const fetch = require('node-fetch');
const USE_MOCKS = process.env.USE_MOCKS === 'true';

/**
 * reverseGeocode(lat, lon)
 * Utilise Nominatim (OpenStreetMap) pour récupérer le lieu réel.
 */
async function reverseGeocode(lat, lon) {
  if (USE_MOCKS) {
    console.log('[GeocodeService] Mock mode activated');
    return { name: 'Parc Mock', type: 'park', lat, lon };
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

  const response = await fetch(url, {
    headers: {
      // Obligatoire avec Nominatim
      'User-Agent': 'MoodApp/1.0 (andriamanomemamy05@gmail.com)'
    }
  });

  if (!response.ok) throw new Error('Nominatim Reverse API error reserve');

  const json = await response.json();

  return {
    name: json.display_name || 'unknown',
    type: json.type || 'unknown',
    lat,
    lon
  };
}

/**
 * forwardGeocode(address)
 * Utilise Nominatim pour transformer une adresse en coordonnées
 */
async function forwardGeocode(address) {
  if (USE_MOCKS) {
    console.log('[GeocodeService] Mock mode activated');
    return { name: address, type: 'unknown', lat: 48.8566, lon: 2.3522 };
  }
  
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'MoodApp/1.0 (andriamanomemamy05@gmail.com)'
    }
  });

  if (!response.ok) throw new Error('Nominatim Forward API error forward');

  const json = await response.json();
  const first = json[0] || {};

  return {
    name: first.display_name || address,
    type: first.type || 'unknown',
    lat: first.lat || 0,
    lon: first.lon || 0
  };
}

module.exports = { reverseGeocode, forwardGeocode };


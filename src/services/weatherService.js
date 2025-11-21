const fetch = require('node-fetch');
const USE_MOCKS = process.env.USE_MOCKS === 'true';

// On récupère la clé API depuis .env
const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY || '';

/**
 * getWeather(lat, lon)
 * Récupère les informations météo pour une latitude et longitude données.
 * Si USE_MOCKS=true, retourne des données simulées pour test.
 * Sinon, appelle l'API OpenWeatherMap.
 */
async function getWeather(lat, lon) {
  if (!isFinite(lat) || !isFinite(lon)) throw new Error('Invalid coordinates for getWeather');

  if (USE_MOCKS) {
    return {
      source: 'mock',
      data: { temp: 15, weather: 'light rain', humidity: 80, wind_speed: 3.5 }
    };
  }

  if (!OPENWEATHER_KEY) {
    throw new Error('OPENWEATHER_API_KEY not set');
  }


  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenWeather error ${res.status}: ${txt}`);
  }
  const json = await res.json();

  // On extrait les données utiles
  const data = {
    temp: json?.main?.temp ?? null,
    weather: json?.weather && json.weather[0] ? json.weather[0].description : '',
    humidity: json?.main?.humidity ?? null,
    wind_speed: json?.wind?.speed ?? null
  };

  return { source: 'openweather', data };
}

module.exports = { getWeather };

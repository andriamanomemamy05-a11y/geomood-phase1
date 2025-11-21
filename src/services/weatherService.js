// On importe 'node-fetch' pour faire des requêtes HTTP vers l'API OpenWeatherMap
const fetch = require('node-fetch');

// On récupère la variable d'environnement USE_MOCKS pour savoir si on utilise des données simulées
const USE_MOCKS = process.env.USE_MOCKS === 'true';

/**
 * getWeather(lat, lon)
 * Récupère les informations météo pour une latitude et longitude données.
 * Si USE_MOCKS=true, retourne des données simulées pour test.
 * Sinon, appelle l'API OpenWeatherMap.
 */
async function getWeather(lat, lon) {
  // Vérifie si on est en mode mock
  if (USE_MOCKS) {
    console.log('[WeatherService] Mock mode activated'); // info console pour debug
    // Retourne un objet simulé avec température, humidité, vent et description météo
    return {
      source: 'mock',
      data: { temp: 15, weather: 'Light Rain', humidity: 82, wind_speed: 3.5 }
    };
  }

  // On récupère la clé API depuis .env
  const key = process.env.OPENWEATHER_API_KEY;

  // Prépare l'URL pour l'API OpenWeatherMap
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

  // On effectue la requête HTTP vers l'API
  const response = await fetch(url);

  // Si l'API retourne une erreur (ex. clé invalide), on lève une exception
  if (!response.ok) throw new Error('Weather API error');

  // On parse la réponse JSON
  const json = await response.json();

  // On extrait uniquement les informations utiles
  const data = {
    temp: json.main.temp,
    weather: json.weather[0].description,
    humidity: json.main.humidity,
    wind_speed: json.wind.speed
  };

  console.log('[WeatherService] Real API data fetched'); // debug console
  return { source: 'openweather', data };
}

// Export du service pour l'utiliser dans d'autres fichiers
module.exports = { getWeather };

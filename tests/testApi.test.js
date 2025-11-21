process.env.USE_MOCKS = 'true'; // Toujours utiliser les mocks pour les tests unitaires
const weatherService = require('../src/services/weatherService');
const geocodeService = require('../src/services/geocodeService');

describe('Services API externes (avec mocks)', () => {

  test('geocodeService.reverseGeocode retourne un lieu simulé', async () => {
    const result = await geocodeService.reverseGeocode(48.8566, 2.3522);
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('lat', 48.8566);
    expect(result).toHaveProperty('lon', 2.3522);
  });

  test('weatherService.getWeather retourne des données météo simulées', async () => {
    const result = await weatherService.getWeather(48.8566, 2.3522);
    expect(result).toHaveProperty('source', 'mock');
    expect(result.data).toHaveProperty('temp');
    expect(result.data).toHaveProperty('weather');
    expect(result.data).toHaveProperty('humidity');
    expect(result.data).toHaveProperty('wind_speed');
  });

});

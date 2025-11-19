const moodScore = require('../src/utils/moodScore');


test('compute neutral rating with no text/weather', () => {
const s = moodScore.compute({ rating: 3, textScore: 0, weather: null });
expect(s).toBeGreaterThanOrEqual(20);
expect(s).toBeLessThanOrEqual(80);
});


test('high rating and sunny weather increases score', () => {
const s = moodScore.compute({ rating: 5, textScore: 2, weather: { weather: 'clear sky', temp: 28 } });
expect(s).toBeGreaterThan(80);
});


test('low rating and rain reduces score', () => {
const s = moodScore.compute({ rating: 1, textScore: -2, weather: { weather: 'light rain', temp: 8 } });
expect(s).toBeLessThan(40);
});
const { computeMoodScore } = require('../src/services/moodService');

describe('MoodScore computation', () => {
  test('Note + météo ensoleillée augmente le score', () => {
    const rating = 4;
    const weather = { weather: 'clear sky' };
    const score = computeMoodScore(rating, weather);
    expect(score).toBe(5);
  });

  test('Note + pluie diminue le score', () => {
    const rating = 3;
    const weather = { weather: 'light rain' };
    const score = computeMoodScore(rating, weather);
    expect(score).toBe(2);
  });

  test('Note + météo neutre ne change pas le score', () => {
    const rating = 5;
    const weather = { weather: 'cloudy' };
    const score = computeMoodScore(rating, weather);
    expect(score).toBe(5);
  });
});

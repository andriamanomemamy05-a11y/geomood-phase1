// compute a normalized MoodScore between 0 and 100
function compute({ rating, textScore, weather }) {
// rating: 1-5 -> base 0..100
const base = ((rating - 1) / 4) * 60 + 20; // keep in [20,80]


// textScore: add or remove up to 20 points
const textDelta = Math.max(-3, Math.min(3, textScore)) / 3 * 20; // clamp


// weather influence: simple rules
let weatherDelta = 0;
if (weather) {
const w = (weather.weather || '').toLowerCase();
if (w.includes('rain') || w.includes('pluie')) weatherDelta -= 10;
if (w.includes('clear') || w.includes('sun')) weatherDelta += 5;
if (weather.temp >= 25) weatherDelta += 5;
if (weather.temp <= 0) weatherDelta -= 10;
}


const raw = base + textDelta + weatherDelta;
const clamped = Math.max(0, Math.min(100, Math.round(raw)));
return clamped;
}


module.exports = { compute };
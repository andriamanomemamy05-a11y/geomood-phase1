const moodScore = require('../utils/moodScore');


// Minimal analyzer: combines rating, simple lexicon on text, and weather influence
async function analyze({ text, rating, imageUrl, weather }) {
const textScore = analyzeText(text);
const imageScore = 0; // in phase1, image analysis not implemented
const score = moodScore.compute({ rating, textScore, weather });
return { textScore, imageScore, score };
}


function analyzeText(text) {
if (!text) return 0;
// tiny lexicon
const positives = ['bien', 'heureux', 'content', 'joyeux', 'serein', 'love', 'happy'];
const negatives = ['mal', 'triste', 'hate', 'déçu', 'colère', 'anxieux', 'stress'];
const words = text.toLowerCase().split(/\W+/);
let s = 0;
for (const w of words) {
if (positives.includes(w)) s += 1;
if (negatives.includes(w)) s -= 1;
}
return s; // can be negative/positive
}


module.exports = { analyze };
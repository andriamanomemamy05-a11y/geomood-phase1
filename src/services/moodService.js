function computeMoodScore(rating, weather) {
  let weatherScore = 0;
  if (weather.weather.toLowerCase().includes('rain')) weatherScore = -1;
  else if (weather.weather.toLowerCase().includes('sun') || weather.weather.toLowerCase().includes('clear')) weatherScore = 1;
  return rating + weatherScore;
}

module.exports = { computeMoodScore };

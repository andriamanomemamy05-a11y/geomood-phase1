const fetch = require('node-fetch');


const USE_MOCKS = process.env.USE_MOCKS === 'true';


async function getWeather(lat, lon) {
if (USE_MOCKS) {
return { source: 'mock', data: {
temp: 15,
weather: 'Light Rain',
humidity: 82,
wind_speed: 3.5
}};
}


const key = process.env.OPENWEATHER_API_KEY;
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
const r = await fetch(url);
if (!r.ok) throw new Error('weather api error');
const json = await r.json();
const data = {
temp: json.main.temp,
weather: json.weather[0].description,
humidity: json.main.humidity,
wind_speed: json.wind.speed,
};
return { source: 'openweather', data };
}


module.exports = { getWeather };
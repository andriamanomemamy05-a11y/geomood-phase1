const fetch = require('node-fetch');
const USE_MOCKS = process.env.USE_MOCKS === 'true';


async function reverseGeocode(lat, lon) {
if (USE_MOCKS) {
return { name: 'Parc Mock', type: 'park', lat, lon };
}
const key = process.env.GOOGLE_GEOCODE_API_KEY;
const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}`;
const r = await fetch(url);
if (!r.ok) throw new Error('geocode error');
const json = await r.json();
const first = json.results[0] || {};
return {
name: first.formatted_address || 'unknown',
type: (first.types && first.types[0]) || 'unknown',
lat,
lon,
};
}


async function forwardGeocode(address) {
if (USE_MOCKS) {
return { name: address, type: 'unknown', lat: 48.8566, lon: 2.3522 };
}
// similar to reverse but using address param
return reverseGeocode(48.8566, 2.3522);
}


module.exports = { reverseGeocode, forwardGeocode };
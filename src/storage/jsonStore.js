const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../../data/moods.json');


function ensure() {
const dir = path.dirname(FILE);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, '[]');
}


function loadAll() {
ensure();
const raw = fs.readFileSync(FILE, 'utf8');
return JSON.parse(raw || '[]');
}


function save(entry) {
const arr = loadAll();
arr.push(entry);
fs.writeFileSync(FILE, JSON.stringify(arr, null, 2));
}


module.exports = { loadAll, save };
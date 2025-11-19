require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const moodController = require('./controllers/moodController');


const app = express();
app.use(bodyParser.json({ limit: '5mb' }));


app.post('/api/moods', moodController.createMood);
app.get('/api/moods', moodController.listMoods);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`GeoMood API listening on ${port}`));


module.exports = app;
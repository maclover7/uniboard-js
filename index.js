const express = require('express');
const Promise = require('bluebird');
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

const providers = [
  require('./lib/lirr'),
  require ('./lib/njt')
].map((provider) => {
  return new provider;
});

const sortTrains = require('./lib/sort');

const getAllTrains = () => {
  return Promise.all(providers.map((provider) => {
    return provider.getData();
  }))
  .then(function(values) {
    return new Promise((resolve, reject) => {
      resolve(values[0].concat(values[1]));
    });
  })
  .then(sortTrains);
};

app.get('/', (req, res) => {
  getAllTrains().then((trains) => {
    res.render('index', { trains: trains });
  });
});

app.get('/api', (req, res) => {
  getAllTrains().then((trains) => {
    res.json({ trains: trains });
  });
});

app.get('/ping', (req, res) => {
  res.status(200).end();
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});

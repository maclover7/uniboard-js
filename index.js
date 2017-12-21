var express = require('express');
var Promise = require('bluebird');
var app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

var getLIRR = require('./lib/lirr');
var getNJTAMTK = require ('./lib/njt');
var sortTrains = require('./lib/sort');

function getAllTrains() {
  return Promise.all([getLIRR(), getNJTAMTK()])
  .then(function(values) {
    return new Promise(function(resolve, reject) {
      resolve(values[0].concat(values[1]));
    });
  })
  .then(sortTrains);
};

app.get('/', function(req, res) {
  getAllTrains().then(function(trains) {
    res.render('index', { trains: trains });
  });
});

app.get('/api', function(req, res) {
  getAllTrains().then(function(trains) {
    res.json({ trains: trains });
  });
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})

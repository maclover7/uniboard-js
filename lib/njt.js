var Promise = require('bluebird');
var request = require('request-promise');
var moment = require('moment');

function getTrains() {
  return new Promise(function(resolve, reject) {
    request({
      uri: 'http://199.184.144.61/NJTAppWS2/services/getDV?station=NY',
      headers: { 'Host': 'app.njtransit.com' }
    })
    .then(function(responseBody) {
      var json = JSON.parse(
        responseBody.substring(9, (responseBody.length - 1))
      );

      resolve(json.STATION.ITEMS.ITEM);
    });
  });
}

function parseTime(time) {
  return moment(time, 'DD-MMM-YYYY HH:mm:ss A');
}

function includeEWR(str) {
  return str.includes('&#9992');
};

function includeSEC(str) {
  return str.includes('SEC');
};

function processTrain(train) {
  return new Promise(function(resolve, reject) {
    // Process carrier
    if (train.TRAIN_ID.includes('A')) {
      train.CARRIER = 'AMTK';
    } else {
      train.CARRIER = 'NJ';
    }

    // Process time
    train.TIME = parseTime(train.SCHED_DEP_DATE);

    // Process destination
    var dest = '';
    var flags = [];

    if (train.DESTINATION.includes('-')) {
      dest = train.DESTINATION.split('-');

      if (dest.some(includeSEC)) {
        flags.push('<b>SEC</b>');
      }
    } else {
      dest = [train.DESTINATION];
    }

    if (dest.some(includeEWR)) {
      flags.push('<b>EWR</b>');
    }

    if (flags.length > 0) {
      flags = ' (' + flags.join(', ') + ')';
    } else {
      flags = '';
    }

    train.DESTINATION = dest[0].replace(' &#9992', '') + flags;

    // Processing complete, time to resolve!
    resolve(train);
  });
}

function processTrains(trains) {
  return Promise.all(
    trains.map(processTrain)
  );
};

function getNJTAMTK() {
  return getTrains()
    .then(processTrains)
}

module.exports = getNJTAMTK;

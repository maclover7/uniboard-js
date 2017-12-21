var Promise = require('bluebird');
var request = require('request-promise');
var moment = require('moment');

function includeEWR(str) {
  return str.includes('&#9992');
};

function includeSEC(str) {
  return str.includes('SEC');
};

var Provider = require('./provider');

class NJTAMTKProvider extends Provider {
  _getTrainCarrier(train) {
    if (train.TRAIN_ID.includes('A')) {
      return 'AMTK';
    } else {
      return 'NJ';
    }
  }

  _getTrainDestination(train) {
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

    return dest[0].replace(' &#9992', '') + this._stringifyFlags(flags);
  }

  _getTrainTime(train) {
    return moment(train.SCHED_DEP_DATE, 'DD-MMM-YYYY HH:mm:ss A');
  };

  _getTrains() {
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
  };
}

module.exports = NJTAMTKProvider;

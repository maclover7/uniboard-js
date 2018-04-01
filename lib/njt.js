const Promise = require('bluebird');
const request = require('request-promise');
const moment = require('moment');

const Provider = require('./provider');

const colors = {
  'AMTK': 'yellow',
  'BERG': 'silver',
  'Gladstone Branch': 'lightgreen',
  'MAIN': 'yellow',
  'MNBTN': 'brown',
  'M&E': 'green',
  'NEC': 'red',
  'NJCL': 'CornflowerBlue',
  'PASC': 'purple'
};

class NJTAMTKProvider extends Provider {
  _getTrainCarrier(train) {
    if (train.TRAIN_ID.includes('A')) {
      return 'AMTK';
    } else {
      return 'NJ';
    }
  }

  _getTrainBackgroundColor(train) {
    return colors[train.LINE] || colors[train.LINEABBREVIATION];
  }

  _getTrainTextColor(train) {
    if (train.LINEABBREVIATION === 'AMTK' || train.LINE === 'Gladstone Branch') {
     return 'black';
    } else {
     return 'white';
    }
  }

  _getTrainDestination(train) {
    var dest = '';

    if (train.DESTINATION.includes('-')) {
      dest = train.DESTINATION.split('-')[0];
    } else {
      dest = train.DESTINATION;
    }

    return dest.replace(' &#9992', '');
  }

  _getTrainFlags(train) {
    var flags = [];

    // EWR Airport
    if (train.DESTINATION.includes('&#9992')) {
      flags.push('<b>EWR</b>');
    }

    // Secaucus
    if (train.DESTINATION.includes('SEC')) {
      flags.push('<b>SEC</b>');
    }

    return flags;
  }

  _getTrainTime(train) {
    return moment(train.SCHED_DEP_DATE, 'DD-MMM-YYYY HH:mm:ss A');
  };

  _getTrains() {
    return new Promise((resolve, reject) => {
      request({
        uri: 'http://199.184.144.61/NJTAppWS2/services/getDV?station=NY',
        headers: { 'Host': 'app.njtransit.com' }
      })
      .then((responseBody) => {
        var json = JSON.parse(
          responseBody.substring(9, (responseBody.length - 1))
        );

        resolve(json.STATION.ITEMS.ITEM);
      });
    });
  };
}

module.exports = NJTAMTKProvider;

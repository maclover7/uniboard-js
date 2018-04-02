class Provider {
  ///////// PUBLIC API
  getData() {
    return this._getTrains()
      .then(this._processTrains.bind(this));
  };

  ///////// IMPLEMENTOR API
  _getTrainBackgroundColor(train) {
    return '';
  };

  _getTrainCarrier(train) {
    return '';
  };

  _getTrainDestination(train) {
    return '';
  };

  _getTrainFlags(train) {
    return [];
  };

  _getTrainStatus(train) {
    return train.STATUS;
  };

  _getTrainTextColor(train) {
    return 'white';
  };

  _getTrainTime(train) {
    return '';
  };

  _getTrains() {
    return [];
  };

  ///////// PRIVATE API
  _processTrain(train) {
    return new Promise((resolve, reject) => {
      train.BG_COLOR = this._getTrainBackgroundColor(train);
      train.TEXT_COLOR = this._getTrainTextColor(train);
      train.CARRIER = this._getTrainCarrier(train);
      train.TIME = this._getTrainTime(train);
      train.STATUS = this._getTrainStatus(train);
      train.DESTINATION = this._getTrainDestination(train) + this._stringifyFlags(this._getTrainFlags(train));

      resolve(train);
    });
  };

  _processTrains(trains) {
    return Promise.all(
      trains.map(this._processTrain.bind(this))
    );
  };

  _stringifyFlags(flags) {
    if (flags.length > 0) {
      flags = ' (' + flags.join(', ') + ')';
    } else {
      flags = '';
    }

    return flags;
  };
};

module.exports = Provider;

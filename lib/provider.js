class Provider {
  getData() {
    return this._getTrains()
      .then(this._processTrains.bind(this))
  }

  // Implementors: override this function!
  _getTrains() {
    return [];
  }

  // Implementors: override this function!
  _processTrain(train) {
    return {};
  }

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
  }
}

module.exports = Provider;

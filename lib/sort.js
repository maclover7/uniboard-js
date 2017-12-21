function comparator(a, b) {
  if (b.TIME.isBefore(a.TIME)) {
    return 1;
  } else {
    return -1;
  }
}

function sortTrains(trains) {
  return trains.sort(comparator);
}

module.exports = sortTrains;

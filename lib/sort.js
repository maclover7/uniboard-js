const comparator = (a, b) => {
  if (b.TIME.isBefore(a.TIME)) {
    return 1;
  } else {
    return -1;
  }
}

const sortTrains = (trains) => {
  return trains.sort(comparator);
}

module.exports = sortTrains;

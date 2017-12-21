var Promise = require('bluebird');
var request = require('request-promise');
var moment = require('moment');

var destinations = {
  NYK: 'Penn Station',
  ABT: 'Albertson',
  AGT: 'Amagansett',
  AVL: 'Amityville',
  ATL: 'Atlantic Terminal',
  ADL: 'Auburndale',
  BTA: 'Babylon',
  BWN: 'Baldwin',
  BSR: 'Bay Shore',
  BSD: 'Bayside',
  BRS: 'Bellerose',
  BMR: 'Bellmore',
  BPT: 'Bellport',
  BRT: 'Belmont',
  BPG: 'Bethpage',
  BWD: 'Brentwood',
  BHN: 'Bridgehampton',
  BDY: 'Broadway',
  CPL: 'Carle Place',
  CHT: 'Cedarhurst',
  CI: 'Central Islip',
  CAV: 'Centre Avenue',
  CSH: 'Cold Spring Harbor',
  CPG: 'Copiague',
  CLP: 'Country Life Press',
  DPK: 'Deer Park',
  DGL: 'Douglaston',
  EHN: 'East Hampton',
  ENY: 'East New York',
  ERY: 'East Rockaway',
  EWN: 'East Williston',
  FRY: 'Far Rockaway',
  FMD: 'Farmingdale',
  FPK: 'Floral Park',
  FLS: 'Flushing Main Street',
  FHL: 'Forest Hills',
  FPT: 'Freeport',
  GCY: 'Garden City',
  GBN: 'Gibson',
  GCV: 'Glen Cove',
  GHD: 'Glen Head',
  GST: 'Glen Street',
  GNK: 'Great Neck',
  GRV: 'Great River',
  GWN: 'Greenlawn',
  GPT: 'Greenport',
  GVL: 'Greenvale',
  HBY: 'Hampton Bays',
  HGN: 'Hempstead Gardens',
  HEM: 'Hempstead',
  HWT: 'Hewlett',
  HVL: 'Hicksville',
  HOL: 'Hollis',
  HPA: 'Hunterspoint Avenue',
  HUN: 'Huntington',
  IWD: 'Inwood',
  IPK: 'Island Park',
  ISP: 'Islip',
  JAM: 'Jamaica',
  KGN: 'Kew Gardens',
  KPK: 'Kings Park',
  LVW: 'Lakeview',
  LTN: 'Laurelton',
  LCE: 'Lawrence',
  LHT: 'Lindenhurst',
  LNK: 'Little Neck',
  LMR: 'Locust Manor',
  LVL: 'Locust Valley',
  LBH: 'Long Beach',
  LIC: 'Long Island City',
  LYN: 'Lynbrook',
  MVN: 'Malverne',
  MHT: 'Manhasset',
  MPK: 'Massapequa Park',
  MQA: 'Massapequa',
  MSY: 'Mastic Shirley',
  MAK: 'Mattituck',
  MFD: 'Medford',
  MAV: 'Merillon Avenue',
  MRK: 'Merrick',
  SSM: 'Mets-Willets Point',
  MIN: 'Mineola',
  MTK: 'Montauk',
  MHL: 'Murray Hill',
  NBD: 'Nassau Boulevard',
  NHP: 'New Hyde Park',
  NPT: 'Northport',
  NAV: 'Nostrand Avenue',
  ODL: 'Oakdale',
  ODE: 'Oceanside',
  OBY: 'Oyster Bay',
  PGE: 'Patchogue',
  PLN: 'Pinelawn',
  PDM: 'Plandome',
  PJN: 'Port Jefferson',
  PWS: 'Port Washington',
  QVG: 'Queens Village',
  RHD: 'Riverhead',
  RVC: 'Rockville Centre',
  RON: 'Ronkonkoma',
  ROS: 'Rosedale',
  RSN: 'Roslyn',
  SVL: 'Sayville',
  SCF: 'Sea Cliff',
  SFD: 'Seaford',
  STN: 'Smithtown',
  SHN: 'Southampton',
  SHD: 'Southold',
  SPK: 'Speonk',
  SAB: 'St. Albans',
  SJM: 'St. James',
  SMR: 'Stewart Manor',
  BK: 'Stony Brook',
  SYT: 'Syosset',
  VSM: 'Valley Stream',
  WGH: 'Wantagh',
  WHD: 'West Hempstead',
  WBY: 'Westbury',
  WHN: 'Westhampton',
  WWD: 'Westwood',
  WMR: 'Woodmere',
  WDD: 'Woodside',
  WYD: 'Wyandanch',
  YPK: 'Yaphank'
};

function getTrains() {
  return new Promise(function(resolve, reject) {
    request({ uri: 'https://traintime.lirr.org/api/Departure?loc=NYK' })
    .then(function(responseBody) {
      var json = JSON.parse(responseBody);
      resolve(json.TRAINS);
    });
  });
}

function parseDestination(destination) {
  return destinations[destination];
}

function parseTime(time) {
  return moment(time, 'MM/DD/YYYY HH:mm:ss');
}

function processTrain(train) {
  return new Promise(function(resolve, reject) {
    // Process carrier
    train.CARRIER = 'LIRR';

    // Process time
    train.TIME = parseTime(train.SCHED);

    // Process status
    train.STATUS = moment().to(parseTime(train.ETA));

    // Process destination
    var flags = []

    if (train.JAM) {
      flags.push('<b>J</b>');
    }

    if (flags.length > 0) {
      flags = ' (' + flags.join(', ') + ')';
    } else {
      flags = '';
    }

    train.DESTINATION = parseDestination(train.DEST) + flags;

    // Processing complete, time to resolve!
    resolve(train);
  });
}

function processTrains(trains) {
  return Promise.all(
    trains.map(processTrain)
  );
};

module.exports = function getLIRR() {
  return getTrains()
    .then(processTrains)
};

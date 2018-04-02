const Promise = require('bluebird');
const request = require('request-promise');
const moment = require('moment');

const colors = {
  // Babylon
  'BTA': '#00985F',
  // City Terminal Zone
  'ATL': '#4D5357',
  'HPA': '#4D5357',
  'JAM': '#4D5357',
  'LIC': '#4D5357',
  'NYK': '#4D5357',
  // Far Rockaway
  'FRY': '#6E3219',
  // Hempstead
  'HEM': '#CE8E00',
  // Long Beach
  'LBH': '#FF6319',
  // Montauk
  'MTK': '#006983',
  'PGE': '#006983',
  'SPK': '#006983',
  // Oyster Bay
  'OBY': '#00AF3F',
  // Port Jefferson
  'HUN': '#0039A6',
  'PJN': '#0039A6',
  // Port Washington
  'PWS': '#C60C30',
  // Ronkonkoma
  'GPT': '#A626AA',
  'RON': '#A626AA',
  // West Hempstead
  'WHD': '#00A1DE',
  'VSM': '#00A1DE'
};

const destinations = {
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

const parseTime = (time) => {
  return moment(time, 'MM/DD/YYYY HH:mm:ss');
};

const Provider = require('./provider');

class LIRRProvider extends Provider {
  _getTrainCarrier(train) {
    return 'LIRR';
  };

  _getTrainBackgroundColor(train) {
    return colors[train.DEST];
  };

  _getTrainDestination(train) {
    return destinations[train.DEST];
  };

  _getTrainFlags(train) {
    var flags = [];

    // Jamaica
    if (train.JAM) {
      flags.push('<b>J</b>');
    }

    return flags;
  };

  _getTrainStatus(train) {
    return moment().to(parseTime(train.ETA));
  };

  _getTrainTime(train) {
    return parseTime(train.SCHED);
  };

  _getTrains() {
    return new Promise((resolve, reject) => {
      request({ uri: 'https://traintime.lirr.org/api/Departure?loc=NYK' })
      .then((responseBody) => {
        var json = JSON.parse(responseBody);
        resolve(json.TRAINS);
      });
    });
  };
};

module.exports = LIRRProvider;

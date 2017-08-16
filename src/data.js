import chroma from 'chroma-js';

const colors = {
  'property': "limegreen",
  'violent': "orange",
  'murder': "red",
  'admin': "purple",
  'other': "gray"
  };
  
const Data = {
  council_districts: [
    { number: 1, name: 'District 1' },
    { number: 2, name: 'District 2' },
    { number: 3, name: 'District 3' },
    { number: 4, name: 'District 4' },
    { number: 5, name: 'District 5' },
    { number: 6, name: 'District 6' },
    { number: 7, name: 'District 7' }
  ],

  precincts: [
    { number: '02', name: '2nd Precinct' },
    { number: '03', name: '3rd Precinct' },
    { number: '04', name: '4th Precinct' },
    { number: '05', name: '5th Precinct' },
    { number: '06', name: '6th Precinct' },
    { number: '07', name: '7th Precinct' },
    { number: '08', name: '8th Precinct' },
    { number: '09', name: '9th Precinct' },
    { number: '10', name: '10th Precinct' },
    { number: '11', name: '11th Precinct' },
    { number: '12', name: '12th Precinct' }
  ],

  months: [
    { number: 1, name: 'January', abbreviation: 'Jan' },
    { number: 2, name: 'February', abbreviation: 'Feb' },
    { number: 3, name: 'March', abbreviation: 'Mar' },
    { number: 4, name: 'April', abbreviation: 'Apr' },
    { number: 5, name: 'May', abbreviation: 'May' },
    { number: 6, name: 'June', abbreviation: 'June' },
    { number: 7, name: 'July', abbreviation: 'July' },
    { number: 8, name: 'August', abbreviation: 'Aug' },
    { number: 9, name: 'September', abbreviation: 'Sept' },
    { number: 10, name: 'October', abbreviation: 'Oct' },
    { number: 11, name: 'November', abbreviation: 'Nov' },
    { number: 12, name: 'December', abbreviation: 'Dec' }
  ],

  seasons: [
    { name: 'Spring', months: [3, 4, 5] },
    { name: 'Summer', months: [6, 7, 8] },
    { name: 'Fall', months: [9, 10, 11] },
    { name: 'Winter', months: [12, 1, 2] }
  ],

  days_of_week: [
    { number: 1, name: 'Sunday', abbreviation: 'Sun' },
    { number: 2, name: 'Monday', abbreviation: 'Mon' },
    { number: 3, name: 'Tuesday', abbreviation: 'Tue' },
    { number: 4, name: 'Wednesday', abbreviation: 'Wed' },
    { number: 5, name: 'Thursday', abbreviation: 'Thu' },
    { number: 6, name: 'Friday', abbreviation: 'Fri' },
    { number: 7, name: 'Saturday', abbreviation: 'Sat' }
  ],

  parts_of_day: [
    { name: 'Morning', hours: [5, 6, 7, 8, 9, 10], abbreviation: '5-10am' },
    { name: 'Afternoon', hours: [11, 12, 13, 14, 15, 16], abbreviation: '11am-4pm' },
    { name: 'Evening', hours: [17, 18, 19, 20, 21, 22], abbreviation: '5-10pm' },
    { name: 'Overnight', hours: [23, 24, 1, 2, 3, 4], abbreviation: '11pm-4am' }
  ],

  state_codes: {
    "1301": "Aggravated Assault: Family - Gun",
    "1302": "Aggravated Assault: Family - Other Weapon",
    "2900": "Damage to Property",
    "2401": "Motor Vehicle Theft: Theft and Sale",
    "2201": "Burglary - Forced Entry: Safe or Vault",
    "2307": "Larceny: From Coin Machines",
    "2303": "Larceny: Theft From Building",
    "2305": "Larceny: Theft From Vehicle",
    "1201": "Robbery: Business - Gun",
    "2603": "Fraud: Mail Fraud",
    "3501": "Controlled Substance: Hallucinogen - Mfg.",
    "2306": "Larceny: From Shipment",
    "7399": "Miscellaneous Arrest",
    "5201": "Concealed Weapon: Altering Identification",
    "2602": "Fraud: Swindle",
    "2601": "Fraud: Confidence Game",
    "3803": "Family Abuse/Neglect: Cruelty Toward Spouse",
    "2202": "Burglary: Forced Entry - Residence",
    "2099": "Arson: Other",
    "3692": "Sexual Penetration Nonforcible: CSC 1st/3rd degree",
    "1303": "Aggravated Assault: Family - Strong Arm",
    "3801": "Family - Nonsupport: Neglect Family/Nonsupport Felony",
    "3072": "Retail Fraud: Misrepresentation 2nd Deg.",
    "5422": "",
    "5421": "",
    "5301": "",
    "7070": "",
    "5203": "",
    "5001": "",
    "2501": "",
    "5701": "",
    "4102": "",
    "2402": "",
    "1171": "",
    "1178": "",
    "2302": "",
    "2301": "",
    "1001": "",
    "0901": "",
    "4801": "",
    "1177": "",
    "2605": "",
    "2801": "",
    "1173": "",
    "2606": "",
    "2203": "",
    "1172": "",
    "3502": "",
    "1175": "",
    "2101": "",
    "1002": "",
    "1174": "",
    "2604": "",
    "7571": "",
    "4001": "",
    "2403": "",
    "5302": "",
    "5501": "",
    "5702": "",
    "1176": "",
    "3071": "",
    "0903": "Murder: Non-Family: Gun",
    "2304": "",
    "3601": "",
    "0902": "Murder: Family: Other Weapon",
    "3802": "",
    "4101": "",
    "3901": "",
    "0904": "Murder: Non-Family: Other Weapon"
  },

  offenses: {
    property: [
      { name: 'ARSON', state_codes: ['2099'], top: 'Property Crimes', color: chroma(colors.property).brighten(2).hex() },
      { name: 'BURGLARY', state_codes: ['2201', '2202'], top: 'Property Crimes', color: chroma(colors.property).brighten(1).hex() },
      { name: 'DAMAGE TO PROPERTY', state_codes: ['2900'], top: 'Property Crimes', color: chroma(colors.property).hex() },
      { name: 'LARCENY', state_codes: ['2305', '2306', '2307', '2303'], top: 'Property Crimes', color: chroma(colors.property).darken(1).hex() },
      { name: 'STOLEN VEHICLE', state_codes: ['2401'], top: 'Property Crimes', color: chroma(colors.property).darken(2).desaturate().hex() }
    ],
    violent: [
      { name: 'ASSAULT', state_codes: ['1301', '1303'], top: 'Violent Crimes', color: chroma(colors.violent).hex() },
      { name: 'AGGRAVATED ASSAULT', state_codes: ['1302'], top: 'Violent Crimes', color: chroma(colors.violent).darken(1).hex() },
      { name: 'SEXUAL ASSAULT', state_codes: ['1171', '1172', '1173', '1174', '1175'], top: 'Violent Crimes', color: chroma(colors.violent).darken(2).hex() },
      { name: 'HOMICIDE', state_codes: ['0901', '0902', '0903'], top: 'Violent Crimes', color: chroma(colors.murder).hex() },
      { name: 'JUSTIFIABLE HOMICIDE', state_codes: ['0904'], top: 'Violent Crimes', color: chroma(colors.murder).desaturate().darken().hex() },
      { name: 'ROBBERY', state_codes: ['1201'], top: 'Violent Crimes', color: chroma(colors.violent).brighten().hex() }
    ],
    other: [
      { name: 'BAIL', state_codes: ['5001'], top: 'Other Crimes', color: chroma(colors.admin).hex() },
      { name: 'DANGEROUS DRUGS', state_codes: ['3501', '3502'], top: 'Other Crimes', color: chroma(colors.admin).brighten().hex() },
      // { name: 'DISORDERLY CONDUCT', state_codes: ['5301', '5302'], top: 'Other Crimes', color: chroma(colors.disorder).hex() },
      { name: 'DRUNK DRIVING', state_codes: ['5421', '5422'], top: 'Other Crimes', color: chroma(colors.admin).brighten(3).saturate().hex() },
      // { name: 'FAMILY ABUSE/NEGLECT', state_codes: ['3801', '3802', '3803'], top: 'Other Crimes', color: chroma(colors.personal).hex() },
      { name: 'FRAUD', state_codes: ['2601', '2602', '2603', '3072'], top: 'Other Crimes', color: chroma(colors.admin).brighten(2).hex() },
      { name: 'LIQUOR VIOLATIONS', state_codes: ['4101', '4102'], top: 'Other Crimes', color: chroma(colors.other).brighten().hex() },
      // { name: 'KIDNAPPING', state_codes: ['1001', '1002'], top: 'Other Crimes', color: chroma(colors.personal).darken().hex() },
      { name: 'MISC ARREST', state_codes: ['7399'], top: 'Other Crimes', color: chroma(colors.other).hex() },
      // { name: 'RUNAWAY', state_codes: ['7070'], top: 'Other Crimes', color: chroma(colors.personal).saturate().hex() },
      { name: 'WEAPONS OFFENSE', state_codes: ['5201', '5203'], top: 'Other Crimes', color: chroma(colors.other).darken().hex() }
    ]
  },

  fields: {
    'properties.council_district': 'Council District',
    'properties.precinct': 'Precinct'
  }
};

export default Data;

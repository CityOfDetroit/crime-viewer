import chroma from 'chroma-js';

const colors = 
// {
//   bail: "#9b874a",
//   admin: "#9d63cb",
//   drugs: "#4ba98c",
//   homicide: "red",
//   car: "#7088c8",
//   larceny: "#7fb235",
//   assault: "#c55d93",
//   robbery: "#c69932",
//   property: "#56a959",
//   arson: "#ce5c2f",
//   other: "#444"
// }
{
  bail: "#E58606",
  admin: "#5D69B1",
  drugs: "#52BCA3",
  car: "#99C945",
  fraud: "#CC61B0",
  property: "#24796C",
  robbery: "#DAA51B",
  assault: "#2F8AC4",
  larceny: "#764E9F",
  homicide: "#ED645A",
  arson: "#CC3A8E",
  other: "#A5AA99"
}
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

  days_of_week: [
    { number: 1, name: 'Sunday', abbreviation: 'Sun' },
    { number: 2, name: 'Monday', abbreviation: 'Mon' },
    { number: 3, name: 'Tuesday', abbreviation: 'Tue' },
    { number: 4, name: 'Wednesday', abbreviation: 'Wed' },
    { number: 5, name: 'Thursday', abbreviation: 'Thu' },
    { number: 6, name: 'Friday', abbreviation: 'Fri' },
    { number: 7, name: 'Saturday', abbreviation: 'Sat' }
  ],

  simple_days: {
    'Sun': 'Sundays',
    'Mon': 'Mondays',
    'Tue': 'Tuesdays',
    'Wed': 'Wednesdays',
    'Thu': 'Thursdays',
    'Fri': 'Fridays',
    'Sat': 'Saturdays'
  },

  parts_of_day: [
    { name: 'Morning', hours: [5, 6, 7, 8, 9, 10], abbreviation: '5-10am' },
    { name: 'Afternoon', hours: [11, 12, 13, 14, 15, 16], abbreviation: '11am-4pm' },
    { name: 'Evening', hours: [17, 18, 19, 20, 21, 22], abbreviation: '5-10pm' },
    { name: 'Overnight', hours: [23, 24, 1, 2, 3, 4], abbreviation: '11pm-4am' }
  ],

  offenses: {
    violent: [
      { name: 'AGGRAVATED ASSAULT', color: chroma(colors.assault).darken().hex() },
      { name: 'ASSAULT', color: chroma(colors.assault).hex() },
      { name: 'HOMICIDE', color: chroma(colors.homicide).darken().hex() },
      { name: 'JUSTIFIABLE HOMICIDE', color: chroma(colors.homicide).hex() },
      { name: 'ROBBERY', color: chroma(colors.robbery).hex() },
      { name: 'SEXUAL ASSAULT', color: chroma(colors.assault).darken(2).hex() }
    ],
    property: [
      { name: 'ARSON', color: chroma(colors.arson).hex() },     
      { name: 'BURGLARY', color: chroma(colors.robbery).darken().hex() },   
      { name: 'DAMAGE TO PROPERTY', color: chroma(colors.arson).brighten().hex() },
      { name: 'LARCENY', color: chroma(colors.larceny).hex() }, 
      { name: 'STOLEN PROPERTY', color: chroma(colors.property).hex() },    
      { name: 'STOLEN VEHICLE', color: chroma(colors.car).hex() }
    ],
    other: [
      { name: 'DANGEROUS DRUGS', color: chroma(colors.drugs).darken().hex() },
      { name: 'DISORDERLY CONDUCT', color: chroma(colors.other).hex() },
      { name: 'EMBEZZLEMENT', color: chroma(colors.other).hex() },
      { name: 'EXTORTION', color: chroma(colors.robbery).darken().hex() },
      { name: 'FAMILY OFFENSE', color: chroma(colors.other).hex() },
      { name: 'FORGERY', color: chroma(colors.other).hex() },
      { name: 'FRAUD', color: chroma(colors.fraud).hex() },
      { name: 'GAMBLING', color: chroma(colors.other).hex() },
      { name: 'KIDNAPPING', color: chroma(colors.larceny).hex() },
      { name: 'LIQUOR', color: chroma(colors.drugs).hex() },
      { name: 'MISCELLANEOUS', color: chroma(colors.other).hex() },
      { name: 'OBSTRUCTING JUDICIARY', color: chroma(colors.other).hex() },
      { name: 'OBSTRUCTING THE POLICE', color: chroma(colors.other).hex() },    
      { name: 'OTHER', color: chroma(colors.other).hex() },
      { name: 'OPERATING UNDER THE INFLUENCE OF LIQUOR OR DRUGS', color: chroma(colors.drugs).hex() },
      { name: 'RUNAWAY', color: chroma(colors.other).hex() },
      { name: 'SEX OFFENSES', color: chroma(colors.assault).hex() },    
      { name: 'SOLICITATION', color: chroma(colors.admin).hex() },
      { name: 'WEAPONS OFFENSES', color: chroma(colors.homicide).hex() }
    ]
  },

  fields: {
    'properties.council_district': 'Council District',
    'properties.precinct': 'Precinct',
    'properties.zip_code': 'Zip Code',
    'properties.neighborhood': 'Neighborhoods',
    'properties.day': 'Date'
  }
};

export default Data;

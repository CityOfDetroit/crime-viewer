import chroma from 'chroma-js';

const colors = {
  bail: "#9b874a",
  admin: "#9d63cb",
  drugs: "#4ba98c",
  homicide: "red",
  car: "#7088c8",
  larceny: "#7fb235",
  assault: "#c55d93",
  robbery: "#c69932",
  property: "#56a959",
  arson: "#ce5c2f",
  other: "#444"
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

  // via MICR Arrest Codes - Revision 01/28/2016
  state_codes: {
    "0901": "Murder: Family - Gun",
    "0902": "Murder: Family - Other Weapon",
    "0903": "Murder: Non-Family - Gun",
    "0904": "Murder: Non-Family - Other Weapon",
    "1001": "Kidnapping/Abduction: Kidnap Minor for Ransom",
    "1002": "Kidnapping/Abduction: Kidnap Adult for Ransom",
    "1171": "Sexual Penetration: Penis/Vagina - CSC 1st Degree",
    "1172": "Sexual Penetration: Penis/Vagina - CSC 3rd Degree",
    "1173": "Sexual Penetration: Oral/Anal - CSC 1st Degree",
    "1174": "Sexual Penetration: Oral/Anal - CSC 3rd Degree",
    "1175": "Sexual Penetration: Object - CSC 1st Degree",
    "1176": "Sexual Penetration: Object - CSC 3rd Degree",
    "1177": "Sexual Contact: Forcible - CSC 2nd Degree",
    "1178": "Sexual Contact: Forcible - CSC 4th Degree",
    "1201": "Robbery: Business - Gun",
    "1301": "Aggravated Assault: Family - Gun",
    "1302": "Aggravated Assault: Family - Other Weapon",
    "1303": "Aggravated Assault: Family - Strong Arm",
    "2099": "Arson: Other",
    "2101": "Extortion: Threat to Injure Person",
    "2201": "Burglary: Forced Entry - Safe or Vault",
    "2202": "Burglary: Forced Entry - Residence",
    "2203": "Burglary: Forced Entry - Non-residence",
    "2301": "Larceny: Pocketpicking",
    "2302": "Larceny: Purse Snatching - No Force",
    "2303": "Larceny: Theft From Building",
    "2304": "Larceny: Parts and Accessories from Vehicle",
    "2305": "Larceny: Personal Property from Vehicle",
    "2306": "Larceny: From Shipment",
    "2307": "Larceny: From Coin Machines",
    "2401": "Motor Vehicle Theft: Theft and Sale",
    "2402": "Motor Vehicle Theft: Theft and Strip",
    "2403": "Motor Vehicle Theft: Theft and Use in Other Crime",
    "2501": "Forgery/Counterfeiting: Forgery of Checks",
    "2601": "Fraud: Confidence Game",
    "2602": "Fraud: Swindle",
    "2603": "Fraud: Mail Fraud",
    "2604": "Fraud: Impersonation",
    "2605": "Fraud: Illegal Use of Credit Card",
    "2606": "Fraud: Insufficient Funds - Bad Checks",
    "2801": "Stolen Property: Sale of Stolen Property",
    "2900": "Damage to Property",
    "3071": "Retail Fraud: Misrepresentation 1st Degree",
    "3072": "Retail Fraud: Misrepresentation 2nd Degree",
    "3501": "Controlled Substance: Hallucinogen - Manufacture",
    "3502": "Controlled Substance: Hallucinogen - Distribute",
    "3601": "Sexual Penetration: Nonforcible - Blood/Affinity",
    "3692": "Sexual Penetration: Nonforcible - CSC 1st/3rd Degree",
    "3801": "Family Nonsupport: Neglect Family/Nonsupport Felony",
    "3802": "Family Abuse Neglect: Nonviolent - Cruelty Towards Child",
    "3803": "Family Abuse/Neglect: Nonviolent - Cruelty Towards Spouse",
    "3901": "Gambling: Operating, Promoting or Assisting in Bookmaking",
    "4001": "Commercialized Sex: Assist or Promote Prostitution - Keep House of Ill Fame",
    "4101": "Liquor Violation: Manufacture",
    "4102": "Liquor Violation: Sell",
    "4801": "Obstructing Police: Resisting Officer",
    "5001": "Obstructing Justice: Bail - Secured Bond",
    "5201": "Concealed Weapon: Altering Identification",
    "5203": "Concealed Weapon: Carrying Prohibited",
    "5301": "Public Peace: Anarchism",
    "5302": "Public Peace: Riot - Inciting",
    "5421": "Operating Under the Influence of Liquor or Drugs: OUI - Off-road Vehicle",
    "5422": "Operating Under the Influence of Liquor or Drugs: Permitted Person OUI - Off-road vehicle",
    "5501": "Health and Safety: Drugs - Adulterated",
    "7070": "Juvenile Runaway",
    "5701": "Invasion of Privacy: Divulge Eavesdrop Info",
    "5702": "Invasion of Privacy: Divulge Eavesdrop Order",
    "7399": "Miscellaneous Arrest",
    "7571": "Solicitation: Any Solicitation Except Prostitution"
  },

  // offense2: {
  //   OtherCrimes: [
  //     { name: 'DISORDERLY CONDUCT', color: chroma(colors.admin).hex() },
  //   ]
  // }
  // STOLEN VEHICLE
  // DANGEROUS DRUGS
  // ROBBERY
  // HOMICIDE
  // LARCENY
  // SEX OFFENSES
  // OUIL
  // RUNAWAY
  // STOLEN PROPERTY
  // DAMAGE TO PROPERTY
  // OTHER
  // OBSTRUCTING JUDICIARY
  // MISCELLANEOUS
  // JUSTIFIABLE HOMICIDE
  // ASSAULT
  // EMBEZZLEMENT
  // FORGERY
  // LIQUOR
  // GAMBLING
  // EXTORTION
  // AGGRAVATED ASSAULT
  // KIDNAPPING
  // FAMILY OFFENSE
  // OBSTRUCTING THE POLICE
  // WEAPONS OFFENSES
  // BURGLARY
  // SEXUAL ASSAULT
  // FRAUD
  // SOLICITATION
  // ARSON

  offenses: {
    property: [
      { name: 'ARSON', state_codes: ['2099'], top: 'Property Crimes', color: chroma(colors.arson).hex() },
      { name: 'BURGLARY', state_codes: ['2201', '2202'], top: 'Property Crimes', color: chroma(colors.robbery).hex() },
      { name: 'DAMAGE TO PROPERTY', state_codes: ['2900'], top: 'Property Crimes', color: chroma(colors.robbery).brighten(1).hex() },
      { name: 'LARCENY', state_codes: ['2301', '2302', '2303', '2304', '2305', '2306', '2307'], top: 'Property Crimes', color: chroma(colors.larceny).hex() },
      { name: 'STOLEN VEHICLE', state_codes: ['2401', '2402', '2403'], top: 'Property Crimes', color: chroma(colors.car).darken().hex() }
    ],
    violent: [
      { name: 'ASSAULT', state_codes: ['1302'], top: 'Violent Crimes', color: chroma(colors.assault).hex() },
      { name: 'AGGRAVATED ASSAULT', state_codes: ['1301', '1303'], top: 'Violent Crimes', color: chroma(colors.assault).brighten(1).hex() },
      { name: 'SEXUAL ASSAULT', state_codes: ['1171', '1172', '1173', '1174', '1175', '1176', '1177', '1178', '3601', '3692'], top: 'Violent Crimes', color: chroma(colors.assault).darken(2).hex() },
      { name: 'HOMICIDE', state_codes: ['0901', '0902', '0903', '0904'], top: 'Violent Crimes', color: chroma(colors.homicide).brighten().hex() },
      // { name: 'JUSTIFIABLE HOMICIDE', state_codes: ['0904'], top: 'Violent Crimes', color: chroma(colors.murder).desaturate().darken().hex() },
      { name: 'ROBBERY', state_codes: ['1201'], top: 'Violent Crimes', color: chroma(colors.robbery).hex() }
    ],
    other: [
      { name: 'OBSTRUCTING JUDICIARY', state_codes: ['5001'], top: 'Other Crimes', color: chroma(colors.bail).hex() },
      { name: 'DANGEROUS DRUGS', state_codes: ['3501', '3502',  '5501'], top: 'Other Crimes', color: chroma(colors.drugs).hex() },
      // { name: 'DISORDERLY CONDUCT', state_codes: ['5301', '5302'], top: 'Other Crimes', color: chroma(colors.disorder).hex() },
      { name: 'DRUNK DRIVING', state_codes: ['5421', '5422',], top: 'Other Crimes', color: chroma(colors.car).hex() },
      // { name: 'FAMILY ABUSE/NEGLECT', state_codes: ['3801', '3802', '3803'], top: 'Other Crimes', color: chroma(colors.personal).hex() },
      { name: 'FRAUD', state_codes: ['2601', '2602', '2603', '2604', '2605', '2606', '3071', '3072'], top: 'Other Crimes', color: chroma(colors.admin).hex() },
      { name: 'LIQUOR VIOLATIONS', state_codes: ['4101', '4102'], top: 'Other Crimes', color: chroma(colors.other).brighten().hex() },
      // { name: 'KIDNAPPING', state_codes: ['1001', '1002'], top: 'Other Crimes', color: chroma(colors.personal).darken().hex() },
      { name: 'MISC ARREST', state_codes: ['7399'], top: 'Other Crimes', color: chroma(colors.other).hex() },
      // { name: 'RUNAWAY', state_codes: ['7070'], top: 'Other Crimes', color: chroma(colors.personal).saturate().hex() },
      { name: 'WEAPONS OFFENSE', state_codes: ['5201', '5203'], top: 'Other Crimes', color: chroma(colors.other).darken().hex() }
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

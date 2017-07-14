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

  // offenses: [
  //   { name: 'ARSON', state_codes: ['2099'], top: 'Property Crimes', color: 'rgb(0,111,49)' },
  //   { name: 'ASSAULT', state_codes: ['1301', '1303'], top: 'Violent Crimes', color: 'rgb(104,0,116)' },
  //   { name: 'AGGRAVATED ASSAULT', state_codes: ['1302'], top: 'Violent Crimes', color: 'rgb(212,39,79)' },
  //   { name: 'SEXUAL ASSAULT', state_codes: ['1171', '1172', '1173', '1174', '1175'], top: 'Violent Crimes', color: 'rgb(23,43,22)' },
  //   { name: 'BURGLARY', state_codes: ['2201', '2202'], top: 'Property Crimes', color: 'rgb(0,162,95)' },
  //   { name: 'DAMAGE TO PROPERTY', state_codes: ['2900'], top: 'Property Crimes', color: 'rgb(0,146,212)' },
  //   { name: 'DANGEROUS DRUGS', state_codes: ['3501'], top: 'Other Crimes', color: 'rgb(178,29,28)' },
  //   { name: 'FRAUD', state_codes: ['2601', '2602', '2603', '3072'], top: 'Other Crimes', color: 'rgb(239,166,255)' },
  //   { name: 'HOMICIDE', state_codes: ['0901', '0902', '0903'], top: 'Violent Crimes', color: 'rgb(139,266,55)' },
  //   { name: 'JUSTIFIABLE HOMICIDE', state_codes: ['0904'], top: 'Violent Crimes', color: 'rgb(39,66,55)' },
  //   { name: 'KIDNAPPING', state_codes: ['1001', '1002'], top: 'Other Crimes', color: 'rgb(178,29,28)' },
  //   { name: 'LARCENY', state_codes: ['2301', '2302', '2303', '2305', '2306', '2307'], top: 'Property Crimes', color: 'rgb(0,262,195)' },
  //   { name: 'STOLEN VEHICLE', state_codes: ['2401'], top: 'Property Crimes', color: 'rgb(0,246,112)' }
  // ],

  // top_offenses: [
  //   { 
  //     name: 'Property Crimes', 
  //     offenses: ['ARSON', 'BURGLARY', 'DAMAGE TO PROPERTY', 'LARCENY', 'STOLEN VEHICLE'],
  //     top_color: 'rgb(0,111,49)' 
  //   },
  //   { 
  //     name: 'Violent Crimes', 
  //     offenses: ['ASSAULT', 'AGGRAVATED ASSAULT', 'SEXUAL ASSAULT', 'HOMICIDE', 'JUSTIFIABLE HOMICIDE'],
  //     top_color: 'rgb(178,29,28)' 
  //   },
  //   { 
  //     name: 'Other Crimes', 
  //     offenses: ['DANGEROUS DRUGS', 'FRAUD', 'KIDNAPPING'],
  //     top_color: 'rgb(239,166,255)' 
  //   }
  // ]

  offenses: {
    property: [
      { name: 'ARSON', state_codes: ['2099'], top: 'Property Crimes', color: 'rgb(0,111,49)' },
      { name: 'BURGLARY', state_codes: ['2201', '2202'], top: 'Property Crimes', color: 'rgb(0,162,95)' },
      { name: 'DAMAGE TO PROPERTY', state_codes: ['2900'], top: 'Property Crimes', color: 'rgb(0,146,212)' },
      { name: 'STOLEN VEHICLE', state_codes: ['2401'], top: 'Property Crimes', color: 'rgb(0,246,112)' }
    ],
    violent: [
      { name: 'ASSAULT', state_codes: ['1301', '1303'], top: 'Violent Crimes', color: 'rgb(104,0,116)' },
      { name: 'AGGRAVATED ASSAULT', state_codes: ['1302'], top: 'Violent Crimes', color: 'rgb(212,39,79)' },
      { name: 'SEXUAL ASSAULT', state_codes: ['1171', '1172', '1173', '1174', '1175'], top: 'Violent Crimes', color: 'rgb(23,43,22)' },
      { name: 'HOMICIDE', state_codes: ['0901', '0902', '0903'], top: 'Violent Crimes', color: 'rgb(139,266,55)' },
      { name: 'JUSTIFIABLE HOMICIDE', state_codes: ['0904'], top: 'Violent Crimes', color: 'rgb(39,66,55)' }
    ],
    other: [
      { name: 'DANGEROUS DRUGS', state_codes: ['3501'], top: 'Other Crimes', color: 'rgb(178,29,28)' },
      { name: 'FRAUD', state_codes: ['2601', '2602', '2603', '3072'], top: 'Other Crimes', color: 'rgb(239,166,255)' },
      { name: 'KIDNAPPING', state_codes: ['1001', '1002'], top: 'Other Crimes', color: 'rgb(178,29,28)' }
    ]
  }
};

export default Data;

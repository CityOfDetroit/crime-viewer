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
    { name: 'Morning', hours: [5, 6, 7, 8, 9, 10] },
    { name: 'Afternoon', hours: [11, 12, 13, 14, 15, 16] },
    { name: 'Evening', hours: [17, 18, 19, 20, 21, 22] },
    { name: 'Overnight', hours: [23, 24, 1, 2, 3, 4] }
  ],
  offenses_heirarchy: [
    // draft schema, still need to decide how this will work
    { name: 'Property Crimes', offense_categories: ['LARCENY', 'STOLEN PROPERTY'], state_offense_codes: ['2305', '2401'] }
  ]
};

export default Data;

import Data from './data.js'

const Filter = {
  /* read the UI inputs and make the object */
  readInput: function() {
    let filterObject = {
      // offense code
      'state_offense_code': [],
      // time
      'hour_of_day': [],
      'day_of_week': [],
      // location
      'neighborhood': [],
      'precinct': [],
      'zip_code': [], 
      'council_district': [],

    }
    const categoryInputs = ['violent-check', 'property-check', 'other-check']
    categoryInputs.forEach(i => {
      let elem = document.getElementById(i)
      if(elem.checked) {
        let type = elem.id.split('-')[0]
        Data.offenses[type].forEach(o => {
          filterObject['state_offense_code'] = filterObject['state_offense_code'].concat(o['state_codes'])
        })
      }
    })
    return filterObject
  },

  getUniqueFeatures: function(array, comparatorProperty) {
    var existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    var uniqueFeatures = array.filter(function(el) {
        if (existingFeatureKeys[el.properties[comparatorProperty]]) {
            return false;
        } else {
            existingFeatureKeys[el.properties[comparatorProperty]] = true;
            return true;
        }
    });
    // sort them alphabetically
    return uniqueFeatures
    // return _.sortBy(uniqueFeatures, [function(f) { return f.properties.name; }]);
  },

  /* make a mapbox-gl filter from an object of filters */
  // API ref: https://www.mapbox.com/mapbox-gl-js/style-spec/#types-filter
  makeMapboxFilter: function(obj) {
    // we may want this to be "any"; possibly a toggle somewhere
    let mapboxFilter = ["all"]
    Object.entries(obj).forEach(([k, v]) => {
      if(v.length < 1) { return; s}
      let inList = ["in", k]
      mapboxFilter.push(inList.concat(v))
    })
    return mapboxFilter
  },

  /* return a human-readable string from the current filter object */
  describeFilter: function(obj) {
    let start = "Current filters:"
    return null
  }
}

export default Filter;

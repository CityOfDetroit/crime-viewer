import Data from './data.js'

const Filter = {
  /**
   * read the filters and do two things: make an object that's easily convertable to Mapbox format,
   *  and a string which describes the currently selected filters in a way we can display
   * @return [array] - object for makeMapboxFilter and display string
   */
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
    let filterHuman = [
      "Currently viewing",
    ]
    const categoryInputs = ['violent-check', 'property-check', 'other-check']
    categoryInputs.forEach(i => {
      let elem = document.getElementById(i)
      let human = ""
      if(elem.checked) {
        let type = elem.id.split('-')[0]
        filterHuman.push(Data.offenses[type][0]['top'])
        Data.offenses[type].forEach(o => {
          filterObject['state_offense_code'] = filterObject['state_offense_code'].concat(o['state_codes'])
        })
      }
    })

    // days of week
    Data.days_of_week.forEach(i => {
      let elem = document.getElementById(`dow-${i.number}-check`)
      if(elem.checked){
        filterHuman.push(`on a ${i.name}`)
        filterObject['day_of_week'].push(i.number.toString())
      }
    })

    // time of day
    Data.parts_of_day.forEach(i => {
      let elem = document.getElementById(`${i.name.toLowerCase()}-check`)
      if(elem.checked){
        filterHuman.push(`during ${i.name}`)
        filterObject['hour_of_day'] = filterObject['hour_of_day'].concat(i.hours.map(i => i.toString()))
      }
    })

    Data.council_districts.forEach(i => {
      let elem = document.getElementById(`district-${i.number}-check`)
      if(elem.checked){
        filterHuman.push(`in District ${i.number.toString()}`)
        filterObject['council_district'].push(i.number.toString())
      }
    })

    Data.precincts.forEach(i => {
      let elem = document.getElementById(`precinct-${parseInt(i.number)}-check`)
      if(elem.checked){
        filterHuman.push(`in precinct ${i.number.toString()}`)
        filterObject['precinct'].push(i.number.toString())
      }
    })

    return [filterObject, filterHuman.join(", ")]
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

  /**
   * @param {obj} - a filterObject returned by readInput
   * @returns {array} - a mapbox-gl Filter
   */
  makeMapboxFilter: function(obj) {
    // we may want this to be "any"; possibly a toggle somewhere
    let mapboxFilter = ["all"]
    Object.entries(obj).forEach(([k, v]) => {
      if(v.length < 1) { return; s}
      let inList = ["in", k]
      mapboxFilter.push(inList.concat(v))
    })
    return mapboxFilter
  }
}

export default Filter;

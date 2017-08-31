import Data from './data.js'
import Stats from './stats.js'
const turf = require('@turf/turf')
const _ = require('lodash')
const $ = require('jquery')

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
      'block_id': []
    }
    let filterHuman = {
      // "date_range": [],
      "categories": [],
      "time": [],
      "area": []
    }

    // filterHuman['date_range'] = [$('#from_date')[0].value, $('#to_date')[0].value]

    _.each($('input.offense-checkbox'), d => {
      if (d.checked) {
        _.each(d.attributes['data-codes'].value.split(" "), c => {
          filterObject['state_offense_code'].push(c)
        })
        filterHuman.categories.push(d.attributes['data-name'].value)        
      }
    })

    // days of week
    Data.days_of_week.forEach(i => {
      let elem = document.getElementById(`dow-${i.number}-check`)
      if(elem.checked){
        filterHuman.time.push(`on a ${i.name}`)
        filterObject['day_of_week'].push(i.number.toString())
      }
    })

    // time of day
    Data.parts_of_day.forEach(i => {
      let elem = document.getElementById(`${i.name.toLowerCase()}-check`)
      if(elem.checked){
        filterHuman.time.push(`during ${i.name}`)
        filterObject['hour_of_day'] = filterObject['hour_of_day'].concat(i.hours.map(i => i.toString()))
      }
    })

    // Data.council_districts.forEach(i => {
    //   let elem = document.getElementById(`district-${i.number}-check`)
    //   if(elem.checked){
    //     filterHuman.area.push(`in District ${i.number.toString()}`)
    //     filterObject['council_district'].push(i.number.toString())
    //   }
    // })

    // Data.precincts.forEach(i => {
    //   let elem = document.getElementById(`precinct-${parseInt(i.number)}-check`)
    //   if(elem.checked){
    //     filterHuman.area.push(`in precinct ${i.number.toString()}`)
    //     filterObject['precinct'].push(i.number.toString())
    //   }
    // })

    return [filterObject, filterHuman]
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
   * master update function
   * @param {Map} map
   * @param {Polygon} drawn
   * @param {FeatureCollection} data
   * @param {Object} filters
   */
  updateData: function(map, draw, data, filters) {
    // make a copy of the original fetched data
    let filteredData = _.cloneDeep(data);

    Object.entries(filters).forEach(([k, v]) => {
      if (v.length < 1) {
        return
      } else {
        filteredData.features = Filter.filterFeatures(filteredData.features, k, v)
      }
    });

    map.getSource('incidents').setData(filteredData);

    // refresh counts to redraw chart in Stats tab based on selected area filter
    var currentArea = $("#location input:checked")

    if (filters['council_district'].length > 0) {
      Stats.printAsHighchart(filteredData.features, `properties.council_district`, 'chart-container');
    } else {
      Stats.printAsHighchart(filteredData.features, `properties.precinct`, 'chart-container');
    }

    // refresh counts to redraw table in Stats tab
    let incidentsByCategory = Stats.countByKey(filteredData.features, 'properties.offense_category');
    Stats.printAsTable(incidentsByCategory, 'tbody');

    // refresh count of current incidents
    // Stats.printFilteredView(filteredData.features, Filter.readInput()[1], 'filtered_view');

    return filteredData;
  },

  /**
   * Given a key and array of values, return features that have given k:v pair
   * @param {array} data 
   * @param {string} key 
   * @param {array} values 
   */
  filterFeatures(data, key, values) {
    return _.filter(data, d => {
      return values.indexOf(eval(`d.properties.${key}`)) > -1 
    })
  },
  /**
   * Reset everything
   * @param {mapboxgl.Map} map mapboxgl.Map instance
   * @param {MapboxDraw} draw MapboxDraw instance
   * @param {Object} data originally fetched data
   */
  resetEverything: function(map, draw, data) {
    // reset map bounds
    map.flyTo({ center: [-83.131, 42.350], zoom: 10.75})
    // copy of original data
    map.getSource('incidents').setData(data);
    // clear all Draw
    draw.deleteAll()
    // reset all filters
    jQuery("input:checkbox").prop("checked", false)

  },

  newDrawnPolygon: function(draw, map) {
    draw.deleteAll()
    map.setPaintProperty('incidents_point', 'circle-opacity', 0.05)
    map.setPaintProperty('incidents_point', 'circle-stroke-opacity', 0.05)
    draw.changeMode('draw_polygon')
    map.on('draw.modechange', map => {
      draw.changeMode('static')
    })
  }
}

export default Filter;

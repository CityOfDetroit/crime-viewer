var moment = require('moment');
var _ = require('lodash');

import Stats from './stats.js';

const Helpers = {
  xDaysAgo: function(int, date) {
    return moment(date).subtract(int, 'days').toISOString().slice(0,10)
  },

  /** 
   * Formats a string by capitalizing the first letters of each word
   * @param {str}
   * @returns {str}
   */
  toSentenceCase: function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },

  /**
   * function for click events on map
   */
  queryMap: function(e, map) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['incidents_point', 'incidents_point_ezclick']
    });

    if (features.length > 0) {
      map.setFilter("incidents_highlighted", ['==', 'crime_id', features[0].properties.crime_id]);
      Stats.printPointDetails(features, 'point_details');
      let details = document.querySelector("#point_details")
      let img = document.querySelector("#point_details img")
      img.addEventListener('mousedown', function() {
        details.innerHTML = '';
        map.setFilter("incidents_highlighted", ["==", 'crime_id', ''])
      })
    }
  }
}

export default Helpers;

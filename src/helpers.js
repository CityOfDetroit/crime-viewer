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

    console.log(features)

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
  },

  /**
   * Unused for now in lieu of checking for specific properties of window and Object
   * ref https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
   */
  getBrowserSpecs: (function() {
    var ua = navigator.userAgent, tem, 
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  
    if (/trident/i.test(M[1])) {
      tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: 'IE', version: (tem[1] || '') };
    }

    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        return { name: tem[1].replace('OPR', 'Opera'), version: tem[2] };
      }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
  
    return { name: M[0], version: M[1] };
  })()

}

export default Helpers;

import _ from 'lodash';
import Helpers from './helpers.js';

const Stats = {
  /**
   * Counts number of features on the map
   * @param {array}
   * @returns {int}
   */
  countFeatures: function(arr) {
    return arr.length;
  },

  /**
   * Counts number of times a unique value occurs for a specified key
   * @param {array}
   * @param {string} - name of key in object
   * @returns {obj} - where keys are unique values for specified key above and values are integers
   */
  countByKey: function(arr, key) {
    return _.countBy(arr, key);
  },

  /**
   * Creates an HTML table from a stats object
   * @param {obj} - object of summary statistics, like the one returned by countByKey
   * @param {string} - html table id
   * @returns {}
   */
  printAsTable: function(summaryStats, tblId) {
    let numRows = Object.keys(summaryStats).length;
    let tbody = document.getElementById(tblId);

    for (var key in summaryStats) {
      let tr = "<tr>";         
      tr += "<td>" + Helpers.toSentenceCase(key) + "</td>" + "<td>" + summaryStats[key] + "</td></tr>";
      
      tbody.innerHTML += tr;
    }
    return tbody;
  }
}

export default Stats;

import _ from 'lodash';
import Chartist from 'chartist';

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
    // drop a key/value pair if the key is "null"
    summaryStats = _.omit(summaryStats, "null");

    // order from largest to smallest values
    summaryStats = _.fromPairs(_.sortBy(_.toPairs(summaryStats), function(a) {
      return a[1];
    }).reverse());

    let numRows = Object.keys(summaryStats).length;
    let tbody = document.getElementById(tblId);

    // make a table row for every key/value pair
    for (var key in summaryStats) {
      let tr = "<tr>";         
      tr += "<td>" + Helpers.toSentenceCase(key) + "</td>" + "<td>" + summaryStats[key] + "</td></tr>";
      
      tbody.innerHTML += tr;
    }
    
    return tbody;
  },

  /** 
   * Create a simple bar chart from a stats object
   * @param {obj}
   * @param {string} - chart classname
   * @returns {} - Chartist Bar chart
   */
  printAsChart: function(summaryStats, chartClass) {
    summaryStats = _.omit(summaryStats, "null");

    let properties = Object.keys(summaryStats);
    let counts = Object.keys(summaryStats).map(function(e) {
      return summaryStats[e];
    });

    // don't hard code this in the future
    let labeledproperties = properties.map(function(e) {
      return "D" + e;
    });

    let data = {
      labels: labeledproperties,
      series: [counts]
    };

    let options = {
      width: 300,
      height: 200
    };

    return new Chartist.Bar(chartClass, data, options);
  }
}

export default Stats;

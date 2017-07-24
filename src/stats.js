import _ from 'lodash';
import Chartist from 'chartist';
import moment from 'moment';
import numeral from 'numeral';

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

    tbody.innerHTML = '';

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
      return e;
      // return "D" + e;
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
  },

  /** 
   * Prints current view
   * @param {array} - list of features
   * @param {string} - html div id
   * @returns {}
   */
  printCurrentView: function(features, divId) {
    let current_view = document.getElementById(divId);

    current_view.innerHTML = '';

    let p = document.createElement("p");
    p.innerHTML = "<strong>" + "Current View" + "</strong><br/>" + numeral(features.length).format('0,0') + " Crime Incidents";
    current_view.appendChild(p);

    return current_view;
  },

  /** 
   * Prints time range
   */
  printTimeRange: function(timeA, timeB, divId) {
    let time_range = document.getElementById(divId);

    let p = document.createElement("p");
    p.innerHTML = moment(timeA).format("MM/DD/YY") + " to " + moment(timeB).format("MM/DD/YY");
    time_range.appendChild(p);

    return time_range;
  },

  /** 
   * Display details of point on the map
   * @param {array} - list of features (we only display the first right now)
   * @param {string} - html div id
   * @returns {}
   */
  printPointDetails: function(features, divId) {
    let detail = document.getElementById(divId);

    detail.innerHTML = '';

    let h3 = document.createElement("h3");
    h3.innerHTML = "POINT DETAILS"
    detail.appendChild(h3);

    let p = document.createElement("p");
    p.innerHTML = "<strong>" + "Incident: " + "</strong>" + features[0].properties.offense_category;
    detail.appendChild(p);

    let p2 = document.createElement("p");
    p2.innerHTML = "<strong>" + "Date & Time: " + "</strong>" + moment(features[0].properties.incident_timestamp).format("dddd, MMMM Do YYYY, h:mm:ss a");
    detail.appendChild(p2);

    let p3 = document.createElement("p");
    p3.innerHTML = "<strong>" + "Address: " + "</strong>" + features[0].properties.address;
    detail.appendChild(p3);

    let p4 = document.createElement("p");
    p4.innerHTML = "<strong>" + "Neighborhood: " + "</strong>" + features[0].properties.neighborhood;
    detail.appendChild(p4);

    let p5 = document.createElement("p");
    p5.innerHTML = "<strong>" + "Precinct: " + "</strong>" + features[0].properties.precinct;
    detail.appendChild(p5);

    return detail;
  }
}

export default Stats;

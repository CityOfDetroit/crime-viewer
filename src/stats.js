import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import Highcharts from 'highcharts';

import Helpers from './helpers.js';
import Data from './data.js';

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
      tr += "<td>" + Helpers.toSentenceCase(key) + "</td>" + "<td>" + numeral(summaryStats[key]).format('0,0') + "</td></tr>";
      
      tbody.innerHTML += tr;
    }
    
    return tbody;
  },

  /**
   * Prints a column chart
   * Ref http://api.highcharts.com/highcharts
   */
  printAsHighchart: function(arr, key, chartId) {
    // prep the data
    let summaryStats = _.countBy(arr, key);
    summaryStats = _.omit(summaryStats, "null");

    let properties = Object.keys(summaryStats);
    let counts = Object.keys(summaryStats).map(function(e) {
      return summaryStats[e];
    });
    
    // lookup human-readable field name
    key = Data.fields[key];

    // define the chart
    let chart = Highcharts.chart({ 
      chart: {
        renderTo: chartId,
        type: 'column',
        style: {
          fontFamily: 'inherit'
        }
      },
      colors: ['#4059CD'],
      title: {
        text: '<b>Crime Incidents by ' + key + '</b>',
        style: {
          fontSize: 16
        }
      },
      xAxis: {
        categories: properties,
        title: {
          text: key
        }
      },
      yAxis: {
        title: {
          enabled: false
        },
        labels: {
          formatter: function() {
            return numeral(this.value).format('0a');
          }
        }
      },
      tooltip: {
        borderWidth: 1,
        borderColor: 'white',
        formatter: function() {
          return numeral(this.y).format('0,0') + ' ' + this.series.name;
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Incidents',
        data: counts
      }]
    });

    return chart
  },

  /** 
   * Prints loaded view
   * @param {array} - list of features
   * @param {string} - html div id
   * @returns {}
   */
  printLoadedView: function(features, timeA, timeB, divId) {
    let loaded_view = document.getElementById(divId);
    loaded_view.innerHTML = `<p>
      <b>${numeral(features.length).format('0,0')}</b> incidents occurred between
      <b>${moment(timeA).format("MM/DD/YY")}</b>
      and <b>${moment(timeB).format("MM/DD/YY")}</b>.`    
      return loaded_view;
  },

  /** 
   * Prints current view
   * @param {array} features list of features
   * @param {array} humanFilter array of filter strings
   * @param {string} divId html div id
   * @returns {}
   */
  printFilteredView: function(features, humanFilter, divId) {
    let filtered_view = document.getElementById(divId);
    filtered_view.innerHTML = `
    <p><b>${numeral(features.length).format('0,0')}</b> incidents are displayed and match <b>these filters</b>:
      <ul>
      ${humanFilter.map(f => `<li>${f}</li>`).join("")}
      </ul></p>
    `
    return filtered_view;
  },

  // /** 
  //  * Prints time range
  //  */
  // printTimeRange: function(timeA, timeB, divId) {
  //   let time_range = document.getElementById(divId);

  //   let p = document.createElement("p");
  //   p.innerHTML = moment(timeA).format("MM/DD/YY") + " to " + moment(timeB).format("MM/DD/YY");
  //   time_range.appendChild(p);

  //   return time_range;
  // },

  /** 
   * Display details of point on the map
   * @param {array} - list of features (we only display the first right now)
   * @param {string} - html div id
   * @returns {}
   */
  printPointDetails: function(features, divId) {
    let detail = document.getElementById(divId);

    detail.innerHTML = '';

    let hr = document.createElement("hr");
    detail.appendChild(hr);

    let span = document.createElement("span");
    span.innerHTML = "<img src='./img/close.svg'>";
    span.className += "disclaimer-close";
    detail.appendChild(span);

    let h3 = document.createElement("h3");
    h3.innerHTML = "Point Details";
    detail.appendChild(h3);

    let p = document.createElement("p");
    p.innerHTML = "<strong>" + "Incident: " + "</strong>" + features[0].properties.offense_category;
    detail.appendChild(p);

    let p2 = document.createElement("p");
    p2.innerHTML = "<strong>" + "Date & Time: " + "</strong>" + moment(features[0].properties.incident_timestamp).format("dddd, MMMM Do YYYY, h:mm a");
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
   
    //extend height of current view div to include new point details
    let currentViewHeight = jQuery('#current_view').height() + jQuery('#point_details').height() + 10;
    //fadeIn point details
    jQuery('#details').animate({height: currentViewHeight}, {complete:function(){jQuery('#point_details').fadeIn()}});
      //close point details
      jQuery('#point_details .disclaimer-close img').click(function(){
        //fade out closed point data
        jQuery('#point_details').fadeOut();
        //resize div to height of current view div
        let currentViewHeight = jQuery('#current_view').height() + 7;
        jQuery('#details').animate({
          height: currentViewHeight
        });
    });
      
    return detail;
  }
}

export default Stats;

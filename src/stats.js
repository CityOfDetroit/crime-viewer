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
  countFeatures: function (arr) {
    return arr.length;
  },

  /**
   * Counts number of times a unique value occurs for a specified key
   * @param {array}
   * @param {string} - name of key in object
   * @returns {obj} - where keys are unique values for specified key above and values are integers
   */
  countByKey: function (arr, key) {
    return _.countBy(arr, key);
  },

  /**
   * Creates an HTML table from a stats object
   * @param {obj} - object of summary statistics, like the one returned by countByKey
   * @param {string} - html table id
   * @returns {}
   */
  printAsTable: function (summaryStats, tblId) {
    // drop a key/value pair if the key is "null"
    summaryStats = _.omit(summaryStats, "null");

    // order from largest to smallest values
    summaryStats = _.fromPairs(_.sortBy(_.toPairs(summaryStats), function (a) {
      return a[1];
    }).reverse());

    let numRows = Object.keys(summaryStats).length;
    let tbody = document.getElementById(tblId);

    tbody.innerHTML = '';

    // make a single array to lookup color codes by key name
    let allColorsLookup = [];
    let propertyColors = Data.offenses['property'];
    let violentColors = Data.offenses['violent'];
    let otherColors = Data.offenses['other'];
    allColorsLookup = allColorsLookup.concat(propertyColors, violentColors, otherColors);

    // make a table row for every key/value pair
    for (var key in summaryStats) {
      let tr = "<tr>";

      // show each keys unique point color, or black by default
      let colorEntry = _.find(allColorsLookup, c => { return c.name == key})
      let colorCode = ''
      if (colorEntry) {
        colorCode = colorEntry.color
      }
      else {
        colorCode = '#000'
      }

      let colorPreview = "<div style='background-color:" + colorCode + ";'></div>";

      // make the actual row
      tr += "<td>" + colorPreview + Helpers.toSentenceCase(key) + "</td>" + "<td>" + numeral(summaryStats[key]).format('0,0') + "</td></tr>";

      tbody.innerHTML += tr;
    }

    return tbody;
  },

  /**
   * Prints a column chart
   * Ref http://api.highcharts.com/highcharts
   */
  printAsHighchart: function (arr, key, chartId) {
    // prep the data, don't include strange values like "Precinct HP"
    let summaryStats = _.countBy(arr, key);
    summaryStats = _.omit(summaryStats, ["null", "HP", "0"]);

    let properties = Object.keys(summaryStats).sort();
    let counts = Object.keys(summaryStats).map(function (e) {
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
      colors: ['#279989'],
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
          formatter: function () {
            return numeral(this.value).format('0a');
          }
        }
      },
      tooltip: {
        borderWidth: 1,
        borderColor: 'white',
        formatter: function () {
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
  printLoadedView: function (timeA, timeB, data) {
    jQuery("#from_date").val(moment(timeA).format("YYYY-MM-DD"))
    jQuery("#to_date").val(moment(timeB).format("YYYY-MM-DD"))
    jQuery("#crime_count").html(data.features.length)
  },

  /** 
   * Prints current view
   * @param {array} features list of features
   * @param {object} humanFilter object of filter strings
   * @param {string} divId html div id
   * @returns {}
   */
  printFilteredView: function (features, humanFilter, divId) {
    let filtered_view = document.getElementById(divId);
    if (_.flatten(Object.values(humanFilter)).length == 0) {
      let currentViewHeight = jQuery('#loaded_view').outerHeight() + jQuery('#point_details').outerHeight() + 15;
      jQuery('#filtered_view').fadeOut(550);
      jQuery('#details').animate({ height: currentViewHeight }, { complete: function () { jQuery('#filtered_view').empty() } });
      return filtered_view;
    }
    else {
      let html = `<hr><p><b>${numeral(features.length).format('0,0')}</b> incidents are displayed and match <b>these filters</b>:<ul>`
      Object.entries(humanFilter).forEach(e => {
        if (e[1].length > 0) {
          html += `<li>${Helpers.toSentenceCase(e[0])}: ${e[1].join(", ")}`
        }
      })
      html += '</ul>'
      filtered_view.innerHTML = html;
      jQuery('#filtered_view').fadeIn(500, function () { });
      let currentViewHeight = jQuery('#loaded_view').outerHeight() + jQuery('#filtered_view').outerHeight() + jQuery('#point_details').outerHeight() + 15;
      jQuery('#details').animate({ height: currentViewHeight }, { complete: function () { } });
      return filtered_view;
    }
  },

  // /** 
  //  * Prints time range
  //  */
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
  printPointDetails: function (features, divId) {
    let detail = document.getElementById(divId);

    let display_cols = {
      "Report #": features[0].properties.report_number,
      "Arrest Category": features[0].properties.offense_category,
      "Offense Code": Data.state_codes[features[0].properties.state_offense_code],
      "Timestamp": moment(features[0].properties.incident_timestamp).format("dddd, MMMM Do YYYY, h:mm a"),
      "Address": features[0].properties.address,
      "Neighborhood": `${features[0].properties.neighborhood} (District ${features[0].properties.council_district}, Precinct ${features[0].properties.precinct})`
    };

    detail.innerHTML = `
    <h4 class="sidebar-title">
      Point Details
      <span class="point-details-close"><img src="./img/close.svg"></span>
    </h4>
    <table id="point_details_tbl">
      <colgroup>
        <col style="width:35%">
        <col style="width:65%">
      </colgroup>
      ${Object.keys(display_cols).map(k => `
        <tr><th>${k}</th></tr>
        <tr><td>${display_cols[k]}</td></tr>
      `).join("")}
    </table>`

    return detail;
  }
}

export default Stats;

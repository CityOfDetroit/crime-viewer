import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import Highcharts from 'highcharts';
require('highcharts/modules/heatmap')(Highcharts);

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
   * Prep data to draw a Highcharts Heatmap by counting incidents that have two properties (eg happened on a Monday during the 5pm hour)
   * @param {array}
   * @returns {array} - array of arrays where inner elements are matrix coordinates with format [day index, hour index, count of incidents]
   */
  makeDayHourCoords: function(arr) {
    let group_by_day = _.groupBy(arr, function(d) { return d.properties.day_of_week });
    let res = new Array();

    for (var day in group_by_day) {
      if (!group_by_day.hasOwnProperty(day)) continue;

      let list_by_day = group_by_day[day];
      let group_by_day_hour = _.countBy(list_by_day, 'properties.hour_of_day');

      for (var hour in group_by_day_hour) {
        let coords = new Array(parseInt(day) -1, parseInt(hour), group_by_day_hour[hour]);
        res.push(coords);
      }
    }

    return res;
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
    console.log(key)
    // prep the data, don't include strange values like "Precinct HP"
    let summaryStats = _.countBy(arr, key);
    summaryStats = _.omit(summaryStats, ["null", "HP", "0"]);

    let properties = Object.keys(summaryStats).sort();
    let counts = Object.keys(summaryStats).map(function(e) {
      return summaryStats[e];
    });

    // lookup human-readable field names for locations
    key = Data.fields[key];

    // define defaults, but if many properties to display switch from columns to horiz bars
    let chartType = 'column';
    let xAxisTitle = { text: key };
    let yAxisTitle = { enabled: false };

    if (properties.length > 20) {
      chartType = 'bar';
      xAxisTitle = { enabled: false };
      yAxisTitle = { text: 'Incidents' };
    }

    // define the chart
    let chart = Highcharts.chart({
      chart: {
        renderTo: chartId,
        type: chartType,
        style: {
          fontFamily: 'inherit'
        }
      },
      colors: ['#279989'],
      title: {
        text: '<b>Incidents by ' + key + '</b>',
        style: {
          fontSize: 19
        },
        align: 'center'
      },
      xAxis: {
          categories: properties,
          title: xAxisTitle
        },
      yAxis: {
        title: yAxisTitle,
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
          return numeral(this.y).format('0,0') + ' ' + this.series.name + ' in ' + this.x;
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

    return chart;
  },

  /** 
   * Prints a line chart
   * ref https://www.highcharts.com
   */
  printAsLineChart: function(arr, key, chartId) {
    let summaryStats = _.countBy(arr, key);
    let properties = Object.keys(summaryStats).sort();
    let counts = Object.keys(summaryStats).map(function(e) {
      return summaryStats[e];
    });

    // lookup human-readable field names for locations
    key = Data.fields[key];

    // define the chart
    let chart = Highcharts.chart({
      chart: {
        renderTo: chartId,
        type: 'line',
        style: {
          fontFamily: 'inherit'
        }
      },
      colors: ['#279989'],
      title: {
        text: '<b>Incidents by ' + key + '</b>',
        style: {
          fontSize: 19
        },
        align: 'center'
      },
      xAxis: {
        categories: properties,
        title: {
          text: key,
          enabled: false
        },
        labels: {
          formatter: function() {
            return moment(this.value).format('MM-DD-YYYY');
          }
        },
        tickPositioner: function() {
          return [this.dataMin, this.dataMax];
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
        formatter: function () {
          return numeral(this.y).format('0,0') + ' ' + this.series.name + ' on ' + moment(this.x).format('MM-DD-YYYY');
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
   * Prints a Highcharts Heatmap
   * ref https://www.highcharts.com/demo/heatmap
   */
  printAsHeatmap: function(data, chartId) {
    let chart = Highcharts.chart({
      chart: {
        renderTo: chartId,
        type: 'heatmap'
      },
      title: {
        text: '<b>Incidents by Day & Hour</b>',
        style: {
          fontSize: 19
        },
        align: 'center'
      },
      yAxis: {
        categories: ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'],
        reversed: true,
        title: null
      },
      xAxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: '#279989'
      },
      legend: {
        // align: 'bottom',
        // layout: 'horizontal',
        enabled: false
      },
      tooltip: {
        // formatter: function() {
        //   return 'Sample text';
        // },
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Incidents',
        data: data,
        dataLabels: {
          enabled: true,
          color: '#000000'
        }
      }]
    });

    return chart;
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
    console.log(humanFilter)
    let filtered_view = document.getElementById(divId);
    let html = `
      <h4 class="sidebar-title">
      Currently showing:
      <span class="point-details-close"><img src="./img/close.svg"></span>
      </h4>
      <b>${numeral(features.length).format(0,0)} incidents</b> from <b>${humanFilter.date_range[0]}</b> to <b>${humanFilter.date_range[1]}</b>
      <ul>
    `
    if (humanFilter.categories.length > 0) {
      html += `<li>Categories: <b>${humanFilter.categories.join(", ")}</b></li>`
    }
    if (humanFilter.weekdays.length > 0) {
      html += `<li>Days of Week: <b>${humanFilter.weekdays.join(", ")}</b></li>`
    }
    if (humanFilter.dayparts.length > 0) {
      html += `<li>Times of Day: <b>${humanFilter.dayparts.join(", ")}</b></li>`
    }
    filtered_view.innerHTML = html
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
  printPointDetails: function (features, divId) {
    let detail = document.getElementById(divId);

    let display_cols = {
      "Report #": features[0].properties.report_number,
      "Arrest Category": Helpers.toSentenceCase(features[0].properties.offense_category),
      "Charge Description": Helpers.toSentenceCase(features[0].properties.charge_description),
      "Timestamp": moment(features[0].properties.incident_timestamp).format("dddd, MMMM Do YYYY, h:mm a"),
      "Address": features[0].properties.address,
      "Neighborhood": `${features[0].properties.neighborhood} (District ${features[0].properties.council_district}, Precinct ${features[0].properties.precinct})`
    };

    detail.innerHTML = `
    <h4 class="sidebar-title">
      Incident details
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

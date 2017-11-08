var mapboxgl = require('mapbox-gl');
var MapboxDraw = require('@mapbox/mapbox-gl-draw');
var StaticMode = require('@mapbox/mapbox-gl-draw-static-mode');
var turf = require('@turf/turf');
var moment = require('moment');
var _ = require('lodash');
import chroma from 'chroma-js';

global.jQuery = require('jquery');
require('jq-accordion');
require('jquery.scrollbar');

import Helpers from './helpers.js';
import Socrata from './socrata.js';
import Stats from './stats.js';
import Filter from './filter.js';
import Locate from './locate.js';
import Boundary from './boundary.js';
import Data from './data.js';
import Init from './init.js';
import Print from './print.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjajZ6YngxeTUwbTU4Mndxa2lydzE0MmlkIn0.tccRHH0Pt2yjRz16ioQH7g';

// check that fetch and Object.entries() are supported
if (!window.hasOwnProperty('fetch') || !Object.hasOwnProperty('entries')) {
  alert("Your browser does not support modern Javascript features required to build this tool. For the best experience, we recommend using the newest version of Chrome or Firefox.");
}

// if your browser supports mapboxgl, then define the map
if (!mapboxgl.supported()) {
  alert('Your browser does not support Mapbox GL, a Javascript library required to build this mapping tool. Please update your browser.');
} else {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/cityofdetroit/cj9fqy8y48aq02smdgong5vc0',
    center: [-83.131, 42.350],
    zoom: 10.75,
    preserveDrawingBuffer: true
  });
}

var modes = MapboxDraw.modes;
modes.static = StaticMode;

var Draw = new MapboxDraw({ modes: modes });
let drawOptions = {
  displayControlsDefault: false,
  modes: modes
}

var Draw = new MapboxDraw(drawOptions);
map.addControl(Draw)

let currentBoundary = 'council_district'
let data = null;
let ogData = null;
let filteredData = null;
let filterObject = {
  // offense code
  'offense_category': [],
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

// load the map
map.on('load', function () {

  // add zoom + geolocate controls
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.GeolocateControl());

  // disable map rotation using right click + drag and touch rotation gesture
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();

  // get the data
  Socrata.getLatestDate().then(response => {
    const ds = "9i6z-cm98"
    let params = {
      "$limit": 100000,
      "$select": "crime_id,location,address,block_id,zip_code,council_district,neighborhood,precinct,offense_category,charge_description,report_number,incident_timestamp,day_of_week,hour_of_day"
    };
    params["$where"] = `incident_timestamp >= '${Helpers.xDaysAgo(7, response[0].incident_timestamp)}'`
    let url = Socrata.makeUrl(ds, params);

    Socrata.fetchData(url).then(theData => {
      ogData = theData
      data = theData

      // calculate some summary stats
      let totalIncidents = Stats.countFeatures(data.features);
      let incidentsByCategory = Stats.countByKey(data.features, 'properties.offense_category');

      // group timestamps by full day, add new json property
      for (let i = 0; i < data.features.length; i++) {
        data.features[i].properties.day = moment(data.features[i].properties.incident_timestamp).format('YYYY-MM-DD');
      }

      let incidentsByDay = Stats.countByKey(data.features, 'properties.day');

      // get the earliest and latest incident dates
      let uniqueTimestamps = [...new Set(data['features'].map(item => item.properties['incident_timestamp']))];
      let minTime = _.min(uniqueTimestamps);
      let maxTime = _.max(uniqueTimestamps);
      jQuery('#from_date').val(minTime.slice(0, 10))
      jQuery('#to_date').val(maxTime.slice(0, 10))

      // count incidents currently viewing
      Stats.printFilteredView(data.features, Filter.readInput(filterObject)[1], 'readable_filter_text')

      // draw initial heatmap
      let incidentsByDayHour = Stats.makeDayHourCoords(data.features);
      Stats.printAsHeatmap(incidentsByDayHour, 'heatmap-container');

      // populate an initial chart and table in the Stats tab
      Stats.printAsHighchart(data.features, 'properties.council_district', 'chart-container');
      Stats.printAsLineChart(data.features, 'properties.day', 'line-chart-container');
      Stats.printAsTable(incidentsByCategory, 'tbody');

      // load the source data and point, highlight styles
      Init.initialLoad(map, data);

      // handle map events
      map.on('touchstart', function (e) {
        Helpers.queryMap(e, map)
      });

      map.on('mousedown', function (e) {
        Helpers.queryMap(e, map)
      });

      map.on('mouseenter', 'incidents_point', function (e) {
        map.getCanvas().style.cursor = 'crosshair'
      });

      map.on('mouseout', 'incidents_point', function (e) {
        map.getCanvas().style.cursor = ''
      });
      
      map.on('mouseenter', 'incidents_point_ezclick', function (e) {
        map.getCanvas().style.cursor = 'crosshair'
      });

      map.on('mouseout', 'incidents_point_ezclick', function (e) {
        map.getCanvas().style.cursor = ''
      });

      // locate an address and draw a radius around it
      document.getElementById('locate').addEventListener('keypress', e => {
        if (e.key == 'Enter') {
          Locate.geocodeAddress(e.target.value).then(result => {
            filterObject.block_id = []
            Draw.deleteAll();            
            let coords = result['candidates'][0]['location']
            Locate.makeRadiusPolygon(coords, 1500, Draw)
            Locate.getCensusBlocks(Draw.getAll()).then(blocks => {
              blocks.features.forEach(b => {
                filterObject.block_id.push(b.properties['geoid10'])
              });
              Draw.deleteAll()
              filteredData = Filter.updateData(map, Draw, data, filterObject, currentBoundary);
              let unioned = turf.dissolve(blocks)
              unioned.features.forEach(f => {
                Draw.add(f)
              });

              map.fitBounds(turf.bbox(unioned), { padding: 50 })
            });

            Locate.addMarker(map, coords)
          })
        }
      });
      
      map.on('draw.create', function (e) {
        filterObject.block_id = []
        filterObject = Filter.readInput(filterObject)[0]
        Locate.getCensusBlocks(Draw.getAll()).then(blocks => {
          blocks.features.forEach(b => {
            filterObject.block_id.push(b.properties['geoid10'])
          })

          filteredData = Filter.updateData(map, Draw, data, filterObject, currentBoundary)
          Draw.deleteAll()

          let unioned = turf.dissolve(blocks)
          unioned.features.forEach(f => {
            Draw.add(f)
          })

          map.fitBounds(turf.bbox(unioned), { padding: 50 })
          map.setPaintProperty('incidents_point', 'circle-opacity', { 'stops': [[9, 0.75], [19, 1]] })
          map.setPaintProperty('incidents_point', 'circle-stroke-opacity', { 'stops': [[9, 0.2], [19, 1]] })
        })

        jQuery('#area-custom').prop('checked', false);        
      });

      map.on('moveend', function (e) {
        if (jQuery('#area-accordion').hasClass('open')) {
          let coords = map.getCenter()
          Locate.identifyBounds({ x: coords['lng'], y: coords['lat'] }).then(response => {
            console.log(response)
          })
        }
      })

      jQuery("input[name!='currentArea']").change(function() {
        filterObject = Filter.readInput(filterObject)[0]
        filteredData = Filter.updateData(map, Draw, data, filterObject, currentBoundary)
      })

      jQuery("input[type=date]").change(function() {
        let fromDt = jQuery('#from_date')[0].value
        let toDt = jQuery('#to_date')[0].value + 'T23:59:59.000'
        let params = {
          "$limit": 100000,
          "$select": "crime_id,location,address,block_id,zip_code,council_district,neighborhood,precinct,offense_category,charge_description,report_number,incident_timestamp,day_of_week,hour_of_day"
        };

        params["$where"] = `incident_timestamp >= '${fromDt}' and incident_timestamp <= '${toDt}'`
        let url = Socrata.makeUrl("9i6z-cm98", params);

        Socrata.fetchData(url).then(d => {
          data = d
          
          let tempFilterObject = filterObject
          tempFilterObject.block_id = filterObject.block_id
          tempFilterObject.neighborhood = filterObject.neighborhood
          tempFilterObject.precinct = filterObject.precinct
          tempFilterObject.zips = filterObject.zips
          tempFilterObject.council_district = filterObject.council_district

          filterObject = Filter.readInput(filterObject)[0]

          filterObject.block_id = tempFilterObject.block_id || []
          filterObject.neighborhood = tempFilterObject.neighborhood || []
          filterObject.precinct = tempFilterObject.precinct || []
          filterObject.zips = tempFilterObject.zips || []
          filterObject.council_district = tempFilterObject.council_district || []

          filteredData = Filter.updateData(map, Draw, data, filterObject, currentBoundary)
        })
      })
    })
  })

    .catch(e => console.log("Booo", e));
});

jQuery(document).ready(function() {
  // Populate sidebar
  Init.populateSidebar()

  //responsively adjust height of tab content
  var currentHeight = jQuery('#menu').height() - jQuery('.logo').height() - jQuery('.search').height() - jQuery('.tab-links').height();

  //initiate scrollbar
  jQuery('.scrollbar-macosx').scrollbar();
  jQuery('.scroll-wrapper.tab-content').height(currentHeight - 10);

  jQuery(window).resize(function() {
    currentHeight = jQuery('#menu').height() - jQuery('.logo').height() - jQuery('.search').height() - jQuery('.tab-links').height();
    jQuery('.scroll-wrapper.tab-content').height(currentHeight - 10);
  });

  //close disclaimer box
  jQuery('.disclaimer-close img').click(function() {
    jQuery('.disclaimer').fadeOut();
  });

  // hide about on x click
  function activateClose(){ 
      jQuery('.about-close img, #content-overlay').click(function() {
      jQuery('#content-overlay').fadeOut();
      let ctrls = document.querySelectorAll(".mapboxgl-ctrl-icon")
      ctrls.forEach(e => {
        e.style.display = 'block'
      })
    });
    jQuery('#content-overlay').fadeIn();
  }

  // hide sharable URL on x click
  jQuery('.share-close img').click(function() {
    jQuery('#share-url').hide();
  });

  // toggle between chart and table on button clicks
  jQuery('#show-charts').click(function() {
    jQuery('#table-container').hide();
    jQuery('#chart-container').show();
    jQuery('#line-chart-container').show();
    jQuery('#heatmap-container').show();
    jQuery('#show-table').show();
    jQuery(this).hide();
  });

  jQuery('#show-table').click(function() {
    jQuery('#table-container').show();
    jQuery('#chart-container').hide();
    jQuery('#line-chart-container').hide();
    jQuery('#heatmap-container').hide();
    jQuery('#show-charts').show();
    jQuery(this).hide();
  });

  // swap map boundary and chart axis based on selected area
  jQuery('input[type=radio][name=currentArea]').change(function(e) {
    filterObject.neighborhood = []
    filterObject.council_district = []
    filterObject.precinct = []
    filterObject.block_id = []
    filterObject.zip_code = []

    if (map.isSourceLoaded('marker')) {
      map.removeSource('marker')
      map.removeLayer('marker')
    }

    if (this.value == 'pick') {
      map.setPaintProperty('boundary_fill', 'fill-color', 'rgba(190,130,230,0.25)')
      map.setLayoutProperty('incidents_point', 'visibility', 'none')
      map.jumpTo({ center: [-83.131, 42.350], zoom: 10.75 })
      map.setLayoutProperty(`${currentBoundary}_labels`, 'visibility', 'visible')
      hidePanel();
      // add click listener on boundary fill layer
      map.once('click', function (e) {
        let clicked = map.queryRenderedFeatures(e.point, {'layers': ['boundary_fill']})
        Draw.add(clicked[0])
        Draw.changeMode('static')
        switch (currentBoundary) {
          case 'council_district':
            filterObject.council_district.push(clicked[0].properties.number.toString())
            break;
          case 'precinct':
            filterObject.precinct.push(clicked[0].properties.name)
            break;
          case 'zip_code':
            filterObject.zip_code.push(clicked[0].properties.zipcode)
            break;
          case 'neighborhood':
            filterObject.neighborhood.push(clicked[0].properties.name)
            break;
        }

        map.setPaintProperty('boundary_fill', 'fill-color', 'rgba(150,230,230,0)')

        filteredData = Filter.updateData(map, Draw, data, filterObject, currentBoundary)
        jQuery('#area-pick').prop('checked', false);        
        jQuery(`#area-${currentBoundary.replace('_', '-')}`).prop('checked', true);
        map.setLayoutProperty('incidents_point', 'visibility', 'visible')
        map.setLayoutProperty(`${currentBoundary}_labels`, 'visibility', 'none')
      })
    }

    if (this.value == 'custom') {
      Filter.newDrawnPolygon(Draw, map);
      hidePanel();
    } else {
      Draw.deleteAll();
      filterObject.block_id = []
      filteredData = Filter.updateData(map, Draw, data, filterObject, this.value)
      currentBoundary = Boundary.changeBoundary(map, Boundary.boundaries[this.value]) 
    }
  });

  jQuery(".meta-button").click(function(){
    if (this.id == 'print-button') {
      Print.printView(map, filteredData || data, Filter.readInput(filterObject)[1])
    }

    if (this.id == 'about-button') {
      jQuery('#content-box').html('<span class="about-close"><img src="./img/close.svg"></span>'+
        '<h2 id="about-header">About</h2>'+
        '<h3>Welcome to the City of Detroit&#x2019;s Crime Viewer</h3>'+
        '<p>The <a target="_blank" href="http://www.detroitmi.gov/police">City of Detroit&#x2019;s Police Department (DPD)</a> and Department of Innovation and Technology (DoIT) are building a tool for residents to visualize crime data. By putting information in the hands of residents, we hope to work together to promote a safer community.</p>'+
        '<h3>Where does the data come from?</h3>'+
        '<p>The incident data that power this tool are provided by the Detroit Police Department (DPD) and made publicly available on the <a target="_blank" href="https://data.detroitmi.gov/">City of Detroit&#x2019;s open data portal</a>. Find the data and methodology description at <a target="_blank" href="https://data.detroitmi.gov/Public-Safety/DPD-All-Crime-Incidents-December-6-2016-Present/6gdg-y3kf">DPD: All Crime Incidents, December 6, 2016 - Present</a>.</p>'+
        '<h3>How often is the dataset updated?</h3>'+
        '<p>The dataset only reflects incidents that have been submitted to the <a target="_blank" href="http://www.micrstats.state.mi.us/MICR/Home.aspx">Michigan Incident Crime Reporting</a> tool (the date of submission is reflected in the "IBR Date" field on open data). The incident data represented here are preliminary in nature and subject to change. <b>In particular</b>, this means that crime will be underrepresented for very recent days (since the incidents have not yet been reported).</p>'+
        '<h3>How are the data anonymized?</h3>'+
        '<p>The addresses and datapoints which appear in this tool are anonymized; instead of a specific street address, data points get assigned to a specific block. We do this by randomly selecting a new point that is 1) within a certain distance of the original crime and 2) a certain distance of the associated street segment. It does <b>not</b> accurately represent where the incident happened.</p>'+
        '<h3>Why do I see a jagged border after I draw a custom area or search for an address?</h3>'+
        '<p>Before incident addresses are anonymized as described above, we stamp each original location with its respective neighborhood, council district and Census Block (learn more about Census Blocks <a href="https://www.census.gov/geo/reference/gtc/gtc_block.html" target="_blank">here</a>). After the anonymization process, the Census Block is the smallest geographic unit we can accurately rely on for aggregated reporting. Therefore, when you filter the map by Location and choose to "Draw a Custom Area" or "Search within a mile radius of an Address/Intersection", we automatically adjust your area to fit to the Census Blocks contained within it.<p>'+
        '<h3>Who can I contact to learn more about the data?</h3 >'+
        '<p>Should you have questions about the data, you may contact the Commanding Officer of the Detroit Police Department&#x2019;s Crime Intelligence Unit at 313-596-2250 or <a href="mailto:CrimeIntelligenceBureau@detroitmi.gov">CrimeIntelligenceBureau@detroitmi.gov</a>.</p>'+
        '<h3>How can I share feedback?</h3>'+
        '<p>Please share your ideas, suggestions, and any bugs you experience while using this tool through <a href="https://app.smartsheet.com/b/form/4b5e8883ad654704b7d04d1f9c747896" target="_blank">this web form</a>. Your response will be received by our project team.');
      activateClose();
      let ctrls = document.querySelectorAll(".mapboxgl-ctrl-icon")
      ctrls.forEach(e => {
        e.style.display = 'none'
      })
    }

    if (this.id == 'help-button') {
      jQuery('#content-box').html('<span class="about-close"><img src="./img/close.svg"></span>'+
        '<h2 id="about-header">User Guide</h2>' +
        '<img style="width:10%;float:right;" src="./img/green.png"></img></p>' +
        '<p>Confused about where to start or how to filter down to just the crime stats you need?</p>' +
        '<p>These are frequently asked questions to help you navigate the Crime Viewer&#x2019;s user interface and key functions.</p>' + 
        
        '<h3>What am I looking at?</h3>' +
        '<p>The Crime Viewer has three main components:</p>' +
        '<ol><li>Map of crime incidents, whose specific locations are masked according to the <b>Disclaimer</b> in the bottom right</li><li>Sidebar that summarizes the points on the map through tables and charts</li><li>Buttons across the top to filter the data, print a report, or learn more about the tool</li></ol>' +
        '<p><b>Currently showing</b> in sidebar summarizes the total number of points loaded on the map at any given time, the date range, and any selected filters.</p>' +
        '<p>Points on the map are color-coded by arrest charge, and the <b>Incidents by Crime Type</b> table acts as a legend.</p>' +

        '<h3>What data are shown by default?</h3>' +
        '<p>The initial map shows the 7 most recent days of crime incidents and Council District boundaries for reference. All crime types, all days of week, and all times of day are shown by default. The number of the incidents for the most recent day is lower than previous days because a full days worth of incidents have not yet been reported.</p>' +

        '<h3>How do I move the map?</h3>' +
        '<p>Use the navigation controls in the top right:<p>' +
        '<ul><li><b>+</b>/<b>-</b> or <b>scroll</b> to zoom</li><li><img style="width:2%;" src="./img/mapboxgl-ctrl-geolocate.svg"></img> to go to your current location</li><li><b>Click + hold</b> to drag the center postion of the map</li></ul>' +

        '<h3>How do I learn more about a specific incident?</h3>' +
        '<p>When you click on a point, it will have a red halo and <b>Incident details</b> about that point will appear in the sidebar.</p>' +
        '<p style="text-align:center;"><img style="width:90%;" src="./img/screenshots/point.png"></img></p>' +

        '<h3>What criteria can I filter the data on?</h3>' +
        '<p>You can filter crime incidents by:</p>' +
        '<ul><li><b>Crime Types</b> to pick specific arrest charge categories, grouped by Property, Violent, and Other crimes</li>' +
        '<li><b>Date/Time</b> to change the date range, select days of the week and times of the day</li>' +
        '<li><b>Location</b> to display a different reference boundary, select a specific place based on that boundary, search within a 1 mile radius of an address, or draw a custom boundary</li></ul>' +
        '<p>Your filter selections will control both the points loaded on the map and the summary statistics shown in the sidebar.</p>' +
        '<p>Use the <b>Reset</b> button to clear your current filter selections and go back to the default.</p>' +

        '<h3>How do I find crime patterns for certain days or times?</h3>' +
        '<p>Expand <b>Date/Time</b><img src="./img/down.png"></img>. Pick Day of Week and Time of Day.</p>' +
        '<p>Notice that your choices effect both the points displayed on the map and the time-based charts in the sidebar.</p>' +
        '<p style="text-align:center;"><img style="width:90%;" src="./img/screenshots/time-filter.png"></img></p>' +

        '<h3>How far back in time can I look at incidents using this tool?</h3>' +
        '<p>This tool includes data from December 6, 2016 to present. For the best user experience, we recommend looking at about a months worth of incidents at a time. Loading many data points at once will slow down the application.</p>' +
        '<p>If you want to do analysis over a long period of time, you may prefer to work directly with the raw data. Find it on our Open Data Portal at <a target="_blank" href="https://data.detroitmi.gov/Public-Safety/DPD-All-Crime-Incidents-December-6-2016-Present/6gdg-y3kf">DPD: All Crime Incidents, December 6, 2016 - Present</a></p>' +
        '<p style="text-align:center;"><img style="width:90%;" src="./img/screenshots/date-picker.png"></img></p>' +

        '<h3>How do I find incidents in my neighborhood?</h3>' +
        '<p>Expand <b>Location</b><img src="./img/down.png"></img>. Change <b>Current boundary</b> to Neighborhoods and then <b>Pick from map</b>.</p>' +
        '<p style="text-align:center;"><img style="width:90%;" src="./img/screenshots/neighborhoods.png"></img></p>' +

        '<h3>How do I find incidents near where I live?</h3>' +
        '<p>Expand <b>Location</b><img src="./img/down.png"></img>. Under <b>Search for an address/intersection</b>, enter an address in the City of Detroit like the examples.</p>' +
        '<p>A grey circle marks your matched address and a 1-mile radius is drawn around it. The border of the radius is not a perfect circle, but rather auto-adjusted to the shape of the Census Blocks contained within it, because the Census Block is the smallest geography that preserves the pre-anonymized incident location.</p>' +
        '<p style="text-align:center;"><img style="width:90%;" src="./img/screenshots/address.png"></img></p>' +

        '<h3>How do I draw a custom area?</h3>' +
        '<p>We offer the option to draw your own custom area if you are looking for crime incidents in a place that does not otherwise align with popular City boundaries, like Neighborhoods or Council Districts.</p>' +
        '<p>Follow these steps:</p>' +
        '<ol><li>Expand <b>Location</b><img src="./img/down.png"></img></li>' +
        '<li>Select <b>Custom</b> Draw area</li>' +
        '<li>Click once to create your first corner</li>' +
        '<li>Drag the orange dotted line to make a border, click once to create another corner, and repeat</li>' +
        '<li>Double-click to close your area</li></ol>' +
        '<p style="text-align:center;"><img style="height:350px;margin-right:20px;" src="./img/screenshots/dyo1.png"></img><img style="height:350px;" src="./img/screenshots/dyo2.png"></img></p>' +
        '<p>Once you close your custom shape, it will auto-adjust to the shape of the Census Blocks contained within it, because the Census Block is the smallest geography that preserves the pre-anonymized incident location.</p>' +
        '<p style="text-align:center;"><img style="width:90%;" src="./img/screenshots/dyo3.png"></img></p>');
      activateClose();
      let ctrls = document.querySelectorAll(".mapboxgl-ctrl-icon")
      ctrls.forEach(e => {
        e.style.display = 'none'
      })
    }

    if (this.id == 'share-button') {
      jQuery('#share-url').show();
    }

    if(this.id == 'reset-button') {
      Filter.resetEverything(map, Draw, ogData)
      filterObject = {
        // offense code
        'offense_category': [],
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

      filteredData = Filter.updateData(map, Draw, ogData, filterObject, currentBoundary)
    }
  })

  function hidePanel() {
    jQuery('#map-overlay').fadeOut();
    jQuery('#primary-panel').slideUp(400, function() {
      jQuery('#primary-panel .filters').css('display', 'none');
      jQuery('#primary-nav').removeClass('panel-show').addClass('drop-shadow');
    }).removeClass('drop-shadow');
    jQuery('#filters-menu label').removeClass('active');
    jQuery('.rotate').removeClass('rotate');
  }

  jQuery("input.dropdown-button").click(function() {
    var panelID = jQuery(this).attr('data-panel');
    var trimmedLabel = panelID.substring(1);
    jQuery('#filters-menu label').removeClass('active');
    jQuery('label[for=' + trimmedLabel + '-dropdown-button').addClass('active');
    //if panel is already shown
    if(jQuery('#primary-nav').hasClass('panel-show')){
      //if button clicked is already shown
      if(jQuery(panelID).is(":visible")){
        hidePanel();
      }
      //if panel is already down, but button clicked is not yet shown
      else {
        jQuery('.rotate').removeClass('rotate');
        jQuery(panelID+'-arrow img').addClass('rotate');
        jQuery('#primary-panel').slideUp(400, function() {
          jQuery('#primary-panel .filters').css('display', 'none');
          jQuery('#primary-nav').removeClass('panel-show').addClass('drop-shadow');
          jQuery('#primary-panel').slideDown(600, function(){
          jQuery('#primary-nav').addClass('panel-show');
            jQuery(panelID).css('display', 'inline-block');
            jQuery(this).addClass('drop-shadow');
          });
        }).removeClass('drop-shadow');   
      }
    }

    //if panel is not shown
    else {
      jQuery(panelID).css('display', 'inline-block');
      jQuery('.rotate').removeClass('rotate');
      jQuery(panelID+'-arrow img').addClass('rotate');
      jQuery('#primary-nav').removeClass('drop-shadow').addClass('panel-show');
      jQuery('#primary-panel').slideDown(400, function(){
        jQuery(this).addClass('drop-shadow');
      });
      jQuery('#map-overlay').fadeIn();
    }
  });

  jQuery('#map-overlay').click(function() {
    hidePanel();
  });
});

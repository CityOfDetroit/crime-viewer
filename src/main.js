var mapboxgl = require('mapbox-gl');
var MapboxDraw = require('@mapbox/mapbox-gl-draw');
var StaticMode = require('@mapbox/mapbox-gl-draw-static-mode');
var turf = require('@turf/turf');
var moment = require('moment');
var _ = require('lodash');
var Slideout = require('slideout');

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

// define the map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/cityofdetroit/cj6zbpw6n2gxq2ro5hfc3n1ip',
  center: [-83.131, 42.350],
  zoom: 10.75,
  preserveDrawingBuffer: true
});

var modes = MapboxDraw.modes;
modes.static = StaticMode;
var Draw = new MapboxDraw({ modes: modes });

let drawOptions = {
  displayControlsDefault: false,
  modes: modes
}

var Draw = new MapboxDraw(drawOptions);

map.addControl(Draw)

let currentBoundary = 'council_districts'
let data = null;
let filteredData = null;
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
      "$limit": 50000,
      "$select": "crime_id,location,address,block_id,zip_code,council_district,neighborhood,precinct,state_offense_code,offense_category,offense_description,report_number,incident_timestamp,day_of_week,hour_of_day"
    };
    params["$where"] = `incident_timestamp >= '${Helpers.xDaysAgo(28, response[0].incident_timestamp)}'`
    let url = Socrata.makeUrl(ds, params);

    Socrata.fetchData(url).then(theData => {
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
      console.log(minTime, maxTime)

      // count incidents currently viewing
      console.log(Filter.readInput()[1])
      Stats.printFilteredView(data.features, Filter.readInput()[1], 'readable_filter_text')

      // populate an initial chart and table in the Stats tab
      Stats.printAsHighchart(data.features, 'properties.council_district', 'chart-container');
      Stats.printAsLineChart(data.features, 'properties.day', 'line-chart-container');
      Stats.printAsTable(incidentsByCategory, 'tbody');

      // load the source data and point, highlight styles
      Init.initialLoad(map, data);

      map.on('mousedown', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['incidents_point']
        });
        if (features.length > 0) {
          map.setFilter("incidents_highlighted", ['==', 'crime_id', features[0].properties.crime_id]);
          Stats.printPointDetails(features, 'point_details');
        }
      });

      map.on('mouseenter', 'incidents_point', function (e) {
        map.getCanvas().style.cursor = 'crosshair'
      });

      map.on('mouseout', 'incidents_point', function (e) {
        map.getCanvas().style.cursor = ''
      });

      // locate an address and draw a radius around it
      document.getElementById('locate').addEventListener('keypress', e => {
        if (e.key == 'Enter') {
          Locate.geocodeAddress(e.target.value).then(result => {
            let coords = result['candidates'][0]['location']
            Locate.makeRadiusPolygon(coords, 1500, Draw)
            Locate.getCensusBlocks(Draw.getAll()).then(blocks => {
              blocks.features.forEach(b => {
                filterObject.block_id.push(b.properties['geoid10'])
              });

              Draw.deleteAll();
              filteredData = Filter.updateData(map, Draw, data, filterObject, currentBoundary);

              // Draw.deleteAll()
              let unioned = turf.dissolve(blocks)
              unioned.features.forEach(f => {
                Draw.add(f)
              });

              map.fitBounds(turf.bbox(unioned), { padding: 50 })
            });

            // show a marker at the matched address
            var el = document.createElement('div');
            el.className = 'marker';
            
            new mapboxgl.Marker(el, { offset: [-50 / 2, -50 / 2] })
            .setLngLat([coords.x, coords.y])
            .addTo(map);
          })
        }
      });
      

      map.on('draw.create', function (e) {
        filterObject = Filter.readInput()[0]
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
          console.log(filterObject)
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

      jQuery("input[name!='currentArea']").change(function () {
        if(filterObject.block_id.length > 0) {
          let blocks = filterObject.block_id
          filterObject = Filter.readInput()[0]
          filterObject.block_id = blocks
        }
        else {
          filterObject = Filter.readInput()[0]
        }
        console.log(currentBoundary)
        filteredData = Filter.updateData(map, Draw, data, filterObject, currentBoundary)
      })

      jQuery("input[type=date]").change(function(){
        let fromDt = jQuery('#from_date')[0].value
        let toDt = jQuery('#to_date')[0].value
        let params = {
          "$limit": 50000,
          "$select": "crime_id,location,address,zip_code,block_id,council_district,neighborhood,precinct,state_offense_code,offense_category,offense_description,report_number,incident_timestamp,day_of_week,hour_of_day"
        };
        params["$where"] = `incident_timestamp >= '${fromDt}' and incident_timestamp <= '${toDt}'`
        let url = Socrata.makeUrl("9i6z-cm98", params);
        Socrata.fetchData(url).then(d => {
          data = d
          // Stats.printLoadedView(fromDt, toDt, data)
          if(filterObject && filterObject.block_id.length > 0) {
            let blocks = filterObject.block_id
            filterObject = Filter.readInput()[0]
            filterObject.block_id = blocks
          }
          else {
            filterObject = Filter.readInput()[0]
          }
          console.log(currentBoundary)
          filteredData = Filter.updateData(map, Draw, data, filterObject, currentBoundary)
        })

      })
    })
  })
    .catch(e => console.log("Booo", e));
});

jQuery(document).ready(function () {

  // Populate sidebar
  Init.populateSidebar()

  //responsively adjust height of tab content
  var currentHeight = jQuery('#menu').height() - jQuery('.logo').height() - jQuery('.search').height() - jQuery('.tab-links').height();

  //initiate scrollbar
  jQuery('.scrollbar-macosx').scrollbar();
  jQuery('.scroll-wrapper.tab-content').height(currentHeight - 10);
  jQuery(window).resize(function () {
    currentHeight = jQuery('#menu').height() - jQuery('.logo').height() - jQuery('.search').height() - jQuery('.tab-links').height();
    jQuery('.scroll-wrapper.tab-content').height(currentHeight - 10);
  });

  //close disclaimer box
  jQuery('.disclaimer-close img').click(function() {
    jQuery('.disclaimer').fadeOut();
  });

  // show about on button click
  jQuery('#about').on("click", function(e) {
    jQuery('#about-content').show();
  });

  // hide about on x click
  jQuery('.about-close img').click(function() {
    jQuery('#about-content').hide();
  });

  // toggle between chart and table on button clicks
  jQuery('#show-charts').click(function() {
    jQuery('#table-container').hide();
    jQuery('#chart-container').show();
    jQuery('#line-chart-container').show();
  });

  jQuery('#show-table').click(function() {
    jQuery('#table-container').show();
    jQuery('#chart-container').hide();
  });

  // todo: remove point details on x click
  jQuery('.point-details-close img').click(function() {
    jQuery('#point_details').remove();
  });


  function hidePanel() {
    jQuery('#primary-panel').slideUp(400, function() {
      jQuery('#primary-panel .filters').css('display', 'none');
      jQuery('#primary-nav').removeClass('panel-show').addClass('drop-shadow');
    }).removeClass('drop-shadow');
    jQuery('.rotate').removeClass('rotate');
    jQuery('#map-overlay').fadeOut();
  }

  // swap map boundary and chart axis based on selected area
  jQuery('input[type=radio][name=currentArea]').change(function(e) {
    if (this.value == 'custom') {
      console.log(e)      
      Filter.newDrawnPolygon(Draw, map);
      hidePanel();
    }
    else {
      Draw.deleteAll();
      filterObject.block_id = []
      filteredData = Filter.updateData(map, Draw, data, filterObject, this.value)
      currentBoundary = Boundary.changeBoundary(map, Boundary.boundaries[this.value])     
    }
    // Filter.updateData(map, Draw, data, Filter.readInput()[0])
  });


  jQuery(".meta-button").click(function(){
    if(this.id == 'print-button') {
      Print.printView(map, filteredData || data, Filter.readInput()[1])
    }
    if(this.id == 'about-button') {
      jQuery('#about-content').show();
    }
    if(this.id == 'reset-button') {
      Filter.resetEverything(map, Draw, data)
      filterObject = {
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
      filteredData = Filter.updateData(map, Draw, data, filterObject, currentBoundary)
    }
  })



  jQuery(".dropdown-button").click(function() {
    console.log(this)
    var panelID = jQuery(this).attr('data-panel');
    if(jQuery('#primary-nav').hasClass('panel-show')){
      if(jQuery(panelID).is(":visible")){
        hidePanel();
      }
      else{
        jQuery('#primary-panel .filters').fadeOut();
        jQuery('.rotate').removeClass('rotate');
        jQuery(panelID+'-arrow img').addClass('rotate');
        jQuery(panelID).fadeIn().css('display', 'inline-block');
      }
    }
    else{
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

  /*initiate slideout
  var slideout = new Slideout({
    'panel': document.getElementById('map'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70
  });
  */
});
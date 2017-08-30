var mapboxgl = require('mapbox-gl');
var MapboxDraw = require('@mapbox/mapbox-gl-draw');
var StaticMode = require('@mapbox/mapbox-gl-draw-static-mode');
var turf = require('@turf/turf');
var moment = require('moment');
var _ = require('lodash');
var Slideout = require('slideout');
var FileSaver = require('filesaver.js');
var html2canvas = require('html2canvas');
var jsPDF = require('jspdf');

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
import Router from './router.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg';

// define the map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-83.131, 42.350],
  zoom: 10.75,
  preserveDrawingBuffer: true
});

// get current zoom level and center of map
var zoom = map.getZoom();
var center = map.getCenter();

// set initial URL params
var router = new Router();
router.updateURLParams({'zoom': zoom,'lng': center.lng,'lat': center.lat});

var currentRouting = router.loadURLRouting();
console.log(currentRouting);

var modes = MapboxDraw.modes;
modes.static = StaticMode;
var Draw = new MapboxDraw({ modes: modes });

let drawOptions = {
  displayControlsDefault: false,
  modes: modes
}

var Draw = new MapboxDraw(drawOptions);

map.addControl(Draw)

let data = null;
let filterObject = null;

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
      "$select": "crime_id,location,address,block_id,council_district,neighborhood,precinct,state_offense_code,offense_category,offense_description,report_number,incident_timestamp,day_of_week,hour_of_day"
    };
    params["$where"] = `incident_timestamp >= '${Helpers.xDaysAgo(28, response[0].incident_timestamp)}'`
    let url = Socrata.makeUrl(ds, params);

    Socrata.fetchData(url).then(theData => {
      data = theData

      // calculate some summary stats
      let totalIncidents = Stats.countFeatures(data.features);
      let incidentsByCategory = Stats.countByKey(data.features, 'properties.offense_category');

      // get the earliest and latest incident dates
      let uniqueTimestamps = [...new Set(data['features'].map(item => item.properties['incident_timestamp']))];
      let minTime = _.min(uniqueTimestamps);
      let maxTime = _.max(uniqueTimestamps);

      // count incidents currently viewing
      Stats.printLoadedView(minTime, maxTime, data);

      // populate an initial chart and table in the Stats tab
      // Stats.printAsHighchart(data.features, 'properties.council_district', 'chart-container');
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

        // update routing
        let zoom = map.getZoom()
        let center = map.getCenter()
        router.updateURLParams({'zoom': zoom,'lng': center.lng,'lat': center.lat});
        var currentRouting = router.loadURLRouting();
      });

      // printing
      document.onkeypress = function (e) {
        if (e.keyCode == 96) {

          let pdf = new jsPDF({
            orientation: 'l',
            unit: 'px',
            format: [612, 792]
          })

          document.getElementById('map').style.width = '1500px';
          document.getElementById('map').style.height = '900px';
          map.resize()
          map.once('render', m => {
            pdf.addImage(map.getCanvas().toDataURL('image/png'), 'png', 10, 10, 500, 300, null, 'FAST');
            pdf.save('map.pdf')            
            document.getElementById('map').style.width = '75%';
            document.getElementById('map').style.height = 'calc(100% - 90px)';
            map.resize()
          })

          


          
          // html2canvas(document.getElementById('point_details_tbl')).then(det => {
          //   let image = det.toDataURL('image/png')
          //   pdf.addImage(image, 'PNG', 20, 20);
          //   pdf.save('map.pdf');            
          // })


        }
      }

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
              Filter.updateData(map, Draw, data, filterObject);

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
          Filter.updateData(map, Draw, data, filterObject)
          Draw.deleteAll()
          let unioned = turf.dissolve(blocks)
          unioned.features.forEach(f => {
            Draw.add(f)
          })
          map.fitBounds(turf.bbox(unioned), { padding: 50 })
          map.setPaintProperty('incidents_point', 'circle-opacity', { 'stops': [[9, 0.75], [19, 1]] })
          map.setPaintProperty('incidents_point', 'circle-stroke-opacity', { 'stops': [[9, 0.2], [19, 1]] })
        })
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
        if(filterObject) {
          let blocks = filterObject.block_id
          filterObject = Filter.readInput()[0]
          filterObject.block_id = blocks
        }
        else {
          filterObject = Filter.readInput()[0]
        }
        Filter.updateData(map, Draw, data, filterObject)
      })

      jQuery("input[type=date]").change(function(){
        Filter.resetEverything(map, Draw, data)
        let fromDt = jQuery('#from_date')[0].value
        let toDt = jQuery('#to_date')[0].value
        let params = {
          "$limit": 50000,
          "$select": "crime_id,location,address,block_id,council_district,neighborhood,precinct,state_offense_code,offense_category,offense_description,report_number,incident_timestamp,day_of_week,hour_of_day"
        };
        params["$where"] = `incident_timestamp >= '${fromDt}' and incident_timestamp <= '${toDt}'`
        let url = Socrata.makeUrl("9i6z-cm98", params);
        Socrata.fetchData(url).then(d => {
          data = d
          Stats.printLoadedView(fromDt, toDt, data)
        })

      })

      // swap map boundary and chart axis based on selected area
      jQuery('input[type=radio][name=currentArea]').change(function () {
        if (this.value == 'custom') {
          Filter.newDrawnPolygon(Draw, map);
        }
        else {
          Draw.deleteAll();
          Boundary.changeBoundary(map, Boundary.boundaries[this.value])
          // Stats.printAsHighchart(data.features, `properties.${this.value}`, 'chart-container');
        }
        // Filter.updateData(map, Draw, data, Filter.readInput()[0])
      });


      // reset filters
      jQuery('#reset-filters').click(function () {
        jQuery('input:checkbox').removeAttr('checked');
        Filter.resetEverything(map, Draw, data)
      });

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

  function hidePanel(){
        jQuery('#primary-panel').slideUp().removeClass('drop-shadow');
        jQuery('#primary-nav').removeClass('panel-show').addClass('drop-shadow');
        jQuery('#map-overlay').fadeOut();
  }

  jQuery('#primary-nav input').click(function() {
    var panelID = jQuery(this).attr('data-panel');
    console.log(panelID);
    if(jQuery('#primary-nav').hasClass('panel-show')){
      if(jQuery(panelID).is(":visible")){
        hidePanel();
        jQuery(panelID).css('display', 'none');
      }
      else{
        jQuery('#primary-panel .filters').fadeOut();
        jQuery(panelID).fadeIn();
      }
    }
    else{
      jQuery(panelID).css('display', 'inline-block');
      jQuery('#primary-nav').removeClass('drop-shadow').addClass('panel-show');
      jQuery('#primary-panel').slideDown().addClass('drop-shadow');
      jQuery('#map-overlay').fadeIn();
    }
  });

  jQuery('#map-overlay').click(function(){
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
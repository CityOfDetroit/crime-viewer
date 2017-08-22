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

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg';

// define the map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [-83.131, 42.350],
  zoom: 10.75
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

// load the map
map.on('load', function () {

  console.log(Locate.identifyBounds([-83.0787163063023, 42.351453227480945]))

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
        "$select": "crime_id,location,address,council_district,neighborhood,precinct,state_offense_code,offense_category,offense_description,report_number,incident_timestamp,day_of_week,hour_of_day"
      };
      params["$where"] = `incident_timestamp >= '${Helpers.xDaysAgo(28, response[0].incident_timestamp)}'`
      let url = Socrata.makeUrl(ds, params);
      console.log(url)

      Socrata.fetchData(url).then(data => {
        console.log(data);

        // calculate some summary stats
        let totalIncidents = Stats.countFeatures(data.features);
        let incidentsByCategory = Stats.countByKey(data.features, 'properties.offense_category');

        // get the earliest and latest incident dates
        let uniqueTimestamps = [...new Set(data['features'].map(item => item.properties['incident_timestamp']))];
        let minTime = _.min(uniqueTimestamps);
        let maxTime = _.max(uniqueTimestamps);

        // count incidents currently viewing
        Stats.printLoadedView(data.features, minTime, maxTime, 'loaded_view');

        // populate an initial chart and table in the Stats tab
        Stats.printAsHighchart(data.features, 'properties.council_district', 'chart-container');
        Stats.printAsTable(incidentsByCategory, 'tbody');

        // load the source data and point, highlight styles
        Init.initialLoad(map, data);

        map.on('mousedown', function (e) {
          var features = map.queryRenderedFeatures(e.point, {
            layers: ['incidents_point']
          });
          if (features.length > 0) {
            console.log(features);
            map.setFilter("incidents_highlighted", ['==', 'crime_id', features[0].properties.crime_id]);
            Stats.printPointDetails(features, 'point_details');
          }
        });

        document.onkeyup = function(e) {
          console.log(e)
          if(e.keyCode == 192) {
            Draw.changeMode('static')
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
              console.log(Locate.identifyBounds(coords))

              Locate.panToLatLng(result, map)
              Locate.makeRadiusPolygon(coords, 1500, Draw)
           
              // show a marker at the matched address
              map.loadImage('../public/img/marker-15.svg', function(error, image) {
                if (error) throw error;
                map.addImage('marker-15', image);
                map.addLayer({
                  "id": "address_marker",
                  "type": "symbol",
                  "source": {
                    "type": "geojson",
                    "data": {
                      "type": "FeatureCollection",
                      "features": [{
                        "type": "Feature",
                        "geometry": {
                          "type": "Point",
                          "coordinates": [coords.x, coords.y]
                        }
                      }]
                    }
                  },
                  "layout": {
                    "icon-image": "marker-15",
                    "icon-size": 0.25
                  }
                });
              });

              Filter.updateData(map, Draw, data, Filter.readInput()[0])
            });

          }
        });

        map.on('draw.create', function (e) {
          Filter.updateData(map, Draw, data, Filter.readInput()[0])
          map.setPaintProperty('incidents_point', 'circle-opacity', {'stops': [[9, 0.75],[19, 1]]})
          map.setPaintProperty('incidents_point', 'circle-stroke-opacity', {'stops': [[9, 0.2],[19, 1]]})
        });

        map.on('moveend', function (e) {
          if (jQuery('#area-accordion').hasClass('open')) {
            let coords = map.getCenter()
            Locate.identifyBounds({x: coords['lng'], y: coords['lat']}).then(response => {
              console.log(response)
            })
          }
        })

        jQuery("input[name!='currentArea']").change(function () {
          console.log(this)
          Filter.updateData(map, Draw, data, Filter.readInput()[0])
        })
        
        // swap map boundary and chart axis based on selected area
        jQuery('input[type=radio][name=currentArea]').change(function () {
          if(this.value == 'custom') {
            Filter.newDrawnPolygon(Draw, map);
          }
          else {
            Draw.deleteAll();
            Boundary.changeBoundary(map, Boundary.boundaries[this.value])
            Stats.printAsHighchart(data.features, `properties.${this.value}`, 'chart-container');
          }
          Filter.updateData(map, Draw, data, Filter.readInput()[0])          
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
  jQuery('.disclaimer-close img').click(function () {
    jQuery('.disclaimer').fadeOut();
  });

  //reset filters
  jQuery('.filters').click(function(){
    //hide all visible dropdowns
    //jQuery('.dropdown-show').slideUp().removeClass('dropdown-show');
    if(jQuery(this).children('.filters-dropdown').hasClass('dropdown-show')){
      jQuery(this).children('.filters-dropdown').removeClass('dropdown-show').slideUp();
    }else{
      jQuery(this).children('.filters-dropdown').addClass('dropdown-show').slideDown();
    }
  });

  //reset filters
  jQuery('#reset-filters').click(function(){
    jQuery('input:checkbox').removeAttr('checked');
    console.log('clear all');
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
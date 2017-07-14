var mapboxgl = require('mapbox-gl');
var moment = require('moment');
var _ = require('lodash');
var Slideout = require('slideout');

global.jQuery = require('jquery');
require('jq-accordion');
require('jquery.scrollbar');

import Helpers from './helpers.js';
import Socrata from './socrata.js';
import Stats from './stats.js';
import Colors from './colors.js';
import Filter from './filter.js';
import Locate from './locate.js';
import Boundary from './boundary.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg';

// define the map
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-83.091, 42.350],
    zoom: 9
})

// Socrata details
const ds = "9i6z-cm98"
let params = {
  "$where": `incident_timestamp >= '${Helpers.xDaysAgo(21)}'`,
  "$limit": 50000
}

// make the URL
let url = Socrata.makeUrl(ds, params)

// load the map
map.on('load', function() {

  Socrata.fetchData(url).then(data => {
    console.log(data)

      // calculate some summary stats
      let totalIncidents = Stats.countFeatures(data.features);
      let incidentsByCategory = Stats.countByKey(data.features, 'properties.offense_category');
      let incidentsByCouncilDistrict = Stats.countByKey(data.features, 'properties.council_district');

      // populate a table in the Data tab  
      Stats.printAsTable(incidentsByCategory, 'tbody');
      
      // populate a bar chart in the Data tab
      Stats.printAsChart(incidentsByCouncilDistrict, '.ct-chart');

      // add the boundary
      Boundary.addBoundary(map, Boundary.boundaries[0]);

      // add the source
      map.addSource('incidents', {
        "type": "geojson",
        "data": data
      });

      // add a layer
      map.addLayer({
        "id": "incidents_point",
        "source": "incidents",
        "type": "circle",
        "layout": {
          "visibility": "visible"
        },
        "paint": {
          "circle-color": {
            property: 'state_offense_code',
            type: 'categorical',
            stops: Colors.crimeStops
          },
          "circle-radius": {
            'base': 1.25,
            'stops': [[8,2.5], [19,9]]
          },
          "circle-opacity": {
            'stops': [[9, 0.5], [19, 1]]
          },
          "circle-stroke-color": 'rgba(255,255,255,1)',
          "circle-stroke-opacity": {
            'stops': [[9, 0.25], [18, 0.75]]
          },
          "circle-stroke-width": {
            'stops': [[9,0.5], [19,3]]
          }
        }

      })

      map.on('mousedown', function (e) {
          var features = map.queryRenderedFeatures(e.point, {layers: ['incidents_point']});
          if(features.length > 0){
            console.log(features)
          }
      });

      map.on('mouseenter', 'incidents_point', function (e) {
          map.getCanvas().style.cursor = 'pointer'
      });

      map.on('mouseout', 'incidents_point', function (e) {
          map.getCanvas().style.cursor = ''
      });

      // quick filter refresh in lieu of actual button
      document.onkeypress = function (e) {
        if(e.keyCode == 96){
          let filter = Filter.makeMapboxFilter(Filter.readInput())
          map.setFilter('incidents_point', filter)
        }
      };

      document.getElementById('locate').addEventListener('keypress', e => {
        if(e.key == 'Enter'){
        Locate.geocodeAddress(e.target.value).then(result => {
          Locate.panToLatLng(result, map)
        })}
      })

    })
    .catch(e => console.log("Booo", e));

});

jQuery(document).ready(function() {

  var currentHeight = jQuery('#menu').height() - jQuery('.logo').height() - jQuery('.search').height() - jQuery('.tab-links').height();
  jQuery('.scrollbar-macosx').scrollbar();
  jQuery('.scroll-wrapper.tab-content').height(currentHeight - 10);
  jQuery(window).resize(function () {
    currentHeight = jQuery('#menu').height() - jQuery('.logo').height() - jQuery('.search').height() - jQuery('.tab-links').height();
    console.log(currentHeight);
    jQuery('.scroll-wrapper.tab-content').height(currentHeight - 10);
  });
  
  //Tab Switch Function
  jQuery('.tabs .tab-links a').on('click', function(e)  {
      var currentAttrValue = jQuery(this).attr('href');
    
    // Show/Hide Tabs
    jQuery('.tabs ' + currentAttrValue).fadeIn(400).siblings().hide();

      // Change/remove current tab to active
      jQuery(this).parent('li').addClass('active').siblings().removeClass('active');

      e.preventDefault();
  });

  //initialize accordion
  jQuery('#filters-accordion [data-accordion]').accordion();

  jQuery('.disclaimer-close img').click(function(){
    jQuery('.disclaimer').fadeOut();
  });


  var slideout = new Slideout({
    'panel': document.getElementById('map'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70
  });

});

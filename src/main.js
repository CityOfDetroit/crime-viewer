var mapboxgl = require('mapbox-gl');
var moment = require('moment');
var _ = require('lodash');
var Slideout = require('slideout');
global.jQuery = require('jquery');
require('jq-accordion');

import Helpers from './helpers.js';
import Socrata from './socrata.js';
import Stats from './stats.js';
import Colors from './colors.js';
import Filter from './filter.js';
import Locate from './locate.js';

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
  "$where": `incident_timestamp >= '${Helpers.xDaysAgo(7)}'`,
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
      console.log(totalIncidents, incidentsByCategory, incidentsByCouncilDistrict);

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

      // the filter should be an object with:
      // properties as keys
      // an array of values to match as the value
      const filterObject = {
        'state_offense_code': ['3803', '1301', '2900', '2401'],
        'precinct': ['12', '09', '07', '02']
      }

      let theFilter = Filter.makeMapboxFilter(filterObject)
      console.log(Filter.makeMapboxFilter(filterObject))
      map.setFilter("incidents_point", theFilter)

      map.on('mousedown', function (e) {
          var features = map.queryRenderedFeatures(e.point, {layers: ['incidents_point']});
          console.log(features)
      });

      console.log(Locate.geocodeAddress('4061 Porter'))

    })
    .catch(e => console.log("Booo"));
});

jQuery(document).ready(function() {
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

  var slideout = new Slideout({
    'panel': document.getElementById('map'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70
  });
});
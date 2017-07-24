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
})

// Socrata details
const ds = "9i6z-cm98"
let params = {
  "$where": `incident_timestamp >= '${Helpers.xDaysAgo(28)}'`,
  "$limit": 50000,
  "$select": "crime_id,location,address,council_district,neighborhood,precinct,state_offense_code,offense_category,offense_description,report_number,incident_timestamp,day_of_week,hour_of_day"
}

// make the URL
let url = Socrata.makeUrl(ds, params)

// load the map
map.on('load', function() {

  console.log(Locate.identifyBounds([-83.0787163063023, 42.351453227480945]))

  // add zoom + geolocate controls
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.GeolocateControl());

  // disable map rotation using right click + drag and touch rotation gesture
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();

  // get the data
  Socrata.fetchData(url).then(data => {
    console.log(data);

    // calculate some summary stats
    let totalIncidents = Stats.countFeatures(data.features);
    let incidentsByCategory = Stats.countByKey(data.features, 'properties.offense_category');
    let incidentsByCouncilDistrict = Stats.countByKey(data.features, 'properties.council_district');

    // get the earliest and latest incident dates
    let uniqueTimestamps = [...new Set(data['features'].map(item => item.properties['incident_timestamp']))];
    let minTime = _.min(uniqueTimestamps);
    let maxTime = _.max(uniqueTimestamps);

    // count incidents for currently viewing
    Stats.printCurrentView(data.features, 'details');
    Stats.printTimeRange(minTime, maxTime, 'details');

    // populate a table in the Data tab  
    Stats.printAsTable(incidentsByCategory, 'tbody');
    
    // populate a bar chart in the Data tab
    Stats.printAsChart(incidentsByCouncilDistrict, '.ct-chart');

    // load the source data and point, highlight styles
    Init.initialLoad(map, data)
    
    map.on('mousedown', function (e) {
        var features = map.queryRenderedFeatures(e.point, {layers: ['incidents_point']});
        if(features.length > 0){
          console.log(features)
          map.setFilter("incidents_highlighted", ['==', 'crime_id', features[0].properties.crime_id])
          Stats.printPointDetails(features, 'details');
        }
    });

    map.on('mouseenter', 'incidents_point', function (e) {
        map.getCanvas().style.cursor = 'pointer'
    });

    map.on('mouseout', 'incidents_point', function (e) {
        map.getCanvas().style.cursor = ''
    });

    // quick filter refresh in lieu of actual button

    document.getElementById('apply_filters').addEventListener('mousedown', function() {
      console.log(data);

      // construct the filterObject
      let mapFilter = Filter.readInput()[0];

      // make a copy of the Socrata data
      let filteredData = _.cloneDeep(data);

      // iterate through the filter object and pare down
      Object.entries(mapFilter).forEach(([k,v]) => {
        if(v.length < 1) { return }
        else { filteredData.features = Filter.filterFeatures(filteredData.features, k, v) }
      })
      map.getSource('incidents').setData(filteredData)

      // offense category count refresh
      let incidentsByCategory = Stats.countByKey(filteredData.features, 'properties.offense_category');
      Stats.printAsTable(incidentsByCategory, 'tbody');

      // current area refresh
      let incidentsByCouncilDistrict = Stats.countByKey(filteredData.features, 'properties.council_district');
      Stats.printAsChart(incidentsByCouncilDistrict, '.ct-chart');

      // log data that's in the view port
      let visibleData = map.queryRenderedFeatures({layers: ['incidents_point']});

      // refresh count of current incidents
      Stats.printCurrentView(filteredData.features, 'current-view');
      console.log(filteredData);
    })

    document.getElementById('locate').addEventListener('keypress', e => {
      if(e.key == 'Enter'){
      Locate.geocodeAddress(e.target.value).then(result => {
        let coords = result['candidates'][0]['location']
        console.log(Locate.identifyBounds(coords))
        Locate.panToLatLng(result, map)
      })}
    })

    jQuery('input[type=radio][name=currentArea]').change(function(){
      Boundary.changeBoundary(map, Boundary.boundaries[this.value])
      let incidentsByCurrentArea = Stats.countByKey(data.features, `properties.${this.value}`)
      Stats.printAsChart(incidentsByCurrentArea, '.ct-chart');
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
  jQuery(window).resize(function () {
    currentHeight = jQuery('#menu').height() - jQuery('.logo').height() - jQuery('.search').height() - jQuery('.tab-links').height();
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
  jQuery('#filters-accordion [data-accordion]').accordion(
    {
      singleOpen: false,
      autoHeight: false
    });

  //close disclaimer box
  jQuery('.disclaimer-close img').click(function(){
    jQuery('.disclaimer').fadeOut();
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

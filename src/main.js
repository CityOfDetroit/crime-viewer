var mapboxgl = require('mapbox-gl');
var moment = require('moment')
import Helpers from './helpers.js';
import Socrata from './socrata.js';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-83.091, 42.350],
    zoom: 9
})

// Socrata details
const ds = "9i6z-cm98"
let params = {
  "$where": `incident_timestamp >= '${Helpers.xDaysAgo(30)}'`,
  "$limit": 50000
}

// make the URL
let url = Socrata.makeUrl(ds, params)

map.on('load', function() {
  console.log('map is loaded')
  // get the data
  fetch(url).then(r => r.json())
    .then(data => {
      console.log(data);

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
            stops: [
              ['1301', 'rgb(104,0,116)'],
              ['2900', 'rgb(202,194,49)'],
              ['2401', 'rgb(1,60,163)'],
              ['1302', 'rgb(0,162,95)'],
              ['2201', 'rgb(212,39,79)'],
              ['2303', 'rgb(0,146,212)'],
              ['2305', 'rgb(0,146,212)'],
              ['2306', 'rgb(0,146,212)'],
              ['2307', 'rgb(0,146,212)'],
              ['1201', 'rgb(178,29,28)'],
              ['2601', 'rgb(239,166,255)'],
              ['2602', 'rgb(239,166,255)'],
              ['2603', 'rgb(239,166,255)']
            ]
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

    })
    .catch(e => console.log("Booo"));
})

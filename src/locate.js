var $ = require('jquery')
var turf = require('@turf/turf')
var Terraformer = require('terraformer')
var arcgis = require('terraformer-arcgis-parser')

const Locate = {
  /**
   * Send an address to the geocoder.
   * @param {string} address a street address in the CoD
   * @returns {Promise} res
   */
  geocodeAddress: function(address) {
    const geocodeURL = 'https://gis.detroitmi.gov/arcgis/rest/services/DoIT/CompositeGeocoder/GeocodeServer/findAddressCandidates?'
    let params = {
      'Street': '',
      'City': '',
      'outSR': '4326',
      'outFields': '*',
      'SingleLine': address,
      'f': 'pjson'
    };
    return fetch(geocodeURL + $.param(params)).then((r) => {
      var res = r.json()
      return res
    })
  },
  /**
   * Add a marker
   */
  addMarker: function(map, coords) {
    map.addLayer({
      "id": "marker",
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
          "icon-image": "circle-stroked-15"
      }
  });
  },

  /**
   * Take a LatLng and toss it against a MapServer/identify to see what polys it falls in.
   * @param {object} coords a coordinate object with x/y
   * @returns {Promise} res
   */
  identifyBounds: function(coords) {
    const boundsEndpoint = 'https://gis.detroitmi.gov/arcgis/rest/services/DoIT/BoundsCheck/MapServer/identify?'
    let params = {
      'geometry': `${coords.x}, ${coords.y}`,
      'sr': 4326,
      'layers': 'all',
      // this is a hack, but wygd. Where Y'at does the same thing.
      'mapExtent': `${coords.x - 0.01}, ${coords.y - 0.01}, ${coords.x + 0.01}, ${coords.y + 0.01}`,
      'tolerance': 1,
      'returnGeometry': 'false',
      'imageDisplay': '500, 500, 96',
      'f': 'json'
    }
    return fetch(boundsEndpoint + $.param(params)).then((r) => {
      var res = r.json()
      return res
    })
  },
  /**
   * Create a promise for an endpoint that returns intersecting census blocks.
   * @param {polygon} geometry A GeoJSON geometry.
   * @returns {Promise} res
   */
  getCensusBlocks: function(geometry) {
    const endpoint = 'https://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Census_Detroit/MapServer/0/query?'
    let params = {
      'where': '1=1',
      'geometryType': 'esriGeometryPolygon',
      'geometry': JSON.stringify(arcgis.convert(geometry)[0]['geometry']),
      'outFields': 'geoid10',
      'inSR': '4326',
      'spatialRel': 'esriSpatialRelContains',
      'returnGeometry': 'true',
      'geometryPrecision': 5,
      'f': 'geojson'
    }
    return fetch(endpoint + $.param(params)).then((r) => {
      var res = r.json()
      return res
    })
  },
  /**
   * Given a set of coordinates, attach a new Polygon to MapboxDraw
   * @param {object} coords x/y to draw radius from
   * @param {integer} radius in meters
   * @param {MapboxDraw} draw MapboxDraw instance
   */
  makeRadiusPolygon: function(coords, radius, draw) {
    let search_radius = turf.buffer(turf.point([coords.x, coords.y]), radius, "meters")
    draw.deleteAll()
    draw.add(search_radius)
    draw.changeMode('static')
  }
}

export default Locate;

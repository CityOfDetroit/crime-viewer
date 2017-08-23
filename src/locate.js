var $ = require('jquery')
var turf = require('@turf/turf')
var Terraformer = require('terraformer')
var arcgis = require('terraformer-arcgis-parser')

const Locate = {
  /* take an address and return a promise */
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
   * Take a LatLng and toss it against a MapServer/identify to see what polys it falls in.
   * @param {object} coords a coordinate object with x/y
   * @returns {something}
   */
  identifyBounds: function(coords) {
    const boundsEndpoint = 'http://gis.detroitmi.gov/arcgis/rest/services/DoIT/BoundsCheck/MapServer/identify?'
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
   * @returns {promise} res
   */
  getCensusBlocks: function(geometry) {
    const endpoint = 'http://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Census_Detroit/MapServer/0/query?'
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
  panToLatLng: function(gc_result, map) {
    console.log(gc_result)
    if (gc_result['candidates'].length > 0) {
      let coords = gc_result['candidates'][0]['location']
      map.flyTo({center: [coords['x'], coords['y']], zoom: 15})
    }
    else {
      console.log("No candidates found!")
    }
  },
  makeRadiusPolygon: function(coords, radius, draw) {
    let search_radius = turf.buffer(turf.point([coords.x, coords.y]), radius, "meters")
    draw.deleteAll()
    draw.add(search_radius)
    draw.changeMode('static')
  }
}

export default Locate;

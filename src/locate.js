var $ = require('jquery')

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
  panToLatLng: function(gc_result, map) {
    console.log(gc_result)
    if (gc_result['candidates'].length > 0) {
      let coords = gc_result['candidates'][0]['location']
      map.flyTo({center: [coords['x'], coords['y']], zoom: 15})
    }
    else {
      console.log("No candidates found!")
    }
  }
}

export default Locate;

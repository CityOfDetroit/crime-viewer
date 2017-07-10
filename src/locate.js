var $ = require('jquery')

const Locate = {
  /* take an address and return a promise */
  geocodeAddress: function(address) {
    const geocodeURL = 'http://gis.detroitmi.gov/arcgis/rest/services/DoIT/CompositeGeocoder/GeocodeServer/findAddressCandidates?'
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
  }
}

export default Locate;

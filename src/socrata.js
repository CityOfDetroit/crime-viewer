const Socrata = {
  makeUrl: function(ds, params) {
    let ret = []
    for (let p in params)
      ret.push(p + '=' + encodeURIComponent(params[p]));
    const qs = ret.join('&')
    return `https://data.detroitmi.gov/resource/${ds}.geojson?${qs}`
  }
}

export default Socrata;

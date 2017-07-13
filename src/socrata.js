const Socrata = {
  /**
   * Formats a geojson url for Socrata
   * @param {string} - dataset 4x4 id
   * @param {obj} - query params accepted by Socrata like where and limit
   * @returns {string}
   */
  makeUrl: function(ds, params) {
    let ret = []
    for (let p in params)
      ret.push(p + '=' + encodeURIComponent(params[p]));
    const qs = ret.join('&')
    return `https://data.detroitmi.gov/resource/${ds}.geojson?${qs}`
  },

  /** 
   * Fetches geojson data from Socrata
   * @param {string}
   * @returns {Promise} - json formatted data
   */
  fetchData: function(url) {
    return fetch(url).then((r) => {
      var res = r.json()
      return res
    })
  }
}

export default Socrata;

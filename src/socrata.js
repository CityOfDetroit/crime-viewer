const Socrata = {
  /**
   * Formats a geojson url for Socrata
   * @param {string} ds Socrata 4x4 ID
   * @param {obj} params Socrata params: $where, $limit, etc
   * @returns {string}
   */
  makeUrl: function(ds, params) {
    let ret = []
    for (let p in params)
      ret.push(p + '=' + encodeURIComponent(params[p]));
    const qs = ret.join('&')
    return `https://data.detroitmi.gov/resource/${ds}.geojson?${qs}`
  },

  getLatestDate: function() {
    let ret = []
    const ds = '9i6z-cm98'
    let params = {
      '$order': 'incident_timestamp desc',
      '$select': 'incident_timestamp',
      '$limit': 1
    }

    for (let p in params)
      ret.push(p + '=' + encodeURIComponent(params[p]))

    const qs = ret.join('&')
    let url = `https://data.detroitmi.gov/resource/${ds}.json?${qs}`
    
    return fetch(url).then((r) => {
      let res = r.json()
      return res
    })
  },

  /** 
   * Fetches geojson data from Socrata
   * @param {string} url the URL from makeUrl to fetch from Socrata
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

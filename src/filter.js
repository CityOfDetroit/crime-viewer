const Filter = {
  /* read the UI inputs and make the object */
  readInput: function() {
    return null
  },

  /* make a mapbox-gl filter from an object of filters */
  // API ref: https://www.mapbox.com/mapbox-gl-js/style-spec/#types-filter
  makeMapboxFilter: function(obj) {
    // we may want this to be "any"; possibly a toggle somewhere
    let mapboxFilter = ["all"]
    Object.entries(obj).forEach(([k, v]) => {
      let inList = ["in", k]
      mapboxFilter.push(inList.concat(v))
    })
    return mapboxFilter
  },

  /* return a human-readable string from the current filter object */
  describeFilter: function(obj) {
    let start = "Current filters:"
    return null
  }
}

export default Filter;

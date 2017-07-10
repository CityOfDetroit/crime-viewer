const Filter = {
  // API ref: https://www.mapbox.com/mapbox-gl-js/style-spec/#types-filter
  makeMapboxFilter: function(obj) {
    // we may want this to be "any"; possibly a toggle somewhere
    let mapboxFilter = ["all"]
    Object.entries(obj).forEach(([k, v]) => {
      console.log(k, v)
      let inList = ["in", k]
      mapboxFilter.push(inList.concat(v))
    })
    return mapboxFilter
  }
}

export default Filter;

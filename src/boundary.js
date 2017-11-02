var $ = require('jquery');

const Boundary = {
    boundaries: {
        council_district: { 'name': 'Council Districts', 'single': 'district', 'slug': 'council_district', 'url': 'https://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Council_Districts/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&geometryPrecision=5&f=geojson' },
        neighborhood: { 'name': 'Neighborhoods', 'single': 'neighborhood', 'slug': 'neighborhood', 'url': 'https://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Neighborhoods/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&geometryPrecision=5&f=geojson' },
        zip_code: { 'name': 'Zip Codes', 'single': 'zip code', 'slug': 'zip_code', 'url': 'https://data.detroitmi.gov/resource/f439-mtjv.geojson' },
        precinct: { 'name': 'Precincts', 'single': 'precinct', 'slug': 'precinct', 'url': 'https://data.detroitmi.gov/resource/mena-2vrg.geojson' }
    },

    addBoundary: function(map, boundary) {
        map.addSource('boundary',{
            "type": "geojson",
            "data": boundary['url']
        });

        map.addLayer({
          "id": "boundary_line",
          "type": "line",
          "source": 'boundary',
          "layout": {
            "visibility": "visible",
            "line-join": "round"
          },
          "paint": {
              "line-color": "rgb(110,130,230)",
              "line-opacity": 1,
              "line-width": {
                  stops: [
                      [8, 0.5],
                      [11, 2],
                      [13, 3],
                      [22, 8]
                  ]
              }
          }
        }, 'bridge-motorway-2');

        map.addLayer({
          "id": "boundary_fill",
          "type": "fill",
          "source": 'boundary',
          "layout": {
            "visibility": "visible",
          },
          "paint": {
            "fill-color": "rgba(150,230,230,0)"
          }
        });
    },

    changeBoundary: function(map, boundary) {
        map.getSource('boundary').setData(boundary['url'])
        $('#area-pick-text').html(`Pick ${boundary['single']}`)
        return boundary['slug']
    },

    chooseFeature: function(map) {
        map.setPaintProperty('boundary_fill', 'fill-color', 'rgba(150,230,230,0)')
    }
}

export default Boundary;
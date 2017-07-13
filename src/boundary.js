const Boundary = {
    boundaries: [
        {'name': 'council_districts', 'url': 'https://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Council_Districts/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&geometryPrecision=5&f=geojson'},
        {'name': 'precincts', 'url': ''},
        {'name': 'neighborhoods', 'url': 'https://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Neighborhoods/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&geometryPrecision=5&f=geojson'},
        {'name': 'zip_codes', 'url': ''},
    ],
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
              "line-color": "#189aca",
              "line-opacity": {
                  stops: [
                      [8, 0.5],
                      [11, 0.2],
                      [16, 0.04],
                      [18, 0.01]
                  ]
              },
              "line-width": {
                  stops: [
                      [8, 0.1],
                      [11, 1],
                      [13, 3],
                      [22, 10]
                  ]
              }
          }
        });
    },
    changeBoundary: function(map, boundary) {
        map.getSource('boundary').setData(boundary['url'])
    }
}

export default Boundary;
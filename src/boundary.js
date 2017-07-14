const Boundary = {
    boundaries: {
        council_district: {'name': 'Council Districts', 'url': 'https://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Council_Districts/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&geometryPrecision=5&f=geojson' },
        neighborhood: {'name': 'Neighborhoods', 'url': 'https://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Neighborhoods/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&geometryPrecision=5&f=geojson' },
        zip_code: {'name': 'Zip Codes', 'url': 'https://data.detroitmi.gov/resource/f439-mtjv.geojson' },
        precinct: {'name': 'Police Precincts', 'url': 'https://data.detroitmi.gov/resource/mena-2vrg.geojson' }
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
              "line-color": "red",
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
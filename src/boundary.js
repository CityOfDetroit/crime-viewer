const Boundary = {
    boundaries: {
        council_district: {'name': 'Council Districts', 'url': 'https://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Council_Districts/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&geometryPrecision=5&f=geojson' },
        neighborhood: {'name': 'Neighborhoods', 'url': 'https://gis.detroitmi.gov/arcgis/rest/services/Boundaries/Neighborhoods/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&geometryPrecision=5&f=geojson' },
        zipcode: {'name': 'Zip Codes', 'url': 'https://data.detroitmi.gov/resource/f439-mtjv.geojson' },
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
              "line-color": "rgba(150,230,230,1)",
              "line-opacity": 1,
              "line-width": {
                  stops: [
                      [8, 0.5],
                      [11, 2],
                      [13, 4],
                      [22, 10]
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
    }
}

export default Boundary;
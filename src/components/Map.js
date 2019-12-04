import React, {useEffect, useState} from 'react'
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import _ from 'lodash';
import arrestCodes from '../data/arrestCodes';

const Map = ({ intersection, setIntersection, timeRange, crimeTypes }) => {

  let [theMap, setTheMap] = useState(null)

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiY2l0eW9mZGV0cm9pdCIsImEiOiJjaXZvOWhnM3QwMTQzMnRtdWhyYnk5dTFyIn0.FZMFi0-hvA60KYnI-KivWg";
    var map = new mapboxgl.Map({
      container: "map", // container id
      style: `mapbox://styles/cityofdetroit/cj9fqy8y48aq02smdgong5vc0`, // stylesheet location
      center: [-83.0457, 42.331], // starting position [lng, lat]
      zoom: 14, // starting zoom
      minZoom: 13.01,
    });
      
    map.on('load', ()=>{

      map.addControl(new mapboxgl.NavigationControl());

      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true
        }));

      map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        bbox: [-83.287803,42.255192,-82.910451,42.45023]
      }), 'top-left');
      setTheMap(map)

      map.addSource("rms-far", {
        type: "vector",
        url: `mapbox://cityofdetroit.rms_mapbox_far`
      })

      map.addSource("intersections", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      })

      let updateIntersections = () => {
        let features = map.queryRenderedFeatures({layers: ['rms-incidents-far']})
        let grouped = _.groupBy(features, 'geometry.coordinates')
        let coordinateFeatures = Object.keys(grouped).map(c => {
          return {
            "type": "Feature",
            "geometry": grouped[c][0].geometry,
            "properties": {
              "id": c.toString(),
              "count": grouped[c].length,
              "incidents": grouped[c].map(gc => gc.properties)
            }
          }
        })
        setTimeout(() =>
        map.getSource("intersections").setData({type: "FeatureCollection", features: coordinateFeatures})
        , 500)
      }

      map.addLayer({
        id: "rms-incidents-far",
        source: "rms-far",
        "source-layer": "rms_mapbox_far",
        filter: ["all", [">=", "incident_timestamp", timeRange[0]], ["<=", "incident_timestamp", timeRange[1]]],
        type: 'circle',
        paint: {
          "circle-opacity": 0.0
        },
      })
      
      map.addLayer({
        id: "intersections",
        source: "intersections",
        type: 'circle',
        minzoom: 13.01,
        paint: {
          "circle-opacity": 0.75,
          "circle-radius": ['+', ['*', ['log2', ['get', 'count']], 4], 5]
        }
      })

      map.addLayer({
        id: "intersections-highlight",
        source: "intersections",
        type: 'circle',
        filter: ['==', 'id', 'none'],
        minzoom: 13.01,
        paint: {
          "circle-opacity": 0.95,
          "circle-color": '#FFAA1D',
          "circle-radius": ['+', ['round', ['*', ['log2', ['get', 'count']], 4]], 11]
        }
      }, 'intersections')

      updateIntersections()

      map.on('click', e => {
        let clicked = map.queryRenderedFeatures(e.point, {layers: ['intersections', 'intersections-highlight']})
        if (clicked.length > 0) {
          map.setFilter('intersections-highlight', ['==', 'id', clicked[0].properties.id])
          console.log(clicked)
          console.log(JSON.parse(clicked[0].properties.incidents))
          map.easeTo({
            center: e.lngLat
          })
          setIntersection(clicked[0])
        }

      })

      map.on('mouseenter', 'intersections', e => {
        map.getCanvas().style.cursor = 'crosshair'
      })

      map.on('mouseout', 'intersections', e => {
        map.getCanvas().style.cursor = 'default'
      })

      map.on('moveend', e => {
        setTimeout(() => updateIntersections(), 200)
      })

      setTimeout(() => map.setZoom(14.001), 500)

    });

  }, []);

  useEffect(() => {
    if(theMap) {
      let arrestCharges = []
      _.toPairs(crimeTypes).forEach(ct => {
        let match = Object.keys(arrestCodes).filter(k => arrestCodes[k].area === ct[0] && ct[1].indexOf(arrestCodes[k].category) > -1 )
        arrestCharges = arrestCharges.concat(match)
      })

      let chargeFilter = ["!=", "arrest_charge", "nothing"]

      if(arrestCharges.length > 0) {
        chargeFilter = ["in", "arrest_charge"].concat(arrestCharges)
      }
      // theMap.setFilter("rms-incidents", ["all", [">=", "incident_timestamp", timeRange[0]], ["<=", "incident_timestamp", timeRange[1]], chargeFilter])
      theMap.setFilter("rms-incidents-far", ["all", [">=", "incident_timestamp", timeRange[0]], ["<=", "incident_timestamp", timeRange[1]], chargeFilter])
      setTimeout(() => {
        let features = theMap.queryRenderedFeatures({layers: ['rms-incidents-far']})
        console.log(features)
        let grouped = _.groupBy(features, 'geometry.coordinates')
        let coordinateFeatures = Object.keys(grouped).map(c => {
          return {
            "type": "Feature",
            "geometry": grouped[c][0].geometry,
            "properties": {
              "id": c.toString(),
              "count": grouped[c].length,
              "incidents": grouped[c].map(gc => gc.properties)
            }
          }
        })
        theMap.getSource("intersections").setData({type: "FeatureCollection", features: coordinateFeatures})
        if (intersection){
          let filtered = coordinateFeatures.filter(cf => cf.properties.id === intersection.properties.id)
          console.log(filtered[0])
          if (filtered.length > 0) {
            setIntersection(filtered[0])
          }
        }
      }, 500)
    }
  },[timeRange, crimeTypes])
  return (
    <div id="map" style={{gridArea: "m"}} />
  )
}

export default Map;
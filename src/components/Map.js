import React, { useEffect, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import _ from "lodash";
import arrestCodes from "../data/arrestCodes";
import { baseStyle } from "../styles/mapstyle";
import maplibregl from "maplibre-gl";

const Map = ({ intersection, setIntersection, timeRange, crimeTypes }) => {
  let [theMap, setTheMap] = useState(null);

  useEffect(() => {
    console.log(baseStyle);

    var map = new maplibregl.Map({
      container: "map", // container id
      style: baseStyle, // stylesheet location
      center: [-83.0457, 42.331], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    map.on("load", () => {
      map.addControl(new maplibregl.NavigationControl());

      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );

      setTheMap(map);

      map.addSource("intersections", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      let updateIntersections = () => {
        console.log("updating intersections");
        console.log(timeRange);
        let features = map.queryRenderedFeatures({
          layers: ["rms_crime_incidents"],
        });
        console.log(features);
        let filtered = features.filter(
          (f) =>
            f.properties.incident_occurred_at >= timeRange[0] &&
            f.properties.incident_occurred_at <= timeRange[1]
        );
        let grouped = _.groupBy(filtered, "geometry.coordinates");
        let coordinateFeatures = Object.keys(grouped).map((c) => {
          return {
            type: "Feature",
            geometry: grouped[c][0].geometry,
            properties: {
              id: c.toString(),
              count: grouped[c].length,
              incidents: grouped[c].map((gc) => gc.properties),
            },
          };
        });
        console.log(coordinateFeatures);
        setTimeout(
          () =>
            map.getSource("intersections").setData({
              type: "FeatureCollection",
              features: coordinateFeatures,
            }),
          1000
        );
      };

      console.log(timeRange);

      map.addLayer({
        id: "rms-incidents",
        source: "rms",
        "source-layer": "rms_crime_incidents",
        filter: [
          "all",
          [">=", "incident_occurred_at", timeRange[0]],
          ["<=", "incident_occurred_at", timeRange[1]],
        ],
        type: "circle",
        paint: {
          "circle-opacity": 0.0,
        },
      });

      map.addLayer({
        id: "intersections",
        source: "intersections",
        type: "circle",
        paint: {
          "circle-opacity": 0.75,
          "circle-radius": ["+", ["*", ["log2", ["get", "count"]], 4], 5],
        },
      });

      map.addLayer(
        {
          id: "intersections-highlight",
          source: "intersections",
          type: "circle",
          filter: ["==", "id", "none"],
          minzoom: 13.01,
          paint: {
            "circle-opacity": 0.95,
            "circle-color": "#FFAA1D",
            "circle-radius": [
              "+",
              ["round", ["*", ["log2", ["get", "count"]], 4]],
              11,
            ],
          },
        },
        "intersections"
      );

      map.on("click", (e) => {
        let clicked = map.queryRenderedFeatures(e.point, {
          layers: ["intersections", "intersections-highlight"],
        });
        if (clicked.length > 0) {
          map.setFilter("intersections-highlight", [
            "==",
            "id",
            clicked[0].properties.id,
          ]);
          map.easeTo({
            center: e.lngLat,
          });
          setIntersection(clicked[0]);
        }
      });

      map.on("mouseenter", "intersections", (e) => {
        map.getCanvas().style.cursor = "crosshair";
      });

      map.on("mouseout", "intersections", (e) => {
        map.getCanvas().style.cursor = "default";
      });

      map.on("moveend", (e) => {
        setTimeout(() => updateIntersections(), 500);
      });

      setTimeout(() => map.setZoom(14.001), 500);
    });
  }, []);

  useEffect(() => {
    if (!theMap) {
      console.log("no map initialized...");
      return;
    }

    // let arrestCharges = [];
    // _.toPairs(crimeTypes).forEach((ct) => {
    //   let match = Object.keys(arrestCodes).filter(
    //     (k) =>
    //       arrestCodes[k].area === ct[0] &&
    //       ct[1].indexOf(arrestCodes[k].category) > -1
    //   );
    //   arrestCharges = arrestCharges.concat(match);
    // });

    // let chargeFilter = ["!=", "arrest_charge", "nothing"];

    // if (arrestCharges.length > 0) {
    //   chargeFilter = ["in", "arrest_charge"].concat(arrestCharges);
    // }

    let timeFilter = [
      "all",
      [">=", "incident_occurred_at", timeRange[0]],
      ["<=", "incident_occurred_at", timeRange[1]],
    ]

    theMap.setFilter("rms-incidents", timeFilter);

    // setTimeout(() => {
    //   let features = theMap.queryRenderedFeatures({
    //     layers: ["rms-incidents"],
    //   });
    //   let grouped = _.groupBy(features, "geometry.coordinates");
    //   let coordinateFeatures = Object.keys(grouped).map((c) => {
    //     return {
    //       type: "Feature",
    //       geometry: grouped[c][0].geometry,
    //       properties: {
    //         id: c.toString(),
    //         count: grouped[c].length,
    //         incidents: grouped[c].map((gc) => gc.properties),
    //       },
    //     };
    //   });
    //   theMap
    //     .getSource("intersections")
    //     .setData({ type: "FeatureCollection", features: coordinateFeatures });
    //   if (intersection) {
    //     let filtered = coordinateFeatures.filter(
    //       (cf) => cf.properties.id === intersection.properties.id
    //     );
    //     if (filtered.length > 0) {
    //       setIntersection(filtered[0]);
    //     }
    //   }
    // }, 500);
  }, [timeRange, theMap]);

  return <div id="map" style={{ gridArea: "m" }} />;
};

export default Map;

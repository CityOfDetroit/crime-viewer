import React, { useEffect, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import _, { set } from "lodash";
import arrestCodes from "../data/arrestCodes";
import { baseStyle } from "../styles/mapstyle";
import maplibregl from "maplibre-gl";

const Map = ({ intersection, setIntersection, timeRange, crimeTypes }) => {
  let [theMap, setTheMap] = useState(null);

  let [moved, setMoved] = useState(false);

  useEffect(() => {

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

      map.addLayer({
        id: "rms-incidents",
        source: "rms",
        "source-layer": "rms_crime_incidents",
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

      map.on("moveend", () => {
        setMoved(true);
      });

      setTimeout(() => map.setZoom(14.001), 500);
    });
  }, []);

  useEffect(() => {
    if (!theMap) {
      console.log("no map initialized...");
      return;
    }
  }, [theMap]);

  useEffect(() => {
    if (!theMap) {
      console.log("no map initialized...");
      return;
    }

    let features = theMap.queryRenderedFeatures({
      layers: ["rms-incidents"],
    });
    features = features.filter((f) => {
      // time filter
      return (
        f.properties.incident_occurred_at >= timeRange[0] &&
        f.properties.incident_occurred_at <= timeRange[1]
      );
    });

    if (crimeTypes) {
      let arrestCharges = [];
      _.toPairs(crimeTypes).forEach((ct) => {
        let match = Object.keys(arrestCodes).filter(
          (k) =>
            arrestCodes[k].area === ct[0] &&
            ct[1].indexOf(arrestCodes[k].category) > -1
        );
        arrestCharges = arrestCharges.concat(match);
      });

      console.log("arrestCharges", arrestCharges);

      if (arrestCharges.length > 0) {
        features = features.filter((f) => {
          return arrestCharges.indexOf(f.properties.arrest_charge) > -1;
        });
      }
    }

    let grouped = _.groupBy(features, "geometry.coordinates");
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



    theMap
      .getSource("intersections")
      .setData({ type: "FeatureCollection", features: coordinateFeatures });
    if (intersection) {
      let filtered = coordinateFeatures.filter(
        (cf) => cf.properties.id === intersection.properties.id
      );
      if (filtered.length > 0) {
        setIntersection(filtered[0]);
      }
    }

    setMoved(false);
  }, [timeRange, crimeTypes, moved]);

  return <div id="map" style={{ gridArea: "m" }} />;
};

export default Map;

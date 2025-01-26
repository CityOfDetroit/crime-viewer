import _ from "lodash";

export const baseStyle = {
  version: 8,
  sprite: "https://www.arcgis.com/sharing/rest/content/items/46d38d6a32ea412fb5fe4cc521ede94e/resources/sprites/sprite-1689510144076",
  glyphs:
    "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
  sources: {
    esri: {
      type: "vector",
      tiles: [
        "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/Basemap_Dynamic_Detail/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      ],
    },
    labels: {
      type: "vector",
      tiles: [
        "https://tiles.arcgis.com/tiles/qvkbeam7Wirps6zC/arcgis/rest/services/Basemap_Dynamic_Labels/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      ],
    },
    "rms": {
      "type": "vector",
      "bounds": [
        -83.3112,
        42.226,
        -82.8806,
        42.4703
      ],
      "minzoom": 0,
      "maxzoom": 23,
      "scheme": "xyz",
      "url": "https://vectortileservices2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/RMS_Crime_Incidents_(read_only)/VectorTileServer",
      "tiles": [
        "https://vectortileservices2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/RMS_Crime_Incidents_(read_only)/VectorTileServer/tile/{z}/{y}/{x}.pbf"
      ]
    }
  },
  layers: [
    {
      "id": "BasemapClipExtent/1",
      "type": "fill",
      "source": "esri",
      "source-layer": "BasemapClipExtent",
      "layout": {

      },
      "paint": {
        "fill-color": "#FFFFFF"
      },
      "minzoom": 9
    },
    {
      "id": "Reference Polygons/Landmarks",
      "type": "fill",
      "source": "esri",
      "source-layer": "Landmarks",
      "layout": {

      },
      "paint": {
        "fill-color": "#E0E0E0"
      },
      "minzoom": 10
    },
    {
      "id": "Reference Polygons/Golfcourse",
      "type": "fill",
      "source": "esri",
      "source-layer": "Golfcourse",
      "layout": {
        "visibility": "none"
      },
      "paint": {
        "fill-color": "#9FD5B3"
      },
      "minzoom": 10
    },
    {
      "id": "Reference Polygons/Cemetery/1",
      "type": "fill",
      "source": "esri",
      "source-layer": "Cemetery",
      "layout": {
        "visibility": "none"
      },
      "paint": {
        "fill-color": "#9FD5B3"
      },
      "minzoom": 10
    },
    {
      "id": "Reference Polygons/Cemetery/0",
      "type": "fill",
      "source": "esri",
      "source-layer": "Cemetery",
      "layout": {

      },
      "paint": {
        "fill-pattern": "Reference Polygons/Cemetery/0"
      },
      "minzoom": 10
    },
    {
      "id": "Reference Polygons/Parks",
      "type": "fill",
      "source": "esri",
      "source-layer": "Parks",
      "layout": {
        "visibility": "none"
      },
      "paint": {
        "fill-color": "#9FD5B3"
      },
      "minzoom": 10
    },
    {
      "id": "Hydro/Hydro Poly",
      "type": "fill",
      "source": "esri",
      "source-layer": "Hydro Poly",
      "layout": {

      },
      "paint": {
        "fill-color": "#BFBFBF"
      },
      "minzoom": 10
    },
    {
      "id": "Hydro/Hydro Line",
      "type": "line",
      "source": "esri",
      "source-layer": "Hydro Line",
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#BFBFBF",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.2],
            [12, 0.4],
            [13, 0.8],
            [14, 1.5],
            [15, 3],
            [16, 6],
            [17, 12],
            [18, 24]
          ]
        }
      },
      "minzoom": 10
    },
    {
      "id": "Hydro/Detroit River",
      "type": "fill",
      "source": "esri",
      "source-layer": "Detroit River",
      "layout": {

      },
      "paint": {
        "fill-color": "#BFBFBF"
      }
    },
    {
      "id": "Runway",
      "type": "fill",
      "source": "esri",
      "source-layer": "Runway",
      "layout": {

      },
      "paint": {
        "fill-color": "#FFFFFF"
      },
      "minzoom": 11
    },
    {
      "id": "Roads/Freeway",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        0],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.9],
            [12, 1.8],
            [13, 3.6],
            [14, 7.2],
            [15, 14.4],
            [16, 28.8],
            [17, 57.6],
            [18, 115.2]
          ]
        }
      },
      "minzoom": 9,
      "maxzoom": 15
    },
    {
      "id": "Roads/Ramp",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        1],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.6],
            [12, 1.1],
            [13, 2.3],
            [14, 4.5],
            [15, 9],
            [16, 18],
            [17, 36],
            [18, 72]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 10
    },
    {
      "id": "Roads/Major",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        2],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.9],
            [12, 1.8],
            [13, 3.6],
            [14, 7.2],
            [15, 14.4],
            [16, 28.8],
            [17, 57.6],
            [18, 115.2]
          ]
        }
      },
      "minzoom": 9,
      "maxzoom": 15
    },
    {
      "id": "Roads/Principal Arterial",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        3],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.8],
            [12, 1.5],
            [13, 3],
            [14, 6],
            [15, 12],
            [16, 24],
            [17, 48],
            [18, 96]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 10
    },
    {
      "id": "Roads/Small",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        4],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.6],
            [12, 1.1],
            [13, 2.3],
            [14, 4.5],
            [15, 9],
            [16, 18],
            [17, 36],
            [18, 72]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 10
    },
    {
      "id": "Roads/Local",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        5],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.4],
            [12, 0.8],
            [13, 1.5],
            [14, 3],
            [15, 6],
            [16, 12],
            [17, 24],
            [18, 48]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 11
    },
    {
      "id": "Roads/Other Small",
      "type": "line",
      "source": "esri",
      "source-layer": "Roads",
      "filter": [
        "==",
        "_symbol",
        6],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#EBEBEB",
        "line-width": {
          "base": 1,
          "stops": [
            [11, 0.2],
            [12, 0.4],
            [13, 0.8],
            [14, 1.5],
            [15, 3],
            [16, 6],
            [17, 12],
            [18, 24]
          ]
        }
      },
      "maxzoom": 15,
      "minzoom": 12
    },
    {
      "id": "Impervious Surface/Details",
      "type": "fill",
      "source": "esri",
      "source-layer": "Impervious Surface",
      "filter": [
        "==",
        "_symbol",
        1],
      "layout": {

      },
      "paint": {
        "fill-color": "#F2F2F2"
      },
      "minzoom": 16
    },
    {
      "id": "Impervious Surface/Roads",
      "type": "fill",
      "source": "esri",
      "source-layer": "Impervious Surface",
      "filter": [
        "==",
        "_symbol",
        0],
      "layout": {

      },
      "paint": {
        "fill-color": "#EBEBEB",
        "fill-outline-color": "#BFBFBF"
      },
      "minzoom": 15
    },
    {
      "id": "Building Footprints/Buildings",
      "type": "fill",
      "source": "esri",
      "source-layer": "Building Footprints",
      "filter": [
        "==",
        "_symbol",
        0],
      "layout": {
        "visibility": "none"
      },
      "paint": {
        "fill-color": {
          "base": 1,
          "stops": [
            [14, "#E0E0E0"
            ],
            [15, "#d7d7d7"
            ]
          ]
        },
        "fill-outline-color": {
          "base": 1,
          "stops": [
            [14, "#E0E0E0"
            ],
            [15, "#BDBDBD"
            ]
          ]
        }
      },
      "minzoom": 14
    },
    {
      "id": "Borders/International",
      "type": "line",
      "source": "esri",
      "source-layer": "International",
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#9C9C9C",
        "line-width": 1.33333,
        "line-dasharray": [8, 4]
      },
      "minzoom": 10
    },
    {
      "id": "Borders/Detroit",
      "type": "line",
      "source": "esri",
      "source-layer": "Detroit",
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#004445",
        "line-width": 4
      }
    },
    {
      "id": "Roads/label/Local",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        4],
      "layout": {
        "visibility": "visible",
        "text-size": 12,
        "icon-size": 1,
        "text-font": [
          "Montserrat Regular"
        ],
        "text-max-width": 10,
        "text-line-height": 1.2,
        "text-padding": 2,
        "text-letter-spacing": 0.2,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "text-justify": "center",
        "text-rotation-alignment": "auto",
        "text-optional": true,
        "icon-allow-overlap": false,
        "icon-optional": false,
        "icon-ignore-placement": false,
        "icon-rotation-alignment": "auto",
        "symbol-placement": "line",
        "symbol-avoid-edges": false,
        "symbol-spacing": 250,
        "text-anchor": "center",
        "icon-anchor": "center",
        "icon-offset": [0, 0],
        "text-offset": [0, 0],
        "icon-rotate": 0,
        "text-rotate": 0,
        "text-max-angle": 45,
        "text-field": "{_name}",
        "text-transform": "none"
      },
      "paint": {
        "icon-opacity": 1,
        "text-opacity": 1,
        "text-halo-color": "rgba(255,255,255,0.5)",
        "text-halo-width": 0.533333,
        "text-halo-blur": 0,
        "text-translate-anchor": "map",
        "icon-translate-anchor": "map",
        "icon-translate": [0, 0],
        "text-translate": [0, 0]
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/Arterial",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        5],
      "layout": {
        "visibility": "visible",
        "text-size": 12,
        "icon-size": 1,
        "text-font": [
          "Montserrat Regular"
        ],
        "text-max-width": 10,
        "text-line-height": 1.2,
        "text-padding": 2,
        "text-letter-spacing": 0.2,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "text-justify": "center",
        "text-rotation-alignment": "auto",
        "text-optional": true,
        "icon-allow-overlap": false,
        "icon-optional": false,
        "icon-ignore-placement": false,
        "icon-rotation-alignment": "auto",
        "symbol-placement": "line",
        "symbol-avoid-edges": false,
        "symbol-spacing": 250,
        "text-anchor": "center",
        "icon-anchor": "center",
        "icon-offset": [0, 0],
        "text-offset": [0, 0],
        "icon-rotate": 0,
        "text-rotate": 0,
        "text-max-angle": 45,
        "text-field": "{_name}",
        "text-transform": "none"
      },
      "paint": {
        "icon-opacity": 1,
        "text-opacity": 1,
        "text-halo-color": "rgba(255,255,255,0.5)",
        "text-halo-width": 0.533333,
        "text-halo-blur": 0,
        "text-translate-anchor": "map",
        "icon-translate-anchor": "map",
        "icon-translate": [0, 0],
        "text-translate": [0, 0]
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/Arterial (+)",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        3],
      "layout": {
        "visibility": "visible",
        "text-size": 12,
        "icon-size": 1,
        "text-font": [
          "Montserrat Regular"
        ],
        "text-max-width": 10,
        "text-line-height": 1.2,
        "text-padding": 2,
        "text-letter-spacing": 0.2,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "text-justify": "center",
        "text-rotation-alignment": "auto",
        "text-optional": true,
        "icon-allow-overlap": false,
        "icon-optional": false,
        "icon-ignore-placement": false,
        "icon-rotation-alignment": "auto",
        "symbol-placement": "line",
        "symbol-avoid-edges": false,
        "symbol-spacing": 250,
        "text-anchor": "center",
        "icon-anchor": "center",
        "icon-offset": [0, 0],
        "text-offset": [0, 0],
        "icon-rotate": 0,
        "text-rotate": 0,
        "text-max-angle": 45,
        "text-field": "{_name}",
        "text-transform": "none"
      },
      "paint": {
        "icon-opacity": 1,
        "text-opacity": 1,
        "text-halo-color": "rgba(255,255,255,0.5)",
        "text-halo-width": 0.533333,
        "text-halo-blur": 0,
        "text-translate-anchor": "map",
        "icon-translate-anchor": "map",
        "icon-translate": [0, 0],
        "text-translate": [0, 0]
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/Major Arterial",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        2],
      "layout": {
        "visibility": "visible",
        "text-size": 12,
        "icon-size": 1,
        "text-font": [
          "Montserrat Regular"
        ],
        "text-max-width": 10,
        "text-line-height": 1.2,
        "text-padding": 2,
        "text-letter-spacing": 0.2,
        "text-allow-overlap": false,
        "text-ignore-placement": false,
        "text-justify": "center",
        "text-rotation-alignment": "auto",
        "text-optional": true,
        "icon-allow-overlap": false,
        "icon-optional": false,
        "icon-ignore-placement": false,
        "icon-rotation-alignment": "auto",
        "symbol-placement": "line",
        "symbol-avoid-edges": false,
        "symbol-spacing": 250,
        "text-anchor": "center",
        "icon-anchor": "center",
        "icon-offset": [0, 0],
        "text-offset": [0, 0],
        "icon-rotate": 0,
        "text-rotate": 0,
        "text-max-angle": 45,
        "text-field": "{_name}",
        "text-transform": "none"
      },
      "paint": {
        "icon-opacity": 1,
        "text-opacity": 1,
        "text-halo-color": "rgba(255,255,255,0.5)",
        "text-halo-width": 0.533333,
        "text-halo-blur": 0,
        "text-translate-anchor": "map",
        "icon-translate-anchor": "map",
        "icon-translate": [0, 0],
        "text-translate": [0, 0]
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/State Route",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        1],
      "layout": {
        "symbol-placement": "line",
        "text-font": [
          "Montserrat Regular"
        ],
        "text-size": 8,
        "text-letter-spacing": 0.01,
        "text-field": "{_name}",
        "icon-image": "Roads/State Route/{_len}",
        "icon-rotation-alignment": "viewport",
        "text-rotation-alignment": "viewport",
        "text-optional": true
      },
      "paint": {
        "text-color": "#686868"
      },
      "showProperties": false
    },
    {
      "id": "Roads/label/Interstate",
      "type": "symbol",
      "source": "labels",
      "source-layer": "Roads/label",
      "filter": [
        "==",
        "_label_class",
        0],
      "layout": {
        "symbol-placement": "line",
        "text-font": [
          "Montserrat Regular"
        ],
        "text-size": 8,
        "text-letter-spacing": 0.01,
        "text-field": "{_name}",
        "icon-image": "Roads/Interstate/{_len}",
        "icon-rotation-alignment": "viewport",
        "text-rotation-alignment": "viewport",
        "text-optional": true
      },
      "paint": {
        "text-color": "#686868"
      },
      "showProperties": false
    },
    {
      "id": "rms_crime_incidents",
      "type": "circle",
      "source": "rms",
      "source-layer": "rms_crime_incidents",
      "layout": {
        "visibility": "visible",
      },
      "paint": {
        "circle-radius": 0,
        "circle-color": "#388C65",
        "circle-stroke-width": 0
      }
    }
  ],
  metadata: {
    arcgisStyleUrl:
      "https://www.arcgis.com/sharing/rest/content/items/273bf8d5c8ac400183fc24e109d20bcf/resources/styles/root.json",
    arcgisOriginalItemTitle: "Community",
  },
};
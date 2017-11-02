import chroma from 'chroma-js';
const $ = require('jquery');

import Data from './data.js';
import Boundary from './boundary.js';
import Helpers from './helpers.js';

/**
 * @returns {array} colors as MapboxGL stops array for symbolizing offense codes
 */
function computeColors() {
    let colors = []
    Object.entries(Data.offenses).forEach(([k, v]) => {
        v.forEach(c => {
            colors.push([c.name, c.color])
        })
    })

    return colors
}

const Init = {
    /**
     * Adds a new Mapbox GL source and two styles to the map.
     * @param {map} map a mapboxgl.Map instance
     * @param {obj} data GeoJSON to be displayed on the map
     * @returns {undefined}
     */
    initialLoad: function(map, data) {
        // add the source
        map.addSource('incidents', {
            "type": "geojson",
            "data": data
        });

        map.addLayer({
            "id": "incidents_highlighted",
            "source": "incidents",
            "type": "circle",
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "circle-color": 'rgba(250,0,0,1)',
                "circle-radius": {
                    'base': 1.25,
                    'stops': [
                        [8, 7.5],
                        [19, 25]
                    ]
                },
                "circle-opacity": {
                    'stops': [
                        [9, 0.35],
                        [19, 0.75]
                    ]
                }
            }
        });

        // add a layer
        map.addLayer({
            "id": "incidents_point_ezclick",
            "source": "incidents",
            "type": "circle",
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "circle-color": "rgba(0,0,0,0)",
                "circle-radius": {
                    'base': 1.25,
                    'stops': [
                        [8, 9],
                        [17, 27],
                        [19, 36]
                    ]
                }
            }
        });

        // add a layer
        map.addLayer({
            "id": "incidents_point",
            "source": "incidents",
            "type": "circle",
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "circle-color": {
                    property: 'offense_category',
                    type: 'categorical',
                    default: '#555',
                    stops: computeColors()
                },
                "circle-radius": {
                    'base': 1.25,
                    'stops': [
                        [8, 3],
                        [17, 9],
                        [19, 12]
                    ]
                },
                "circle-opacity": {
                    'stops': [
                        [9, 0.75],
                        [19, 1]
                    ]
                },
                "circle-stroke-color": 'rgba(0,0,0,1)',
                "circle-stroke-opacity": {
                    'stops': [
                        [9, 0.2],
                        [18, 1]
                    ]
                },
                "circle-stroke-width": {
                    'stops': [
                        [9, 0.1],
                        [19, 2]
                    ]
                }
            }
        });

        // set a filter on highlighted which won't match anything
        map.setFilter('incidents_highlighted', ["==", "crime_id", "NONE"])

        // add the boundary
        Boundary.addBoundary(map, Boundary.boundaries.council_district);
    },

    /**
     * Takes stuff from Data.js and adds them as filters on the sidebar.
     * @returns {undefined}
     */
    populateSidebar: function() {
        let offenseHtml = `<div class="filter-instructions">These filters display incidents based on <b>what</b> the arrest charge was.<br/>You can choose from several types of <b>violent, property,</b> or <b>other</b> crime categories.</div>`
        Object.entries(Data.offenses).forEach(([k,v]) => {
            offenseHtml += `
                <div class='filter-subcat lg'><span class='filter-subcat-title'>${k.toUpperCase()}</span>
                    ${v.map (o => `
                    <div class='filter-subcat-input'>
                    <input type ="checkbox" id="${o.name.toLowerCase().replace(/\s/g, '-')}-check" class="offense-checkbox" data-codes="${o.name}" data-name="${o.name}"/>
                    <label for="${o.name.toLowerCase().replace(/\s/g, '-')}-check">${Helpers.toSentenceCase(o.name)}</label></div>`).join("")}
                </div>`
        })

        $('#categories').html(offenseHtml);
    }
}

export default Init;

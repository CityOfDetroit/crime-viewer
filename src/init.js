import Data from './data.js';
import Boundary from './boundary.js';
import Helpers from './helpers.js';

import chroma from 'chroma-js';
const $ = require('jquery');

function computeColors() {
    /**
     * @returns {array} - An MapboxGL stops array for symbolizing offense codes
     */
    let colors = []
    Object.entries(Data.offenses).forEach(([k, v]) => {
        v.forEach(c => {
            c.state_codes.forEach(o => {
                colors.push([o, c.color])
            })
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
    initialLoad: function (map, data) {
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
                "circle-color": 'rgba(0,0,0,1)',
                "circle-radius": {
                    'base': 1.25,
                    'stops': [
                        [8, 5.5],
                        [19, 15]
                    ]
                },
                "circle-opacity": {
                    'stops': [
                        [9, 0.15],
                        [19, 0.5]
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
                    property: 'state_offense_code',
                    type: 'categorical',
                    default: '#555',
                    stops: computeColors()
                },
                "circle-radius": {
                    'base': 1.25,
                    'stops': [
                        [8, 3],
                        [19, 9]
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
                        [9, 0.2],
                        [19, 1]
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
        console.log(Data.offenses)
        let offenseHtml = `
        <section class="filters" id="categories-list">
        <button><span>Crime Type</span></button>
        <div class="filters-dropdown">
        `
        Object.entries(Data.offenses).forEach(([k,v]) => {
            offenseHtml += `
                <span>
                ${v[0].top}</span>
                    ${v.map (o => `<div class="offense_category">
                    <input type ="checkbox" id="${o.name.toLowerCase().replace(' ','-')}-check" class="offense-checkbox" data-codes="${o.state_codes.join(" ")}" data-name="${o.name}"/>
                    <label for="${o.name.toLowerCase().replace(' ','-')}-check"></label> ${Helpers.toSentenceCase(o.name)}`).join("")}</div>`
        })
        offenseHtml += `</div></section>`
        $('#date-list').before(offenseHtml)
    }
}

export default Init;
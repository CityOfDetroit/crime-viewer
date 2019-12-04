import React from 'react';
import _ from 'lodash'
import arrestCodes from '../data/arrestCodes';
import {Dropdown, Segment} from 'semantic-ui-react';

const CrimeTypeFilter = ({ crimeTypes, setCrimeTypes }) => {
  let byAreas = _.groupBy(_.uniqBy(Object.values(arrestCodes), ac => ac.area + ac.category), 'area' )

  return (
    <section style={{marginTop: '1em'}}>
      <h3>Change crime types</h3>
      {Object.keys(byAreas).sort((a,b)=>a < b).map(ak => {
        let keys = byAreas[ak].sort((a, b) => b.category < a.category).map(u => {
          return {
            key: `${u.area}_${u.category}`,
            text: u.category,
            value: `${u.area}_${u.category}`
          }
        })
        return(
          <div className="rowDiv">
        <h4 style={{display: 'inline-block', minWidth: 100, fontWeight: 500, margin: 0}}>{ak}</h4>
        <Dropdown id={ak} onChange={(e, d) => {
          let area = d.id
          let changedCrimeTypes = {}
          Object.keys(byAreas).forEach(r => {
            if (r !== area) {
              changedCrimeTypes[r] = crimeTypes[r]
            }
            else {
              changedCrimeTypes[area] = d.value.map(v => v.split('_')[1])
            }
          })
          setCrimeTypes(changedCrimeTypes)
        }} options={keys} placeholder={`${ak} crimes`} labeled fluid multiple selection/>
        </div>
      )})}
    </section>
  )
}

export default CrimeTypeFilter;
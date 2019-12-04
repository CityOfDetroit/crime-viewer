import React, {useState} from 'react';
import {Card, Icon} from 'semantic-ui-react'

const Sidebar = ({ close, children }) => {
  
  let sidebarStyle = {
    gridArea: "f",
    padding: '1em',
    height: '100%',
    overflowY: 'auto'
  }  

  let filterStyle = {
    marginTop: '.5em',
    padding: '.5em',
    background: '#eee'
  }

  return (
    <div style={sidebarStyle}>
      <header>
        <div className="rowDiv">
        <div className="rowDiv">

        <img src="https://cityofdetroit.github.io/crime-viewer/img/green.png" style={{height: 50, display: 'inline-block'}} />
        <h1 className="hul">Detroit Crime Viewer
        </h1>
        </div>
        {close}
        </div>
      </header>
      {children}
    </div>
  )
}

export default Sidebar;
import React from 'react';
import {Modal, Icon, Container, Message} from 'semantic-ui-react'

const WelcomeModal = () => (
  <>
    <Modal.Header as='h2' style={{fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 0}}>
      <h2 style={{margin: 0}}>Welcome to the City of Detroit Crime Viewer</h2>
    </Modal.Header>
    
    <Modal.Content>
    <Message>
      <Message.Header>Note: This tool is currently in BETA mode.</Message.Header>
      <Message.Content>
      Please submit all feedback to <a href="https://app.smartsheet.com/b/form/4b5e8883ad654704b7d04d1f9c747896">this web form</a>.      </Message.Content>
    </Message>
    <p style={{fontSize: '1.25em'}}>You can use this tool to view crimes which occurred in the city of Detroit over the past year.</p>
    <p style={{fontSize: '1.25em'}}><Icon name='filter'/>Adjust the <b>date range</b> or the list of <b>crime types</b> below to change which incidents appear on the map.</p>
    <p style={{fontSize: '1.25em'}}><Icon name='search' />You can <b>search for an address</b> using the search bar in the top left of the map, or click the <b>geolocate</b> <Icon name='crosshairs'/> button to zoom to your current location.</p>
    <p style={{fontSize: '1.25em'}}>Click <b>an intersection on the map</b> to bring up more information about the incidents which occurred there and match the current set of filters.</p>
    <p style={{fontSize: '1.25em'}}>Do you want to access the raw data behind this tool? Visit the <b><a href="https://data.detroitmi.gov/datasets/rms-crime-incidents">RMS Crime Incidents dataset</a></b> on the City's open data portal.</p>
    <Message>
      <Message.Header>A note on anonymization</Message.Header>
      <Message.Content>
        In order to protect the privacy of individuals connected to these incidents, the geographic coordinates of all incidents have been snapped to a nearby intersection. The coordinates and address provided in this data reflect the nearby anonymized intersection. 
      </Message.Content>
    </Message>
    </Modal.Content>
  </>
)

export default WelcomeModal;


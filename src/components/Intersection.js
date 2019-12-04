import React from "react";
import arrestCodes from "../data/arrestCodes";
import moment from "moment";
import { Card, Icon, Table } from "semantic-ui-react";

const Incident = ({ incident, stripe }) => {
  let incidentStyle = {
    background: stripe ? "#eee" : "#ddd",
    padding: 5
  };

  let fieldStyle = {
    fontWeight: "600",
    fontSize: `1.1em`,
    color: `rgba(0,0,0,.65)`,
    fontFamily: "Roboto Condensed"
  };

  let valueStyle = {
    fontWeight: "500",
    fontSize: `1.1em`,
    color: `rgba(0,0,0,.65)`,
    fontFamily: "Roboto Condensed"
  };

  let fields = {
    Date: moment(incident.incident_timestamp * 1000).format("ddd, MMMM Do YYYY"),
    Time: moment(incident.incident_timestamp * 1000).format("h:mm a"),
    Offense: arrestCodes[incident.arrest_charge].description,
    "Report #": incident.report_number
  };

  return (
    <Table definition compact>
      <Table.Body>
        {Object.entries(fields).map(e => (
          <Table.Row>
            <Table.Cell width={2} style={fieldStyle}>
              {e[0]}
            </Table.Cell>
            <Table.Cell width={10} style={valueStyle}>
              {e[1]}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

const Intersection = ({ intersection }) => {
  let incidents = intersection.properties.incidents;
  if (typeof intersection.properties.incidents === "string") {
    incidents = JSON.parse(intersection.properties.incidents).sort((a, b) => a.incident_timestamp > b.incident_timestamp);
  }

  let cardStyle = {
    width: "100%"
  };

  let cardHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 0
  };

  let headerStyle = {
    margin: 0,
    textAlign: "right"
  };

  return (
    <Card style={cardStyle}>
      <Card.Content>
        <Card.Header style={cardHeaderStyle}>
          <Icon name="crosshairs" size="large" />
          <h2 className="hul" style={headerStyle}>
            {incidents[0].inter} & {incidents[0].main}
          </h2>
        </Card.Header>
      </Card.Content>
      <Card.Content style={{ maxHeight: "40vh", overflowY: "auto" }}>
        {incidents.map((i, j) => (
          <Incident incident={i} key={i.report_number + j} stripe={j % 2 === 0} />
        ))}
      </Card.Content>
      <Card.Content extra>
        {incidents.length} matching incident{incidents.length > 1 ? `s` : ``}
      </Card.Content>
    </Card>
  );
};

export default Intersection;

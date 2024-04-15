import React, { useState } from "react";
import _ from "lodash";
import moment from "moment";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import Intersection from "./components/Intersection";
import "semantic-ui-css/semantic.min.css";
import { Card, Icon, Modal } from "semantic-ui-react";
import "./css/App.css";
import CrimeTypeFilter from "./components/CrimeTypeFilter";
import DateFilter from "./components/DateFilter";
import WelcomeModal from "./components/WelcomeModal";

const Filters = ({ children }) => {
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
    margin: 0
  };

  return (
    <Card style={cardStyle}>
      <Card.Content>
        <Card.Header style={cardHeaderStyle}>
          <Icon name="filter" size="large" />
          <h2 style={headerStyle}>Adjust filters</h2>
        </Card.Header>
      </Card.Content>
      <Card.Content style={{}}>{children}</Card.Content>
    </Card>
  );
};

const ZoomToArea = ({ children }) => {
  let filterStyle = {
    marginTop: ".5em",
    padding: ".5em",
    background: "#eee"
  };
  return (
    <section style={filterStyle}>
      <h2>View area</h2>
      {children}
    </section>
  );
};

function App() {
  let [intersection, setIntersection] = useState(null);
  let [modal, setModal] = useState(true);

  // default time range is the last 14 days
  let [timeRange, setTimeRange] = useState([
    moment()
      .subtract(14, "days")
      .unix(),
    moment().unix()
  ]);

  let [crimeTypes, setCrimeTypes] = useState({
    Violent: [],
    Property: [],
    Other: []
  });

  let appStyle = {
    display: "grid",
    gridTemplateColumns: `minmax(450px, 2fr) 5fr`,
    gridTemplateRows: `2fr 3fr`,
    gridTemplateAreas: `"f m" "f m"`,
    height: "100vh",
    width: "100vw"
  };

  return (
    <div className="App" style={appStyle}>
      <Modal open={modal} onClose={() => setModal(false)} closeIcon>
        <WelcomeModal />
      </Modal>
      <Sidebar
        close={
          <Icon
            name="help circle"
            size="large"
            onClick={() => setModal(true)}
          />
        }
      >
        <Filters>
          <DateFilter timeRange={timeRange} setTimeRange={setTimeRange} />
          <CrimeTypeFilter
            crimeTypes={crimeTypes}
            setCrimeTypes={setCrimeTypes}
          />
        </Filters>
        {intersection && <Intersection intersection={intersection} />}
      </Sidebar>
      <Map
        intersection={intersection}
        setIntersection={setIntersection}
        timeRange={timeRange}
        crimeTypes={crimeTypes}
      />
    </div>
  );
}

export default App;

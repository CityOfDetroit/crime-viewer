import React from "react";
import moment from "moment";
import { Input, Label, Segment } from "semantic-ui-react";

export const DateFilter = ({ timeRange, setTimeRange }) => {
  let spanStyle = { display: "inline-block", minWidth: 100, fontWeight: 600, margin: 0 };
  return (
    <section>
      <h3>Date range</h3>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>

        <Input
          type="date"
          name="beginning"
          labelPosition='left' 
          min={moment().subtract(1, 'year').format("YYYY-MM-DD")}
          max={moment().format("YYYY-MM-DD")}
          value={moment(timeRange[0], "X").format("YYYY-MM-DD")}
          onChange={(e, d) => setTimeRange([parseInt(moment(d.value, "YYYY-MM-DD").format("X")), timeRange[1]])}>
                        <Label basic>From:</Label>
            <input />
          </Input>
        <Input
          type="date"
          name="ending"
          labelPosition='left' 
          min={moment().subtract(1, 'year').format("YYYY-MM-DD")}
          max={moment().format("YYYY-MM-DD")}
          value={moment(timeRange[1], "X").format("YYYY-MM-DD")}
          onChange={(e, d) => setTimeRange([timeRange[0], parseInt(moment(d.value, "YYYY-MM-DD").format("X"))])}>

            <Label basic>To:</Label>
            <input />
          </Input>
          </div>
        </section>
  );
};

export default DateFilter;

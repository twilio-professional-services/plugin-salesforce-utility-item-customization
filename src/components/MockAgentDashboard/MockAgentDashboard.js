import React from "react";

import { withTheme, AggregatedDataTile } from "@twilio/flex-ui";

import { Container, FirstLineContainer, FirstLine, Grid } from "./MockAgentDashboard.Components"

class MockAgentDashboard extends React.Component {


  constructor(props) {
    super(props);

  }




  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <Container>
        <FirstLineContainer>
            <FirstLine>
                Agent Stats
            </FirstLine>
        </FirstLineContainer>
        <Grid>
          <AggregatedDataTile
              key="mock-dash-call-tile" 
              title="Calls" 
              content="6"/>
          <AggregatedDataTile 
              key="mock-dash-handle-time-tile" 
              title="Handle Time" 
              content="225"/>
          <AggregatedDataTile 
              key="mock-dash-acw-tile" 
              title="ACW" 
              content="22"/>    
        </Grid>
      </Container>
    );
  }
}

export default withTheme(MockAgentDashboard);
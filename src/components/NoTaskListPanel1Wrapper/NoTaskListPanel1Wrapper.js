import React from "react";

import { withTheme, TaskCanvas, ContentFragment, WorkerDirectory } from "@twilio/flex-ui";

class NoTaskListPanel1Wrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    return (
      <ContentFragment>
          <TaskCanvas key="taskCanvas" />
          <WorkerDirectory key="worker-directory" />
      </ContentFragment>
    );
  }
}

export default withTheme(NoTaskListPanel1Wrapper);

import React from "react";

import { withTheme, IconButton } from "@twilio/flex-ui";

class RefreshSfdcButton extends React.Component {


  constructor(props) {
    super(props);
  }




  componentDidMount() {
  }

  componentDidUpdate() {}

  componentWillUnmount() {
  }

  render() {
    return (
        <IconButton
          {...this.props}
          icon="Loading"
          iconActive="Loading"
          onClick={this.props.handleOnClick}
          title="Refresh Salesforce"
        />
    );
  }
}

export default RefreshSfdcButton;
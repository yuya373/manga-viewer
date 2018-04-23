import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import store from './../persistence/store.js';
import * as actions from './../actions/ipc_renderer.js';

class IpcRenderer extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const state = store.get("state", {});
    this.props.stateLoaded(state);

    store.onDidChange("state", (newValue, oldValue) => {
      this.props.stateChanged(state);
    });
  }

  render() {
    return this.props.children;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(IpcRenderer);

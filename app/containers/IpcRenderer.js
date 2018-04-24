import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ipcRenderer } from 'electron';
import Store from 'electron-store';
import * as actions from './../actions/ipc_renderer.js';

class IpcRenderer extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const store = new Store();
    const state = store.get("state", {});
    this.props.stateLoaded(state);

    // store.onDidChange("state", (newValue, oldValue) => {
    //   this.props.stateChanged(newValue);
    // });
    // ipcRenderer.on(actions.STATE_LOADED, (e, state) => {
    //   this.props.stateLoaded(state);
    // });
    ipcRenderer.on(actions.STATE_CHANGED, (e, state) => {
      this.props.stateChanged(state);
    });
    ipcRenderer.on(actions.PARSE_DIR_ERROR, (e, {payload}) => {
      this.props.parseDirError(payload);
    })
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

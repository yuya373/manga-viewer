// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';
import IpcRenderer from './IpcRenderer.js';

type Props = {
  store: {},
  history: {}
};


export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <IpcRenderer>
          <ConnectedRouter history={this.props.history}>
            <Routes />
          </ConnectedRouter>
        </IpcRenderer>
      </Provider>
    );
  }
}

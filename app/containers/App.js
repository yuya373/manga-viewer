// @flow
import * as React from 'react';
import Drawer from './Drawer.js';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Drawer />
        {this.props.children}
      </React.Fragment>
    );
  }
}

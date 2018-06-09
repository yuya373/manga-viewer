import React, { Component } from 'react';

export default class Redirect extends Component {
  componentDidMount() {
    const { redirectToDirectory } = this.props;
    redirectToDirectory();
  }

  render() {
    return null;
  }
}

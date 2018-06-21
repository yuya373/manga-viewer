import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import SwapVertIcon from '@material-ui/icons/SwapVert';

export default class Sort extends PureComponent {
  handleClick = () => {
    const {
      toggleDirection,
    } = this.props;
    toggleDirection();
  }

  render() {
    const {
      desc,
    } = this.props;

    return (
      <IconButton
        color="inherit"
        onClick={this.handleClick}
        >
        <SwapVertIcon />
      </IconButton>
    );
  }
}

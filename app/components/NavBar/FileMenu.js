import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import SettingIcon from '@material-ui/icons/Settings';
import Switch from 'material-ui/Switch';
import List, {
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import { FormGroup, FormControlLabel } from 'material-ui/Form';


const styles = theme => ({
  menuItemControl: {
    paddingRight: theme.spacing.unit * 2,
    marginRight: 0,
  }
});

class FileMenu extends Component {
  state = {
    menuAnchor: null
  };

  handleMenuOpen = (e) => this.setState({menuAnchor: e.currentTarget});

  handleMenuClose = (e) => this.setState({menuAnchor: null});

  handlePerPageSwitch = (e) => {
    const {perPage, filePerPageChanged} = this.props;
    e.stopPropagation();
    e.preventDefault();
    filePerPageChanged(perPage === 2 ? 1 : 2);
    this.setState({menuAnchor: null});
  }


  render() {
    const {classes, perPage} = this.props;
    const {menuAnchor} = this.state;
    const perPageSwitch = (
      <Switch checked={perPage == 2}/>
    );

    return (
      <React.Fragment>
        <IconButton
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup="true"
          onClick={this.handleMenuOpen}
          color="inherit"
          >
          <SettingIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClick={this.handleMenuClose}
          >
          <MenuItem onClick={this.handlePerPageSwitch} >
            <FormControlLabel
              className={classes.menuItemControl}
              control={perPageSwitch}
              label="Spread"
              />
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(FileMenu);

import React, {Component} from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slide from 'material-ui/transitions/Slide';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from './../Drawer.js';

const styles = theme => ({
  title: {
    flex: 1,
  },
  menuButton: {
    color: "inherit",
    marginLeft: -(theme.spacing.unit * 1),
    marginRight: theme.spacing.unit * 2,
  },
});

class NavBar extends Component {
  state = {
    isDrawerOpen: false,
  };

  modifyDrawer = (isOpen) => () => this.setState((state) => ({
    isDrawerOpen: isOpen,
  }));

  renderBackButton = () => {
    const {
      classes,
      handleClickBack,
    } = this.props;

    if ((typeof handleClickBack) !== 'function')
      return null;

    return (
      <IconButton
        onClick={handleClickBack}
        className={classes.menuButton}
        aria-label="Back"
        >
        <ArrowBackIcon />
      </IconButton>
    );
  }

  render() {
    const {
      classes, title, visible,
      handleClickBack,
      menu,
      position,
    } = this.props;

    const {isDrawerOpen} = this.state;

    return (
      <React.Fragment>
        <Slide direction="down" in={visible} >
          <AppBar position={position}>
            <Toolbar >
              {this.renderBackButton()}
              <Typography
                className={classes.title}
                variant="title"
                color="inherit"
                >
                {title}
              </Typography>
              {menu}
              <IconButton
                color="inherit"
                onClick={this.modifyDrawer(true)}
                aria-label="Menu"
                >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Slide>
        <Drawer
          isOpen={isDrawerOpen}
          onClose={this.modifyDrawer(false)}
          />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NavBar);

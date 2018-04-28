import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slide from 'material-ui/transitions/Slide';
import Menu, { MenuItem } from 'material-ui/Menu';
import SettingIcon from '@material-ui/icons/Settings';
import Switch from 'material-ui/Switch';
import List, {
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import ImageFile from './ImageFile.js';
import PdfFile from './PdfFile.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flex: 1,
  },
  backButton: {
    color: "inherit",
    marginLeft: -(theme.spacing.unit * 1),
    marginRight: theme.spacing.unit * 2,
    menuAnchor: null,
  },
  menuItemControl: {
    paddingRight: theme.spacing.unit * 2,
    marginRight: 0,
  }
});

class File extends Component {
  state = {
    displayAppBar: true,
    menuAnchor: null
  };
  handleClickBack = () => {
    const {gotoDirectory, directory} = this.props;
    gotoDirectory(directory);
  }

  handleMenuOpen = (e) => this.setState({menuAnchor: e.currentTarget});

  handleMenuClose = (e) => this.setState({menuAnchor: null});

  handlePerPageSwitch = (e) => {
    const {perPage, filePerPageChanged} = this.props;
    e.stopPropagation();
    e.preventDefault();
    filePerPageChanged(perPage === 2 ? 1 : 2);
    this.setState({menuAnchor: null});
  }

  handleMouseEnter = () => {
    this.clearTimers();
    this.hideAppBarTimer = window.setTimeout(
      () => this.setState({displayAppBar: false}),
      500
    );
  }

  handleMouseLeave = () => {
    this.clearTimers();
    this.displayAppBarTimer = window.setTimeout(
      () =>this.setState({displayAppBar: true}),
      500
    );
  }
  displayAppBarTimer = null;
  hideAppBarTimer = null;

  componentDidMount() {
    const {file, directory, loadFile} = this.props;
    if (file && directory) {
      loadFile(file, directory);
    }
  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps")
  }

  componentWillUnmount() {
    this.clearTimers();
  }

  clearTimers() {
    if (this.displayAppBarTimer) {
      window.clearTimeout(this.displayAppBarTimer);
    }
    if (this.hideAppBarTimer) {
      window.clearTimeout(this.hideAppBarTimer);
    }
  }

  renderAppBar() {
    const {displayAppBar, menuAnchor} = this.state;
    const {
      classes, file, directory, perPage,
    } = this.props;

    const perPageSwitch = (
      <Switch checked={perPage == 2}/>
    );

    return (
      <Slide direction="down" in={displayAppBar} >
        <AppBar>
          <Toolbar >
            <IconButton
              onClick={this.handleClickBack}
              className={classes.backButton}
              aria-label="Back"
              >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              className={classes.title}
              variant="title"
              color="inherit"
              >
              {file.name}
            </Typography>
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
          </Toolbar>
        </AppBar>
      </Slide>
    )
  }

  renderFile() {
    const {file, perPage} = this.props;

    switch(file.ext) {
    case "zip":
      return (<ImageFile file={file} perPage={perPage} />);
    case "pdf":
      return (<PdfFile file={file} />);
    default:
      return null;
    }
  }

  render() {
    const {classes, file, directory} = this.props;

    if (!file && directory) {
      return (
        <Redirect to={`/directories${directory.path}`}/>
      )
    }

    if (!file || !directory) {
      return <Redirect to="/" />
    }

    return (
      <React.Fragment>
        {this.renderAppBar()}
        <Grid
          container
          className={classes.root}
          spacing={0}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          >
          {this.renderFile()}
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(File);

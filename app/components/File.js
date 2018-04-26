import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
import Canvas from './Canvas.js';

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
  constructor(props) {
    super(props);
    this.state = {
      perPage: 2,
      index: 0,
      width: null,
      displayAppBar: true,
    };
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.displayAppBarTimer = null;
    this.hideAppBarTimer = null;
  }

  componentDidMount() {
    const {file, directory, loadFile} = this.props;
    if (file && directory) {
      loadFile(file, directory);
    }
    document.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps")
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyUp);
    this.clearTimers();
  }

  handleKeyUp(event) {
    const {altKey, ctrlKey, key, keyCode, metaKey, shiftKey} = event;
    console.log(
      "keyup",
      "altKey", altKey,
      "ctrlKey", ctrlKey,
      "metaKey", metaKey,
      "shiftKey", shiftKey,
      "key", key,
      "keyCode", keyCode,
    );
    if (!altKey && !ctrlKey && !metaKey && !shiftKey) {
      if (keyCode === 37) {
        this.nextPage();
      }
      if (keyCode === 39) {
        this.prevPage();
      }
    }
  }

  nextPage() {
    const {file} = this.props;
    const {index, perPage} = this.state;
    const nextIndex = Math.min(index + perPage, (file.images.length - 1));
    this.setState({index: nextIndex});
  }

  prevPage() {
    const {index, perPage} = this.state;
    const nextIndex = Math.max(0, index - perPage);
    this.setState({index: nextIndex});
  }

  renderImages() {
    const {index, perPage} = this.state;
    const {classes, file} = this.props;

    const images = file.images.slice(index, index + perPage).reverse();
    const innerGridProps = perPage !== 1 ?
          (i) =>  ({
            justify: i === 0 ? "flex-end" : "flex-start",
          }) : () => ({
            justify: "center",
          });
    return images.map((e, i) => (
      <Grid item xs={12 / perPage} key={i} >
        <Grid
          container
          direction="row"
          alignItems="center"
          {...innerGridProps(i)}
          >
          <Canvas
            base64={e.base64}
            name={e.name}
            width={window.innerWidth / perPage}
            height={window.innerHeight}
            />
        </Grid>
      </Grid>
    ))
  }

  renderAppBar() {
    const {displayAppBar, menuAnchor, perPage} = this.state;
    const {classes, file, directory} = this.props;
    const handleClickBack = () =>
          this.props.gotoDirectory(directory);
    const handleMenuOpen = (e) =>
          this.setState({menuAnchor: e.currentTarget});
    const handleMenuClose = (e) =>
          this.setState({menuAnchor: null});
    const handlePerPageSwitch = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.setState(
        (s) => ({perPage: s.perPage === 2 ? 1 : 2}),
        () => this.setState({menuAnchor: null})
      );
    }

    const perPageSwitch = (
      <Switch checked={perPage == 2}/>
    );

    return (
      <Slide direction="down" in={displayAppBar} >
        <AppBar>
          <Toolbar >
            <IconButton
              onClick={handleClickBack}
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
              onClick={handleMenuOpen}
              color="inherit"
              >
              <SettingIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClick={handleMenuClose}
              >
              <MenuItem onClick={handlePerPageSwitch} >
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

  clearTimers() {
    if (this.displayAppBarTimer) {
      window.clearTimeout(this.displayAppBarTimer);
    }
    if (this.hideAppBarTimer) {
      window.clearTimeout(this.hideAppBarTimer);
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

    const handleMouseEnter = () => {
      this.clearTimers();
      this.hideAppBarTimer = window.setTimeout(
        () => this.setState({displayAppBar: false}),
        500
      );

    }

    const handleMouseLeave = () => {
      this.clearTimers();
      this.displayAppBarTimer = window.setTimeout(
        () =>this.setState({displayAppBar: true}),
        500
      );
    }

    return (
      <React.Fragment>
        {this.renderAppBar()}
        <Grid
          container
          className={classes.root}
          spacing={0}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          >
          {this.renderImages()}
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(File);

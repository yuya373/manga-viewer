import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import ImageFile from './../../containers/File/ImageFile.js';
import PdfFile from './PdfFile.js';
import NavBar from './../../containers/NavBar/Index.js';
import FileMenu from './../../containers/NavBar/FileMenu.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

class File extends PureComponent {
  mounted = false
  state = {
    displayAppBar: true,
  };
  hideAppBar = () => {
    this.hideAppBarTimer = window.setTimeout(
      () => this.mounted && this.setState({displayAppBar: false}),
      500
    );
  }
  displayAppBar = () => {
    this.displayAppBarTimer = window.setTimeout(
      () => this.mounted && this.setState({displayAppBar: true}),
      500
    );
  }
  handleClickBack = () => {
    const {goBack, gotoDirectory, directory} = this.props;
    if (goBack) {
      goBack();
    } else {
      gotoDirectory(directory.path);
    }
  }
  handleMouseEnter = () => {
    this.clearTimers();
    this.hideAppBar();
  }
  handleMouseLeave = () => {
    this.clearTimers();
    this.displayAppBar();
  }
  handleKeyUp = (event) => {
    event.preventDefault();
    const {shiftKey, keyCode} = event;
    if (shiftKey) {
      switch(keyCode) {
      case 72:
        this.handleClickBack();
        return;
      }
    }
  }
  clearTimers = () => {
    if (this.displayAppBarTimer) {
      window.clearTimeout(this.displayAppBarTimer);
    }
    if (this.hideAppBarTimer) {
      window.clearTimeout(this.hideAppBarTimer);
    }
  }
  redirectIfNotExists = ({loading, gotoDirectory, file, directory}) => {
    if (loading) return;
    if (!directory) {
      gotoDirectory(require('os').homedir());
      return;
    }
    if (!file) {
      gotoDirectory(directory.path);
      return;
    }
  }
  renderAppBar = () => {
    const {displayAppBar} = this.state;
    const {file} = this.props;

    const menu = file.ext === "zip" ?
          (<FileMenu filePath={file.path} />) : null;

    return (
      <NavBar
        visible={displayAppBar}
        title={file.name}
        onClickBack={this.handleClickBack}
        menu={menu}
        />
    );
  }
  renderFile = () => {
    const {file, perPage, directory} = this.props;

    switch(file.ext) {
    case "zip":
      return (<ImageFile file={file} directory={directory} />);
    case "pdf":
      return (<PdfFile file={file} />);
    default:
      return null;
    }
  }

  displayAppBarTimer = null;
  hideAppBarTimer = null;

  componentWillMount() {
    this.redirectIfNotExists(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectIfNotExists(nextProps);
  }

  componentDidMount() {
    this.mounted = true
    const {file, directory} = this.props;
    if (file && directory) {
      document.addEventListener("keyup", this.handleKeyUp);
      setTimeout(this.hideAppBar, 1000);
    }
  }

  componentWillUnmount() {
    this.mounted = false
    this.clearTimers();
    document.removeEventListener("keyup", this.handleKeyUp);
  }


  render() {
    const {classes, loading, file, directory, gotoDirectory} = this.props;

    if (loading || !file) return null;

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

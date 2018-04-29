import React, { Component } from 'react';
import { Redirect } from 'react-router';
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

class File extends Component {
  state = {
    displayAppBar: true,
  };
  hideAppBar = () => {
    this.hideAppBarTimer = window.setTimeout(
      () => this.setState({displayAppBar: false}),
      500
    );
  }
  displayAppBar = () => {
    this.displayAppBarTimer = window.setTimeout(
      () =>this.setState({displayAppBar: true}),
      500
    );
  }
  handleClickBack = () => {
    const {gotoDirectory, directory} = this.props;
    gotoDirectory(directory);
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
    const {shiftKey, keyCode} = event;
    const {gotoDirectory, directory} = this.props;
    if (shiftKey) {
      switch(keyCode) {
      case 72:
        gotoDirectory(directory);
        return;
      }
    }
  }

  displayAppBarTimer = null;
  hideAppBarTimer = null;

  componentDidMount() {
    const {file, directory, loadFile} = this.props;
    if (file && directory) {
      loadFile(file, directory);
      document.addEventListener("keyup", this.handleKeyUp);
    }
    setTimeout(this.hideAppBar, 1000);
  }

  componentWillReceiveProps() {
    console.log("componentWillReceiveProps")
  }

  componentWillUnmount() {
    this.clearTimers();
    document.removeEventListener("keyup", this.handleKeyUp);
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
    const {displayAppBar} = this.state;
    const {file} = this.props;

    const menu = file.ext === "zip" ?
          (<FileMenu />) : null;

    return (
      <NavBar
        visible={displayAppBar}
        title={file.name}
        onClickBack={this.handleClickBack}
        menu={menu}
        />
    );
  }

  renderFile() {
    const {file, perPage} = this.props;

    switch(file.ext) {
    case "zip":
      return (<ImageFile file={file} />);
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

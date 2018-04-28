import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import ImageFile from './ImageFile.js';
import PdfFile from './PdfFile.js';
import NavBar from './../NavBar/index.js';
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
  handleClickBack = () => {
    const {gotoDirectory, directory} = this.props;
    gotoDirectory(directory);
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
    const {displayAppBar} = this.state;
    const {file} = this.props;

    const menu = file.ext === "zip" ?
          (<FileMenu />) : null;

    return (
      <NavBar
        visible={displayAppBar}
        title={file.name}
        handleClickBack={this.handleClickBack}
        menu={menu}
        />
    );
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

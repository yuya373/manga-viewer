import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import NavBar from './../containers/NavBar/Index.js';
import ListItem from './ListItem.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    margin: 0,
  },
});

class Favorite extends Component {
  toggleFavorite = (target, isFile) => () => {
    if (isFile) {
      this.props.fileFavoriteChanged(
        target.parent, target, false
      );
    } else {
      this.props.directoryFavoriteChanged(
        target.parent, target, false
      );
    }
  }
  gotoFile = (file) => () => {
    this.props.gotoFile(file, file.parent);
  }
  renderFile = (file, i) => {
    return (
      <React.Fragment key={i}>
        <ListItem
          text={file.name}
          favorite={file.favorite}
          onClick={this.gotoFile(file)}
          onClickFavorite={this.toggleFavorite(file, true)}
          />
      </React.Fragment>
    );
  }
  gotoDirectory = (directory) => () => {
    this.props.gotoDirectory(directory);
  }
  renderDirectory = (directory, i) => {
    return (
      <React.Fragment key={i}>
        <ListItem
          text={directory.name}
          favorite={directory.favorite}
          isDirectory={true}
          onClick={this.gotoDirectory(directory)}
          onClickFavorite={this.toggleFavorite(directory)}
          />
      </React.Fragment>
    );
  }
  render() {
    const {
      classes,
      files,
      directories,
    } = this.props;

    return (
      <React.Fragment>
        <NavBar
          title="Favorites"
          visible={true}
          position="sticky"
          />
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <List>
              <ListSubheader disableSticky={true} >
                Files
              </ListSubheader>
              {files.map(this.renderFile)}
              <ListSubheader disableSticky={true} >
                Directories
              </ListSubheader>
              {directories.map(this.renderDirectory)}
            </List>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Favorite);

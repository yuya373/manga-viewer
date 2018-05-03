import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import NavBar from './../containers/NavBar/Index.js';
import FileListItem from './../containers/ListItem/FileListItem.js';
import DirectoryListItem from './../containers/ListItem/DirectoryListItem.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    margin: 0,
  },
});

class Favorite extends PureComponent {
  renderFile = (file, i) => {
    return (
      <React.Fragment key={i}>
        <FileListItem
          file={file}
          directory={file.parent}
          queryParams={{backTo: "/favorites"}}
          />
      </React.Fragment>
    );
  }
  renderDirectory = (directory, i) => {
    return (
      <React.Fragment key={i}>
        <DirectoryListItem
          directory={directory}
          queryParams={{backTo: "/favorites"}}
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

import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import NavBar from './../containers/NavBar/Index.js';
import DirectoryMenu from './NavBar/DirectoryMenu.js';
import FileListItem from './../containers/ListItem/FileListItem.js';
import DirectoryListItem from './../containers/ListItem/DirectoryListItem.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    margin: 0,
  },
});

class Directory extends PureComponent {
  handleClickReload = () => {
    const { directory, gotoDirectory } = this.props;
    gotoDirectory(directory.path, {}, true);
  };
  handleClickBack = () => {
    const { goBack, directory, gotoDirectory } = this.props;
    if (goBack) {
      goBack();
      return;
    }

    if (directory) {
      const paths = directory.path.split("/");
      const parent = paths.slice(0, paths.length - 1).join("/");
      console.log("PARENT", parent);
      gotoDirectory(parent);
    } else {
      gotoDirectory("/");
    }
  };
  renderFile = (file, i) => {
    const { directory } = this.props;
    return (
      <React.Fragment key={i}>
        <FileListItem
          file={file}
          directory={directory}
          />
      </React.Fragment>
    );
  }
  renderDirectory = (dir, i) => {
    return (
      <React.Fragment key={i}>
        <DirectoryListItem
          directory={dir} />
      </React.Fragment>
    );
  };
  redirectIfDirectoryNotExists = ({path, directory, loading, gotoDirectory}) => {
    if (loading) return;
    if (!directory) {
      const paths = `/${path}`.split("/");
      const parent = paths.slice(0, paths.length - 1).join("/");
      gotoDirectory(parent);
    }
  }

  componentWillMount() {
    this.redirectIfDirectoryNotExists(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectIfDirectoryNotExists(nextProps);
  }

  render() {
    const {
      classes, path, directory,
      loading, gotoDirectory,
    } = this.props;

    if (loading || !directory) return null;

    return (
      <React.Fragment>
        <NavBar
          title={directory.path}
          visible={true}
          onClickBack={this.handleClickBack}
          position="sticky"
          menu={<DirectoryMenu onClickReload={this.handleClickReload} />}
          />
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <List >
              <ListSubheader disableSticky={true} >
                Files
              </ListSubheader>
              {directory && directory.files.map(this.renderFile)}
              <ListSubheader disableSticky={true} >
                Directories
              </ListSubheader>
              {directory && directory.childDirectories.map(this.renderDirectory)}
            </List>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Directory);

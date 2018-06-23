import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import NavBar from './../containers/NavBar/Index.js';
import DirectoryMenu from './NavBar/DirectoryMenu.js';
import LazyList from './../containers/LazyList.js';

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
      const parent = paths.
            slice(0, paths.length - 1).join("/") || "/";
      console.log("PARENT: ", parent);
      gotoDirectory(parent);
    } else {
      gotoDirectory("/");
    }
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
      location, sort,
    } = this.props;
    const {
      files = [], childDirectories = [],
    } = directory;

    if (loading || !directory) return null;

    const disableBackButton = directory.path === "/";
    const navMenu = (
      <DirectoryMenu
        onClickReload={this.handleClickReload}
        />
    );

    return (
      <React.Fragment>
        <NavBar
          title={directory.path}
          visible={true}
          onClickBack={this.handleClickBack}
          position="sticky"
          menu={navMenu}
          disableBackButton={disableBackButton}
          />
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <LazyList
              location={location}
              directory={directory}
              files={files}
              directories={childDirectories}
              sort={sort}
              />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Directory);

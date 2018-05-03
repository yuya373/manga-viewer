import React, { PureComponent } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import NavBar from './../containers/NavBar/Index.js';
import DirectoryMenu from './NavBar/DirectoryMenu.js';
import ListItem from './ListItem.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    margin: 0,
  },
});

class Directory extends PureComponent {
  handleClickFile = (file, directory) => {
    const { gotoFile } = this.props;
    gotoFile(file, directory);
  };
  handleClickDirectory = (dir) => {
    const { gotoDirectory } = this.props;
    gotoDirectory(dir.path);
  };
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
  toggleFavorite = ({path, favorite}, isFile = false) => () => {
    if (isFile) {
      this.props.fileFavoriteChanged({path, favorite});
    } else {
      this.props.directoryFavoriteChanged({path, favorite});
    }
  }
  addTag = (file) => (tag) => {
    this.props.addTag({ tag, filePath: file.path });
  };
  deleteTag = (file) => (tag) => {
    this.props.deleteTag({ tag, filePath: file.path });
  }
  renderFile = (file, i) => {
    const { directory, favoriteFiles, tags } = this.props;
    const { name, path } = file;
    const favorite = favoriteFiles.includes(path);
    const matchedTags =
          Object.keys(tags).filter((e) => tags[e].includes(path))

    return (
      <React.Fragment
        key={i}
        >
        <ListItem
          text={name}
          favorite={favorite}
          onClick={() => this.handleClickFile(file, directory)}
          onClickFavorite={this.toggleFavorite({path, favorite: !favorite}, true)}
          addTag={this.addTag(file)}
          deleteTag={this.deleteTag(file)}
          tags={matchedTags}
          />

      </React.Fragment>
    );
  }
  renderDirectory = (dir, i) => {
    const { directory, favoriteDirectories } = this.props;
    const parent = directory;
    const { name, path } = dir;
    const favorite = favoriteDirectories.includes(path);

    return (
      <React.Fragment
        key={i}
        >
        <ListItem
          text={name}
          favorite={favorite}
          isDirectory={true}
          onClick={() => this.handleClickDirectory(dir)}
          onClickFavorite={this.toggleFavorite({path, favorite: !favorite})}
          />
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

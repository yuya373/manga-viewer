import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
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

class Directory extends Component {
  handleClickFile = (file, directory) => {
    const { onClickFile } = this.props;
    onClickFile(file, directory);
  };
  handleClickDirectory = (dir) => {
    const { onClickDirectory } = this.props;
    onClickDirectory(dir.path);
  };
  handleClickReload = () => {
    const { path } = this.props;
    this.loadDirectory(`/${path}`);
  };
  handleClickBack = () => {
    const { goBack, directory, onClickDirectory } = this.props;
    if (goBack) {
      goBack();
      return;
    }

    if (directory) {
      const splitted = directory.path.split("/");
      const parent = splitted.reduce((a, e) => {
        if (e === directory.name) {
          return a;
        } else {
          return a.concat([e]);
        }
      }, []).join("/");
      console.log("PARENT", parent);
      onClickDirectory(parent);
    } else {
      onClickDirectory("/");
    }
  };
  toggleFavorite = (parent, target, isFile = false) => () => {
    if (isFile) {
      this.props.fileFavoriteChanged(
        parent,
        target,
        !target.favorite
      );
    } else {
      this.props.directoryFavoriteChanged(
        parent,
        target,
        !target.favorite
      );
    }
  }
  renderFile = (file, i) => {
    const { directory } = this.props;
    return (
      <React.Fragment
        key={i}
        >
        <ListItem
          text={file.name}
          favorite={file.favorite}
          onClick={() => this.handleClickFile(file, directory)}
          onClickFavorite={this.toggleFavorite(directory, file, true)}
          />
      </React.Fragment>
    );
  }
  renderDirectory = (dir, i) => {
    const { directory } = this.props;
    const parent = directory;

    return (
      <React.Fragment
        key={i}
        >
        <ListItem
          text={dir.name}
          favorite={dir.favorite}
          isDirectory={true}
          onClick={() => this.handleClickDirectory(dir)}
          onClickFavorite={this.toggleFavorite(parent, dir)}
          />
      </React.Fragment>
    );
  };

  componentDidMount() {
    this.loadDirectoryIfNeed(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadDirectoryIfNeed(nextProps);
  }

  loadDirectoryIfNeed({path, directory}) {
    if (!directory) {
      this.loadDirectory(`/${path}`);
    }
  }

  loadDirectory(path) {
    this.props.loadDirectory(path);
  }

  render() {
    const {
      classes, path, directory,
      onClickDirectory,
      error,
    } = this.props;

    if (error.message.length > 0) return (
      <React.Fragment>
        <Grid item xs={12} >
          <Typography variant="title">
            {error.message}
          </Typography>
        </Grid>
        <Grid item xs={12} >
          <Button
            color="primary"
            onClick={() => onClickDirectory("/")}
            >
            Home
          </Button>
        </Grid>
      </React.Fragment>
    );

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

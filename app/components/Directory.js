import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import ListSubheader from 'material-ui/List/ListSubheader';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import MoreIcon from '@material-ui/icons/MoreVert';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import NavBar from './../containers/NavBar/Index.js';
import DirectoryMenu from './NavBar/DirectoryMenu.js';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    margin: 0,
  },
  title: {
    padding: theme.spacing.unit,
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  listItem: {
    cursor: "pointer",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
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
    const { directory, onClickDirectory } = this.props;

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
  favoriteIcon = ({favorite}) => favorite ?
    (<FavoriteIcon />) :
    (<FavoriteBorderIcon />)
  renderFile = (file, i) => {
    const { directory } = this.props;

    return (
      <ListItem
        key={i}
        onClick={() => this.handleClickFile(file, directory)}
        >
        <ListItemText>
          {file.name}
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton
            onClick={this.toggleFavorite(directory, file, true)}
            aria-label="Favorite"
            >
            {this.favoriteIcon(file)}
          </IconButton>
          <IconButton aria-label="More">
            <MoreIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
  renderDirectory = (dir, i) => {
    const { classes, directory } = this.props;
    const parent = directory;

    return (
      <ListItem
        className={classes.listItem}
        key={i}
        onClick={() => this.handleClickDirectory(dir)}
        >
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText>
          {dir.name}
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton
            aria-label="Favorite"
            onClick={this.toggleFavorite(parent, dir)}
            >
            {this.favoriteIcon(dir)}
          </IconButton>
          <IconButton aria-label="More">
            <MoreIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
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

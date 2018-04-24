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

const styles = theme => ({
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
  componentDidMount() {
    this.loadDirectoryIfNeed(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.loadDirectoryIfNeed(nextProps);
  }

  loadDirectoryIfNeed({path, directory}) {
    if (directory) {
      this.props.directoryLoaded();
    } else {
      this.loadDirectory(`/${path}`);
    }
  }

  loadDirectory(path) {
    this.props.directoryLoading();
    this.props.loadDirectory(path);
  }

  render() {
    const {
      classes, path, directory,
      goBack, onClickDirectory,
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

    const handleClickDirectory = (dir) => {
      console.log("Clicked", dir);
      onClickDirectory(dir.path);
    };

    const handleClickBack = () => {
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
    }

    const renderDirectory = (dir, i) => (
      <ListItem
        className={classes.listItem}
        key={i}
        onClick={() => handleClickDirectory(dir)}
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
          <IconButton aria-label="More">
            <MoreIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );

    const renderFile = (file, i) => (
      <ListItem key={i}>
        <ListItemText>
          {file.name}
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton aria-label="More">
            <MoreIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );

    return (
      <React.Fragment>
        <Grid item xs={8}>
          <Typography variant="title">
            {path}
          </Typography>
        </Grid>
        <Grid item container justify="flex-end" xs={4} >
          <Button
            color="primary"
            onClick={handleClickBack}
            >
            Back
          </Button>
        </Grid>
        <Grid item xs={12}>
          <List >
            <ListSubheader disableSticky={true} >
              Files
            </ListSubheader>
            {directory && directory.files.map(renderFile)}
            <ListSubheader disableSticky={true} >
              Directories
            </ListSubheader>
            {directory && directory.childDirectories.map(renderDirectory)}
          </List>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Directory);

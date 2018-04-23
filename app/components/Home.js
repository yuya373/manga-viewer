import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
});

const renderDirectory = (dir, i) => (
  <ListItem key={i} >
    <ListItemAvatar>
      <Avatar>
        <FolderIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={dir.name}
      />
    <ListItemSecondaryAction>
      <IconButton aria-label="Delete">
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const renderFile = (file, i) => (
  <ListItem key={i}>
    <ListItemText
      primary={file.path}
      />
    <ListItemSecondaryAction>
      <IconButton aria-label="Delete">
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);


class Home extends Component {
  render() {
    const { classes, homedir, reloadDirectory } = this.props;

    return (
      <React.Fragment>
        <Grid item xs={12} >
          <h1>
            {homedir.path}
          </h1>
        </Grid>
        <Grid item xs={6} >
          <Link to="/counter">to Counter</Link>
        </Grid>
        <Grid item xs={6} >
          <a onClick={() => reloadDirectory(homedir.path)}>
            Reload
          </a>
        </Grid>
        <Grid item xs={12} >
          <List >
            <ListSubheader disableSticky={true} >
              Files
            </ListSubheader>
            {homedir.files.map(renderFile)}
            <ListSubheader disableSticky={true} >
              Directories
            </ListSubheader>
            {homedir.childDirectories.map(renderDirectory)}
          </List>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Home);

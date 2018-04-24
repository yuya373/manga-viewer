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


function Home({
  classes, homedir,
  reloadDirectory,
  onClickDirectory,
}) {
  const handleClickDirectory = (dir, e) => {
    e.preventDefault();
    console.log("Clicked", dir);
    onClickDirectory(dir.path);
  };

  const renderDirectory = (dir, i) => (
    <ListItem
      className={classes.listItem}
      key={i}
      onClick={(e) => handleClickDirectory(dir, e)}
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

  return (
    <React.Fragment>
      <Grid item xs={8} >
        <Typography variant="title" className={classes.title} >
          {homedir.path}
        </Typography>
      </Grid>
      <Grid item container justify="flex-end" xs={4} >
        <Button
          color="primary"
          onClick={() => reloadDirectory(homedir.path)}
          >
          Reload
        </Button>
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

export default withStyles(styles)(Home);

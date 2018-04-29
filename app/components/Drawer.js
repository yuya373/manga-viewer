import React from 'react';
import { withStyles } from 'material-ui/styles';
import MuiDrawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import FolderIcon from '@material-ui/icons/Folder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LabelIcon from '@material-ui/icons/Label';

const styles = theme => ({
  list: {
    width: 250,
  },
});

function Drawer({
  classes,
  isOpen,
  drawerClose,
  gotoBrowse,
  gotoFavorite,
}) {
  const handleClickBrowse = () => {
    gotoBrowse();
    drawerClose();
  };
  const handleClickFavorite = () => {
    gotoFavorite();
    drawerClose();
  };

  return (
    <MuiDrawer
      anchor="right"
      open={isOpen}
      onClose={drawerClose}
      >
      <List
        component="nav"
        className={classes.list}
        >
        <ListItem
          button={true}
          onClick={handleClickBrowse}
          >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            primary="Browse"
            />
        </ListItem>
        <ListItem
          button={true}
          onClick={handleClickFavorite}
          >
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText
            primary="Favorites"
            />
        </ListItem>
        <ListItem
          button={true}
          >
          <ListItemIcon>
            <LabelIcon />
          </ListItemIcon>
          <ListItemText
            primary="Tags"
            />
        </ListItem>
      </List>
    </MuiDrawer>
  );
}

export default withStyles(styles)(Drawer);
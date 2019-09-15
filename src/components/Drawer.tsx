import React from 'react';
import MuiDrawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onPressHome: () => void;
  onPressFavorite: () => void;
};
const Drawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onPressHome,
  onPressFavorite,
}) => {
  return (
    <MuiDrawer anchor="right" open={isOpen} onClose={onClose}>
      <div style={{ width: 250 }}>
        <List>
          <ListItem button onClick={onPressHome}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="HOME" />
          </ListItem>
          <ListItem button onClick={onPressFavorite}>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Favorite" />
          </ListItem>
        </List>
        <Divider />
      </div>
    </MuiDrawer>
  );
};

export default Drawer;

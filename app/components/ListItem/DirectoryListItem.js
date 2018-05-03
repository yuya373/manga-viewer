import React, { PureComponent } from 'react';
import List, {
  ListItem as MuiListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import FavoriteButton from './../FavoriteButton.js';

export default function DirectoryListItem({
  directory,
  favorite,
  onClick,
  onClickFavorite,
}) {

  const handleClickFavorite = () => onClickFavorite(!favorite);

  return (
    <MuiListItem
      button
      onClick={onClick}
      >
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText>
        {directory.name}
      </ListItemText>
      <ListItemSecondaryAction>
        <FavoriteButton
          favorite={favorite}
          onClick={handleClickFavorite}
          />
      </ListItemSecondaryAction>
    </MuiListItem>
  );
}

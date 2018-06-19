import React from 'react';
import List, {
  // ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import FavoriteButton from './../FavoriteButton.js';
import ListItem from './LazyListItem.js';

export default function DirectoryListItem({
  directory,
  favorite,
  onClick,
  onClickFavorite,
  onDisplay,
}) {

  const handleClickFavorite = () => onClickFavorite(!favorite);

  return (
    <ListItem
      button
      onClick={onClick}
      onDisplay={onDisplay}
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
    </ListItem>
  );
}

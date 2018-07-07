import React from 'react';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
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

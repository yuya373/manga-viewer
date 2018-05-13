import React from 'react';
import List, {
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import FavoriteButton from './../FavoriteButton.js';
import LazyListItem from './LazyListItem.js';

export default function DirectoryListItem({
  directory,
  favorite,
  onClick,
  onClickFavorite,
  onDisplay,
}) {

  const handleClickFavorite = () => onClickFavorite(!favorite);

  return (
    <LazyListItem
      onDisplay={onDisplay}
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
    </LazyListItem>
  );
}

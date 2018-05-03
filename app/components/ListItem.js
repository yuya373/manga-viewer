import React from 'react';
import List, {
  ListItem as MuiListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import FolderIcon from '@material-ui/icons/Folder';
import FavoriteButton from './FavoriteButton.js';

export default function ListItem({
  text,
  favorite = false,
  isDirectory = false,
  onClick,
  onClickFavorite,
}) {
  const folderIcon = isDirectory ? (
    <ListItemAvatar>
      <Avatar>
        <FolderIcon />
      </Avatar>
    </ListItemAvatar>
  ) : null;

  return (
    <MuiListItem
      button
      onClick={onClick}
      >
      {folderIcon}
      <ListItemText>
        {text}
      </ListItemText>
      <ListItemSecondaryAction>
        <FavoriteButton
          favorite={favorite}
          onClick={onClickFavorite}
          />
        <IconButton aria-label="More">
          <MoreIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </MuiListItem>
  );
}

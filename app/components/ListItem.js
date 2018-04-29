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
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

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

  const favoriteIcon = favorite ?
        (<FavoriteIcon />) :
        (<FavoriteBorderIcon />);

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
        <IconButton
          onClick={onClickFavorite}
          aria-label="Favorite"
          >
          {favoriteIcon}
        </IconButton>
        <IconButton aria-label="More">
          <MoreIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </MuiListItem>
  );
}

import React from 'react';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import FavoriteButton from './../FavoriteButton.js';
import ListItem from '@material-ui/core/ListItem';

export default function DirectoryListItem({
  directory,
  favorite,
  primaryTypographyProps,
  isScrolling,
  onClick,
  onClickFavorite,
  onDisplay,
}) {

  const handleClickFavorite = () => onClickFavorite(!favorite);

  const buttonBaseProps = {
    disableRipple: isScrolling,
    disableTouchRipple: isScrolling,
  };


  return (
    <ListItem
      button={true}
      onClick={onClick}
      ContainerComponent="div"
      {...buttonBaseProps}
      >
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={primaryTypographyProps}
        >
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

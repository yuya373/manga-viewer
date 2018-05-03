import React from 'react';
import IconButton from 'material-ui/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

export default function FavoriteButton({favorite, color, onClick}) {
  const favoriteIcon = favorite ?
        (<FavoriteIcon />) :
        (<FavoriteBorderIcon />);

  return (
    <IconButton
      color={color}
      onClick={onClick}
      aria-label="Favorite"
      >
      {favoriteIcon}
    </IconButton>
  )
}

import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { makeStyles } from '@material-ui/styles';
import { join } from 'path';
import preloadImg from '../preload.svg';

const mediaWidth = 174;
const mediaRatio = 1.4;
const mediaHeight = mediaWidth * mediaRatio;

const useStyles = makeStyles({
  card: {
    width: mediaWidth * 2,
  },
  media: {
    height: mediaHeight,
    backgroundSize: 'contain',
  },
});

export type Props = {
  path: string;
  name: string;
  fromFavorite?: boolean;
};

export type StateProps = {
  thumbnail?: string;
  isFavorite?: boolean;
};

export type DispatchProps = {
  fetchThumbnail: (path: string) => void;
  onPress: (params: {
    path: string;
    name: string;
    fromFavorite?: boolean;
  }) => void;
  onPressFavorite: (path: string) => void;
};

const FileCard: React.FC<Props & StateProps & DispatchProps> = ({
  path,
  name,
  fromFavorite,
  thumbnail,
  isFavorite,
  fetchThumbnail,
  onPress,
  onPressFavorite,
}) => {
  useEffect(() => {
    fetchThumbnail(join(path, name));
  }, [path, name, fetchThumbnail]);

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => onPress({ path, name, fromFavorite })}>
        <CardMedia
          className={classes.media}
          image={thumbnail || preloadImg}
          title={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <IconButton onClick={() => onPressFavorite(join(path, name))}>
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton />
      </CardActions>
    </Card>
  );
};

export default React.memo(FileCard);

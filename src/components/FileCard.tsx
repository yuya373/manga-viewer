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
import { useDispatch, useSelector } from 'react-redux';
import { fetchThumbnail } from '../actions/file';
import { RootState } from '../reducers';
import preloadImg from '../preload.svg';
import { fileDialogOpen } from '../actions/fileDialog';

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

type Props = {
  path: string;
  name: string;
};

const FileCard: React.FC<Props> = ({ path, name }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchThumbnail(`${path}/${name}`));
  }, [path, dispatch, name]);

  const thumbnail = useSelector((state: RootState) => {
    return state.thumbnails.byPath[`${path}/${name}`];
  });

  const onPress = () => {
    dispatch(fileDialogOpen({ path, name }));
  };

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={onPress}>
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
        <IconButton>
          <FavoriteIcon />
        </IconButton>
        <IconButton>
          <FavoriteBorderIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default React.memo(FileCard);

import React from 'react';
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

const mediaWidth = 174;
const mediaRatio = 1.4;
const mediaHeight = mediaWidth * mediaRatio;

const useStyles = makeStyles({
  card: {
    width: mediaWidth * 2,
  },
  media: {
    height: mediaHeight,
  },
});

type Props = {
  path: string;
  name: string;
  onPress: (path: string) => void;
};

const DirectoryCard: React.FC<Props> = ({ path, name, onPress }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={() => onPress(`${path}/${name}`)}>
        <CardMedia
          className={classes.media}
          image="https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
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

export default React.memo(DirectoryCard);

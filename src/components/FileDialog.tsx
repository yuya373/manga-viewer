import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions/transition';
import CircularProgress from '@material-ui/core/CircularProgress';
import { join } from 'path';
import ViewerContainer from '../containers/ViewerContainer';
import useWindowDimension from '../hooks/useWindowDimension';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  })
);

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

export type Props = {
  isOpen: boolean;
  isLoading: boolean;
  isAppBarHidden: boolean;
  path: string;
  name: string;
};

type DispatchProps = {
  onClose: () => void;
  fetchImages: (path: string) => void;
  onMouseOver: () => void;
  onMouseLeave: () => void;
};

const FileDialog: React.FC<Props & DispatchProps> = ({
  isOpen,
  isLoading,
  isAppBarHidden,
  path,
  name,
  onClose,
  fetchImages,
  onMouseOver,
  onMouseLeave,
}) => {
  useEffect(() => {
    fetchImages(join(path, name));
  }, [path, name, fetchImages]);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  useWindowDimension(param => {
    requestAnimationFrame(() => {
      setWidth(param.width);
      setHeight(param.height);
    });
  });

  const classes = useStyles();

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <Slide direction="down" in={!isAppBarHidden} mountOnEnter unmountOnExit>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {name}
            </Typography>
          </Toolbar>
        </AppBar>
      </Slide>

      <Grid
        container
        wrap="nowrap"
        alignItems="center"
        style={{
          height,
          overflow: 'hidden',
        }}
        onMouseOver={onMouseOver}
        onFocus={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        {isLoading ? (
          <Grid
            style={{ width, height }}
            container
            alignItems="center"
            justify="center"
          >
            <CircularProgress size={60} />
          </Grid>
        ) : (
          <ViewerContainer width={width} height={height} />
        )}
      </Grid>
    </Dialog>
  );
};

export default React.memo(FileDialog);

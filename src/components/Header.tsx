import React, { useCallback, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuIcon from '@material-ui/icons/Menu';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router';
import * as os from 'os';
import { join } from 'path';
import { RootState } from '../app';
import Drawer from './Drawer';
import { serializePath } from '../utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const homedir = os.homedir();

const Header: React.FC<RouteComponentProps> = ({ history }) => {
  const isBackButtonHidden = useSelector((state: RootState) => {
    return state.header.isBackButtonHidden;
  });
  const title = useSelector((state: RootState) => {
    return state.header.title;
  });
  const onPressBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, [setIsDrawerOpen]);

  const onPressMenu = useCallback(() => {
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen]);

  const onPressHome = useCallback(() => {
    setIsDrawerOpen(false);
    history.push(join('/entryList', serializePath(homedir)));
  }, [history]);

  const onPressFavorite = useCallback(() => {
    setIsDrawerOpen(false);
    history.push('/favoriteList');
  }, [history]);

  const onPressHitomi = useCallback(() => {
    setIsDrawerOpen(false);
    history.push('/hitomi');
  }, [history]);

  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {isBackButtonHidden ? null : (
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="back"
              onClick={onPressBack}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap className={classes.title}>
            {title || 'MangaViewer'}
          </Typography>
          <IconButton
            edge="end"
            aria-label="menu"
            color="inherit"
            onClick={onPressMenu}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        onPressHome={onPressHome}
        onPressFavorite={onPressFavorite}
        onPressHitomi={onPressHitomi}
      />
    </>
  );
};

export default Header;

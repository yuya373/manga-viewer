import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';

const Header: React.FC<{}> = () => {
  const title = useSelector((state: RootState) => {
    return state.header.title;
  });

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap>
          {title || 'MangaViewer'}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

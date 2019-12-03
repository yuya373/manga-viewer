import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import * as os from 'os';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { join } from 'path';
import Header from '../components/Header';
import EntryList from '../components/EntryList';
import { serializePath } from '../utils';
import FileDialogContainer from '../containers/FileDialogContainer';
import FavoriteListContainer from '../containers/FavoriteListContainer';
import HitomiContainer from '../containers/HitomiContainer';
import ErrorBoundary from './ErrorBoundary';

const homedir = os.homedir();
const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 344,
      md: 648,
      lg: 1032,
      xl: 1376,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <FileDialogContainer />
        <HashRouter>
          <Route path="/" component={Header} />
          <Route path="/entryList/:serializedPath+" component={EntryList} />
          <Route path="/favoriteList" component={FavoriteListContainer} />
          <Route path="/hitomi" component={HitomiContainer} />
          <Redirect path="/" to={join('/entryList', serializePath(homedir))} />
        </HashRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

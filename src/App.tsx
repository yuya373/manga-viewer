import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import * as os from 'os';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Header from './components/Header';
import EntryList from './components/EntryList';
import { serializePath } from './utils';
import FileDialogContainer from './containers/FileDialogContainer';

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
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <FileDialogContainer />
        <BrowserRouter>
          <Route path="/" component={Header} />
          <Route path="/entryList/:serializedPath+" component={EntryList} />
          <Redirect path="/" to={`/entryList/${serializePath(homedir)}`} />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default App;

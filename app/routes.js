/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';
import Home from './containers/Home.js';
import CounterPage from './containers/CounterPage';
import Directory from './containers/Directory.js';
import File from './containers/File/Index.js';

const homedir = require('os').homedir();

export default () => (
  <App>
    <Switch>
      <Route path="/counter" component={CounterPage} />
      <Route
        path="/files/:name"
        component={File}
        />
      <Route
        path="/directories/:path*"
        component={Directory}
        />
      <Route
        path={`/directories${homedir}`}
        component={Directory}
        />
      <Route
        path="/"
        render={() => <Redirect to={`/directories${homedir}`} />}
        />
    </Switch>
  </App>
);

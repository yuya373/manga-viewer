/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';
import Directory from './containers/Directory.js';
import File from './containers/File/Index.js';
import Favorite from './containers/Favorite.js';
import Tags from './containers/Tags.js';
import Tag from './containers/Tag.js';

const homedir = require('os').homedir();

export default () => (
  <App>
    <Switch>
      <Route
        path="/tags/:tag"
        component={Tag}
        />
      <Route
        path="/tags"
        component={Tags}
        />
      <Route
        path="/favorites"
        component={Favorite}
        />
      <Route
        path="/files/:name"
        component={File}
        />
      <Route
        path="/directories/:path*"
        component={Directory}
        />
      <Route
        path="/"
        render={() => <Redirect to={`/directories${homedir}`} />}
        />
    </Switch>
  </App>
);

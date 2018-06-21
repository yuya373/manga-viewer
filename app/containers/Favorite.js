import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Favorite from './../components/Favorite.js';
import F from './../models/file.js';
import D from './../models/directory.js';

export function findDirectory(state, path) {
  return state.directory.directories.
    find((e) => e.path === path);
}

export function findFile(directory, path) {
  return directory.files.
    find((e) => e.path === path);
}

function mapStateToProps(state) {
  const files = state.favorite.files.reduce((a, e) => {
    const splitted = e.split("/");
    const directoryPath =
          splitted.slice(0, splitted.length - 1).join("/");
    const parent = findDirectory(state, directoryPath) ||
          D.create(directoryPath, {});
    const file = findFile(parent, e) || F.create(e, {});
    return a.concat([{...file, parent}]);
  }, []);

  const directories = state.favorite.directories.reduce((a, e) => {
    const splitted = e.split("/");
    const parent = D.create(
      splitted.slice(0, splitted.length - 1).join("/"),
      {}
    );
    let dir = D.create(e, {});
    return a.concat([{...dir, parent}]);
  }, []);

  return {
    files,
    directories,
  };
}

export default connect(mapStateToProps)(Favorite);

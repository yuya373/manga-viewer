import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Favorite from './../components/Favorite.js';
import {
  fileFavoriteChanged,
  gotoFile,
} from './../actions/file.js';
import {
  directoryFavoriteChanged,
  gotoDirectory,
} from './../actions/directory.js';

function mapStateToProps(state) {
  const files = state.favorite.files.reduce((a, e) => {
    let parent = null;
    let file = null;

    state.directory.directories.some((f) => {
      const found = f.files.find((g) => g.path === e);
      if (found) {
        parent = f;
        file = found;
        return true;
      }
      return false;
    });
    if (parent && file) return a.concat([{...file, parent}]);
    return a;
  }, []);
  const directories = state.favorite.directories.reduce((a, e) => {
    let parent = null;
    let dir = null;

    const fav = state.directory.directories.some((f) => {
      const found = f.childDirectories.find((g) => g.path === e);
      if (found) {
        parent = f;
        dir = found;
        return true;
      }
      return false;
    });

    if (parent && dir) return a.concat([{...dir, parent}]);
    return a;
  }, []);

  return {
    files,
    directories,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        fileFavoriteChanged,
        directoryFavoriteChanged,
      },
      dispatch
    ),
    gotoFile: (file, directory) => dispatch(gotoFile(
      file, directory, {backTo: "/favorites"}
    )),
    gotoDirectory: (directory) =>
      dispatch(gotoDirectory(directory.path, {backTo: "/favorites"})),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);

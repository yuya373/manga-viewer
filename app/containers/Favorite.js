import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Favorite from './../components/Favorite.js';
import {
  fileFavoriteChanged,
} from './../actions/file.js';
import {
  directoryFavoriteChanged,
} from './../actions/directory.js';

function mapStateToProps(state) {
  const files = [];
  const directories = [];

  state.directory.directories.sort((a, b) => {
    if (a.path < b.path) return -1;
    if (a.path > b.path) return 1;
    return 0
  }).forEach((e) => {
    e.childDirectories.forEach((f) => {
      if (f.favorite) {
        directories.push({
          ...f,
          parent: e,
        });
      }
    })
    e.files.forEach((f) => {
      if (f.favorite) {
        files.push({
          ...f,
          parent: e,
        });
      }
    })
  });

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
    gotoFile: (file, directory) => dispatch(push(
      `/files/${file.name}?path=${directory.path}&backTo=/favorites`
    )),
    gotoDirectory: (directory) => dispatch(push(
      `/directories${directory.path}?backTo=/favorites`
    )),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);

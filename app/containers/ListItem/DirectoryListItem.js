import { connect } from 'react-redux';
import DirectoryListItem from './../../components/ListItem/DirectoryListItem.js';
import {
  gotoDirectory,
  directoryFavoriteChanged,
} from './../../actions/directory.js';

function mapStateToProps(state, { directory }) {
  const favorite = state.favorite.directories.includes(directory.path);
  return {
    directory,
    favorite,
  };
}

function mapDispatchToProps(dispatch, { onClick, directory, queryParams = {} }) {
  return {
    onClick: () => {
      onClick();
      dispatch(gotoDirectory(directory.path, queryParams));
    },
    onClickFavorite: (favorite) => dispatch(directoryFavoriteChanged({
      path: directory.path,
      favorite,
    })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryListItem);

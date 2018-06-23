import { connect } from 'react-redux';
import {
  addTag,
  deleteTag,
} from './../../actions/tag.js';
import { fileFavoriteChanged, gotoFile, saveThumbnailUrl } from './../../actions/file.js';
import FileListItem from './../../components/ListItem/FileListItem.js';

function areStatesEqual(prevState, nextState) {
  // console.log("areStatesEqual", prevState, nextState);
  if (prevState.tag.tags !== nextState.tag.tags) {
    return false;
  }
  if (prevState.favorite.files !== nextState.favorite.files) {
    return false;
  }
  if (prevState.file.thumbnailUrls !== nextState.file.thumbnailUrls) {
    return false
  }

  return true;
}

function areStatePropsEqual(prevProps, nextProps) {
  // console.log("areStatePropsEqual", prevProps, nextProps);
  if (prevProps.thumbnailUrls !== nextProps.thumbnailUrls) {
    return false;
  }
  if (prevProps.tags.length !== nextProps.tags.length) {
    return false;
  }
  if (prevProps.favorite !== nextProps.favorite) {
    return false;
  }

  return true;
}

function mapStateToProps(state, { file }) {
  const favorite = state.favorite.files.includes(file.path);
  const tags = Object.keys(state.tag.tags).filter((e) => {
    return state.tag.tags[e].includes(file.path);
  });
  const thumbnailUrl = state.file.thumbnailUrls[file.path];

  return {
    thumbnailUrl,
    tags,
    file,
    favorite,
  };
}

function mapDispatchToProps(dispatch, { onClick, file, directory, queryParams = {} }) {
  return {
    onClick: () => {
      onClick();
      console.log("location: ", window.location, window.scrollY);
      dispatch(gotoFile(file, directory, queryParams));
    },
    onClickFavorite: (favorite) => dispatch(fileFavoriteChanged({
      path: file.path,
      favorite,
    })),
    saveThumbnailUrl: ({ thumbnailUrl }) =>
      dispatch(saveThumbnailUrl({ file, directory, thumbnailUrl })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  areStatesEqual,
  areStatePropsEqual,
})(FileListItem);

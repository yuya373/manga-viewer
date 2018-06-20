import { connect } from 'react-redux';
import {
  addTag,
  deleteTag,
} from './../../actions/tag.js';
import { fileFavoriteChanged, gotoFile, saveThumbnailUrl } from './../../actions/file.js';
import FileListItem from './../../components/ListItem/FileListItem.js';

function mapStateToProps(state, { file }) {
  const favorite = state.favorite.files.includes(file.path);
  const tags = Object.keys(state.tag.tags).filter((e) => {
    return state.tag.tags[e].includes(file.path);
  });
  const hasThumbnail = !!file.thumbnailUrl;

  return {
    hasThumbnail,
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

export default connect(mapStateToProps, mapDispatchToProps)(FileListItem);

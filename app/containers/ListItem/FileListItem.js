import { connect } from 'react-redux';
import {
  addTag,
  deleteTag,
} from './../../actions/tag.js';
import { fileFavoriteChanged, gotoFile } from './../../actions/file.js';
import FileListItem from './../../components/ListItem/FileListItem.js';

function mapStateToProps(state, { file }) {
  const favorite = state.favorite.files.includes(file.path);
  const searchQuery = state.search.query;
  const tags = Object.keys(state.tag.tags).filter((e) => {
    return state.tag.tags[e].includes(file.path);
  });

  return {
    tags,
    searchQuery,
    file,
    favorite,
  };
}

function mapDispatchToProps(dispatch, { file, directory, queryParams = {} }) {
  return {
    onClick: () => dispatch(gotoFile(file, directory, queryParams)),
    onClickFavorite: (favorite) => dispatch(fileFavoriteChanged({
      path: file.path,
      favorite,
    })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileListItem);

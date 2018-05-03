import { connect } from 'react-redux';
import {
  addTag,
  deleteTag,
} from './../../actions/tag.js';
import { fileFavoriteChanged, gotoFile } from './../../actions/file.js';
import FileListItem from './../../components/ListItem/FileListItem.js';

function mapStateToProps(state, { file }) {
  const tags = Object.keys(state.tag.tags).filter((e) => {
    return state.tag.tags[e].includes(file.path);
  });
  const favorite = state.favorite.files.includes(file.path);

  return {
    file,
    tags,
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
    addTag: (tag) => dispatch(addTag({
      filePath: file.path,
      tag,
    })),
    deleteTag: (tag) => dispatch(deleteTag({
      filePath: file.path,
      tag,
    })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileListItem);

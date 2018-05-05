import { connect } from 'react-redux';
import {
  addTag,
  deleteTag,
} from './../../actions/tag.js';
import TagsDialog from './../../components/ListItem/TagsDialog.js';

function mapStateToProps(state, { file, open, tags }) {
  const suggestions = Object.keys(state.tag.tags);

  return {
    open,
    title: file.path,
    tags,
    suggestions,
  };
}

function mapDispatchToProps(dispatch, { file, onClose }) {
  return {
    onClose,
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

export default connect(mapStateToProps, mapDispatchToProps)(TagsDialog);

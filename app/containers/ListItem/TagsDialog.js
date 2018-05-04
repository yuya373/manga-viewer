import { connect } from 'react-redux';
import {
  addTag,
  deleteTag,
} from './../../actions/tag.js';
import TagsDialog from './../../components/ListItem/TagsDialog.js';

function mapStateToProps(state, { file, open }) {
  const suggestions = Object.keys(state.tag.tags);
  const tags = suggestions.filter((e) => {
    return state.tag.tags[e].includes(file.path);
  });

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

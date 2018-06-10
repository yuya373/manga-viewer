import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  filePerPageChanged,
  fileLoadError,
} from './../../actions/file.js';
import ImageFile from './../../components/File/ImageFile.js';

function mapStateToProps(state, {file}) {
  return {
    file,
    perPage: state.file.perPage,
    tagsDialogOpen: state.tag.dialogIsOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      filePerPageChanged,
      fileLoadError,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageFile);

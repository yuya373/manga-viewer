import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  filePerPageChanged,
} from './../../actions/file.js';
import ImageFile from './../../components/File/ImageFile.js';

function mapStateToProps(state, {file}) {
  return {
    file,
    perPage: state.file.perPage,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      filePerPageChanged,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageFile);

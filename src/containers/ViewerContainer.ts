import { connect } from 'react-redux';
import {
  displayNextPage,
  displayPrevPage,
  perPageChanged,
  displayNextFile,
  displayPrevFile,
} from '../actions/viewer';
import Viewer, { DispatchProps } from '../components/Viewer';

const mapDispatchToProps: DispatchProps = {
  onNextPage: displayNextPage,
  onPrevPage: displayPrevPage,
  onPerPageChanged: perPageChanged,
  onNextFile: displayNextFile,
  onPrevFile: displayPrevFile,
};

export default connect(
  null,
  mapDispatchToProps
)(Viewer);

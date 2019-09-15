import { connect } from 'react-redux';
import {
  displayNextPage,
  displayPrevPage,
  perPageChanged,
} from '../actions/viewer';
import Viewer, { DispatchProps } from '../components/Viewer';

const mapDispatchToProps: DispatchProps = {
  onNextPage: displayNextPage,
  onPrevPage: displayPrevPage,
  onPerPageChanged: perPageChanged,
};

export default connect(
  null,
  mapDispatchToProps
)(Viewer);

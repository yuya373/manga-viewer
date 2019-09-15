import { connect } from 'react-redux';
import { displayNextPage, displayPrevPage } from '../actions/viewer';
import Viewer, { DispatchProps } from '../components/Viewer';

const mapDispatchToProps: DispatchProps = {
  onNextPage: displayNextPage,
  onPrevPage: displayPrevPage,
};

export default connect(
  null,
  mapDispatchToProps
)(Viewer);

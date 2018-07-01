import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './../actions/snackbar.js';
import Snackbar from './../components/Snackbar.js';

function mapStateToProps(state) {
  return {
    message: state.snackbar.message,
    isOpen: state.snackbar.isOpen,
    autoHide: state.snackbar.autoHide,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);

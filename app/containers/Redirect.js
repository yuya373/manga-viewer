import { connect } from 'react-redux';
import {
  gotoDirectory,
} from './../actions/directory.js';
import Redirect from'./../components/Redirect.js';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch, { to }) {
  return {
    redirectToDirectory: () => dispatch(gotoDirectory(to, {}, true)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Redirect);

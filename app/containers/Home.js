import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import Home from './../components/Home.js';
import * as actions from './../actions/homedir.js';


function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(actions, dispatch),
    onClickDirectory: (path) =>
      dispatch(push(`/directories/${path.slice(1, path.length)}`)),
  };
}

export default connect(
  (state) => ({
    homedir: state.homedir,
  }),
  mapDispatchToProps
)(Home);

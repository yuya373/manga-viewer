import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Home from './../components/Home.js';
import * as actions from './../actions/homedir.js';


function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(
  (state) => ({
    homedir: state.homedir,
  }),
  mapDispatchToProps
)(Home);

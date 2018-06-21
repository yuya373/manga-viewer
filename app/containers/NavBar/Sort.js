import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Sort from './../../components/NavBar/Sort.js';
import * as actions from './../../actions/sort.js';

function mapStateToProps(state) {
  return {
    key: state.sort.key,
    desc: state.sort.desc,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sort);

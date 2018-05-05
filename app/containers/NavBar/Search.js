import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Search from './../../components/NavBar/Search.js';
import * as actions from './../../actions/search.js';

function mapStateToProps(state) {
  return {
    query: state.search.query,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);

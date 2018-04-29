import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import * as actions from './../actions/drawer.js';
import Drawer from './../components/Drawer.js';

function mapStateToProps(state) {
  return {
    isOpen: state.drawer.isOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(actions, dispatch),
    gotoBrowse: () => dispatch(push(`/directories${require("os").homedir()}`)),
    gotoFavorite: () => dispatch(push("/favorites")),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);

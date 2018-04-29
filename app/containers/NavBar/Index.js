import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  drawerOpen
} from './../../actions/drawer.js';
import NavBar from './../../components/NavBar/Index.js';

function mapStateToProps(state, {visible, title, onClickBack, menu, position}) {
  return {
    isDrawerOpen: state.drawer.isOpen,
    visible,
    title,
    onClickBack,
    menu,
    position
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      drawerOpen,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

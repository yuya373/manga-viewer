import { connect } from 'react-redux';
import FavoriteList, {
  StateProps,
  DispatchProps,
} from '../components/FavoriteList';
import { RootState } from '../reducers';
import { headerTitleChanged, headerHideBackButton } from '../actions/header';

const mapStateToProps = (state: RootState): StateProps => {
  return {
    favorites: state.favorites.favorites,
  };
};

const mapDispatchToProps: DispatchProps = {
  setHeaderTitle: headerTitleChanged,
  hideHeaderBackButton: headerHideBackButton,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoriteList);

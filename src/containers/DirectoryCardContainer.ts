import { connect } from 'react-redux';
import DirectoryCard, {
  StateProps,
  Props,
  DispatchProps,
} from '../components/DirectoryCard';
import { RootState } from '../reducers';
import { toggleDirectoryFavorite } from '../actions/favorite';

const mapStateToProps = (state: RootState, ownProps: Props): StateProps => {
  const { path, name } = ownProps;
  const isFavorite = Boolean(state.favorites.byPath[`${path}/${name}`]);

  return {
    isFavorite,
  };
};

const mapDispatchToProps: DispatchProps = {
  onPressFavorite: toggleDirectoryFavorite,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirectoryCard);

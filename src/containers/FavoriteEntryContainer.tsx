import { connect } from 'react-redux';
import { RootState } from '../reducers';
import FavoriteEntry, { StateProps, Props } from '../components/FavoriteEntry';

const mapStateToProps = (state: RootState, ownProps: Props): StateProps => {
  const entry = state.favorites.byPath[ownProps.path];
  const path = ownProps.path.replace(`/${entry.name}`, '');

  return {
    path,
    entry,
  };
};

export default connect(mapStateToProps)(FavoriteEntry);

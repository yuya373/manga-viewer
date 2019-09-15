import { connect } from 'react-redux';
import { RootState } from '../reducers';
import FileCard, {
  Props,
  StateProps,
  DispatchProps,
} from '../components/FileCard';
import { fileDialogOpen } from '../actions/fileDialog';
import { fetchThumbnail } from '../actions/file';
import { toggleFavorite } from '../actions/favorite';

const mapStateToProps = (state: RootState, ownProps: Props): StateProps => {
  const { path, name } = ownProps;
  const thumbnail = state.thumbnails.byPath[`${path}/${name}`];
  const isFavorite = Boolean(state.favorites.byPath[`${path}/${name}`]);

  return {
    thumbnail,
    isFavorite,
  };
};

const mapDispatchToProps: DispatchProps = {
  fetchThumbnail,
  onPress: fileDialogOpen,
  onPressFavorite: toggleFavorite,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileCard);

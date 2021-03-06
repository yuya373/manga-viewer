import { connect } from 'react-redux';
import { join } from 'path';
import { RootState } from '../app';
import FileCard, {
  Props,
  StateProps,
  DispatchProps,
} from '../components/FileCard';
import { openFileDialog } from '../actions/fileDialog';
import { fetchThumbnail } from '../actions/file';
import { toggleFavorite } from '../actions/favorite';

const mapStateToProps = (state: RootState, ownProps: Props): StateProps => {
  const { path, name } = ownProps;
  const fullpath = join(path, name);
  const thumbnail = state.thumbnails.byPath[fullpath];
  const isFavorite = Boolean(state.favorites.byPath[fullpath]);

  return {
    thumbnail,
    isFavorite,
  };
};

const mapDispatchToProps: DispatchProps = {
  fetchThumbnail,
  onPress: openFileDialog,
  onPressFavorite: toggleFavorite,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileCard);
